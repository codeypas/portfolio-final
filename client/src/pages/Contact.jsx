import { useState } from "react"
import resumee from "../component/resumee.pdf"
import {
  Mail,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Linkedin,
  Github,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [expandedFAQ, setExpandedFAQ] = useState(null)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({ type: "error", message: "Please fill in all fields." })
      return
    }

    if (!validateEmail(formData.email)) {
      setSubmitStatus({ type: "error", message: "Please enter a valid email address." })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call - replace with actual email service. 
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSubmitStatus({
        type: "success",
        message: "Thank you! Your message has been sent successfully. I'll get back to you soon.",
      })

      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Sorry, there was an error sending your message. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const faqs = [
    {
      question: "Are you open to internships or freelance work?",
      answer:
        "Yes! I'm always excited to work on real-world projects that challenge and grow my skills. Feel free to reach out with opportunities.",
    },
    {
      question: "Can I use your study materials for free?",
      answer:
        "Absolutely. All content in my Study Hub is freely available for learning. You can download and use any resource without restrictions.",
    },
    {
      question: "Do you collaborate on open-source projects?",
      answer:
        "Yes, I love contributing to open-source projects. Feel free to pitch your idea or send a GitHub link, and I'll be happy to collaborate.",
    },
    {
      question: "How can I request a personalized note or topic?",
      answer:
        "Just mention it in the contact form with your email. I'll try to create or upload it in Study Hub based on demand and relevance.",
    },
    {
      question: "Can I get resume/portfolio tips from you?",
      answer:
        "Send me your draft or LinkedIn profile, and I'll give quick suggestions to help you improve your professional presentation.",
    },
  ]

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Let's Connect 🤝</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Whether you have a question, project idea, internship opportunity, or just want to say hello — I'd love to
            hear from you. I usually reply within 24 hours.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Send me a message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  👤 Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📧 Email (required)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  💬 Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Tell me about your project, question, or just say hello..."
                />
              </div>

              {submitStatus && (
                <div
                  className={`p-4 rounded-lg flex items-center ${
                    submitStatus.type === "success"
                      ? "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                      : "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="mr-3 flex-shrink-0" size={20} />
                  ) : (
                    <AlertCircle className="mr-3 flex-shrink-0" size={20} />
                  )}
                  <span>{submitStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2" size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Quick Contact Links */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Connect</h3>

              <div className="space-y-4">
                <a
                  href="mailto:bjbestintheworld@gmail.com"
                  className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
                >
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg mr-4">
                    <Mail className="text-red-600 dark:text-red-400" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      Email
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">bjbestintheworld@gmail.com</p>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/bijay-adhikari-656122327/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
                >
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                    <Linkedin className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      LinkedIn
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">Connect professionally</p>
                  </div>
                </a>

                <a
                  href="https://github.com/codeypas?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
                >
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg mr-4">
                    <Github className="text-gray-800 dark:text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                      GitHub
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">View my repositories</p>
                  </div>
                </a>

                <a
                  href={resumee}
                  target="_blank"
                  className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
                  rel="noreferrer"
                >
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
                    <Download className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      Resume
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">Download PDF</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Location</h3>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="text-blue-600 dark:text-blue-400 mr-3" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Chitvan, Nepal</h4>
                    <p className="text-gray-600 dark:text-gray-300">Remote-friendly | Open to relocation</p>
                  </div>
                </div>

                {/* Embedded Map */}
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113032.56149281568!2d84.35073842167969!3d27.529305899999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994fb2b9b8b8b8b%3A0x1234567890abcdef!2sChitwan%2C%20Nepal!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Chitvan, Nepal Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            ❓ Frequently Asked Questions
          </h2>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="text-gray-500 dark:text-gray-400" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-500 dark:text-gray-400" size={20} />
                  )}
                </button>

                {expandedFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
