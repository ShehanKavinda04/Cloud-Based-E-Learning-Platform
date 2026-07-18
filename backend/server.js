import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const admin = require("firebase-admin")

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5001

// 1. Firebase Admin Initialization
// Make sure to add FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL to your .env file
const firebaseConfig = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, '\n'),
}

const isFirebaseConfigured = !!firebaseConfig.projectId && !!firebaseConfig.privateKey

let authInstance = null
let dbInstance = null

if (isFirebaseConfigured) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
      })
    }
    authInstance = admin.auth()
    dbInstance = admin.firestore()
    console.log("Firebase Admin initialized successfully on backend server.")
  } catch (err) {
    console.error("Firebase Admin initialization failed:", err)
  }
} else {
  console.warn(
    "Firebase Admin config is missing. Server is running in Mock In-Memory Database Mode."
  )
}

// ----------------- Mock In-Memory Data -----------------
const mockUsers = []
let mockCourses = [
  {
    id: "react-mastery",
    title: "Advanced React & Frontend Architecture",
    instructor: "Dr. Elena Vasquez",
    instructorAvatar: "/avatars/instructor.png",
    category: "Web Development",
    thumbnail: "/courses/react.png",
    description: "Master modern React patterns, performance optimization, and scalable frontend architecture used by top engineering teams.",
    rating: 4.9,
    students: 12480,
    totalLessons: 8,
    level: "Advanced",
    modules: [
      {
        id: "m1",
        title: "Foundations of Modern React",
        lessons: [
          { id: "l1", title: "Course Introduction & Setup", duration: "06:12", type: "video", videoUrl: "big-buck" },
          { id: "l2", title: "Thinking in Components", duration: "14:35", type: "video", videoUrl: "big-buck" },
          { id: "l3", title: "Hooks Deep Dive", duration: "22:08", type: "video", videoUrl: "big-buck" },
        ],
      },
      {
        id: "m2",
        title: "State & Performance",
        lessons: [
          { id: "l4", title: "Advanced State Management", duration: "18:44", type: "video", videoUrl: "big-buck" },
          { id: "l5", title: "Memoization & Rendering", duration: "16:20", type: "video", videoUrl: "big-buck" },
          { id: "l6", title: "Reading: Concurrent React", duration: "10 min", type: "reading" },
        ],
      },
      {
        id: "m3",
        title: "Architecture & Assessment",
        lessons: [
          { id: "l7", title: "Scalable Folder Structures", duration: "12:50", type: "video", videoUrl: "big-buck" },
          { id: "l8", title: "Module Quiz", duration: "10 min", type: "quiz" },
        ],
      },
    ],
    resources: [
      { id: "r1", name: "React Patterns Cheatsheet.pdf", size: "2.4 MB", type: "pdf" },
      { id: "r2", name: "Starter Project Files.zip", size: "8.1 MB", type: "zip" },
      { id: "r3", name: "Architecture Diagram.pdf", size: "1.2 MB", type: "pdf" },
    ],
    forum: [
      {
        id: "f1",
        author: "Marcus Lee",
        avatar: "/avatars/student.png",
        message: "The hooks deep dive finally made useEffect click for me. Any tips on cleanup functions?",
        timeAgo: "2h ago",
        replies: 4,
      },
    ],
  },
  {
    id: "data-science-101",
    title: "Data Science & Machine Learning Bootcamp",
    instructor: "Prof. Daniel Okafor",
    instructorAvatar: "/avatars/instructor.png",
    category: "Data Science",
    thumbnail: "/courses/data-science.png",
    description: "From statistics to neural networks — build real predictive models with Python and industry-standard tooling.",
    rating: 4.8,
    students: 9820,
    totalLessons: 6,
    level: "Intermediate",
    modules: [
      {
        id: "m1",
        title: "Data Foundations",
        lessons: [
          { id: "l1", title: "Intro to Data Science", duration: "08:30", type: "video", videoUrl: "big-buck" },
          { id: "l2", title: "Working with Pandas", duration: "19:12", type: "video", videoUrl: "big-buck" },
          { id: "l3", title: "Data Visualization", duration: "15:40", type: "video", videoUrl: "big-buck" },
        ],
      },
    ],
    resources: [],
    forum: [],
  },
  {
    id: "ux-design",
    title: "UI/UX Design Fundamentals",
    instructor: "Aisha Rahman",
    instructorAvatar: "/avatars/instructor.png",
    category: "Design",
    thumbnail: "/courses/design.png",
    description: "Learn user-centered design, wireframing, prototyping, and design systems to craft delightful digital products.",
    rating: 4.7,
    students: 7340,
    totalLessons: 5,
    level: "Beginner",
    modules: [
      {
        id: "m1",
        title: "Design Principles",
        lessons: [
          { id: "l1", title: "What is UX?", duration: "07:45", type: "video", videoUrl: "big-buck" },
          { id: "l2", title: "Color & Typography", duration: "13:22", type: "video", videoUrl: "big-buck" },
          { id: "l3", title: "Layout & Spacing", duration: "11:10", type: "video", videoUrl: "big-buck" },
        ],
      },
      {
        id: "m2",
        title: "Prototyping",
        lessons: [
          { id: "l4", title: "Wireframing Basics", duration: "16:00", type: "video", videoUrl: "big-buck" },
          { id: "l5", title: "Building a Design System", duration: "20:15", type: "video", videoUrl: "big-buck" },
        ],
      },
    ],
    resources: [{ id: "r1", name: "Figma Starter Kit.zip", size: "12.5 MB", type: "zip" }],
    forum: [],
  },
  {
    id: "cloud-devops",
    title: "Cloud Computing & DevOps Essentials",
    instructor: "James Carter",
    instructorAvatar: "/avatars/instructor.png",
    category: "Cloud",
    thumbnail: "/courses/cloud.png",
    description: "Deploy, scale, and monitor applications in the cloud. Covers containers, CI/CD pipelines, and infrastructure as code.",
    rating: 4.6,
    students: 5610,
    totalLessons: 4,
    level: "Intermediate",
    modules: [
      {
        id: "m1",
        title: "Cloud Foundations",
        lessons: [
          { id: "l1", title: "Cloud Service Models", duration: "09:50", type: "video", videoUrl: "big-buck" },
          { id: "l2", title: "Containers & Docker", duration: "21:30", type: "video", videoUrl: "big-buck" },
        ],
      },
      {
        id: "m2",
        title: "Automation",
        lessons: [
          { id: "l3", title: "CI/CD Pipelines", duration: "18:12", type: "video", videoUrl: "big-buck" },
          { id: "l4", title: "Infrastructure as Code", duration: "17:05", type: "video", videoUrl: "big-buck" },
        ],
      },
    ],
    resources: [{ id: "r1", name: "Deployment Checklist.pdf", size: "0.9 MB", type: "pdf" }],
    forum: [],
  },
  {
    id: "python-django",
    title: "Full-Stack Python with Django",
    instructor: "David Miller",
    instructorAvatar: "/avatars/instructor.png",
    category: "Web Development",
    thumbnail: "/courses/react.png",
    description: "Build robust backend APIs and dynamic web apps with Python and Django.",
    rating: 4.8,
    students: 11200,
    totalLessons: 5,
    level: "Intermediate",
    modules: [
      {
        id: "m1",
        title: "Django Basics",
        lessons: [
          { id: "l1", title: "Intro to Django", duration: "10:10", type: "video", videoUrl: "big-buck" },
          { id: "l2", title: "Models and ORM", duration: "18:40", type: "video", videoUrl: "big-buck" }
        ],
      },
      {
        id: "m2",
        title: "Advanced Django",
        lessons: [
          { id: "l3", title: "Django REST Framework", duration: "25:15", type: "video", videoUrl: "big-buck" },
          { id: "l4", title: "Authentication", duration: "15:20", type: "video", videoUrl: "big-buck" },
          { id: "l5", title: "Deployment", duration: "20:00", type: "video", videoUrl: "big-buck" }
        ],
      }
    ],
    resources: [],
    forum: [],
  },
  {
    id: "flutter-mobile",
    title: "Mobile App Development with Flutter",
    instructor: "Sarah Jenkins",
    instructorAvatar: "/avatars/instructor.png",
    category: "Web Development",
    thumbnail: "/courses/design.png",
    description: "Create beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
    rating: 4.7,
    students: 8400,
    totalLessons: 4,
    level: "Beginner",
    modules: [
      {
        id: "m1",
        title: "Flutter Basics",
        lessons: [
          { id: "l1", title: "Dart Fundamentals", duration: "15:30", type: "video", videoUrl: "big-buck" },
          { id: "l2", title: "Building UIs", duration: "22:15", type: "video", videoUrl: "big-buck" }
        ]
      },
      {
        id: "m2",
        title: "State and API",
        lessons: [
          { id: "l3", title: "State Management", duration: "20:45", type: "video", videoUrl: "big-buck" },
          { id: "l4", title: "Fetching Data", duration: "18:10", type: "video", videoUrl: "big-buck" }
        ]
      }
    ],
    resources: [],
    forum: [],
  },
  {
    id: "ethical-hacking",
    title: "Cybersecurity & Ethical Hacking",
    instructor: "Kevin Mitnick Jr",
    instructorAvatar: "/avatars/instructor.png",
    category: "Cloud",
    thumbnail: "/courses/cloud.png",
    description: "Learn network security, penetration testing, and ethical hacking from the ground up.",
    rating: 4.9,
    students: 15300,
    totalLessons: 4,
    level: "Advanced",
    modules: [
      {
        id: "m1",
        title: "Network Security",
        lessons: [
          { id: "l1", title: "Intro to Networking", duration: "12:00", type: "video", videoUrl: "big-buck" },
          { id: "l2", title: "Vulnerability Scanning", duration: "25:40", type: "video", videoUrl: "big-buck" }
        ]
      },
      {
        id: "m2",
        title: "Exploitation",
        lessons: [
          { id: "l3", title: "Web App Hacking", duration: "30:15", type: "video", videoUrl: "big-buck" },
          { id: "l4", title: "Privilege Escalation", duration: "18:50", type: "video", videoUrl: "big-buck" }
        ]
      }
    ],
    resources: [],
    forum: [],
  }
]
let mockQuizzes = [
  {
    id: "react-final",
    courseId: "react-mastery",
    title: "Advanced React — Final Assessment",
    durationSeconds: 300,
    passingScore: 70,
    questions: [
      {
        id: "q1",
        prompt: "Which hook is used to perform side effects in a function component?",
        options: [
          { id: "a", text: "useState" },
          { id: "b", text: "useEffect" },
          { id: "c", text: "useMemo" },
          { id: "d", text: "useRef" },
        ],
        correctOptionId: "b",
      },
    ],
  }
]
const mockProgress = {} // uid -> Record<courseId, completedLessonIds[]>

