import { useNavigate } from "react-router-dom"
import { BookOpen, Clock, Trophy, Flame, ArrowRight } from "lucide-react"
import { Card, CircularProgress } from "@/components/ui/Primitives"
import { CourseCard } from "@/components/CourseCard"
import { useApp } from "@/store/AppContext"

export default function DashboardPage() {
  const { user, overallProgressPct, courses } = useApp()
  const navigate = useNavigate()
  const overall = overallProgressPct()

  const stats = [
    { label: "Enrolled Courses", value: courses.length, icon: BookOpen, color: "text-primary bg-primary/10" },
    { label: "Hours Learned", value: "48h", icon: Clock, color: "text-success bg-success/10" },
    { label: "Certificates", value: 2, icon: Trophy, color: "text-warning bg-warning/10" },
    { label: "Day Streak", value: 12, icon: Flame, color: "text-danger bg-danger/10" },
  ]

  const firstName = user?.name?.split(" ")[0] ?? "there"

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <Card className="overflow-hidden border-0 bg-dark text-dark-foreground">
        <div className="flex flex-col items-center gap-6 p-6 md:flex-row md:justify-between md:p-8">
          <div className="max-w-lg text-center md:text-left">
            <p className="text-sm font-medium text-slate-400">Welcome back,</p>
            <h1 className="mt-1 text-balance text-3xl font-bold">{firstName}!</h1>
            <p className="mt-3 text-pretty leading-relaxed text-slate-300">
              You&apos;ve completed {overall}% of your overall learning path. Keep the
              momentum going and unlock your next certificate.
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-indigo-700"
            >
              Continue learning
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="text-primary">
            <CircularProgress
              value={overall}
              size={150}
              stroke={12}
              label={
                <div className="text-center text-dark-foreground">
                  <div className="text-3xl font-bold">{overall}%</div>
                  <div className="text-xs text-slate-400">Overall</div>
                </div>
              }
            />
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="p-5 transition-all duration-300 hover:shadow-md">
              <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </Card>
          )
        })}
      </div>

      {/* Enrolled courses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">My Enrolled Courses</h2>
          <button
            onClick={() => navigate("/courses")}
            className="text-sm font-semibold text-primary hover:underline"
          >
            View all
          </button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}
