import Contact from "../models/contact.model.js"
import { errorHandler } from "../utils/error.js"

export const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return next(errorHandler(400, "Name, email, and message are required"))
    }
    const newContact = await Contact.create({ name, email, message })
    res.status(201).json(newContact)
  } catch (error) {
    next(errorHandler(500, "Failed to send contact message"))
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
