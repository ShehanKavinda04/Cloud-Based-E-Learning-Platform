import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const { initializeApp, getApps } = require("firebase/app")
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require("firebase/auth")
const {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
} = require("firebase/firestore")

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5001

// 1. Firebase Initialization
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.VITE_FIREBASE_APP_ID || "",
}

const isFirebaseConfigured = !!firebaseConfig.apiKey

let authInstance = null
let dbInstance = null

if (isFirebaseConfigured) {
  try {
    const fbApp = initializeApp(firebaseConfig)
    authInstance = getAuth(fbApp)
    dbInstance = getFirestore(fbApp)
    console.log("Firebase initialized successfully on backend server.")
  } catch (err) {
    console.error("Firebase backend initialization failed:", err)
  }
} else {
  console.warn(
    "Firebase config is missing on backend. Server is running in Mock In-Memory Database Mode."
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
    const coursesRef = collection(dbInstance, "courses")
    const coursesSnap = await getDocs(coursesRef)
    if (coursesSnap.empty) {
      console.log("Seeding default courses to live Firestore...")
      for (const course of mockCourses) {
        await setDoc(doc(dbInstance, "courses", course.id), course)
      }
    }

    const quizzesRef = collection(dbInstance, "quizzes")
    const quizzesSnap = await getDocs(quizzesRef)
    if (quizzesSnap.empty) {
      console.log("Seeding default quizzes to live Firestore...")
      for (const quiz of mockQuizzes) {
        await setDoc(doc(dbInstance, "quizzes", quiz.id), quiz)
      }
    }
  } catch (err) {
    console.error("Firestore seeding failed:", err)
  }
}
seedLiveDb()

// ----------------- API Route Mappings -----------------

// 1. Auth: Register
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." })
  }

  if (isFirebaseConfigured && authInstance && dbInstance) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        authInstance,
        email,
        password
      )
      const uid = userCredential.user.uid
      const userDocData = {
        name,
        email,
        role,
        avatar:
          role === "instructor"
            ? "/avatars/instructor.png"
            : role === "admin"
              ? "/avatars/admin.png"
              : "/avatars/student.png",
        createdAt: Date.now(),
      }
      await setDoc(doc(dbInstance, "users", uid), userDocData)
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
      avatar:
        role === "instructor"
          ? "/avatars/instructor.png"
          : role === "admin"
            ? "/avatars/admin.png"
            : "/avatars/student.png",
      createdAt: Date.now(),
    }
    mockUsers.push(newUser)
    return res.json(newUser)
  }
})

// 2. Auth: Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password, role } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." })
  }

  if (isFirebaseConfigured && authInstance && dbInstance) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        authInstance,
        email,
        password
      )
      const uid = userCredential.user.uid
      const userSnap = await getDoc(doc(dbInstance, "users", uid))
      if (userSnap.exists()) {
        const data = userSnap.data()
        return res.json({ uid, ...data })
      } else {
        // Create profile on the fly
        const userDocData = {
          name: email.split("@")[0],
          email,
          role: role || "student",
          avatar: "/avatars/student.png",
          createdAt: Date.now(),
        }
        await setDoc(doc(dbInstance, "users", uid), userDocData)
        return res.json({ uid, ...userDocData })
      }
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  } else {
    // Mock Login
    let user = mockUsers.find((u) => u.email === email)
    if (!user) {
      // Create a mock user on the fly for ease of use
      user = {
        uid: `mock_uid_${Math.random().toString(36).slice(2, 10)}`,
        name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        role: role || "student",
        avatar:
          role === "instructor"
            ? "/avatars/instructor.png"
            : role === "admin"
              ? "/avatars/admin.png"
              : "/avatars/student.png",
        createdAt: Date.now(),
      }
      mockUsers.push(user)
    }
    return res.json(user)
  }
})

// 3. Courses: Fetch All
app.get("/api/courses", async (req, res) => {
  if (isFirebaseConfigured && dbInstance) {
    try {
      const coursesSnap = await getDocs(collection(dbInstance, "courses"))
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
      await setDoc(doc(dbInstance, "courses", course.id), course)
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

// 5. Quizzes: Fetch All
app.get("/api/quizzes", async (req, res) => {
  if (isFirebaseConfigured && dbInstance) {
    try {
      const quizzesSnap = await getDocs(collection(dbInstance, "quizzes"))
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
      await setDoc(doc(dbInstance, "quizzes", quiz.id), quiz)
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

// 7. Student Progress: Fetch for User
app.get("/api/progress/:uid", async (req, res) => {
  const { uid } = req.params
  if (!uid) {
    return res.status(400).json({ error: "User UID is required." })
  }

  if (isFirebaseConfigured && dbInstance) {
    try {
      const progressQuery = query(
        collection(dbInstance, "progress"),
        where("uid", "==", uid)
      )
      const progressSnap = await getDocs(progressQuery)
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
      await setDoc(doc(dbInstance, "progress", `${uid}_${courseId}`), {
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
