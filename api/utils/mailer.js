import nodemailer from "nodemailer"

const getFrontendUrl = () => (process.env.FRONTEND_ORIGIN || "http://localhost:5173").split(",")[0].trim()
const SMTP_TIMEOUT_MS = 15_000

const emailConfigurationError = (message) => {
  const error = new Error(message)
  error.statusCode = 503
  return error
}

const getTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw emailConfigurationError("Email delivery is not configured. Please try again later.")
  }

  const connectionOptions = {
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS * 2,
  }

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      ...connectionOptions,
    })
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    ...connectionOptions,
  })
}

export const sendEmail = async ({ to, subject, text, replyTo }) => {
  try {
    return await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      replyTo,
    })
  } catch (error) {
    if (error.statusCode) throw error

    if (error.code === "EAUTH") {
      throw emailConfigurationError("Email service authentication failed. Please try again later.")
    }
    if (["ECONNECTION", "ECONNREFUSED", "ESOCKET", "ETIMEDOUT"].includes(error.code)) {
      throw emailConfigurationError("Email service is temporarily unavailable. Please try again later.")
    }

    throw emailConfigurationError("Email could not be delivered. Please try again later.")
  }
}

export const getEmailLink = (path, token) => `${getFrontendUrl()}${path}?token=${encodeURIComponent(token)}`
