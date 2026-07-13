import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ShieldAlert,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  FileQuestion,
  ArrowRight,
} from "lucide-react"
import { Card, Badge, Button } from "@/components/ui/Primitives"
import { useApp } from "@/store/AppContext"
import type { QuizDoc, CourseDoc } from "@/services/models"
import { cn } from "@/lib/utils"

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, "0")}`
}

export default function QuizPage({ listMode = false }: { listMode?: boolean }) {
  const navigate = useNavigate()
  const { quizzes, courses } = useApp()
  const { quizId } = useParams()

  if (listMode) {
    return (
      <QuizList
        quizzes={quizzes}
        courses={courses}
        onStart={(id) => navigate(`/quiz/${id}`)}
      />
    )
  }

  const quiz = quizzes.find((q) => q.id === quizId)
  if (!quiz) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md p-8 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-warning" />
          <h1 className="mt-4 text-xl font-bold text-foreground">Quiz not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The requested assessment could not be located in the database.
          </p>
          <Button className="mt-6 w-full" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  return <QuizExam quiz={quiz} />
}

/* ---------------- Quiz List (dashboard view) ---------------- */

function QuizList({
  quizzes,
  courses,
  onStart,
}: {
  quizzes: QuizDoc[]
  courses: CourseDoc[]
  onStart: (id: string) => void
}) {
  const items = quizzes.map((q) => ({ ...q, status: "available" as const }))

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quizzes & Assessments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Test your knowledge and earn points toward your certificate.
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="p-8 text-center">
          <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">No quizzes available at the moment.</p>
        </Card>
      ) : (
        items.map((q) => {
          const course = courses.find((c) => c.id === q.courseId)
          return (
            <Card
              key={q.id}
              className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FileQuestion className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{q.title}</h3>
                  <p className="text-sm text-muted-foreground">{course?.title || "General Course"}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge color="muted">{q.questions.length} questions</Badge>
                    <Badge color="warning">
                      <Clock className="h-3 w-3" /> {Math.round(q.durationSeconds / 60)} min
                    </Badge>
                    <Badge color="success">Pass: {q.passingScore}%</Badge>
                  </div>
                </div>
              </div>
              <Button onClick={() => onStart(q.id)} size="lg" className="sm:w-auto">
                Start Quiz
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          )
        })
      )}
    </div>
  )
}

/* ---------------- Quiz Exam (full-screen) ---------------- */

function QuizExam({ quiz }: { quiz: QuizDoc }) {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [remaining, setRemaining] = useState(quiz.durationSeconds)
  const [submitted, setSubmitted] = useState(false)
  const [flashViolation, setFlashViolation] = useState(false)
  const timerRef = useRef<number | null>(null)

  // Reset quiz states if a new quiz is loaded
  useEffect(() => {
    setIndex(0)
    setAnswers({})
    setRemaining(quiz.durationSeconds)
    setSubmitted(false)
    setFlashViolation(false)
  }, [quiz])

  const question = quiz.questions[index]
  const answeredCount = Object.keys(answers).length

  // Countdown timer
  useEffect(() => {
    if (submitted) return
    timerRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(timerRef.current!)
          setSubmitted(true)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [submitted])

  // Anti-cheat simulation: detect tab switch + copy/paste
  useEffect(() => {
    if (submitted) return
    function onVisibility() {
      if (document.hidden) triggerViolation()
    }
    function onCopy(e: Event) {
      e.preventDefault()
      triggerViolation()
    }
    function triggerViolation() {
      setFlashViolation(true)
      window.setTimeout(() => setFlashViolation(false), 2500)
    }
    document.addEventListener("visibilitychange", onVisibility)
    document.addEventListener("copy", onCopy)
    document.addEventListener("paste", onCopy)
    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      document.removeEventListener("copy", onCopy)
      document.removeEventListener("paste", onCopy)
    }
  }, [submitted])

  const score = useMemo(() => {
    if (!submitted) return 0
    const correct = quiz.questions.filter((q) => answers[q.id] === q.correctOptionId).length
    return Math.round((correct / quiz.questions.length) * 100)
  }, [submitted, answers, quiz.questions])

  const timeColor =
    remaining <= 30
      ? "text-danger bg-danger/10 border-danger"
      : remaining <= 60
        ? "text-warning bg-warning/10 border-warning"
        : "text-primary bg-primary/10 border-primary/30"

  if (submitted) {
    const passed = score >= quiz.passingScore
    const correctCount = quiz.questions.filter((q) => answers[q.id] === q.correctOptionId).length
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-lg p-8 text-center animate-fade-in">
          <div
            className={cn(
              "mx-auto flex h-20 w-20 items-center justify-center rounded-full",
              passed ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
            )}
          >
            {passed ? <Trophy className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
          </div>
          <h1 className="mt-5 text-2xl font-bold text-foreground">
            {passed ? "Congratulations!" : "Keep practicing"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            You scored {score}% ({correctCount}/{quiz.questions.length} correct)
          </p>

          <div className="my-6 h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all duration-700", passed ? "bg-success" : "bg-danger")}
              style={{ width: `${score}%` }}
            />
          </div>

          {/* Answer review */}
          <div className="max-h-52 space-y-2 overflow-y-auto thin-scroll text-left">
            {quiz.questions.map((q, i) => {
              const correct = answers[q.id] === q.correctOptionId
              return (
                <div key={q.id} className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                  {correct ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-danger" />
                  )}
                  <span className="text-sm text-foreground">
                    Q{i + 1}: {q.prompt}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setAnswers({})
                setIndex(0)
                setRemaining(quiz.durationSeconds)
                setSubmitted(false)
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Retake
            </Button>
            <Button className="flex-1" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Slim exam header */}
      <header className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-foreground">{quiz.title}</h1>
            <p className="text-xs text-muted-foreground">
              Question {index + 1} of {quiz.questions.length}
            </p>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2 font-bold tabular-nums transition-colors duration-300",
              timeColor,
            )}
          >
            <Clock className="h-4 w-4" />
            {formatTime(remaining)}
          </div>
        </div>
        {/* Progress */}
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((index + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Anti-cheat badge */}
      <div
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold transition-colors duration-300",
          flashViolation ? "bg-danger text-white" : "bg-dark text-slate-300",
        )}
      >
        <ShieldAlert className="h-4 w-4" />
        {flashViolation
          ? "Violation detected! This action has been logged."
          : "Tab Switching / Copy-Paste Monitoring Active"}
      </div>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {question ? (
          <Card className="p-6 md:p-8 animate-fade-in">
            <span className="text-sm font-semibold text-primary">
              Question {index + 1}
            </span>
            <h2 className="mt-2 text-balance text-xl font-bold text-foreground">
              {question.prompt}
            </h2>

            <div className="mt-6 space-y-3">
              {question.options.map((opt) => {
                const selected = answers[question.id] === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAnswers((a) => ({ ...a, [question.id]: opt.id }))}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-300",
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold uppercase transition-colors",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      {opt.id}
                    </span>
                    <span className="text-sm font-medium text-foreground">{opt.text}</span>
                  </button>
                )
              })}
            </div>
          </Card>
        ) : (
          <Card className="p-6 text-center text-muted-foreground">
            No questions available.
          </Card>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            {answeredCount}/{quiz.questions.length} answered
          </span>

          {index < quiz.questions.length - 1 ? (
            <Button onClick={() => setIndex((i) => i + 1)}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="success" onClick={() => setSubmitted(true)}>
              Submit Quiz
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
