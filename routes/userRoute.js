import express from "express";
// import soal from "../json/soal.json";

import userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", userController.getAllusers);
userRouter.post("/auth/register", userController.registerUser);
userRouter.post("/auth/login", userController.loginUser);

export default userRouter;
