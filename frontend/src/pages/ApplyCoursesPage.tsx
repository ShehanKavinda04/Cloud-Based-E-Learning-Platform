import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "@/store/AppContext"
import { cn } from "@/lib/utils"
import { Search, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react"
import { Button, Badge, Card } from "@/components/ui/Primitives"

const STUDENT_CATEGORIES = ["All", "Programming", "Computer Science", "Hackathons"]

export default function ApplyCoursesPage() {
  const { courses, progress, enrollCourse } = useApp()
  const [filter, setFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [enrollingId, setEnrollingId] = useState<string | null>(null)
  const navigate = useNavigate()

  // Filter courses by category and search query
  const filtered = courses.filter((c) => {
    const matchesCategory = filter === "All" || c.category === filter
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId)
    await enrollCourse(courseId)
    setEnrollingId(null)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            Course Catalog
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Explore our curated selection of premium courses and start learning today.
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search for courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-2xl border border-input bg-card pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/30 shadow-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {STUDENT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 border border-transparent",
              filter === cat
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "bg-card text-muted-foreground hover:bg-muted hover:border-border",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-card/50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-foreground">No courses found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course) => {
            const isEnrolled = progress[course.id] !== undefined
            const isEnrolling = enrollingId === course.id
            
            return (
              <Card 
                key={course.id} 
                className="group relative flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 border-border/50"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                  
                  {isEnrolled && (
                    <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-success/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-sm">
                      <CheckCircle2 className="h-3 w-3" />
                      Enrolled
                    </div>
                  )}
                  
                  <Badge variant="primary" className="absolute bottom-3 left-3 backdrop-blur-md bg-primary/90 text-[10px]">
                    {course.category}
                  </Badge>
                </div>
                
                {/* Content Section */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded-full bg-muted overflow-hidden">
                        <img src={course.instructorAvatar || "/avatars/instructor.png"} className="h-full w-full object-cover" />
                      </div>
                      {course.instructor}
                    </span>
                    <span className="flex items-center gap-1 text-warning">
                      ★ {course.rating.toFixed(1)}
                    </span>
                  </div>
                  
                  <h3 className="mb-2 text-base font-bold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="mb-6 text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-border/50">
                    <div className="mb-4 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                      <span>{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons</span>
                      <span>{(course.students / 1000).toFixed(1)}k Students</span>
                    </div>
                    
                    {isEnrolled ? (
                      <Button 
                        variant="secondary" 
                        className="w-full font-bold shadow-sm"
                        onClick={() => navigate(`/courses/${course.id}`)}
                      >
                        Go to Course <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="primary" 
                        className="w-full font-bold shadow-md hover:shadow-primary/25 transition-all"
                        onClick={() => handleEnroll(course.id)}
                        disabled={isEnrolling}
                      >
                        {isEnrolling ? "Enrolling..." : "Enroll Now"}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
