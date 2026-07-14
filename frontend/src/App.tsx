import { Navigate, Route, Routes } from "react-router-dom"
import { useApp } from "./store/AppContext"
import AuthPage from "./pages/AuthPage"
import DashboardLayout from "./layouts/DashboardLayout"
import DashboardPage from "./pages/DashboardPage"
import MyCoursesPage from "./pages/MyCoursesPage"
import CoursePlayerPage from "./pages/CoursePlayerPage"
import QuizPage from "./pages/QuizPage"
import CertificatesPage from "./pages/CertificatesPage"
import ProfilePage from "./pages/ProfilePage"
import ConsolePage from "./pages/ConsolePage"
import AdminCourseReviewPage from "./pages/AdminCourseReviewPage"
import StudentAboutPage from "./pages/StudentAboutPage"
import LecturesAboutPage from "./pages/LecturesAboutPage"
import ApplyCoursesPage from "./pages/ApplyCoursesPage"
import type { ReactNode } from "react"

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const { user, loading } = useApp()

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-dark text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-sm font-semibold tracking-wider text-slate-300 animate-pulse">
          Connecting to secure cloud learning platform...
        </p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={user ? (user.role === 'admin' || user.role === 'instructor' ? <Navigate to="/console" replace /> : <Navigate to="/dashboard" replace />) : <AuthPage />} />

      {/* Quiz is full-screen (hides sidebar/navbar) */}
      <Route
        path="/quiz/:quizId"
        element={
          <RequireAuth>
            <QuizPage />
          </RequireAuth>
        }
      />

      {/* Everything else uses the dashboard shell */}
      <Route
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/apply-courses" element={<ApplyCoursesPage />} />
        <Route path="/courses" element={<MyCoursesPage />} />
        <Route path="/courses/:courseId" element={<CoursePlayerPage />} />
        <Route path="/quizzes" element={<QuizPage listMode />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/console" element={<ConsolePage />} />
        <Route path="/student-about" element={<StudentAboutPage />} />
        <Route path="/lectures-about" element={<LecturesAboutPage />} />
        <Route path="/admin-course-review" element={<AdminCourseReviewPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
