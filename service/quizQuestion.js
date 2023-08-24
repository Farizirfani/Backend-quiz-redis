import { soal } from "../db/soal";
import Redis from "ioredis";

const redis = new Redis();

export const quizQuestion = () => {
  const sentAt = new Date();
  const randomNumber = Math.floor(Math.random() * soal.length);

  const question = soal[randomNumber];
};
