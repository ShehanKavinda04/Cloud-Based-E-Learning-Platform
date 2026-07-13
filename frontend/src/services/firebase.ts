import type { UserDoc, UserRole, CourseDoc, QuizDoc } from "./models"
import { COURSES, QUIZ } from "./mockData"

const API_URL = "http://localhost:5001/api"
const AVATARS = [
  "/avatars/student.png",
  "/avatars/instructor.png",
  "/avatars/admin.png",
]

// Custom fetch client with API base URL
async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.error || `HTTP error! Status: ${res.status}`)
  }
  return await res.json()
}

// ----------------- Mock Fallbacks (LocalStorage) -----------------
const MOCK_USERS_KEY = "nimbus_mock_users"
const MOCK_COURSES_KEY = "nimbus_mock_courses"
const MOCK_QUIZZES_KEY = "nimbus_mock_quizzes"
const MOCK_PROGRESS_KEY = "nimbus_mock_progress"

function getMockUsers(): UserDoc[] {
  const data = localStorage.getItem(MOCK_USERS_KEY)
  return data ? JSON.parse(data) : []
}

function saveMockUser(user: UserDoc) {
  const users = getMockUsers()
  const filtered = users.filter((u) => u.uid !== user.uid)
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([...filtered, user]))
}

async function loginMock(email: string, password: string, role: UserRole): Promise<UserDoc> {
  const users = getMockUsers()
  let user = users.find((u) => u.email === email)
  if (!user) {
    user = {
      uid: `mock_${Math.random().toString(36).slice(2, 10)}`,
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role,
      avatar: role === "instructor" ? AVATARS[1] : role === "admin" ? AVATARS[2] : AVATARS[0],
      createdAt: Date.now(),
    }
    saveMockUser(user)
  }
  return user
}

async function registerMock(name: string, email: string, password: string, role: UserRole): Promise<UserDoc> {
  const users = getMockUsers()
  if (users.some((u) => u.email === email)) {
    throw new Error("Email already in use.")
  }
  const newUser: UserDoc = {
    uid: `mock_${Math.random().toString(36).slice(2, 10)}`,
    name,
    email,
    role,
    avatar: role === "instructor" ? AVATARS[1] : role === "admin" ? AVATARS[2] : AVATARS[0],
    createdAt: Date.now(),
  }
  saveMockUser(newUser)
  return newUser
}

function getMockCourses(): CourseDoc[] {
  const data = localStorage.getItem(MOCK_COURSES_KEY)
  if (!data) {
    localStorage.setItem(MOCK_COURSES_KEY, JSON.stringify(COURSES))
    return COURSES
  }
  return JSON.parse(data)
}

function saveMockCourse(course: CourseDoc) {
  const courses = getMockCourses()
  const updated = courses.map((c) => (c.id === course.id ? course : c))
  if (!courses.some((c) => c.id === course.id)) {
    updated.push(course)
  }
  localStorage.setItem(MOCK_COURSES_KEY, JSON.stringify(updated))
}

function getMockQuizzes(): QuizDoc[] {
  const data = localStorage.getItem(MOCK_QUIZZES_KEY)
  if (!data) {
    localStorage.setItem(MOCK_QUIZZES_KEY, JSON.stringify([QUIZ]))
    return [QUIZ]
  }
  return JSON.parse(data)
}

function saveMockQuiz(quiz: QuizDoc) {
  const quizzes = getMockQuizzes()
  const updated = quizzes.map((q) => (q.id === quiz.id ? quiz : q))
  if (!quizzes.some((q) => q.id === quiz.id)) {
    updated.push(quiz)
  }
  localStorage.setItem(MOCK_QUIZZES_KEY, JSON.stringify(updated))
}

function getMockProgress(uid: string): Record<string, string[]> {
  const data = localStorage.getItem(`${MOCK_PROGRESS_KEY}_${uid}`)
  if (!data) {
    const defaultProgress = {
      "react-mastery": ["l1", "l2", "l3", "l4"],
      "data-science-101": ["l1", "l2"],
    }
    localStorage.setItem(`${MOCK_PROGRESS_KEY}_${uid}`, JSON.stringify(defaultProgress))
    return defaultProgress
  }
  return JSON.parse(data)
}

