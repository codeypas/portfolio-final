import resumee from "../component/resumee.pdf"
import logo from "../image/BIZZBIO.png"
import { Link } from "react-router-dom"
import { Github, Linkedin, Mail, Download, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <img src={logo} alt="" width={120} />
            <p className="text-gray-300 mb-6 max-w-md">
              Full-Stack Software Developer who enjoys building real-world web and software solutions, and sharing what I learn through code and content.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/bijay-adhikari-656122327/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com/codeypas?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:bjbestintheworld@gmail.com"
                className="p-3 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/studyhub" className="text-gray-300 hover:text-white transition-colors">
                  Study Hub
                </Link>
              </li>
              <li>
                <Link to="/project" className="text-gray-300 hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={resumee}
                  target="_blank"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                  rel="noreferrer"
                >
                  <Download size={16} className="mr-2" />
                  Resume
                </a>
              </li>
              <li>
                <Link to="/studyhub" className="text-gray-300 hover:text-white transition-colors">
                  Study Materials
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/codeypas?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Open Source
                </a>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Tech Articles
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">Copyright © 2025. All rights are reserved</p>

          <div className="flex items-center text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="mx-2 text-red-500" size={16} />
            <span>by Bijay Adhikari</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
