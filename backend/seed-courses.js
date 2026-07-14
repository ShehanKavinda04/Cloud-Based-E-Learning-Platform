import dotenv from "dotenv"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const { initializeApp } = require("firebase/app")
const { getFirestore, doc, setDoc } = require("firebase/firestore")

dotenv.config()

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.VITE_FIREBASE_APP_ID || "",
}

const fbApp = initializeApp(firebaseConfig)
const db = getFirestore(fbApp)

const newCourses = [
  {
    id: "react-mastery",
    title: "Advanced React & Frontend Architecture",
    instructor: "Dr. Elena Vasquez",
    instructorAvatar: "/avatars/instructor.png",
    category: "Web Development",
    thumbnail: "/courses/web-development.png",
    description: "Master modern React patterns, performance optimization, and scalable frontend architecture used by top engineering teams.",
    rating: 4.9,
    students: 12480,
    totalLessons: 8,
    level: "Advanced",
    modules: [
      { id: "m1", title: "Foundations of Modern React", lessons: [{ id: "l1", title: "Course Introduction & Setup", duration: "06:12", type: "video", videoUrl: "big-buck" }, { id: "l2", title: "Thinking in Components", duration: "14:35", type: "video", videoUrl: "big-buck" }, { id: "l3", title: "Hooks Deep Dive", duration: "22:08", type: "video", videoUrl: "big-buck" }] },
      { id: "m2", title: "State & Performance", lessons: [{ id: "l4", title: "Advanced State Management", duration: "18:44", type: "video", videoUrl: "big-buck" }, { id: "l5", title: "Memoization & Rendering", duration: "16:20", type: "video", videoUrl: "big-buck" }, { id: "l6", title: "Reading: Concurrent React", duration: "10 min", type: "reading" }] },
      { id: "m3", title: "Architecture & Assessment", lessons: [{ id: "l7", title: "Scalable Folder Structures", duration: "12:50", type: "video", videoUrl: "big-buck" }, { id: "l8", title: "Module Quiz", duration: "10 min", type: "quiz" }] }
    ],
    resources: [{ id: "r1", name: "React Patterns Cheatsheet.pdf", size: "2.4 MB", type: "pdf" }, { id: "r2", name: "Starter Project Files.zip", size: "8.1 MB", type: "zip" }, { id: "r3", name: "Architecture Diagram.pdf", size: "1.2 MB", type: "pdf" }],
    forum: [{ id: "f1", author: "Marcus Lee", avatar: "/avatars/student.png", message: "The hooks deep dive finally made useEffect click for me. Any tips on cleanup functions?", timeAgo: "2h ago", replies: 4 }]
  },
  {
    id: "data-science-101",
    title: "Data Science & Machine Learning Bootcamp",
    instructor: "Prof. Daniel Okafor",
    instructorAvatar: "/avatars/instructor.png",
    category: "Data Science",
    thumbnail: "/courses/data-science-new.png",
    description: "From statistics to neural networks — build real predictive models with Python and industry-standard tooling.",
    rating: 4.8,
    students: 9820,
    totalLessons: 6,
    level: "Intermediate",
    modules: [
      { id: "m1", title: "Data Foundations", lessons: [{ id: "l1", title: "Intro to Data Science", duration: "08:30", type: "video", videoUrl: "big-buck" }, { id: "l2", title: "Working with Pandas", duration: "19:12", type: "video", videoUrl: "big-buck" }, { id: "l3", title: "Data Visualization", duration: "15:40", type: "video", videoUrl: "big-buck" }] },
      { id: "m2", title: "Machine Learning", lessons: [{ id: "l4", title: "Regression Models", duration: "24:05", type: "video", videoUrl: "big-buck" }, { id: "l5", title: "Neural Network Basics", duration: "28:33", type: "video", videoUrl: "big-buck" }, { id: "l6", title: "Final Assessment", duration: "12 min", type: "quiz" }] }
    ],
    resources: [{ id: "r1", name: "Dataset Collection.zip", size: "42.0 MB", type: "zip" }, { id: "r2", name: "ML Formula Reference.pdf", size: "3.1 MB", type: "pdf" }],
    forum: [{ id: "f1", author: "Sofia Rossi", avatar: "/avatars/student.png", message: "Loving the visualization module! Which library do you recommend for interactive charts?", timeAgo: "1d ago", replies: 6 }]
  },
  {
    id: "ux-design",
    title: "UI/UX Design Fundamentals",
    instructor: "Aisha Rahman",
    instructorAvatar: "/avatars/instructor.png",
    category: "Design",
    thumbnail: "/courses/ui-ux-design.png",
    description: "Learn user-centered design, wireframing, prototyping, and design systems to craft delightful digital products.",
    rating: 4.7,
    students: 7340,
    totalLessons: 5,
    level: "Beginner",
    modules: [
      { id: "m1", title: "Design Principles", lessons: [{ id: "l1", title: "What is UX?", duration: "07:45", type: "video", videoUrl: "big-buck" }, { id: "l2", title: "Color & Typography", duration: "13:22", type: "video", videoUrl: "big-buck" }, { id: "l3", title: "Layout & Spacing", duration: "11:10", type: "video", videoUrl: "big-buck" }] },
      { id: "m2", title: "Prototyping", lessons: [{ id: "l4", title: "Wireframing Basics", duration: "16:00", type: "video", videoUrl: "big-buck" }, { id: "l5", title: "Building a Design System", duration: "20:15", type: "video", videoUrl: "big-buck" }] }
    ],
    resources: [{ id: "r1", name: "Figma Starter Kit.zip", size: "12.5 MB", type: "zip" }],
    forum: []
  },
  {
    id: "cloud-devops",
    title: "Cloud Computing & DevOps Essentials",
    instructor: "James Carter",
    instructorAvatar: "/avatars/instructor.png",
    category: "Cloud",
    thumbnail: "/courses/cloud-computing.png",
    description: "Deploy, scale, and monitor applications in the cloud. Covers containers, CI/CD pipelines, and infrastructure as code.",
    rating: 4.6,
    students: 5610,
    totalLessons: 4,
    level: "Intermediate",
    modules: [
      { id: "m1", title: "Cloud Foundations", lessons: [{ id: "l1", title: "Cloud Service Models", duration: "09:50", type: "video", videoUrl: "big-buck" }, { id: "l2", title: "Containers & Docker", duration: "21:30", type: "video", videoUrl: "big-buck" }] },
      { id: "m2", title: "Automation", lessons: [{ id: "l3", title: "CI/CD Pipelines", duration: "18:12", type: "video", videoUrl: "big-buck" }, { id: "l4", title: "Infrastructure as Code", duration: "17:05", type: "video", videoUrl: "big-buck" }] }
    ],
    resources: [{ id: "r1", name: "Deployment Checklist.pdf", size: "0.9 MB", type: "pdf" }],
    forum: []
  },
  {
    id: "artificial-intelligence",
    title: "Artificial Intelligence & Deep Learning",
    instructor: "Dr. Alan Turing",
    instructorAvatar: "/avatars/instructor.png",
    category: "Data Science",
    thumbnail: "/courses/artificial-intelligence.png",
    description: "Explore the frontiers of AI, neural networks, computer vision, and natural language processing.",
    rating: 4.9,
    students: 14200,
    totalLessons: 5,
    level: "Advanced",
    modules: [
      { id: "m1", title: "Deep Learning Foundations", lessons: [{ id: "l1", title: "Backpropagation", duration: "14:10", type: "video", videoUrl: "big-buck" }, { id: "l2", title: "Activation Functions", duration: "12:40", type: "video", videoUrl: "big-buck" }] },
      { id: "m2", title: "Advanced Architectures", lessons: [{ id: "l3", title: "CNNs for Vision", duration: "25:15", type: "video", videoUrl: "big-buck" }, { id: "l4", title: "Transformers and LLMs", duration: "32:20", type: "video", videoUrl: "big-buck" }, { id: "l5", title: "Model Deployment", duration: "20:00", type: "video", videoUrl: "big-buck" }] }
    ],
    resources: [],
    forum: []
  },
  {
    id: "flutter-mobile",
    title: "Mobile App Development with Flutter",
    instructor: "Sarah Jenkins",
    instructorAvatar: "/avatars/instructor.png",
    category: "Web Development",
    thumbnail: "/courses/app-development.png",
    description: "Create beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
    rating: 4.7,
    students: 8400,
    totalLessons: 4,
    level: "Beginner",
    modules: [
      { id: "m1", title: "Flutter Basics", lessons: [{ id: "l1", title: "Dart Fundamentals", duration: "15:30", type: "video", videoUrl: "big-buck" }, { id: "l2", title: "Building UIs", duration: "22:15", type: "video", videoUrl: "big-buck" }] },
      { id: "m2", title: "State and API", lessons: [{ id: "l3", title: "State Management", duration: "20:45", type: "video", videoUrl: "big-buck" }, { id: "l4", title: "Fetching Data", duration: "18:10", type: "video", videoUrl: "big-buck" }] }
    ],
    resources: [],
    forum: []
  },
  {
    id: "ethical-hacking",
    title: "Cybersecurity & Ethical Hacking",
    instructor: "Kevin Mitnick Jr",
    instructorAvatar: "/avatars/instructor.png",
    category: "Cloud",
    thumbnail: "/courses/ethical-hacking.png",
    description: "Learn network security, penetration testing, and ethical hacking from the ground up.",
    rating: 4.9,
    students: 15300,
    totalLessons: 4,
    level: "Advanced",
    modules: [
      { id: "m1", title: "Network Security", lessons: [{ id: "l1", title: "Intro to Networking", duration: "12:00", type: "video", videoUrl: "big-buck" }, { id: "l2", title: "Vulnerability Scanning", duration: "25:40", type: "video", videoUrl: "big-buck" }] },
      { id: "m2", title: "Exploitation", lessons: [{ id: "l3", title: "Web App Hacking", duration: "30:15", type: "video", videoUrl: "big-buck" }, { id: "l4", title: "Privilege Escalation", duration: "18:50", type: "video", videoUrl: "big-buck" }] }
    ],
    resources: [],
    forum: []
  }
]

async function seed() {
  console.log("Seeding all 7 updated courses to Firestore...")
  for (const c of newCourses) {
    await setDoc(doc(db, "courses", c.id), c)
    console.log(`Seeded: ${c.title}`)
  }
  
  // optionally remove python-django if it exists
  const { deleteDoc } = require("firebase/firestore")
  try {
    await deleteDoc(doc(db, "courses", "python-django"))
    console.log("Deleted old python-django course")
  } catch (e) {}

  console.log("All courses seeded successfully.")
  process.exit(0)
}

seed().catch(err => {
  console.error("Error seeding courses:", err)
  process.exit(1)
})
