// import { errorHandler } from "../utils/error.js"
// import User from "../models/user.model.js"
// import bcryptjs from "bcryptjs"
// import jwt from "jsonwebtoken"

// const setCookie = (res, token) => {
//   const isProduction = process.env.NODE_ENV === "production"
//   res.cookie("access_token", token, {
//     httpOnly: true,
//     secure: isProduction, // HTTPS only in production
//     sameSite: isProduction ? "None" : "Lax", // None for cross-origin in production
//     maxAge: 3600000, // 1 hour
//   })
// }

// export const signup = async (req, res, next) => {
//   const { username, email, password } = req.body

//   if (!username || !email || !password || username === "" || email === "" || password === "") {
//     return next(errorHandler(400, "All fields are required"))
//   }

//   const hashedPassword = bcryptjs.hashSync(password, 10)

//   const newUser = new User({
//     username,
//     email,
//     password: hashedPassword,
//   })

//   try {
//     await newUser.save()
//     const { password: hashedPasswordFromDoc, ...rest } = newUser._doc
//     const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET)
//     setCookie(res, token)
//     res.status(201).json({ user: rest })
//   } catch (error) {
//     next(error)
//   }
// }

// export const signin = async (req, res, next) => {
//   const { email, password } = req.body

//   if (!email || !password || email === "" || password === "") {
//     return next(errorHandler(400, "All fields are required"))
//   }

//   try {
//     const validUser = await User.findOne({ email })
//     if (!validUser) {
//       return next(errorHandler(404, "User not found"))
//     }

//     const validPassword = bcryptjs.compareSync(password, validUser.password)
//     if (!validPassword) {
//       return next(errorHandler(400, "Invalid password"))
//     }

//     const token = jwt.sign({ id: validUser._id, role: validUser.role }, process.env.JWT_SECRET)

//     const { password: hashedPassword, ...rest } = validUser._doc
//     setCookie(res, token)
//     res.status(200).json({ user: rest })
//   } catch (error) {
//     console.error("Signin error:", error)
//     next(error)
//   }
// }

// export const getUserProfile = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password")
//     if (!user) {
//       return next(errorHandler(404, "User not found"))
//     }
//     res.status(200).json({ user })
//   } catch (error) {
//     next(errorHandler(500, "Failed to fetch user profile"))
//   }
// }

// export const signout = (req, res, next) => {
//   try {
//     res.clearCookie("access_token")
//     res.status(200).json("Signout successful")
//   } catch (error) {
//     next(errorHandler(500, "Failed to sign out"))
//   }
// }



import { errorHandler } from "../utils/error.js"
import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

const getCookieOptions = () => {
  // Render terminates HTTPS before forwarding requests to Express. RENDER is
  // set by the platform, so this remains correct even if NODE_ENV is missing.
  const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true"

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
  }
}

const setCookie = (res, token) => {
  res.cookie("access_token", token, getCookieOptions())
}

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body

  if (!username || !email || !password || username === "" || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"))
  }

  const hashedPassword = bcryptjs.hashSync(password, 10)

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  })

  try {
    await newUser.save()
    const { password: hashedPasswordFromDoc, ...rest } = newUser._doc
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "7d" })
    setCookie(res, token)
    res.status(201).json({ user: rest })
  } catch (error) {
    next(error)
  }
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"))
  }

  try {
    const validUser = await User.findOne({ email })
    if (!validUser) {
      return next(errorHandler(404, "User not found"))
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"))
    }

    const token = jwt.sign({ id: validUser._id, role: validUser.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    const { password: hashedPassword, ...rest } = validUser._doc
    setCookie(res, token)
    res.status(200).json({ user: rest })
  } catch (error) {
    console.error("Signin error:", error)
    next(error)
  }
}

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return next(errorHandler(404, "User not found"))
    }
    res.status(200).json({ user })
  } catch (error) {
    next(errorHandler(500, "Failed to fetch user profile"))
  }
}

export const signout = (req, res, next) => {
  try {
    const { maxAge, ...clearCookieOptions } = getCookieOptions()
    res.clearCookie("access_token", clearCookieOptions)
    res.status(200).json("Signout successful")
  } catch (error) {
    next(errorHandler(500, "Failed to sign out"))
  }
}
