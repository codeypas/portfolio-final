"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { blogAPI } from "../services/api"
import { Calendar, Clock, Eye, Tag, ArrowLeft } from "lucide-react"

// Define the base URL for uploaded files
const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_BASE_URL || "http://localhost:3000"

// const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_BASE_URL;

export default function BlogDetails() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState(null)
  const hasIncrementedView = useRef(false)

  const sampleBlogPosts = [
    {
      _id: "sample1",
      title: "My Journey into Web3 Development",
      summary:
        "I share how I built a blockchain project and what I learned along the way. From smart contracts to DApp development.",
      content:
        "This is the full content of the Web3 Development blog post. It delves into the challenges and triumphs of building decentralized applications, covering topics like smart contract deployment, interacting with the Ethereum blockchain, and designing user-friendly DApps. The journey involved learning Solidity, Web3.js, and integrating with MetaMask. It was a challenging but rewarding experience that opened up new possibilities in the decentralized world.",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Web3+Journey",
      tags: ["Web3", "Solidity", "Ethereum", "Blockchain"],
      createdAt: "2025-07-20T10:00:00Z",
      readTime: "3 min read",
      views: 1250,
      category: "Web3",
    },
    {
      _id: "sample2",
      title: "How I Built My Portfolio with React",
      summary:
        "A complete guide on building a modern portfolio website using React, Tailwind CSS, and best practices for performance.",
      content:
        "This post details the step-by-step process of creating a high-performance portfolio website using React and Tailwind CSS. It covers component-based architecture, state management, responsive design, and deployment strategies. The goal was to create a fast, visually appealing, and easily maintainable site to showcase projects and skills.",
      thumbnail: "/placeholder.svg?height=200&width=300&text=React+Portfolio",
      tags: ["React", "Tailwind", "Portfolio", "Frontend"],
      createdAt: "2025-07-15T10:00:00Z",
      readTime: "5 min read",
      views: 2100,
      category: "React",
    },
  ]

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true)
      setError(null)
      let fetchedBlog = null

      if (id !== hasIncrementedView.current.id) {
        hasIncrementedView.current = { id: null, done: false }
      }

      const sample = sampleBlogPosts.find((p) => p._id === id)
      if (sample) {
        fetchedBlog = sample
        console.log("Loaded blog from sample data:", sample.title)
      } else {
        try {
          const response = await blogAPI.getBlog(id)
          fetchedBlog = response.data
          console.log("Loaded blog from API:", fetchedBlog.title)

          if (!hasIncrementedView.current.done) {
            await blogAPI.incrementView(id)
            hasIncrementedView.current = { id: id, done: true }
          }
        } catch (err) {
          console.error("Failed to fetch blog details from API:", err)
          setError("Failed to load blog post. It might not exist or there was a server error.")
        }
      }

      if (fetchedBlog) {
        setBlog(fetchedBlog)

        const thumbUrl = fetchedBlog.thumbnail
          ? fetchedBlog.thumbnail.startsWith("/uploads/")
            ? `${UPLOAD_BASE_URL}${fetchedBlog.thumbnail}`
            : fetchedBlog.thumbnail
          : null
        setThumbnailUrl(thumbUrl)
      }

      setLoading(false)
    }
    fetchBlog()
  }, [id])

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
        <Link to="/blog" className="mt-4 text-blue-600 hover:underline">
          Go back to Blog
        </Link>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg">Blog post not found.</p>
        <Link to="/blog" className="mt-4 text-blue-600 hover:underline">
          Go back to Blog
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg my-8">
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to all Blogs
        </Link>

        {thumbnailUrl && (
          <div className="w-full max-w-md mx-auto h-85 overflow-hidden rounded-lg mb-8 shadow-md group bg-white p-2">
            <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-md">
              <img
                src={thumbnailUrl || "/placeholder.svg"}
                alt={blog?.title}
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=200&width=300&text=Blog+Post"
                }}
                className="max-h-full max-w-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
          </div>
        )}

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{blog.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{blog.summary}</p>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8 space-x-4">
          <span className="flex items-center">
            <Calendar size={16} className="mr-1" />
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center">
            <Clock size={16} className="mr-1" />
            {blog.readTime || "N/A"}
          </span>
          <span className="flex items-center">
            <Eye size={16} className="mr-1" />
            {(blog.views || 0).toLocaleString()} views
          </span>
        </div>

        <div
          className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  <Tag size={14} className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      <style>{`
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 700;
        }
        .prose h1 { font-size: 2em; }
        .prose h2 { font-size: 1.5em; }
        .prose h3 { font-size: 1.25em; }
        .prose p { margin-bottom: 1em; }
        .prose ul, .prose ol { margin-left: 2em; margin-bottom: 1em; }
        .prose li { margin-bottom: 0.5em; }
        .prose img { max-width: 100%; height: auto; margin: 1em 0; border-radius: 0.5em; }
        .prose a { color: #2563eb; text-decoration: underline; }
        .dark .prose a { color: #60a5fa; }
        .prose blockquote { border-left: 4px solid #e5e7eb; padding-left: 1em; margin: 1em 0; font-style: italic; }
        .dark .prose blockquote { border-left-color: #4b5563; }
        .prose code { background-color: #f3f4f6; padding: 0.2em 0.4em; border-radius: 0.25em; font-family: monospace; }
        .dark .prose code { background-color: #374151; }
        .prose pre { background-color: #1f2937; color: #f3f4f6; padding: 1em; border-radius: 0.5em; overflow-x: auto; }
      `}</style>
    </div>
  )
}
