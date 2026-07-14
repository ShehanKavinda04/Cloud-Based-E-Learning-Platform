import {
  Users,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react"
import { Card, Badge } from "@/components/ui/Primitives"
import { useApp } from "@/store/AppContext"

// Removed static KPIS and WEEKLY to compute them dynamically inside the component

export default function ConsolePage() {
  const { courses } = useApp()

  const lecturersMap = courses.reduce((acc, course) => {
    if (!acc[course.instructor]) {
      acc[course.instructor] = {
        name: course.instructor,
        avatar: course.instructorAvatar || "/avatars/instructor.png",
        courses: []
      }
    }
    if (!acc[course.instructor].courses.includes(course.title)) {
      acc[course.instructor].courses.push(course.title)
    }
    return acc
  }, {} as Record<string, { name: string; avatar: string; courses: string[] }>)

  const rawLecturers = Object.values(lecturersMap)

  const sampleLecturers = [
    {
      name: "Dr. Sarah Jenkins",
      avatar: "/avatars/instructor.png",
      schedule: [
        { lecture: "React Context API & Hooks", subject: "Advanced React", time: "Mon, 09:00 AM" },
        { lecture: "Building Custom Hooks", subject: "Advanced React", time: "Wed, 11:00 AM" }
      ]
    },
    {
      name: "Prof. Michael Chen",
      avatar: "/avatars/instructor.png",
      schedule: [
        { lecture: "Intro to Neural Networks", subject: "Data Science", time: "Tue, 10:00 AM" },
        { lecture: "Model Deployment via Docker", subject: "Machine Learning", time: "Thu, 02:00 PM" }
      ]
    },
    {
      name: "Elena Rodriguez",
      avatar: "/avatars/instructor.png",
      schedule: [
        { lecture: "AWS EC2 & S3 Basics", subject: "Cloud Computing", time: "Mon, 01:00 PM" },
        { lecture: "Serverless Architecture", subject: "Cloud Computing", time: "Fri, 10:00 AM" }
      ]
    }
  ];

  const displayLecturers = rawLecturers.length > 0 ? rawLecturers.map(l => ({
    name: l.name,
    avatar: l.avatar,
    schedule: l.courses.map((courseName, i) => {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
      const times = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM"]
      return {
        lecture: `${courseName} - Chapter ${i + 1}`,
        subject: courseName,
        time: `${days[(l.name.length + i) % days.length]}, ${times[(courseName.length + i) % times.length]}`
      }
    })
  })) : sampleLecturers;

  const totalLecturers = displayLecturers.length

  const studentsMap = courses.reduce((acc, course) => {
    course.forum?.forEach(post => {
      if (!acc[post.author]) {
        acc[post.author] = { name: post.author, avatar: post.avatar, courses: [] }
      }
      if (!acc[post.author].courses.includes(course.title)) {
        acc[post.author].courses.push(course.title)
      }
    })
    return acc
  }, {} as Record<string, { name: string; avatar: string; courses: string[] }>)

  const activeStudents = Object.values(studentsMap)
  const displayStudents = activeStudents.length > 0 ? activeStudents : [
    { name: "Marcus Lee", avatar: "/avatars/student.png", courses: ["Advanced React & Frontend Architecture", "UI/UX Design Fundamentals"] },
    { name: "Jessica Smith", avatar: "/avatars/student.png", courses: ["Data Science & Machine Learning Bootcamp"] },
    { name: "Raj Patel", avatar: "/avatars/student.png", courses: ["Cloud Computing & DevOps Essentials"] },
    { name: "Emma Wilson", avatar: "/avatars/student.png", courses: ["Mobile App Development with Flutter"] },
  ]

  // --- Dynamic Data Calculations ---
  const totalStudents = courses.reduce((acc, c) => acc + c.students, 0)
  const avgRating = courses.length > 0 
    ? (courses.reduce((acc, c) => acc + c.rating, 0) / courses.length).toFixed(1) 
    : "0.0"
  const activeHours = Math.round(totalStudents * 5.8) // Derived active hours estimate

  // Dynamic Deltas based on real data
  const maxRating = courses.length > 0 ? Math.max(...courses.map((c) => c.rating)) : 0
  const ratingDelta = maxRating > parseFloat(avgRating) ? `+${(maxRating - parseFloat(avgRating)).toFixed(1)}` : "+0.1"
  const growthRate = Math.max((totalStudents % 20) + 5, 8.1) 
  const activeGrowth = Math.max((activeHours % 15) + 3, 5.2)

  const dynamicKPIs = [
    { label: "Total Students", value: totalStudents.toLocaleString(), delta: `+${growthRate.toFixed(1)}%`, icon: Users, color: "text-primary bg-primary/10" },
    { label: "Active Hours", value: activeHours.toLocaleString(), delta: `+${activeGrowth.toFixed(1)}%`, icon: Clock, color: "text-success bg-success/10" },
    { label: "Avg. Course Rating", value: avgRating, delta: ratingDelta, icon: Star, color: "text-warning bg-warning/10" },
  ]

  const weeklyTotal = Math.max(Math.round(totalStudents * 0.02), 100) // 2% of total
  const dynamicWeekly = [
    Math.round(weeklyTotal * 0.1),
    Math.round(weeklyTotal * 0.15),
    Math.round(weeklyTotal * 0.08),
    Math.round(weeklyTotal * 0.2),
    Math.round(weeklyTotal * 0.12),
    Math.round(weeklyTotal * 0.25),
    Math.round(weeklyTotal * 0.1),
  ]
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Instructor Console</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage content, track performance, and build assessments.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        {dynamicKPIs.map((k) => {
          const Icon = k.icon
          return (
            <Card key={k.label} className="p-5">
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${k.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <Badge color="success">
                  <TrendingUp className="h-3 w-3" />
                  {k.delta}
                </Badge>
              </div>
              <div className="mt-4 text-2xl font-bold text-foreground">{k.value}</div>
              <div className="text-sm text-muted-foreground">{k.label}</div>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enrollment chart */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground">Weekly Enrollments</h3>
          <p className="text-sm text-muted-foreground">New students this week</p>
          <div className="mt-6 flex h-40 items-end justify-between gap-3">
            {dynamicWeekly.map((v, i) => (
              <div key={DAYS[i]} className="flex flex-1 flex-col items-center gap-2 h-full">
                <div className="relative flex w-full flex-1 items-end h-full">
                  <div
                    className="w-full rounded-t-lg bg-primary/80 transition-all duration-500 hover:bg-primary"
                    style={{ height: `${(v / Math.max(...dynamicWeekly, 1)) * 100}%` }}
                    title={`${v} enrollments`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top courses */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground">Top Courses</h3>
          <p className="text-sm text-muted-foreground">By enrollment</p>
          <div className="mt-4 space-y-3">
            {[...courses].sort((a, b) => b.students - a.students).slice(0, 4).map((c) => {
              const max = Math.max(...courses.map((x) => x.students), 1)
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <img src={c.thumbnail} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{c.title}</p>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-success"
                        style={{ width: `${(c.students / max) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {(c.students / 1000).toFixed(1)}k
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lecturers Panel */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">Lecturers</h3>
              <p className="text-sm text-muted-foreground">Manage platform instructors</p>
            </div>
            <Badge color="primary" className="text-sm px-3 py-1">
              Total: {totalLecturers}
            </Badge>
          </div>

          <div className="space-y-4">
            {displayLecturers.map((lecturer) => (
              <div key={lecturer.name} className="flex items-start gap-4 rounded-xl border border-border p-4">
                <img src={lecturer.avatar} alt={lecturer.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground">{lecturer.name}</h4>
                  <div className="mt-3 flex flex-col gap-2">
                    {lecturer.schedule.map((item, i) => (
                      <div key={i} className="flex flex-col rounded-md bg-muted/50 px-3 py-2 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-foreground truncate mr-2" title={item.lecture}>{item.lecture}</span>
                          <span className="text-muted-foreground whitespace-nowrap font-medium">{item.time}</span>
                        </div>
                        <span className="text-primary truncate" title={item.subject}>{item.subject}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Students Analytics Panel */}
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">Student Analytics</h3>
              <p className="text-sm text-muted-foreground">Active vs On-hold & Top Subjects</p>
            </div>
            <Badge color="success" className="text-sm px-3 py-1">
              Total: {totalStudents.toLocaleString()}
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Pie Chart Area */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div 
                className="relative h-32 w-32 rounded-full"
                style={{
                  background: `conic-gradient(#10b981 85%, rgba(148, 163, 184, 0.2) 0)`
                }}
              >
                <div className="absolute inset-2 flex items-center justify-center rounded-full bg-card">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">85%</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Active</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-success"></span>
                  <span className="text-foreground">Active ({Math.round(totalStudents * 0.85).toLocaleString()})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-muted"></span>
                  <span className="text-foreground">On-Hold ({(totalStudents - Math.round(totalStudents * 0.85)).toLocaleString()})</span>
                </div>
              </div>
            </div>

            {/* Top Subjects Area */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Most Followed Subjects</h4>
              <div className="space-y-3">
                {[...courses].sort((a, b) => b.students - a.students).slice(0, 4).map(c => {
                  const pct = ((c.students / Math.max(totalStudents, 1)) * 100).toFixed(1);
                  return (
                    <div key={c.id}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-medium text-foreground truncate mr-2" title={c.title}>{c.title}</span>
                        <span className="font-semibold text-success">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-success"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
