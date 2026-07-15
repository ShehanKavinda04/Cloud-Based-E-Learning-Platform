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

  // Admin Panels Data
  const upcomingLectures = [
    { id: "lec-1", subject: "Network Penetration Testing", course: "Cybersecurity & Ethical Hacking", time: "Today, 10:00 AM" },
    { id: "lec-2", subject: "Neural Networks Basics", course: "Artificial Intelligence & Deep Learning", time: "Tomorrow, 2:00 PM" },
    { id: "lec-3", subject: "State Management with Context", course: "Advanced React Architecture", time: "Thu, 11:30 AM" }
  ];

  const activeStudents = Math.round(totalStudents * 0.85);
  const activePercent = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;

  const popularSubjects = [
    { name: "Cybersecurity & Ethical Hacking", percent: 35, color: "bg-primary" },
    { name: "Artificial Intelligence & Deep Learning", percent: 28, color: "bg-success" },
    { name: "Data Science & ML Bootcamp", percent: 20, color: "bg-warning" },
    { name: "Advanced React & Frontend", percent: 17, color: "bg-destructive" },
  ];

  const uniqueLecturers = Array.from(new Set(courses.map(c => c.instructor).filter(Boolean)));
  const totalLecturerCount = uniqueLecturers.length;
  const lecturersList = uniqueLecturers.map((name, idx) => ({
    id: `lec-profile-${idx}`,
    name,
    courses: courses.filter(c => c.instructor === name).map(c => c.title).join(", "),
    avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${name.replace(/\s/g, '')}`
  }));

  const studentsList = [
    { id: 1, name: "Emma Watson", course: courses[0]?.title || "Cybersecurity", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Emma" },
    { id: 2, name: "Michael Chang", course: courses[1]?.title || "AI & Deep Learning", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael" },
    { id: 3, name: "Sophia Martinez", course: courses[2]?.title || "Data Science", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sophia" },
    { id: 4, name: "James Wilson", course: courses[3]?.title || "React Architecture", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=James" },
  ];

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

        {/* Admin Panels OR Instructor My Courses */}
        {user?.role === "admin" ? (
          <div className="space-y-6">
            {/* Lecturers Panel */}
            <Card className="p-6 border border-border/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-foreground">Lecturers</h3>
                  <p className="text-sm text-muted-foreground">Active instructors</p>
                </div>
                <Badge color="primary" className="bg-primary/10 text-primary font-bold border-0">
                  Total: {totalLecturerCount}
                </Badge>
              </div>
              {/* Upcoming Lectures List */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">This Week's Lectures</h4>
                {upcomingLectures.map((lec) => (
                  <div key={lec.id} className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-3 shadow-sm hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileVideo className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate text-xs font-bold text-foreground group-hover:text-primary transition-colors">{lec.subject}</h4>
                      <p className="truncate text-[10px] font-medium text-muted-foreground">{lec.course}</p>
                    </div>
                    <div className="shrink-0">
                      <Badge color="primary" className="bg-primary/10 text-primary group-hover:bg-primary/20 text-[9px] font-bold border-0 px-2 py-0.5">
                        <Clock className="h-2.5 w-2.5 mr-1 inline" />
                        {lec.time}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Students Panel */}
            <Card className="p-6 border border-border/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-foreground">Recent Students</h3>
                  <p className="text-sm text-muted-foreground">Newly enrolled</p>
                </div>
                <Badge color="success" className="bg-success/10 text-success font-bold border-0">
                  Total: {totalStudents.toLocaleString()}
                </Badge>
              </div>
              <div className="space-y-3">
                {studentsList.map(student => (
                  <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card hover:border-success/50 transition-colors shadow-sm cursor-pointer group">
                    <img src={student.avatar} alt={student.name} className="h-10 w-10 rounded-full object-cover border border-border group-hover:border-success/50 transition-colors bg-muted/50" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate group-hover:text-success transition-colors">{student.name}</p>
                      <p className="text-[11px] font-medium text-muted-foreground truncate">{student.course}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pie Chart & Subject Stats */}
              <div className="mt-6 pt-6 border-t border-border/50">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Student Activity & Interests</h4>
                <div className="flex items-center gap-6">
                  
                  {/* Pie Chart */}
                  <div className="flex flex-col items-center gap-2">
                    <div 
                      className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-inner" 
                      style={{ background: `conic-gradient(hsl(var(--primary)) ${activePercent}%, hsl(var(--muted)) 0)` }}
                    >
                      <div className="absolute inset-1.5 bg-card rounded-full flex flex-col items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-foreground">{activePercent}%</span>
                      </div>
                    </div>
                    <div className="flex gap-3 text-[10px] font-semibold text-muted-foreground">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span>Active</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted"></span>On-hold</span>
                    </div>
                  </div>

                  {/* Popular Subjects */}
                  <div className="flex-1 space-y-3">
                    {popularSubjects.map((sub, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${sub.color}`}></span>
                          <span className="text-muted-foreground truncate max-w-[140px]">{sub.name}</span>
                        </div>
                        <span className="font-bold text-foreground">{sub.percent}%</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </Card>
          </div>
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
