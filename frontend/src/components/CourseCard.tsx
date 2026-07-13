import { useNavigate } from "react-router-dom"
import { Star, PlayCircle } from "lucide-react"
import { Card, Badge, ProgressBar } from "@/components/ui/Primitives"
import { useApp } from "@/store/AppContext"
import type { CourseDoc } from "@/services/models"

export function CourseCard({ course }: { course: CourseDoc }) {
  const navigate = useNavigate()
  const { courseProgressPct } = useApp()
  const pct = courseProgressPct(course.id)

  return (
    <Card className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <button
          onClick={() => navigate(`/courses/${course.id}`)}
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-label={`Play ${course.title}`}
        >
          <PlayCircle className="h-14 w-14 text-white drop-shadow-lg" />
        </button>
        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur-md border-none shadow-sm font-semibold">
          {course.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 text-warning">
            <Star className="h-3.5 w-3.5 fill-current" />
            {course.rating}
          </span>
          <span aria-hidden>&middot;</span>
          <span>{course.students.toLocaleString()} students</span>
        </div>

        <h3 className="text-balance font-bold leading-snug text-foreground">
          {course.title}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <img
            src={course.instructorAvatar}
            alt=""
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="text-sm text-muted-foreground">{course.instructor}</span>
        </div>

        <div className="mt-4 flex-1" />

        <div className="mb-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Progress</span>
            <span className="font-semibold text-primary">{pct}%</span>
          </div>
          <ProgressBar value={pct} />
        </div>

        <button
          onClick={() => navigate(`/courses/${course.id}`)}
          className="w-full rounded-xl bg-muted py-2.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
        >
          {pct === 0 ? "Start course" : pct === 100 ? "Review course" : "Continue"}
        </button>
      </div>
    </Card>
  )
}
