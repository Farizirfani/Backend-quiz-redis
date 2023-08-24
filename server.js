import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";

import userRouter from "./routes/userRoute.js";
import quizRouter from "./routes/quizRoute.js";

const app = express();
const port = process.env.PORT || 3001;

configDotenv();

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to MongoDB"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/api/quiz", quizRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
