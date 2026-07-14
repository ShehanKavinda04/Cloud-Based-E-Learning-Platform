import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CourseCard } from "@/components/CourseCard"
import { useApp } from "@/store/AppContext"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, PlaySquare, FileText, FileQuestion, Award, X } from "lucide-react"
import { Button, Badge } from "@/components/ui/Primitives"

const STUDENT_CATEGORIES = ["All", "Programming", "Computer Science", "Hackathons"]
const ADMIN_CATEGORIES = ["All", "Programming", "Computer Science", "Hackathons"]

const MOCK_ADMIN_COURSES = [
  // Programming
  {
    id: "ac1",
    title: "Advanced React & Next.js Patterns",
    instructor: "Sarah Drasner",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
    curriculum: ["React Server Components", "Next.js App Router", "State Management Deep Dive"],
    videos: 42,
    quizzes: 12,
    papers: 5,
    certificate: "React Master Certification"
  },
  {
    id: "ac2",
    title: "Rust for Systems Programming",
    instructor: "Carol Nichols",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    curriculum: ["Ownership & Borrowing", "Concurrency in Rust", "Building CLI Tools"],
    videos: 35,
    quizzes: 8,
    papers: 3,
    certificate: "Systems Programming with Rust"
  },
  {
    id: "ac3",
    title: "Python API Development with FastAPI",
    instructor: "Sebastian Ramirez",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1000&auto=format&fit=crop",
    curriculum: ["Pydantic Models", "Dependency Injection", "Async Database Queries"],
    videos: 28,
    quizzes: 6,
    papers: 2,
    certificate: "FastAPI Backend Developer"
  },
  // Computer Science
  {
    id: "ac4",
    title: "Algorithms and Data Structures",
    instructor: "Tim Roughgarden",
    category: "Computer Science",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000&auto=format&fit=crop",
    curriculum: ["Big O Notation", "Graph Algorithms", "Dynamic Programming"],
    videos: 55,
    quizzes: 20,
    papers: 10,
    certificate: "CS Fundamentals: Algorithms"
  },
  {
    id: "ac5",
    title: "Operating Systems Design",
    instructor: "Andrew Tanenbaum",
    category: "Computer Science",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
    curriculum: ["Memory Management", "Process Scheduling", "File Systems"],
    videos: 40,
    quizzes: 15,
    papers: 8,
    certificate: "Advanced OS Architect"
  },
  {
    id: "ac6",
    title: "Cryptography and Network Security",
    instructor: "Dan Boneh",
    category: "Computer Science",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000&auto=format&fit=crop",
    curriculum: ["Public Key Cryptography", "Hash Functions", "Secure Protocols"],
    videos: 48,
    quizzes: 18,
    papers: 12,
    certificate: "Applied Cryptography Specialist"
  },
  // Hackathons
  {
    id: "ac7",
    title: "Hackathon Winning Strategies",
    instructor: "MLH Coaches",
    category: "Hackathons",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop",
    curriculum: ["Ideation & Brainstorming", "Rapid Prototyping", "Pitching to Judges"],
    videos: 15,
    quizzes: 3,
    papers: 1,
    certificate: "Hackathon Champion"
  },
  {
    id: "ac8",
    title: "Building MVPs in 24 Hours",
    instructor: "Pieter Levels",
    category: "Hackathons",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
    curriculum: ["No-Code Tools", "Firebase Setup", "Deploying to Vercel fast"],
    videos: 20,
    quizzes: 5,
    papers: 2,
    certificate: "Rapid MVP Developer"
  },
  {
    id: "ac9",
    title: "Design Thinking for Hackathons",
    instructor: "Sarah Doody",
    category: "Hackathons",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000&auto=format&fit=crop",
    curriculum: ["User Flow Mapping", "Figma Prototyping", "UI/UX for Hackathons"],
    videos: 22,
    quizzes: 4,
    papers: 3,
    certificate: "UX Hackathon Specialist"
  }
]

function StudentCoursesView() {
  const { courses, progress } = useApp()
  const [filter, setFilter] = useState("All")
  
  const enrolledCourses = courses.filter((c) => progress[c.id] !== undefined)
  
  const filtered =
    filter === "All" ? enrolledCourses : enrolledCourses.filter((c) => c.category === filter)

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Continue where you left off or explore something new.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STUDENT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
              filter === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50">
          <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
          <Button onClick={() => window.location.href = "/apply-courses"}>Explore Courses</Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}

