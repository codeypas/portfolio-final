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
import crypto from "node:crypto"
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"
import { getEmailLink, sendEmail } from "../utils/mailer.js"

const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
const TOKEN_MAX_AGE_MS = 60 * 60 * 1000
const googleClient = new OAuth2Client()
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

const createToken = () => crypto.randomBytes(32).toString("hex")
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex")
const sanitizeUser = (user) => {
  const { password, emailVerificationToken, emailVerificationExpires, passwordResetToken, passwordResetExpires, ...rest } =
    user.toObject()
  return rest
}
const issueSession = (res, user) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })
  setCookie(res, token)
}

const getUniqueUsername = async (preferredName, email) => {
  const base = (preferredName || email.split("@")[0]).replace(/[^a-zA-Z0-9_]/g, "").slice(0, 24) || "user"
  let username = base
  let suffix = 1

  while (await User.exists({ username })) {
    username = `${base}${suffix}`
    suffix += 1
  }

  return username
}

const sendVerificationEmail = async (user, rawToken) => {
  await sendEmail({
    to: user.email,
    subject: "Verify your Portfolio account email",
    text: `Verify your email by opening this link within one hour:\n${getEmailLink("/login", rawToken)}&action=verify-email`,
  })
}

export const signup = async (req, res, next) => {
  const { username, email: submittedEmail, password } = req.body
  const email = submittedEmail?.trim().toLowerCase()

  if (!username?.trim() || !email || !password) {
    return next(errorHandler(400, "All fields are required"))
  }
  if (!EMAIL_PATTERN.test(email)) return next(errorHandler(400, "Enter a valid email address"))
  if (password.length < 6) return next(errorHandler(400, "Password must be at least 6 characters"))

  try {
    if (await User.exists({ email })) return next(errorHandler(409, "An account with this email already exists"))

    const rawToken = createToken()
    const newUser = await User.create({
      username: await getUniqueUsername(username.trim(), email),
      email,
      password: bcryptjs.hashSync(password, 12),
      emailVerificationToken: hashToken(rawToken),
      emailVerificationExpires: new Date(Date.now() + TOKEN_MAX_AGE_MS),
    })

    try {
      await sendVerificationEmail(newUser, rawToken)
    } catch (mailError) {
      await User.findByIdAndDelete(newUser._id)
      throw mailError
    }

    res.status(201).json({ message: "Check your email to verify your account before signing in." })
  } catch (error) {
    next(error)
  }
}

export const signin = async (req, res, next) => {
  const { email: submittedEmail, password } = req.body
  const email = submittedEmail?.trim().toLowerCase()

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"))
  }

  try {
    const validUser = await User.findOne({ email })
    if (!validUser || !validUser.password) return next(errorHandler(401, "Invalid email or password"))

    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) {
      return next(errorHandler(401, "Invalid email or password"))
    }
    if (!validUser.emailVerified) return next(errorHandler(403, "Verify your email before signing in"))

    issueSession(res, validUser)
    res.status(200).json({ user: sanitizeUser(validUser) })
  } catch (error) {
    console.error("Signin error:", error)
    next(error)
  }
}

export const verifyEmail = async (req, res, next) => {
  try {
    const token = req.query.token
    if (!token) return next(errorHandler(400, "Verification token is required"))

    const user = await User.findOne({
      emailVerificationToken: hashToken(token),
      emailVerificationExpires: { $gt: new Date() },
    })
    if (!user) return next(errorHandler(400, "This verification link is invalid or expired"))

    user.emailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()
    res.status(200).json({ message: "Email verified. You can now sign in." })
  } catch (error) {
    next(error)
  }
}

export const requestPasswordReset = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase()
    if (!email || !EMAIL_PATTERN.test(email)) return next(errorHandler(400, "Enter a valid email address"))

    const user = await User.findOne({ email })
    if (user?.password && user.emailVerified) {
      const rawToken = createToken()
      user.passwordResetToken = hashToken(rawToken)
      user.passwordResetExpires = new Date(Date.now() + TOKEN_MAX_AGE_MS)
      await user.save()
      await sendEmail({
        to: user.email,
        subject: "Reset your Portfolio account password",
        text: `Reset your password by opening this link within one hour:\n${getEmailLink("/login", rawToken)}&action=reset-password`,
      })
    }

    res.status(200).json({ message: "If an account exists for that email, a reset link has been sent." })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body
    if (!token || !password || password.length < 6) return next(errorHandler(400, "Use a valid reset link and a password of at least 6 characters"))

    const user = await User.findOne({ passwordResetToken: hashToken(token), passwordResetExpires: { $gt: new Date() } })
    if (!user) return next(errorHandler(400, "This password reset link is invalid or expired"))

    user.password = bcryptjs.hashSync(password, 12)
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    res.status(200).json({ message: "Password reset. You can now sign in." })
  } catch (error) {
    next(error)
  }
}

export const googleSignin = async (req, res, next) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) return next(errorHandler(503, "Google sign-in is not configured"))
    if (!req.body.credential) return next(errorHandler(400, "Google credential is required"))

    const ticket = await googleClient.verifyIdToken({ idToken: req.body.credential, audience: process.env.GOOGLE_CLIENT_ID })
    const payload = ticket.getPayload()
    if (!payload?.sub || !payload.email || !payload.email_verified) return next(errorHandler(401, "Google could not verify this email"))

    const email = payload.email.toLowerCase()
    let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] })
    if (!user) {
      user = await User.create({
        username: await getUniqueUsername(payload.name, email),
        email,
        googleId: payload.sub,
        emailVerified: true,
      })
    } else if (!user.googleId) {
      user.googleId = payload.sub
      user.emailVerified = true
      await user.save()
    }

    issueSession(res, user)
    res.status(200).json({ user: sanitizeUser(user) })
  } catch (error) {
    next(error.statusCode ? error : errorHandler(401, "Google sign-in failed"))
  }
}

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires",
    )
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
