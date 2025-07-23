// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    friends: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
