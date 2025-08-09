"use client"
import logo from "../image/BIZZBIO.png"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom" // Import useNavigate
import { Menu, X, Sun, Moon, LogIn, LogOut, LayoutDashboard } from "lucide-react" // Import new icons
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext" // Import useAuth

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const { user, isAdmin, logout } = useAuth() // Get user, isAdmin, and logout from AuthContext
  const location = useLocation()
  const navigate = useNavigate() // Initialize useNavigate

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    logout()
    closeMenu() // Close mobile menu on logout
    navigate("/login") // Redirect to login page after logout
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <img src={logo || "/placeholder.svg"} alt="BookMandu Logo" width={180} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${isActive("/") ? "text-blue-600 dark:text-blue-400 font-semibold" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/blog"
              className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${isActive("/blog") ? "text-blue-600 dark:text-blue-400 font-semibold" : ""}`}
            >
              Blog
            </Link>
            <Link
              to="/studyhub"
              className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${isActive("/studyhub") ? "text-blue-600 dark:text-blue-400 font-semibold" : ""}`}
            >
              StudyHub
            </Link>
            <Link
              to="/project"
              className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${isActive("/project") ? "text-blue-600 dark:text-blue-400 font-semibold" : ""}`}
            >
              Projects
            </Link>
            <Link
              to="/contact"
              className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${isActive("/contact") ? "text-blue-600 dark:text-blue-400 font-semibold" : ""}`}
            >
              Contact
            </Link>

            {/* Conditional Auth Buttons for Desktop */}
            {user ? (
              <>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/admin") ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                  >
                    <LayoutDashboard size={16} className="mr-2" />
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/login") ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              >
                <LogIn size={16} className="mr-2" />
                Sign In
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className={`block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${isActive("/") ? "text-blue-600 dark:text-blue-400 font-semibold" : ""}`}
              >
                Home
              </Link>
              <Link
                to="/blog"
                onClick={closeMenu}
                className={`block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${isActive("/blog") ? "text-blue-600 dark:text-blue-400 font-semibold" : ""}`}
              >
                Blog
              </Link>
              <Link
                to="/studyhub"
                onClick={closeMenu}
                className={`block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${isActive("/studyhub") ? "text-blue-600 dark:text-blue-400 font-semibold" : ""}`}
              >
                StudyHub
              </Link>
              <Link
                to="/project"
                onClick={closeMenu}
                className={`block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${isActive("/project") ? "text-blue-600 dark:text-blue-400 font-semibold" : ""}`}
              >
                Projects
              </Link>
              <Link
                to="/contact"
                onClick={closeMenu}
                className={`block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${isActive("/contact") ? "text-blue-600 dark:text-blue-400 font-semibold" : ""}`}
              >
                Contact
              </Link>
              {/* Conditional Auth Buttons for Mobile */}
              {user ? (
                <>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className={`block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${isActive("/admin") ? "text-blue-600 dark:text-blue-400 font-semibold" : ""}`}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className={`block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${isActive("/login") ? "text-blue-600 dark:text-blue-400 font-semibold" : ""}`}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
