import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"
import Home from "./pages/Home"
import Blog from "./pages/Blog"
import BlogDetails from "./pages/BlogDetails"
import StudyHub from "./pages/StudyHub"
import Project from "./pages/Project"
import ProjectDetails from "./pages/ProjectDetails"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import AdminDashboard from "./pages/AdminDashboard"
import Header from "./component/Header"
import Footer from "./component/Footer"
// Import new admin form components
import BlogForm from "./pages/admin/BlogForm"
import StudyForm from "./pages/admin/StudyForm"
import ProjectForm from "./pages/admin/ProjectForm"
// Import ProtectedRoute component
import ProtectedRoute from "./components/ProtectedRoute"
import ColdStartAlert from "./component/ColdStartAlert"
// Import ColdStartAlert component


export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ColdStartAlert />
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              {/* Protect StudyHub with AuthContext-aware guard */}
              <Route
                path="/studyhub"
                element={
                  <ProtectedRoute>
                    <StudyHub />
                  </ProtectedRoute>
                }
              />
              <Route path="/project" element={<Project />} />
              <Route path="/project/:id" element={<ProjectDetails />} /> {/* New route for project details */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              {/* Admin Routes for Content Management */}
              <Route path="/admin/blogs/new" element={<BlogForm />} />
              <Route path="/admin/blogs/edit/:id" element={<BlogForm />} />
              <Route path="/admin/study/new" element={<StudyForm />} />
              <Route path="/admin/study/edit/:id" element={<StudyForm />} />
              <Route path="/admin/projects/new" element={<ProjectForm />} />
              <Route path="/admin/projects/edit/:id" element={<ProjectForm />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
