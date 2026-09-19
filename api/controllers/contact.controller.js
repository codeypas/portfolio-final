import Contact from "../models/contact.model.js"
import { errorHandler } from "../utils/error.js"
import { sendEmail } from "../utils/mailer.js"

export const createContactMessage = async (req, res, next) => {
  try {
    const name = req.body.name?.trim()
    const email = req.body.email?.trim().toLowerCase()
    const message = req.body.message?.trim()
    if (!name || !email || !message) {
      return next(errorHandler(400, "Name, email, and message are required"))
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return next(errorHandler(400, "Enter a valid email address"))
    }

    await sendEmail({
      to: process.env.CONTACT_RECIPIENT_EMAIL || "bjbestintheworld17@gmail.com",
      replyTo: email,
      subject: `Portfolio contact message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    // Return success only after Gmail/SMTP accepts the message for delivery.
    const newContact = await Contact.create({ name, email, message })
    res.status(201).json(newContact)
  } catch (error) {
    console.error("Contact email delivery failed:", error.message)
    next(error.statusCode ? error : errorHandler(500, "Failed to send contact message"))
  }
}

export const getContactMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 }) // Sort by newest first
    res.status(200).json(messages)
  } catch (error) {
    next(errorHandler(500, "Failed to fetch contact messages"))
  }
}

export const markContactAsRead = async (req, res, next) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })
    if (!updatedContact) {
      return next(errorHandler(404, "Contact message not found"))
    }
    res.status(200).json(updatedContact)
  } catch (error) {
    next(errorHandler(500, "Failed to mark message as read"))
  }
}

export const deleteContactMessage = async (req, res, next) => {
  try {
    await Contact.findByIdAndDelete(req.params.id)
    res.status(200).json("Contact message deleted successfully")
  } catch (error) {
    next(errorHandler(500, "Failed to delete contact message"))
  }
}