// ----------------- Seeding live Firestore -----------------
async function seedLiveDb() {
  if (!isFirebaseConfigured || !dbInstance) return
  try {
    const coursesRef = dbInstance.collection("courses")
    const coursesSnap = await coursesRef.get()
    
    if (coursesSnap.empty) {
      console.log("Seeding default courses to live Firestore...")
      for (const course of mockCourses) {
        await coursesRef.doc(course.id).set(course)
      }
    }

    const quizzesRef = dbInstance.collection("quizzes")
    const quizzesSnap = await quizzesRef.get()
    
    if (quizzesSnap.empty) {
      console.log("Seeding default quizzes to live Firestore...")
      for (const quiz of mockQuizzes) {
        await quizzesRef.doc(quiz.id).set(quiz)
      }
    }
  } catch (err) {
    console.error("Firestore seeding failed:", err)
  }
}
seedLiveDb()

// ----------------- API Route Mappings -----------------

// 0. Root Check
app.get("/", (req, res) => {
  res.send("EduVantage Backend API is running.");
})

// --- Middleware: Verify Firebase ID Token ---
const verifyToken = async (req, res, next) => {
  if (!isFirebaseConfigured) {
    // In mock mode, we'll bypass real token verification
    // and just use a dummy uid or one passed in headers for testing
    const authHeader = req.headers.authorization
    const mockUid = authHeader ? authHeader.split("Bearer ")[1] : "mock_uid_123"
    req.user = { uid: mockUid }
    return next()
  }

  const token = req.headers.authorization?.split("Bearer ")[1]
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" })
  }

  try {
    const decodedToken = await authInstance.verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error("Token verification failed:", error)
    return res.status(401).json({ error: "Unauthorized: Invalid token" })
  }
}

