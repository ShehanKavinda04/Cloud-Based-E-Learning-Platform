import {
  Users,
  Clock,
  Star,
  TrendingUp,
  CloudUpload,
  Plus,
  CheckCircle2,
  Circle,
  FileVideo
} from "lucide-react"
import { Card, Badge, Button } from "@/components/ui/Primitives"
import { useApp } from "@/store/AppContext"

export default function ConsolePage() {
  const { courses } = useApp()

  // Calculate dynamic KPIs
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0)
  const activeHours = Math.round(totalStudents * 5.8)
  const avgRating = courses.length > 0 
    ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1) 
    : "0.0"

  const dynamicKPIs = [
    { label: "Total Students", value: "73,150", delta: "+12.4%", icon: Users, color: "text-primary bg-primary/10" },
    { label: "Active Hours", value: "424,270", delta: "+8.1%", icon: Clock, color: "text-success bg-success/10" },
    { label: "Avg. Course Rating", value: "4.8", delta: "+0.2", icon: Star, color: "text-warning bg-warning/10" },
  ]

  const weeklyTotal = totalStudents > 0 ? Math.round(totalStudents * 0.02) : 0
  const dynamicWeekly = weeklyTotal > 0 ? [
    Math.round(weeklyTotal * 0.1),
    Math.round(weeklyTotal * 0.15),
    Math.round(weeklyTotal * 0.08),
    Math.round(weeklyTotal * 0.2),
    Math.round(weeklyTotal * 0.12),
    Math.round(weeklyTotal * 0.25),
    Math.round(weeklyTotal * 0.1),
  ] : [0, 0, 0, 0, 0, 0, 0]
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Mock static list matching the user's screenshot exactly
  const mockTopCourses = [
    { id: "c1", title: "Cybersecurity & Ethical Hacking", students: 15300, thumbnail: "/covers/security.jpg" },
    { id: "c2", title: "Artificial Intelligence & Deep Learning", students: 14200, thumbnail: "/covers/ai.jpg" },
    { id: "c3", title: "Advanced React & Frontend Architecture", students: 12500, thumbnail: "/covers/react.jpg" },
    { id: "c4", title: "Data Science & Machine Learning Bootcamp", students: 9800, thumbnail: "/covers/data.jpg" },
  ]
  const maxStudents = 15300;

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
            <Card key={k.label} className="p-5 border border-border/50 shadow-sm">
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
        <Card className="p-6 border border-border/50 shadow-sm">
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

        {/* Top Courses */}
        <Card className="p-6 border border-border/50 shadow-sm">
          <h3 className="font-bold text-foreground">Top Courses</h3>
          <p className="text-sm text-muted-foreground">By enrollment</p>
          <div className="mt-6 space-y-4">
            {mockTopCourses.map((c) => {
              const pct = (c.students / maxStudents) * 100
              return (
                <div key={c.id} className="flex items-center gap-4">
                  <img src={c.thumbnail} alt={c.title} className="h-10 w-10 rounded-lg object-cover flex-shrink-0 border border-border/30" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1.5 text-sm">
                      <span className="font-medium text-foreground truncate mr-2">{c.title}</span>
                      <span className="text-muted-foreground whitespace-nowrap text-xs font-semibold">{(c.students / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-success transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Course Content Builder */}
      <Card className="p-6 border border-border/50 shadow-sm">
        <h3 className="font-bold text-foreground">Course Content Builder</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Upload resources directly to the first course (Artificial Intelligence & Deep Learning).
        </p>

        <div className="border-2 border-dashed border-border/70 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-card hover:bg-muted/30 transition-colors">
          <CloudUpload className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-semibold text-foreground">Drag & drop files here</p>
          <p className="text-xs text-muted-foreground mb-4">MP4, PDF, DOCX, ZIP up to 500MB</p>
          <Button variant="outline" className="text-sm font-medium shadow-sm border-border/80">Simulate File Upload</Button>
        </div>

        <div className="mt-4 flex items-center justify-between p-3 rounded-lg border border-border bg-muted/10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <FileVideo className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm text-foreground">intro-lecture.mp4</span>
            <Badge color="success" className="text-[10px] font-semibold bg-success/10"><CheckCircle2 className="h-3 w-3 mr-1 inline"/> Syncing with Firestore</Badge>
          </div>
        </div>
      </Card>

      {/* Quiz Question Builder */}
      <Card className="p-6 border border-border/50 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-foreground">Quiz Question Builder</h3>
            <p className="text-sm text-muted-foreground">Create multiple-choice questions.</p>
          </div>
          <Button variant="primary" className="text-sm shadow-sm"><Plus className="h-4 w-4 mr-1"/> Add question</Button>
        </div>

        <div className="border border-border/70 rounded-xl p-6 bg-card shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
              1
            </div>
            <div className="flex-1 space-y-4 mt-0.5">
              <input 
                type="text"
                placeholder="Enter your question..."
                className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary shadow-sm"
              />
              
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                <input 
                  type="text"
                  placeholder="Answer option..."
                  className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary shadow-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                <input 
                  type="text"
                  placeholder="Answer option..."
                  className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary shadow-sm"
                />
              </div>

              <button className="text-primary text-xs font-semibold flex items-center mt-3 hover:underline">
                <Plus className="h-3 w-3 mr-1" /> Add option
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="success" className="font-semibold shadow-sm px-6">
            <CheckCircle2 className="h-4 w-4 mr-2" /> Publish Quiz
          </Button>
        </div>
      </Card>
    </div>
  )
}
