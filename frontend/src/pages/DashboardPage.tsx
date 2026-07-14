import { useNavigate } from "react-router-dom"
import { BookOpen, Clock, Trophy, Flame, ArrowRight } from "lucide-react"
import { Card, CircularProgress } from "@/components/ui/Primitives"
import { CourseCard } from "@/components/CourseCard"
import { useApp } from "@/store/AppContext"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const { user, overallProgressPct, courses, progress, courseProgressPct } = useApp()
  const navigate = useNavigate()
  const overall = overallProgressPct()

  // 1. Enrolled Courses
  const enrolledCoursesList = courses.filter((c) => progress[c.id] !== undefined)
  const enrolledCourses = enrolledCoursesList.length

  // 2. Hours Learned
  let totalSeconds = 0
  Object.entries(progress).forEach(([courseId, lessonIds]) => {
    const course = courses.find((c) => c.id === courseId)
    if (course) {
      course.modules.forEach((m) => {
        m.lessons.forEach((lesson) => {
          if (lessonIds.includes(lesson.id) && lesson.duration) {
            if (lesson.duration.includes("min")) {
              totalSeconds += parseInt(lesson.duration) * 60
            } else if (lesson.duration.includes(":")) {
              const [mins, secs] = lesson.duration.split(":")
              totalSeconds += (parseInt(mins) || 0) * 60 + (parseInt(secs) || 0)
            }
          }
        })
      })
    }
  })
  
  const hours = totalSeconds / 3600
  const hoursLearned = parseFloat(hours.toFixed(1)) + "h"

  // 3. Certificates (Courses at 100%)
  const certificates = Object.keys(progress).filter(
    (courseId) => courseProgressPct(courseId) === 100
  ).length

  // 4. Day Streak (Derived from user.createdAt)
  const streak = user?.createdAt 
    ? Math.max(1, Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24))) 
    : 1

  const stats = [
    { label: "Enrolled Courses", value: enrolledCourses, icon: BookOpen, color: "text-primary bg-primary/10" },
    { label: "Hours Learned", value: hoursLearned, icon: Clock, color: "text-success bg-success/10" },
    { label: "Certificates", value: certificates, icon: Trophy, color: "text-warning bg-warning/10" },
    { label: "Day Streak", value: streak, icon: Flame, color: "text-danger bg-danger/10" },
  ]

  const firstName = user?.name?.split(" ")[0] ?? "there"

  // --- Dynamic Calendar Logic ---
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Derive schedule dates for enrolled courses
  const scheduledDates = new Map<number, { course: string; time: string }[]>();
  
  enrolledCoursesList.forEach((course, index) => {
    // Generate a consistent pseudo-random day and time for this course
    const daysOfWeek = ["Mon", "Wed", "Fri", "Tue", "Thu"];
    const targetDayStr = daysOfWeek[(course.id.length + index) % daysOfWeek.length];
    const times = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"];
    const targetTime = times[(course.id.length + index) % times.length];
    
    const dayNameToIndex: Record<string, number> = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 };
    const targetDayOfWeek = dayNameToIndex[targetDayStr];
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      if (dateObj.getDay() === targetDayOfWeek) {
        if (!scheduledDates.has(d)) {
          scheduledDates.set(d, []);
        }
        scheduledDates.get(d)!.push({ course: course.title, time: targetTime });
      }
    }
  });
  // -----------------------------

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

      {/* Student Lecture Calendar */}
      <Card className="p-6 flex flex-col border border-border/50 shadow-sm overflow-visible z-10 relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> My Lecture Schedule
            </h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              {today.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground"><span className="h-2.5 w-2.5 rounded-full bg-primary"></span> Today</span>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground"><span className="h-2.5 w-2.5 rounded-full bg-warning"></span> Lecture</span>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center mb-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-3">
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="p-3" />;
            const isToday = day === today.getDate();
            const hasLecture = scheduledDates.has(day);
            const lecturesForDay = scheduledDates.get(day) || [];
            
            return (
              <div key={day} className="relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all hover:bg-muted/60 cursor-pointer group h-16 border border-transparent hover:border-border">
                <span className={cn(
                  "text-base font-bold z-10",
                  isToday ? "text-white" : "text-foreground",
                )}>{day}</span>
                
                {isToday && (
                  <div className="absolute inset-0 bg-primary rounded-2xl shadow-lg shadow-primary/25 -z-0"></div>
                )}
                
                {hasLecture && (
                  <div className={cn(
                    "absolute bottom-2.5 flex gap-1 z-10",
                  )}>
                    {lecturesForDay.slice(0, 3).map((_, i) => (
                      <div key={i} className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isToday ? "bg-white" : "bg-warning shadow-[0_0_8px_rgba(var(--color-warning),0.6)]"
                      )}></div>
                    ))}
                  </div>
                )}

                {hasLecture && (
                  <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 hidden w-max min-w-[200px] px-4 py-3 text-sm font-medium text-white bg-dark rounded-xl shadow-2xl group-hover:block z-[100] animate-fade-in after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-dark">
                    <div className="font-bold text-primary mb-2 text-xs uppercase tracking-wider">Scheduled Lectures</div>
                    <div className="space-y-2">
                      {lecturesForDay.map((s, i) => (
                        <div key={i} className="flex flex-col gap-0.5 border-t border-slate-700/50 pt-2 first:border-0 first:pt-0">
                          <span className="font-semibold truncate max-w-[250px]">{s.course}</span>
                          <span className="text-xs text-warning flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {s.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
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
          {enrolledCoursesList.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}