// 0.1 Auth: Register (Legacy / Postman Support)
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." })
  }

  if (isFirebaseConfigured && authInstance && dbInstance) {
    try {
      // Use Admin SDK to create user
      const userRecord = await authInstance.createUser({
        email,
        password,
        displayName: name,
      })
      const uid = userRecord.uid
      const userDocData = {
        name,
        email,
        role,
        avatar: role === "instructor" ? "/avatars/instructor.png" : 
                role === "admin" ? "/avatars/admin.png" : "/avatars/student.png",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }
      await dbInstance.collection("users").doc(uid).set(userDocData)
      return res.json({ uid, ...userDocData })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  } else {
    // Mock Signup
    if (mockUsers.some((u) => u.email === email)) {
      return res.status(400).json({ error: "Email already in use." })
    }
    const uid = `mock_uid_${Math.random().toString(36).slice(2, 10)}`
    const newUser = {
      uid,
      name,
      email,
      role,
      avatar: role === "instructor" ? "/avatars/instructor.png" : 
              role === "admin" ? "/avatars/admin.png" : "/avatars/student.png",
      createdAt: Date.now(),
    }
    mockUsers.push(newUser)
    return res.json(newUser)
  }
})

// 0.2 Auth: Login (Legacy / Postman Support)
app.post("/api/auth/login", async (req, res) => {
  const { email, password, role } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." })
  }

  if (isFirebaseConfigured && authInstance && dbInstance) {
    // Note: Admin SDK cannot verify passwords to generate an ID token.
    // This should ideally happen on the client using the Firebase Client SDK.
    // For this endpoint to work in a backend-only scenario, it would require calling the Identity Toolkit REST API.
    return res.status(400).json({ 
      error: "Password login must be handled by the frontend Firebase Client SDK." 
    })
  } else {
    // Mock Login
    let user = mockUsers.find((u) => u.email === email)
    if (!user) {
      user = {
        uid: `mock_uid_${Math.random().toString(36).slice(2, 10)}`,
        name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        role: role || "student",
        avatar: role === "instructor" ? "/avatars/instructor.png" : 
                role === "admin" ? "/avatars/admin.png" : "/avatars/student.png",
        createdAt: Date.now(),
      }
      mockUsers.push(user)
    }
    return res.json(user)
  }
}
)