function saveMockProgress(uid: string, courseId: string, completedLessonIds: string[]) {
  const progress = getMockProgress(uid)
  progress[courseId] = completedLessonIds
  localStorage.setItem(`${MOCK_PROGRESS_KEY}_${uid}`, JSON.stringify(progress))
}

// ----------------- Unified Platform Service Layer -----------------
export const dbService = {
  // --- Auth Actions ---
  onAuthStateChangedListener(callback: (user: UserDoc | null) => void): () => void {
    const checkUser = () => {
      const stored = localStorage.getItem("nimbus_current_user")
      if (stored) {
        callback(JSON.parse(stored))
      } else {
        callback(null)
      }
    }
    checkUser()
    window.addEventListener("nimbus_auth_state", checkUser)
    return () => window.removeEventListener("nimbus_auth_state", checkUser)
  },

  async login(email: string, password: string, role: UserRole): Promise<UserDoc> {
    try {
      const user = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      })
      localStorage.setItem("nimbus_current_user", JSON.stringify(user))
      window.dispatchEvent(new Event("nimbus_auth_state"))
      return user
    } catch (err) {
      console.warn("Express backend authentication offline, falling back to Mock storage.")
      const user = await loginMock(email, password, role)
      localStorage.setItem("nimbus_current_user", JSON.stringify(user))
      window.dispatchEvent(new Event("nimbus_auth_state"))
      return user
    }
  },

  async register(name: string, email: string, password: string, role: UserRole): Promise<UserDoc> {
    try {
      const user = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      })
      localStorage.setItem("nimbus_current_user", JSON.stringify(user))
      window.dispatchEvent(new Event("nimbus_auth_state"))
      return user
    } catch (err) {
      console.warn("Express backend registration offline, falling back to Mock storage.")
      const user = await registerMock(name, email, password, role)
      localStorage.setItem("nimbus_current_user", JSON.stringify(user))
      window.dispatchEvent(new Event("nimbus_auth_state"))
      return user
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_URL}/auth/logout`, { method: "POST" }).catch(() => {})
    } finally {
      localStorage.removeItem("nimbus_current_user")
      window.dispatchEvent(new Event("nimbus_auth_state"))
    }
  },

  // --- Course & Quiz Actions ---
  async fetchCoursesAndQuizzes(): Promise<{ courses: CourseDoc[]; quizzes: QuizDoc[] }> {
    try {
      const courses = await request("/courses")
      const quizzes = await request("/quizzes")
      return { courses, quizzes }
    } catch (err) {
      console.warn("Backend server offline. Fetching courses and quizzes from LocalStorage mock.")
      return {
        courses: getMockCourses(),
        quizzes: getMockQuizzes(),
      }
    }
  },

  async saveCourse(course: CourseDoc): Promise<void> {
    try {
      await request("/courses", {
        method: "POST",
        body: JSON.stringify(course),
      })
    } catch (err) {
      console.warn("Backend server offline. Saving course locally.")
      saveMockCourse(course)
    }
  },

  async saveQuiz(quiz: QuizDoc): Promise<void> {
    try {
      await request("/quizzes", {
        method: "POST",
        body: JSON.stringify(quiz),
      })
    } catch (err) {
      console.warn("Backend server offline. Saving quiz locally.")
      saveMockQuiz(quiz)
    }
  },

  // --- Student Progress Actions ---
  async fetchProgress(uid: string): Promise<Record<string, string[]>> {
    try {
      return await request(`/progress/${uid}`)
    } catch (err) {
      console.warn("Backend server offline. Fetching student progress locally.")
      return getMockProgress(uid)
    }
  },

  async saveProgress(uid: string, courseId: string, completedLessonIds: string[]): Promise<void> {
    try {
      await request("/progress", {
        method: "POST",
        body: JSON.stringify({ uid, courseId, completedLessonIds }),
      })
    } catch (err) {
      console.warn("Backend server offline. Syncing progress locally.")
      saveMockProgress(uid, courseId, completedLessonIds)
    }
  },
}
