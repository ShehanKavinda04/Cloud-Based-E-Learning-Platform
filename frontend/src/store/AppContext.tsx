import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { dbService } from "@/services/firebase"
import type { UserDoc, CourseDoc, QuizDoc } from "@/services/models"

export interface Notification {
  id: string
  title: string
  body: string
  timeAgo: string
  unread: boolean
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "New lesson unlocked", body: "Module 3 of Advanced React is now available.", timeAgo: "10m ago", unread: true },
  { id: "n2", title: "Quiz reminder", body: "Your React final assessment closes in 2 days.", timeAgo: "1h ago", unread: true },
  { id: "n3", title: "Certificate ready", body: "Download your UI/UX Fundamentals certificate.", timeAgo: "3h ago", unread: false },
]

interface AppState {
  user: UserDoc | null
  setUser: (u: UserDoc | null) => void
  courses: CourseDoc[]
  setCourses: React.Dispatch<React.SetStateAction<CourseDoc[]>>
  quizzes: QuizDoc[]
  setQuizzes: React.Dispatch<React.SetStateAction<QuizDoc[]>>
  progress: Record<string, string[]>
  enrollCourse: (courseId: string) => Promise<void>
  toggleLesson: (courseId: string, lessonId: string) => Promise<void>
  courseProgressPct: (courseId: string) => number
  overallProgressPct: () => number
  notifications: Notification[]
  markAllRead: () => void
  loading: boolean
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDoc | null>(null)
  const [courses, setCourses] = useState<CourseDoc[]>([])
  const [quizzes, setQuizzes] = useState<QuizDoc[]>([])
  const [progress, setProgress] = useState<Record<string, string[]>>({})
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)
  const [loading, setLoading] = useState(true)

  // Listen to Auth State Changes & Load User Data
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const unsubscribe = dbService.onAuthStateChangedListener(async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser)

          const fetchLive = async () => {
            const { courses: dbCourses, quizzes: dbQuizzes } = await dbService.fetchCoursesAndQuizzes()
            setCourses(dbCourses)
            setQuizzes(dbQuizzes)
          }
          
          // Initial fetch
          await fetchLive()

          // Poll every 3 seconds for real-time updates from the database
          intervalId = setInterval(fetchLive, 3000)

          // Fetch student progress
          const progressMap = await dbService.fetchProgress(currentUser.uid)
          setProgress(progressMap)
        } else {
          // Logged out
          setUser(null)
          setProgress({})
          setCourses([])
          setQuizzes([])
          if (intervalId) clearInterval(intervalId)
        }
      } catch (err) {
        console.error("Error loading application context data:", err)
      } finally {
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  const enrollCourse = async (courseId: string) => {
    if (!user) return
    // Only enroll if not already enrolled
    if (progress[courseId] === undefined) {
      setProgress((prev) => ({ ...prev, [courseId]: [] }))
      try {
        await dbService.saveProgress(user.uid, courseId, [])
      } catch (err) {
        console.error("Failed to sync enrollment to database:", err)
      }
    }
  }

  const toggleLesson = async (courseId: string, lessonId: string) => {
    if (!user) return
    const current = progress[courseId] ?? []
    const next = current.includes(lessonId)
      ? current.filter((id) => id !== lessonId)
      : [...current, lessonId]

    // Update local state
    setProgress((prev) => ({ ...prev, [courseId]: next }))

    // Sync with backend (live Firebase or LocalStorage Mock)
    try {
      await dbService.saveProgress(user.uid, courseId, next)
    } catch (err) {
      console.error("Failed to sync progress to database:", err)
    }
  }

  const courseProgressPct = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (!course) return 0
    const total = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
    const done = (progress[courseId] ?? []).length
    return total === 0 ? 0 : Math.round((done / total) * 100)
  }

  const overallProgressPct = () => {
    if (courses.length === 0) return 0
    const sum = courses.reduce((acc, c) => acc + courseProgressPct(c.id), 0)
    return Math.round(sum / courses.length)
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const value = useMemo<AppState>(
    () => ({
      user,
      setUser,
      courses,
      setCourses,
      quizzes,
      setQuizzes,
      progress,
      enrollCourse,
      toggleLesson,
      courseProgressPct,
      overallProgressPct,
      notifications,
      markAllRead,
      loading,
    }),
    [user, courses, quizzes, progress, notifications, loading],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