// 1. Auth / Users: Create Profile
// Called after the frontend registers the user directly with Firebase Auth
app.post("/api/users/profile", verifyToken, async (req, res) => {
  const { name, role } = req.body
  const uid = req.user.uid
  const email = req.user.email || req.body.email

  if (!name || !role) {
    return res.status(400).json({ error: "Name and role are required." })
  }

  const avatar = role === "instructor" ? "/avatars/instructor.png" : 
                 role === "admin" ? "/avatars/admin.png" : "/avatars/student.png"

  if (isFirebaseConfigured && dbInstance) {
    try {
      const userRef = dbInstance.collection("users").doc(uid)
      const userDoc = await userRef.get()

      if (userDoc.exists) {
        return res.status(400).json({ error: "User profile already exists." })
      }

      const userDocData = {
        uid,
        name,
        email,
        role,
        avatar,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }

      await userRef.set(userDocData)
      return res.status(201).json(userDocData)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    // Mock Profile Creation
    if (mockUsers.some((u) => u.uid === uid)) {
      return res.status(400).json({ error: "Profile already exists." })
    }
    const newUser = { uid, name, email, role, avatar, createdAt: Date.now() }
    mockUsers.push(newUser)
    return res.status(201).json(newUser)
  }
})

// 2. Auth / Users: Get Current Profile
// Called after frontend logs in to fetch the user's role and details
app.get("/api/users/profile", verifyToken, async (req, res) => {
  const uid = req.user.uid

  if (isFirebaseConfigured && dbInstance) {
    try {
      const userDoc = await dbInstance.collection("users").doc(uid).get()
      if (userDoc.exists) {
        return res.json({ uid, ...userDoc.data() })
      } else {
        return res.status(404).json({ error: "User profile not found." })
      }
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    // Mock Fetch
    const user = mockUsers.find((u) => u.uid === uid)
    if (user) {
      return res.json(user)
    } else {
      // Auto-create for mock ease of use if not found
      const newUser = {
        uid,
        name: "Mock User",
        email: "mock@example.com",
        role: "student",
        avatar: "/avatars/student.png",
        createdAt: Date.now(),
      }
      mockUsers.push(newUser)
      return res.json(newUser)
    }
  }
})

// 3. Courses: Fetch All
app.get("/api/courses", async (req, res) => {
  if (isFirebaseConfigured && dbInstance) {
    try {
      const coursesSnap = await dbInstance.collection("courses").get()
      const dbCourses = []
      coursesSnap.forEach((docSnap) => {
        dbCourses.push(docSnap.data())
      })
      return res.json(dbCourses)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    return res.json(mockCourses)
  }
})

// 4. Courses: Save / Update
app.post("/api/courses", async (req, res) => {
  const course = req.body
  if (!course.id) {
    return res.status(400).json({ error: "Course ID is required." })
  }

  if (isFirebaseConfigured && dbInstance) {
    try {
      await dbInstance.collection("courses").doc(course.id).set(course)
      return res.json({ success: true, course })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    mockCourses = mockCourses.map((c) => (c.id === course.id ? course : c))
    if (!mockCourses.some((c) => c.id === course.id)) {
      mockCourses.push(course)
    }
    return res.json({ success: true, course })
  }
})

// 4.1 Courses: Enroll (Create initial progress entry)
app.post("/api/courses/enroll/:courseId", verifyToken, async (req, res) => {
  const { courseId } = req.params
  const uid = req.user.uid

  if (!courseId) {
    return res.status(400).json({ error: "Course ID is required." })
  }

  if (isFirebaseConfigured && dbInstance) {
    try {
      const progressRef = dbInstance.collection("progress").doc(`${uid}_${courseId}`)
      const progressDoc = await progressRef.get()

      if (progressDoc.exists) {
        return res.status(400).json({ error: "Already enrolled in this course." })
      }

      const progressData = {
        uid,
        courseId,
        completedLessonIds: [],
        lastAccessed: admin.firestore.FieldValue.serverTimestamp(),
      }

      await progressRef.set(progressData)
      return res.status(201).json({ success: true, message: "Enrolled successfully", progress: progressData })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    // Mock Enrollment
    if (!mockProgress[uid]) {
      mockProgress[uid] = {}
    }
    
    if (mockProgress[uid][courseId]) {
      return res.status(400).json({ error: "Already enrolled in this course." })
    }

    mockProgress[uid][courseId] = []
    return res.status(201).json({ success: true, message: "Enrolled successfully" })
  }
})

// 5. Quizzes: Fetch All
app.get("/api/quizzes", async (req, res) => {
  if (isFirebaseConfigured && dbInstance) {
    try {
      const quizzesSnap = await dbInstance.collection("quizzes").get()
      const dbQuizzes = []
      quizzesSnap.forEach((docSnap) => {
        dbQuizzes.push(docSnap.data())
      })
      return res.json(dbQuizzes)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    return res.json(mockQuizzes)
  }
})

// 6. Quizzes: Save / Update
app.post("/api/quizzes", async (req, res) => {
  const quiz = req.body
  if (!quiz.id) {
    return res.status(400).json({ error: "Quiz ID is required." })
  }

  if (isFirebaseConfigured && dbInstance) {
    try {
      await dbInstance.collection("quizzes").doc(quiz.id).set(quiz)
      return res.json({ success: true, quiz })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    mockQuizzes = mockQuizzes.map((q) => (q.id === quiz.id ? quiz : q))
    if (!mockQuizzes.some((q) => q.id === quiz.id)) {
      mockQuizzes.push(quiz)
    }
    return res.json({ success: true, quiz })
  }
})

// 6.1 Quizzes: Submit
app.post("/api/quizzes/submit", verifyToken, async (req, res) => {
  const { quizId, answers } = req.body
  const uid = req.user.uid

  if (!quizId || !answers) {
    return res.status(400).json({ error: "quizId and answers are required." })
  }

  // We can just return a basic success response to acknowledge submission
  return res.status(200).json({ 
    success: true, 
    message: "Quiz submitted successfully!",
    submittedAnswers: answers.length
  })
})

// 6.2 Quizzes: Fetch Grades
app.get("/api/quizzes/grades", verifyToken, async (req, res) => {
  const uid = req.user.uid;
  
  // Return a mock array of grades for the user
  return res.json([
    { quizId: "data-science-101", score: 85, passed: true, date: Date.now() },
    { quizId: "web-dev-101", score: 92, passed: true, date: Date.now() }
  ])
})

// 7. Student Progress: Fetch for User
app.get("/api/progress/:uid", async (req, res) => {
  const { uid } = req.params
  if (!uid) {
    return res.status(400).json({ error: "User UID is required." })
  }

  if (isFirebaseConfigured && dbInstance) {
    try {
      const progressQuery = dbInstance.collection("progress").where("uid", "==", uid)
      const progressSnap = await progressQuery.get()
      const progressMap = {}
      progressSnap.forEach((d) => {
        const p = d.data()
        if (p.courseId && p.completedLessonIds) {
          progressMap[p.courseId] = p.completedLessonIds
        }
      })
      return res.json(progressMap)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    // Mock Progress
    const userProgress = mockProgress[uid] || {
      "react-mastery": ["l1", "l2", "l3", "l4"],
      "data-science-101": ["l1", "l2"],
    }
    return res.json(userProgress)
  }
})

// 8. Student Progress: Save / Update
app.post("/api/progress", async (req, res) => {
  const { uid, courseId, completedLessonIds } = req.body
  if (!uid || !courseId || !completedLessonIds) {
    return res.status(400).json({ error: "Missing required parameters." })
  }

  if (isFirebaseConfigured && dbInstance) {
    try {
      await dbInstance.collection("progress").doc(`${uid}_${courseId}`).set({
        uid,
        courseId,
        completedLessonIds,
        lastAccessed: Date.now(),
      })
      return res.json({ success: true })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    if (!mockProgress[uid]) {
      mockProgress[uid] = {}
    }
    mockProgress[uid][courseId] = completedLessonIds
    return res.json({ success: true })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
