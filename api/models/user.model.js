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
      required() {
        return !this.googleId
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
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
