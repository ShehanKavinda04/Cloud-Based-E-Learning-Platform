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

export interface CourseApplication {
  id: string
  studentId: string
  studentName: string
  courseId: string
  courseTitle: string
  timestamp: string
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
  publishAdminCourse: (adminCourse: any) => Promise<void>
  rejectAdminCourse: (courseId: string) => void
  rejectedAdminCourses: string[]
  addNotification: (notif: Omit<Notification, "id">) => void
  courseApplications: CourseApplication[]
  applyCourse: (courseId: string) => void
  approveApplication: (appId: string) => Promise<void>
  rejectApplication: (appId: string) => void
  publishQuiz: (quiz: QuizDoc) => Promise<void>
  loading: boolean
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDoc | null>(null)
  const [courses, setCourses] = useState<CourseDoc[]>([])
  const [quizzes, setQuizzes] = useState<QuizDoc[]>([])
  const [progress, setProgress] = useState<Record<string, string[]>>({})
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem("nimbus_notifications")
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS
    } catch {
      return INITIAL_NOTIFICATIONS
    }
  })
  const [rejectedAdminCourses, setRejectedAdminCourses] = useState<string[]>([])
  const [courseApplications, setCourseApplications] = useState<CourseApplication[]>(() => {
    try {
      const saved = localStorage.getItem("nimbus_applications")
      return saved ? JSON.parse(saved) : [
        {
          id: "app1",
          studentId: "student123",
          studentName: "James Carter",
          courseId: "c1",
          courseTitle: "Advanced React & Frontend Architecture",
          timestamp: "Yesterday"
        },
        {
          id: "app2",
          studentId: "student456",
          studentName: "Sophia Lee",
          courseId: "c2",
          courseTitle: "Cloud Computing & DevOps Essentials",
          timestamp: "2 days ago"
        }
      ]
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setRejectedAdminCourses(JSON.parse(localStorage.getItem("nimbus_rejected_courses") || "[]"))
  }, [])

  // Sync to localStorage when these change
  useEffect(() => {
    localStorage.setItem("nimbus_applications", JSON.stringify(courseApplications))
  }, [courseApplications])

  useEffect(() => {
    localStorage.setItem("nimbus_notifications", JSON.stringify(notifications))
  }, [notifications])

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

  const addNotification = (notif: Omit<Notification, "id">) => {
    setNotifications((prev) => [
      { id: `n_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, ...notif },
      ...prev,
    ])
  }

  const publishAdminCourse = async (adminCourse: any) => {
    const newCourse: CourseDoc = {
      id: adminCourse.id,
      title: adminCourse.title,
      instructor: adminCourse.instructor,
      instructorAvatar: "/avatars/instructor.png",
      category: adminCourse.category,
      thumbnail: adminCourse.image,
      description: `Master ${adminCourse.title} and earn your ${adminCourse.certificate}.`,
      rating: 5.0,
      students: 0,
      totalLessons: adminCourse.videos + adminCourse.quizzes + adminCourse.papers,
      level: "Intermediate",
      modules: adminCourse.curriculum.map((c: string, i: number) => ({
        id: `m${i}`,
        title: c,
        lessons: [
           { id: `l${i}_1`, title: `${c} Introduction`, duration: "10:00", type: "video", videoUrl: "big-buck" }
        ]
      })),
      resources: [],
      forum: []
    }
    await dbService.saveCourse(newCourse)
  }

  const rejectAdminCourse = (courseId: string) => {
    const next = [...rejectedAdminCourses, courseId]
    setRejectedAdminCourses(next)
    localStorage.setItem("nimbus_rejected_courses", JSON.stringify(next))
  }

  const applyCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (!course || !user) return
    setCourseApplications((prev) => [
      {
        id: `app_${Date.now()}`,
        studentId: user.uid,
        studentName: user.name,
        courseId,
        courseTitle: course.title,
        timestamp: "Just now",
      },
      ...prev,
    ])
    addNotification({
      title: "Request to Course",
      body: `${user.name} wants to join ${course.title}.`,
      timeAgo: "Just now",
      unread: true,
    })
  }

  const approveApplication = async (appId: string) => {
    const app = courseApplications.find((a) => a.id === appId)
    if (!app) return
    
    // Optimistic UI update - instantly remove from screen
    setCourseApplications((prev) => prev.filter((a) => a.id !== appId))
    
    // In a real app we'd enroll the specific student, but here we can just enroll the current user if they match
    // Actually we will simulate adding to progress for that student in the mock DB.
    try {
      const studentProgress = await dbService.fetchProgress(app.studentId)
      studentProgress[app.courseId] = []
      await dbService.saveProgress(app.studentId, app.courseId, [])
      
      // If current user is the one approved, update local progress state
      if (user && user.uid === app.studentId) {
        setProgress((prev) => ({ ...prev, [app.courseId]: [] }))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const rejectApplication = (appId: string) => {
    setCourseApplications((prev) => prev.filter((a) => a.id !== appId))
  }

  const publishQuiz = async (quiz: QuizDoc) => {
    setQuizzes((prev) => [...prev, quiz])
    await dbService.saveQuiz(quiz)
    addNotification({
      title: "New Quiz Published",
      body: `A new assessment "${quiz.title}" is now available.`,
      timeAgo: "Just now",
      unread: true,
    })
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
      publishAdminCourse,
      rejectAdminCourse,
      rejectedAdminCourses,
      addNotification,
      courseApplications,
      applyCourse,
      approveApplication,
      rejectApplication,
      publishQuiz,
      loading,
    }),
    [user, courses, quizzes, progress, notifications, rejectedAdminCourses, courseApplications, loading],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
