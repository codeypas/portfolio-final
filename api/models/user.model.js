import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      // New field for user role
      type: String,
      enum: ["user", "admin"], // Only 'user' or 'admin' allowed
      default: "user", // Default role is 'user'
    },
  },
  { timestamps: true },
) // to see time of creation

const User = mongoose.model("User", userSchema)

export default User
