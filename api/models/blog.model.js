import mongoose from "mongoose"

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: "/placeholder.svg?height=200&width=300&text=Blog+Thumbnail",
    },
    views: {
      type: Number,
      default: 0,
    },
    comments: {
      type: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          text: String,
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }, // Adds createdAt and updatedAt fields
)

const Blog = mongoose.model("Blog", blogSchema)

export default Blog
