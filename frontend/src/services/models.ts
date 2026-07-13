/**
 * Firestore schema models.
 *
 * These interfaces describe the documents stored in each Firestore collection.
 * Collections: `users`, `courses`, `progress`, `quizzes`.
 */

export type UserRole = "student" | "instructor" | "admin"

/** Collection: users/{uid} */
export interface UserDoc {
  uid: string
  name: string
  email: string
  role: UserRole
  avatar: string
  createdAt: number
}

/** Collection: courses/{courseId} */
export interface Lesson {
  id: string
  title: string
  duration: string // e.g. "12:40"
  type: "video" | "reading" | "quiz"
  videoUrl?: string
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface CourseResource {
  id: string
  name: string
  size: string
  type: "pdf" | "zip" | "doc"
}

export interface ForumPost {
  id: string
  author: string
  avatar: string
  message: string
  timeAgo: string
  replies: number
}

export interface CourseDoc {
  id: string
  title: string
  instructor: string
  instructorAvatar: string
  category: string
  thumbnail: string
  description: string
  rating: number
  students: number
  totalLessons: number
  level: "Beginner" | "Intermediate" | "Advanced"
  modules: Module[]
  resources: CourseResource[]
  forum: ForumPost[]
}

/** Collection: progress/{uid}_{courseId} */
export interface ProgressDoc {
  uid: string
  courseId: string
  completedLessonIds: string[]
  lastAccessed: number
}

/** Collection: quizzes/{quizId} */
export interface QuizOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: QuizOption[]
  correctOptionId: string
}

export interface QuizDoc {
  id: string
  courseId: string
  title: string
  durationSeconds: number
  passingScore: number // percentage
  questions: QuizQuestion[]
}
