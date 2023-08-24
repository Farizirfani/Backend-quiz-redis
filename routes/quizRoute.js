import express from "express";
import quizController from "../controllers/quizController.js";

const quizRouter = express.Router();

quizRouter.get("/:id", quizController.getQuestion);
quizRouter.post("/answer/:id", quizController.answer);

export default quizRouter;
