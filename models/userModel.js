import mongoose from "mongoose";

const User = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Users", User);