function AdminCoursesView() {
  const { courses, publishAdminCourse, rejectAdminCourse, rejectedAdminCourses, addNotification } = useApp()
  const [filter, setFilter] = useState("All")
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [publishingId, setPublishingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{message: string, courseName: string, courseId: string} | null>(null)
  const navigate = useNavigate()

  const pendingCourses = MOCK_ADMIN_COURSES.filter(
    (c) => !courses.some((pc) => pc.id === c.id) && !rejectedAdminCourses.includes(c.id)
  )

  const filtered =
    filter === "All" ? pendingCourses : pendingCourses.filter((c) => c.category === filter)

  const handlePublish = async (id: string) => {
    const course = pendingCourses.find(c => c.id === id)
    if (course) {
      setPublishingId(id)
      await publishAdminCourse(course)
      
      addNotification({
        title: "Course Published",
        body: `Your course has been successfully published. Thank you.`,
        timeAgo: "Just now",
        unread: true
      })
      
      setToast({
        message: "Successfully Published",
        courseName: course.title,
        courseId: course.id
      })
      
      setTimeout(() => {
        setToast(null)
        setPublishingId(null)
        setSelectedCourse(null)
      }, 3000)
    }
  }

  const handleReject = (id: string) => {
    rejectAdminCourse(id)
    setSelectedCourse(null)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in relative">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and approve incoming course submissions.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {ADMIN_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
              filter === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-border bg-card/50">
          <p className="text-muted-foreground">No pending courses in this category.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <div 
              key={course.id} 
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-2 hover:ring-primary/50"
              onClick={() => setSelectedCourse(course)}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img src={course.image} alt={course.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4 bg-card relative z-10">
                <Badge variant="secondary" className="mb-2 text-[10px]">{course.category}</Badge>
                <h3 className="mb-1 font-bold leading-tight text-foreground line-clamp-2">{course.title}</h3>
                <p className="text-xs text-muted-foreground">{course.instructor}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Review Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-card shadow-2xl my-8">
            <button 
              onClick={() => setSelectedCourse(null)}
              disabled={publishingId === selectedCourse.id}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-56 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
              <img src={selectedCourse.image} alt={selectedCourse.title} className="h-full w-full object-cover" />
              <div className="absolute bottom-4 left-6 z-10">
                <Badge variant="primary" className="mb-2 backdrop-blur-md bg-primary/80">{selectedCourse.category}</Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight shadow-sm">{selectedCourse.title}</h2>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <p className="mb-6 text-sm text-muted-foreground flex items-center">
                Instructed by <span className="font-semibold text-foreground ml-1.5 px-2 py-0.5 rounded-full bg-muted">{selectedCourse.instructor}</span>
              </p>
              
              <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/30 border border-border/50 p-4 text-center transition-colors hover:bg-muted/50">
                  <PlaySquare className="mb-2 h-6 w-6 text-primary" />
                  <span className="text-xl font-bold text-foreground">{selectedCourse.videos}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-0.5">Videos</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/30 border border-border/50 p-4 text-center transition-colors hover:bg-muted/50">
                  <FileQuestion className="mb-2 h-6 w-6 text-warning" />
                  <span className="text-xl font-bold text-foreground">{selectedCourse.quizzes}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-0.5">Quizzes</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/30 border border-border/50 p-4 text-center transition-colors hover:bg-muted/50">
                  <FileText className="mb-2 h-6 w-6 text-success" />
                  <span className="text-xl font-bold text-foreground">{selectedCourse.papers}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-0.5">Papers</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/30 border border-border/50 p-4 text-center transition-colors hover:bg-muted/50">
                  <Award className="mb-2 h-6 w-6 text-purple-500" />
                  <span className="text-xl font-bold text-foreground">Yes</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-0.5">Certificate</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" /> Curriculum Overview
                  </h4>
                  <Button variant="outline" size="sm" className="text-xs font-semibold shadow-sm" onClick={() => navigate("/admin-course-review", { state: { course: selectedCourse } })}>
                    See More About
                  </Button>
                </div>
                <ul className="space-y-3">
                  {selectedCourse.curriculum.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 shadow-sm transition-colors hover:border-primary/30">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{i + 1}</span>
                      <span className="text-sm font-medium text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <Award className="h-6 w-6 shrink-0 text-purple-500" />
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Included Certificate</span>
                    <span className="text-sm font-medium text-foreground">{selectedCourse.certificate}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 border-t border-border pt-6">
                <Button 
                  variant="success" 
                  disabled={publishingId === selectedCourse.id}
                  className="flex-1 py-6 text-base shadow-lg shadow-success/20 hover:shadow-success/30 transition-shadow disabled:opacity-90 disabled:pointer-events-none" 
                  onClick={() => handlePublish(selectedCourse.id)}
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  {publishingId === selectedCourse.id ? "Published" : "Publish Course"}
                </Button>
                <Button 
                  variant="outline" 
                  disabled={publishingId === selectedCourse.id}
                  className="flex-1 py-6 text-base border-danger/30 text-danger hover:bg-danger/10 hover:text-danger hover:border-danger transition-colors disabled:opacity-50" 
                  onClick={() => handleReject(selectedCourse.id)}
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-start gap-4 rounded-xl border border-success/30 bg-success/10 p-4 shadow-lg backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-white shadow-sm">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-success">{toast.message}</p>
              <p className="mt-1 text-sm text-foreground">{toast.courseName}</p>
              <p className="text-xs font-medium text-muted-foreground mt-0.5 uppercase tracking-wider">ID: {toast.courseId}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MyCoursesPage() {
  const { user } = useApp()
  if (user?.role === "staff" || user?.role === "admin") {
    return <AdminCoursesView />
  }
  return <StudentCoursesView />
}
