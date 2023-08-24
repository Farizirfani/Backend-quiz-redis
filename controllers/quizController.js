import { list } from "../db/soal.js";
import { bucket } from "../db/bucket.js";
import Redis from "ioredis";
import User from "../models/userModel.js";

const redis = new Redis();

const quizController = {
  getQuestion: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const firstRound = user.phoneNumber.slice(-1);

      // Get nextRound and nextQuestion from Redis or initialize if not exists
      const getNextRound = await redis.get(`nextRound:${user._id}`);
      let checkQuestion = false;

      let nextRound = getNextRound ? Number(getNextRound) : Number(firstRound);

      let nextQuestion =
        parseInt(await redis.get(`nextQuestion:${user._id}`)) || 0;

      // Increment nextQuestion and update nextRound if needed
      nextQuestion++;
      if (nextQuestion >= 15) {
        nextQuestion = 0;

        // Check if nextRound exceeds 10 and reset it to 0
        nextRound++;
        if (nextRound > 9) {
          nextRound = 0;
        }
      }

      // check question
      if ((await redis.get(`checkQuestion:${user._id}`)) === "false") {
        return res.status(400).json({
          message: "Please answer the question first",
          Soal: await redis.get(`question:${user._id}`),
          Jawaban: JSON.parse(await redis.get(`answerOption:${user._id}`)),
        });
      }

      // Update nextRound and nextQuestion in Redis with user ID
      await redis.set(`nextRound:${user._id}`, nextRound);
      await redis.set(`nextQuestion:${user._id}`, nextQuestion);

      // Get question and round based on nextRound and nextQuestion
      const questionRow = list.soal; // soal
      const questionCol = bucket.round[nextRound][nextQuestion]; // round menyimpan id

      // Get result
      const result = questionRow[questionCol - 1];

      // Set question and correctAnswer in Redis with user ID
      await redis.set(`question:${user._id}`, result.soal);
      await redis.set(
        `answerOption:${user._id}`,
        JSON.stringify(result.answer)
      );

      // Set start time in Redis with user ID
      await redis.set(`startTime:${user._id}`, new Date().getTime());

      await redis.set(`correctAnswer:${user._id}`, result.correctOption);
      await redis.set(`checkQuestion:${user._id}`, checkQuestion);

      res.status(200).json({
        Soal: await redis.get(`question:${user._id}`),
        Jawaban: JSON.parse(await redis.get(`answerOption:${user._id}`)),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  answer: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { answer } = req.body;

      const getAnswer = await redis.get(`correctAnswer:${user._id}`);
      const getQuestion = await redis.get(`question:${user._id}`);

      // Get the current time in milliseconds
      const currentTime = new Date().getTime();

      // Get the start time from Redis
      const startTime = parseInt(await redis.get(`startTime:${user._id}`));

      // Calculate the time elapsed in seconds
      const elapsedTimeInSeconds = (currentTime - startTime) / 1000;

      // Calculate the score based on the time elapsed
      let score = 10; // Default score

      if (elapsedTimeInSeconds <= 10) {
        score = 10;
      } else if (elapsedTimeInSeconds <= 20) {
        score = 9;
      } else if (elapsedTimeInSeconds <= 30) {
        score = 8;
      } else if (elapsedTimeInSeconds <= 40) {
        score = 7;
      } else if (elapsedTimeInSeconds <= 50) {
        score = 6;
      } else if (elapsedTimeInSeconds <= 60) {
        score = 5;
      } else {
        score = 0;
      }

      // Check if the answer is correct
      await redis.set(`checkQuestion:${user._id}`, true);

      if (getAnswer === answer) {
        // Add the calculated score
        user.score += score;
        await user.save();

        res.status(200).json({
          msg: "correct answer",
          question: getQuestion,
          name: user.username,
          score: user.score,
          answer: getAnswer,
        });
      } else {
        user.score -= 5;
        await user.save();
        res.status(200).json({
          msg: "wrong answer",
          question: getQuestion,
          name: user.username,
          score: user.score,
          answer: getAnswer,
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default quizController;
