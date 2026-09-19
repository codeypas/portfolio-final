import nodemailer from "nodemailer"

const getFrontendUrl = () => (process.env.FRONTEND_ORIGIN || "http://localhost:5173").split(",")[0].trim()

const getTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    const error = new Error("Email delivery is not configured")
    error.statusCode = 503
    throw error
  }

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

export const sendEmail = async ({ to, subject, text, replyTo }) =>
  getTransporter().sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    replyTo,
  })

export const getEmailLink = (path, token) => `${getFrontendUrl()}${path}?token=${encodeURIComponent(token)}`
