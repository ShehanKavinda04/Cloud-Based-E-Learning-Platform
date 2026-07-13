import { useState } from "react"
import { CourseCard } from "@/components/CourseCard"
import { useApp } from "@/store/AppContext"
import { cn } from "@/lib/utils"

const CATEGORIES = ["All", "Web Development", "Data Science", "Design", "Cloud"]

export default function MyCoursesPage() {
  const { courses } = useApp()
  const [filter, setFilter] = useState("All")
  const filtered =
    filter === "All" ? courses : courses.filter((c) => c.category === filter)

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Continue where you left off or explore something new.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
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

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
