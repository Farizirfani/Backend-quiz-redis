import User from "../models/userModel.js";
import bcrypt from "bcrypt";

const userController = {
  getAllusers: async (req, res) => {
    try {
      const users = await User.find();
      if (users) {
        res.status(200).json(users);
      } else {
        res.status(404).json({ message: "No users found" });
      }
    } catch (error) {
      console.log(error);
    }
  },

  registerUser: async (req, res) => {
    try {
      const { username, password, phoneNumber } = req.body;

      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create a new user
      const user = await User.create({
        username: username,
        password: bcrypt.hashSync(password, 10),
        phoneNumber: phoneNumber,
      });

      if (user) {
        res.status(201).json({
          message: "User registered",
          data: user,
        });
      } else {
        res.status(400).json({ message: "Failed to register" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (user) {
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (isPasswordValid) {
          res.status(200).json({
            message: "Login successful",
            data: user,
          });
        } else {
          res.status(400).json({ message: "Invalid password" });
        }
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default userController;
