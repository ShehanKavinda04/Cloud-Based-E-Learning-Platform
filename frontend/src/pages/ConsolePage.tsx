import { useState, type DragEvent } from "react"
import {
  Users,
  Clock,
  Star,
  TrendingUp,
  UploadCloud,
  FileVideo,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react"
import { Card, Badge, Button } from "@/components/ui/Primitives"
import { useApp } from "@/store/AppContext"
import { dbService } from "@/services/firebase"
import { cn } from "@/lib/utils"

interface DraftOption {
  id: string
  text: string
  correct: boolean
}
interface DraftQuestion {
  id: string
  prompt: string
  options: DraftOption[]
}

const KPIS = [
  { label: "Total Students", value: "35,240", delta: "+12.4%", icon: Users, color: "text-primary bg-primary/10" },
  { label: "Active Hours", value: "128,900", delta: "+8.1%", icon: Clock, color: "text-success bg-success/10" },
  { label: "Avg. Course Rating", value: "4.8", delta: "+0.2", icon: Star, color: "text-warning bg-warning/10" },
]

// Simple weekly bar chart data (enrollments)
const WEEKLY = [42, 58, 39, 71, 65, 88, 76]
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function ConsolePage() {
  const { courses, setCourses, setQuizzes } = useApp()
  const [files, setFiles] = useState<{ name: string; type: "video" | "doc" }[]>([
    { name: "intro-lecture.mp4", type: "video" },
    { name: "syllabus.pdf", type: "doc" },
  ])
  const [dragging, setDragging] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)

  const [questions, setQuestions] = useState<DraftQuestion[]>([
    {
      id: "dq1",
      prompt: "",
      options: [
        { id: "o1", text: "", correct: true },
        { id: "o2", text: "", correct: false },
      ],
    },
  ])

  // Sync new uploaded assets into course resources
  const addResourceToDb = async (name: string, type: "video" | "doc") => {
    if (courses.length === 0) return
    const course = courses[0]
    const ext = name.split(".").pop() || ""
    const resourceType = ext === "zip" ? "zip" : ext === "pdf" ? "pdf" : "doc"
    
    const newResource = {
      id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      name,
      size: "2.5 MB",
      type: resourceType,
    }

    const updatedCourse = {
      ...course,
      resources: [...course.resources, newResource],
    }

    try {
      await dbService.saveCourse(updatedCourse)
      setCourses((prev) => prev.map((c) => (c.id === course.id ? updatedCourse : c)))
    } catch (err) {
      console.error("Failed to save new resource in console:", err)
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    if (dropped.length) {
      const newFiles = dropped.map((f) => ({
        name: f.name,
        type: f.type.startsWith("video") ? ("video" as const) : ("doc" as const),
      }))
      setFiles((prev) => [...prev, ...newFiles])
      newFiles.forEach((file) => {
        addResourceToDb(file.name, file.type)
      })
    } else {
      // Simulate a dropped asset when no real file present
      const name = `new-asset-${files.length + 1}.mp4`
      const type = "video" as const
      setFiles((prev) => [...prev, { name, type }])
      addResourceToDb(name, type)
    }
  }

  function addQuestion() {
    setQuestions((q) => [
      ...q,
      {
        id: `dq_${Date.now()}`,
        prompt: "",
        options: [
          { id: "o1", text: "", correct: true },
          { id: "o2", text: "", correct: false },
        ],
      },
    ])
  }

  function updateQuestion(qid: string, prompt: string) {
    setQuestions((qs) => qs.map((q) => (q.id === qid ? { ...q, prompt } : q)))
  }

  function updateOption(qid: string, oid: string, text: string) {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qid ? { ...q, options: q.options.map((o) => (o.id === oid ? { ...o, text } : o)) } : q,
      ),
    )
  }

  function setCorrect(qid: string, oid: string) {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.map((o) => ({ ...o, correct: o.id === oid })) }
          : q,
      ),
    )
  }

  function addOption(qid: string) {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qid
          ? { ...q, options: [...q.options, { id: `o_${Date.now()}`, text: "", correct: false }] }
          : q,
      ),
    )
  }

  function removeQuestion(qid: string) {
    setQuestions((qs) => qs.filter((q) => q.id !== qid))
  }

  // Publish dynamic quiz and save to Firestore
  const handlePublishQuiz = async () => {
    if (courses.length === 0) {
      alert("No courses available to link this quiz to.")
      return
    }
    if (questions.some((q) => !q.prompt.trim())) {
      alert("Please write a question prompt for all items.")
      return
    }

    setPublishing(true)
    try {
      const course = courses[0] // Link to first course by default
      const formattedQuestions = questions.map((q) => {
        const correctOpt = q.options.find((o) => o.correct)
        return {
          id: q.id,
          prompt: q.prompt,
          options: q.options.map((o) => ({ id: o.id, text: o.text || "Option" })),
          correctOptionId: correctOpt ? correctOpt.id : q.options[0]?.id || "",
        }
      })

      const newQuiz = {
        id: `quiz_${Date.now()}`,
        courseId: course.id,
        title: `${course.title} - Custom Quiz`,
        durationSeconds: 300,
        passingScore: 70,
        questions: formattedQuestions,
      }

      // 1. Write to database
      await dbService.saveQuiz(newQuiz)

      // 2. Add quiz lesson to course modules so student can click it
      const updatedModules = [...course.modules]
      if (updatedModules.length > 0) {
        const lastMod = updatedModules[updatedModules.length - 1]
        lastMod.lessons = [
          ...lastMod.lessons,
          {
            id: `l_${Date.now()}`,
            title: `Quiz Assessment`,
            duration: "10 min",
            type: "quiz" as const,
          },
        ]
      }
      
      const updatedCourse = {
        ...course,
        modules: updatedModules,
        totalLessons: course.totalLessons + 1,
      }

      await dbService.saveCourse(updatedCourse)

      // 3. Update application state
      setCourses((prev) => prev.map((c) => (c.id === course.id ? updatedCourse : c)))
      setQuizzes((prev) => [...prev, newQuiz])

      setPublishSuccess(true)
      setQuestions([
        {
          id: "dq1",
          prompt: "",
          options: [
            { id: "o1", text: "", correct: true },
            { id: "o2", text: "", correct: false },
          ],
        },
      ])
      setTimeout(() => setPublishSuccess(false), 3000)
    } catch (err) {
      console.error("Failed to publish quiz:", err)
      alert("Error publishing quiz: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setPublishing(false)
    }
  }

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
        {KPIS.map((k) => {
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
            {WEEKLY.map((v, i) => (
              <div key={DAYS[i]} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-primary/80 transition-all duration-500 hover:bg-primary"
                    style={{ height: `${(v / Math.max(...WEEKLY)) * 100}%` }}
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
            {courses.slice(0, 4).map((c) => {
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

      {/* Content builder */}
      <Card className="p-6">
        <h3 className="font-bold text-foreground">Course Content Builder</h3>
        <p className="text-sm text-muted-foreground">
          Upload resources directly to the first course ({courses[0]?.title || "N/A"}).
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300",
            dragging ? "border-primary bg-primary/10" : "border-border bg-muted/30",
          )}
        >
          <UploadCloud className={cn("h-10 w-10", dragging ? "text-primary" : "text-muted-foreground")} />
          <p className="mt-3 text-sm font-semibold text-foreground">
            Drag & drop files here
          </p>
          <p className="text-xs text-muted-foreground">MP4, PDF, DOCX, ZIP up to 500MB</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => handleDrop({ preventDefault() {}, dataTransfer: { files: [] } } as unknown as DragEvent)}
          >
            Simulate File Upload
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {f.type === "video" ? <FileVideo className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                </div>
                <span className="text-sm font-medium text-foreground">{f.name}</span>
                <Badge color="success">
                  <CheckCircle2 className="h-3 w-3" /> Syncing with Firestore
                </Badge>
              </div>
              <button
                onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                className="text-muted-foreground transition-colors hover:text-danger"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Quiz builder */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">Quiz Question Builder</h3>
            <p className="text-sm text-muted-foreground">Create multiple-choice questions.</p>
          </div>
          <Button size="sm" onClick={addQuestion}>
            <Plus className="h-4 w-4" />
            Add question
          </Button>
        </div>

        <div className="mt-4 space-y-4">
          {questions.map((q, qi) => (
            <div key={q.id} className="rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {qi + 1}
                </span>
                <input
                  value={q.prompt}
                  onChange={(e) => updateQuestion(q.id, e.target.value)}
                  placeholder="Enter your question..."
                  className="h-10 flex-1 rounded-xl border border-input bg-card px-3 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(q.id)}
                    className="text-muted-foreground transition-colors hover:text-danger"
                    aria-label="Remove question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 pl-9">
                {q.options.map((o) => (
                  <div key={o.id} className="flex items-center gap-2">
                    <button
                      onClick={() => setCorrect(q.id, o.id)}
                      className={cn(
                        "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        o.correct
                          ? "border-success bg-success text-white"
                          : "border-border text-transparent hover:border-success",
                      )}
                      aria-label="Mark correct answer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                    <input
                      value={o.text}
                      onChange={(e) => updateOption(q.id, o.id, e.target.value)}
                      placeholder="Answer option..."
                      className="h-9 flex-1 rounded-lg border border-input bg-card px-3 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                ))}
                <button
                  onClick={() => addOption(q.id)}
                  className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  Add option
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end items-center gap-3">
          {publishSuccess && (
            <span className="text-sm font-semibold text-success animate-fade-in">
              Quiz successfully published and synced!
            </span>
          )}
          <Button variant="success" onClick={handlePublishQuiz} disabled={publishing}>
            {publishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Publish Quiz
          </Button>
        </div>
      </Card>
    </div>
  )
}
