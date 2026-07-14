import type { CourseDoc, QuizDoc } from "./models"

export const COURSES: CourseDoc[] = [
  {
    id: "react-mastery",
    title: "Advanced React & Frontend Architecture",
    instructor: "Dr. Elena Vasquez",
    instructorAvatar: "/avatars/instructor.png",
    category: "Programming",
    thumbnail: "/courses/react.png",
    description:
      "Master modern React patterns, performance optimization, and scalable frontend architecture used by top engineering teams.",
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
      {
        id: "f2",
        author: "Priya Nair",
        avatar: "/avatars/student.png",
        message: "Is the starter project compatible with the latest React version?",
        timeAgo: "5h ago",
        replies: 2,
      },
    ],
  },
  {
    id: "data-science-101",
    title: "Data Science & Machine Learning Bootcamp",
    instructor: "Prof. Daniel Okafor",
    instructorAvatar: "/avatars/instructor.png",
    category: "Computer Science",
    thumbnail: "/courses/data-science.png",
    description:
      "From statistics to neural networks — build real predictive models with Python and industry-standard tooling.",
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
      {
        id: "m2",
        title: "Machine Learning",
        lessons: [
          { id: "l4", title: "Regression Models", duration: "24:05", type: "video", videoUrl: "big-buck" },
          { id: "l5", title: "Neural Network Basics", duration: "28:33", type: "video", videoUrl: "big-buck" },
          { id: "l6", title: "Final Assessment", duration: "12 min", type: "quiz" },
        ],
      },
    ],
    resources: [
      { id: "r1", name: "Dataset Collection.zip", size: "42.0 MB", type: "zip" },
      { id: "r2", name: "ML Formula Reference.pdf", size: "3.1 MB", type: "pdf" },
    ],
    forum: [
      {
        id: "f1",
        author: "Sofia Rossi",
        avatar: "/avatars/student.png",
        message: "Loving the visualization module! Which library do you recommend for interactive charts?",
        timeAgo: "1d ago",
        replies: 6,
      },
    ],
  },
  {
    id: "ux-design",
    title: "UI/UX Design Fundamentals",
    instructor: "Aisha Rahman",
    instructorAvatar: "/avatars/instructor.png",
    category: "Hackathons",
    thumbnail: "/courses/design.png",
    description:
      "Learn user-centered design, wireframing, prototyping, and design systems to craft delightful digital products.",
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
    category: "Computer Science",
    thumbnail: "/courses/cloud.png",
    description:
      "Deploy, scale, and monitor applications in the cloud. Covers containers, CI/CD pipelines, and infrastructure as code.",
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
    category: "Programming",
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
    category: "Programming",
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
    category: "Hackathons",
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

// Initial per-course completed lessons for the demo student.
export const INITIAL_PROGRESS: Record<string, string[]> = {
  "react-mastery": ["l1", "l2", "l3", "l4"],
  "data-science-101": ["l1", "l2"],
  "ux-design": ["l1"],
  "cloud-devops": [],
  "python-django": [],
  "flutter-mobile": [],
  "ethical-hacking": [],
}

export const QUIZ: QuizDoc = {
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
    {
      id: "q2",
      prompt: "What does memoization primarily help with in React?",
      options: [
        { id: "a", text: "Routing between pages" },
        { id: "b", text: "Fetching remote data" },
        { id: "c", text: "Avoiding unnecessary re-computation/renders" },
        { id: "d", text: "Styling components" },
      ],
      correctOptionId: "c",
    },
    {
      id: "q3",
      prompt: "Which of the following is NOT a valid way to manage global state?",
      options: [
        { id: "a", text: "React Context" },
        { id: "b", text: "Redux" },
        { id: "c", text: "Zustand" },
        { id: "d", text: "useLocalVariable" },
      ],
      correctOptionId: "d",
    },
    {
      id: "q4",
      prompt: "The Virtual DOM improves performance by...",
      options: [
        { id: "a", text: "Rendering directly to the GPU" },
        { id: "b", text: "Batching and diffing updates before touching the real DOM" },
        { id: "c", text: "Removing the need for JavaScript" },
        { id: "d", text: "Caching network requests" },
      ],
      correctOptionId: "b",
    },
    {
      id: "q5",
      prompt: "Which key prop practice is recommended when rendering lists?",
      options: [
        { id: "a", text: "Use the array index always" },
        { id: "b", text: "Use a stable unique identifier" },
        { id: "c", text: "Omit keys entirely" },
        { id: "d", text: "Use Math.random()" },
      ],
      correctOptionId: "b",
    },
  ],
}
