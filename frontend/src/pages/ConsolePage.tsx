import { useState } from "react"
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
import type { QuizDoc } from "@/services/models"

export default function ConsolePage() {
  const { courses, user, publishQuiz } = useApp()
  const [showSuccess, setShowSuccess] = useState(false)
  const [questionText, setQuestionText] = useState("")
  const [option1, setOption1] = useState("")
  const [option2, setOption2] = useState("")

  const instructorCourses = user?.role === "admin" 
    ? courses 
    : courses.filter(c => c.instructor === user?.name)

  const handlePublishQuiz = async () => {
    const courseId = instructorCourses.length > 0 ? instructorCourses[0].id : "c1"
    const newQuiz: QuizDoc = {
      id: `q_${Date.now()}`,
      courseId,
      title: questionText ? `Quiz: ${questionText}` : `Assessment: ${instructorCourses[0]?.title || "General"}`,
      durationSeconds: 1800,
      passingScore: 70,
      questions: [
        {
          id: "q1",
          prompt: questionText || "Sample question",
          options: [
            { id: "A", text: option1 || "Option A" },
            { id: "B", text: option2 || "Option B" }
          ],
          correctOptionId: "A"
        }
      ]
    }
    
    await publishQuiz(newQuiz)
    
    setQuestionText("")
    setOption1("")
    setOption2("")
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3500)
  }

  // Calculate dynamic KPIs
  const totalStudents = instructorCourses.reduce((sum, c) => sum + c.students, 0)
  const activeHours = Math.round(totalStudents * 5.8)
  const avgRating = instructorCourses.length > 0 
    ? (instructorCourses.reduce((sum, c) => sum + c.rating, 0) / instructorCourses.length).toFixed(1) 
    : "0.0"

  const dynamicKPIs = [
    { label: "Total Students", value: totalStudents.toLocaleString(), delta: "+12.4%", icon: Users, color: "text-primary bg-primary/10" },
    { label: "Active Hours", value: activeHours.toLocaleString(), delta: "+8.1%", icon: Clock, color: "text-success bg-success/10" },
    { label: "Avg. Course Rating", value: avgRating, delta: "+0.2", icon: Star, color: "text-warning bg-warning/10" },
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

  const topCourses = [...instructorCourses].sort((a, b) => b.students - a.students).slice(0, user?.role === "admin" ? 4 : 2)

  // Dynamic Calendar Logic
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

  const scheduledDates = new Set<number>();
  const dayNameToIndex: Record<string, number> = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 };
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  
  instructorCourses.forEach((c, i) => {
    const dayStr = daysOfWeek[(c.title.length + i) % daysOfWeek.length];
    const targetDayOfWeek = dayNameToIndex[dayStr];
    if (targetDayOfWeek !== undefined) {
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(currentYear, currentMonth, d);
        if (dateObj.getDay() === targetDayOfWeek) {
          scheduledDates.add(d);
        }
      }
    }
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {user?.role === "admin" ? "Admin Console" : "Instructor Console"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {user?.role === "admin" 
            ? "Platform overview and key performance metrics." 
            : "Manage content, track performance, and build assessments."}
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
        <Card className="p-6 border border-border/50 shadow-sm flex flex-col">
          <h3 className="font-bold text-foreground">Weekly Enrollments</h3>
          <p className="text-sm text-muted-foreground">New students this week</p>
          <div className="mt-6 flex flex-1 items-end justify-between gap-3 min-h-[160px]">
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

        {/* My Courses & Calendar */}
        {user?.role === "admin" ? (
          <Card className="p-6 border border-border/50 shadow-sm flex flex-col">
            <h3 className="font-bold text-foreground">Top Courses</h3>
            <p className="text-sm text-muted-foreground">By enrollment</p>
            <div className="mt-6 space-y-4">
              {topCourses.map((c) => {
                const pct = totalStudents > 0 ? (c.students / totalStudents) * 100 : 0
                return (
                  <div key={c.id} className="flex items-center gap-4">
                    <img src={c.thumbnail} alt={c.title} className="h-10 w-10 rounded-lg object-cover flex-shrink-0 border border-border/30" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1.5 text-sm">
                        <span className="font-medium text-foreground truncate mr-2">{c.title}</span>
                        <span className="text-muted-foreground whitespace-nowrap text-xs font-semibold">{pct.toFixed(1)}%</span>
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
        ) : (
          <Card className="p-6 border border-border/50 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-foreground">My Courses</h3>
              <p className="text-sm text-muted-foreground">By enrollment</p>
              <div className="mt-6 space-y-4">
                {topCourses.map((c) => {
                  const pct = totalStudents > 0 ? (c.students / totalStudents) * 100 : 0
                  return (
                    <div key={c.id} className="flex items-center gap-4">
                      <img src={c.thumbnail} alt={c.title} className="h-10 w-10 rounded-lg object-cover flex-shrink-0 border border-border/30" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1.5 text-sm">
                          <span className="font-medium text-foreground truncate mr-2">{c.title}</span>
                          <span className="text-muted-foreground whitespace-nowrap text-xs font-semibold">{pct.toFixed(1)}%</span>
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
            </div>

            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-foreground text-sm">Lecture Calendar</h3>
                  <p className="text-[11px] font-medium text-primary mt-0.5">{today.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"><span className="h-2 w-2 rounded-full bg-primary"></span> Today</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"><span className="h-2 w-2 rounded-full bg-warning"></span> Lecture</span>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <div key={d} className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="p-1.5" />;
                  const isToday = day === today.getDate();
                  const hasLecture = scheduledDates.has(day);
                  
                  return (
                    <div key={day} className="relative flex flex-col items-center justify-center p-1.5 rounded-lg transition-all hover:bg-muted/50 cursor-pointer group h-8">
                      <span className={`text-xs font-semibold z-10 ${isToday ? "text-white" : "text-foreground"}`}>
                        {day}
                      </span>
                      
                      {isToday && (
                        <div className="absolute inset-0 bg-primary rounded-lg shadow-md shadow-primary/20 -z-0"></div>
                      )}
                      
                      {hasLecture && (
                        <div className={`absolute bottom-1 h-1 w-1 rounded-full z-10 ${isToday ? "bg-white" : "bg-warning shadow-[0_0_8px_rgba(var(--color-warning),0.8)]"}`}></div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Course Content Builder */}
      {user?.role !== "admin" && (
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
      )}

      {/* Quiz Question Builder */}
      {user?.role !== "admin" && (
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
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary shadow-sm"
                />
                
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <input 
                    type="text"
                    placeholder="Answer option..."
                    value={option1}
                    onChange={e => setOption1(e.target.value)}
                    className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary shadow-sm"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                  <input 
                    type="text"
                    placeholder="Answer option..."
                    value={option2}
                    onChange={e => setOption2(e.target.value)}
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
            <Button variant="success" className="font-semibold shadow-sm px-6" onClick={handlePublishQuiz}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Publish Quiz
            </Button>
          </div>
        </Card>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <Card className="flex items-center gap-3 border-success bg-success/10 p-4 shadow-lg">
            <CheckCircle2 className="h-6 w-6 text-success" />
            <div>
              <p className="font-bold text-success">Successful</p>
              <p className="text-sm text-success/80">Quiz has been published to students.</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
