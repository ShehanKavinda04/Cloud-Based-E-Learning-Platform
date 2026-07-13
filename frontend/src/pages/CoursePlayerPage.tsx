import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  FileText,
  MessagesSquare,
  Download,
  FileArchive,
  Send,
} from "lucide-react"
import { Card, Badge } from "@/components/ui/Primitives"
import { VideoPlayer } from "@/components/VideoPlayer"
import { CurriculumAccordion } from "@/components/CurriculumAccordion"
import { useApp } from "@/store/AppContext"
import type { Lesson } from "@/services/models"
import { cn } from "@/lib/utils"

type Tab = "overview" | "resources" | "forum"

export default function CoursePlayerPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { toggleLesson, progress, courseProgressPct, courses, quizzes } = useApp()

  const course = useMemo(() => courses.find((c) => c.id === courseId), [courseId, courses])

  const firstLesson = course?.modules[0]?.lessons[0]
  const [activeLesson, setActiveLesson] = useState<Lesson | undefined>(firstLesson)
  const [tab, setTab] = useState<Tab>("overview")

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <p className="text-muted-foreground">Course not found.</p>
        <button onClick={() => navigate("/courses")} className="mt-4 font-semibold text-primary">
          Back to courses
        </button>
      </div>
    )
  }

  const completed = progress[course.id] ?? []
  const pct = courseProgressPct(course.id)

  const tabs: { key: Tab; label: string; icon: typeof FileText }[] = [
    { key: "overview", label: "Lesson Overview", icon: FileText },
    { key: "resources", label: "Resources", icon: Download },
    { key: "forum", label: "Q&A Forum", icon: MessagesSquare },
  ]

  return (
    <div className="mx-auto max-w-7xl animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-6 lg:grid-cols-[7fr_3fr]">
        {/* Left: player + tabs */}
        <div className="space-y-5">
          <VideoPlayer title={activeLesson?.title ?? course.title} />

          <div>
            <div className="flex items-center gap-2">
              <Badge color="primary">{course.level}</Badge>
              <span className="text-sm text-muted-foreground">{course.category}</span>
            </div>
            <h1 className="mt-2 text-balance text-2xl font-bold text-foreground">
              {activeLesson?.title ?? course.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {course.title} &middot; by {course.instructor}
            </p>
          </div>

          {/* Tabs */}
          <Card className="overflow-hidden">
            <div className="flex border-b border-border">
              {tabs.map((t) => {
                const Icon = t.icon
                const active = tab === t.key
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-all duration-300",
                      active
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="p-6">
              {tab === "overview" && <OverviewTab description={course.description} />}
              {tab === "resources" && <ResourcesTab resources={course.resources} />}
              {tab === "forum" && <ForumTab forum={course.forum} />}
            </div>
          </Card>
        </div>

        {/* Right: curriculum */}
        <div>
          <Card className="sticky top-20 overflow-hidden">
            <div className="border-b border-border bg-muted/40 p-5">
              <h2 className="font-bold text-foreground">Course Curriculum</h2>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {completed.length} / {course.modules.reduce((s, m) => s + m.lessons.length, 0)} lessons
                </span>
                <span className="font-semibold text-primary">{pct}% complete</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-success transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto thin-scroll p-3">
              <CurriculumAccordion
                modules={course.modules}
                completedIds={completed}
                activeLessonId={activeLesson?.id}
                onToggleComplete={(lessonId) => toggleLesson(course.id, lessonId)}
                onSelectLesson={(lesson) => {
                  if (lesson.type === "quiz") {
                    const matchedQuiz = quizzes.find((q) => q.courseId === course.id)
                    navigate(matchedQuiz ? `/quiz/${matchedQuiz.id}` : "/quiz/react-final")
                  } else {
                    setActiveLesson(lesson)
                    setTab("overview")
                  }
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ description }: { description: string }) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
      <p>{description}</p>
      <p>
        In this lesson you&apos;ll follow along with hands-on examples. Use the curriculum
        panel to mark lessons complete as you progress — your completion syncs instantly to
        your overall learning path.
      </p>
      <div>
        <h4 className="mb-2 font-semibold text-foreground">What you&apos;ll learn</h4>
        <ul className="space-y-2">
          {["Core concepts explained with real examples", "Best practices from industry experts", "Downloadable resources to practice"].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ResourcesTab({
  resources,
}: {
  resources: { id: string; name: string; size: string; type: string }[]
}) {
  if (resources.length === 0) {
    return <p className="text-sm text-muted-foreground">No resources for this lesson.</p>
  }
  return (
    <div className="space-y-2">
      {resources.map((r) => (
        <div
          key={r.id}
          className="flex items-center justify-between rounded-xl border border-border p-3 transition-all duration-300 hover:border-primary hover:bg-muted/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-primary">
              {r.type === "zip" ? <FileArchive className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{r.name}</p>
              <p className="text-xs text-muted-foreground uppercase">
                {r.type} &middot; {r.size}
              </p>
            </div>
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
            <Download className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

function ForumTab({
  forum,
}: {
  forum: { id: string; author: string; avatar: string; message: string; timeAgo: string; replies: number }[]
}) {
  const [posts, setPosts] = useState(forum)
  const [draft, setDraft] = useState("")

  function submit() {
    if (!draft.trim()) return
    setPosts((prev) => [
      {
        id: `f_${Date.now()}`,
        author: "You",
        avatar: "/avatars/student.png",
        message: draft.trim(),
        timeAgo: "just now",
        replies: 0,
      },
      ...prev,
    ])
    setDraft("")
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <img src="/avatars/student.png" alt="" className="h-9 w-9 rounded-full object-cover" />
        <div className="flex-1">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask a question or share your thoughts..."
            rows={2}
            className="w-full resize-none rounded-xl border border-input bg-muted/40 px-3 py-2 text-sm outline-none transition-all duration-300 focus:border-primary focus:bg-card focus:ring-2 focus:ring-ring/30"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={submit}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-indigo-700"
            >
              <Send className="h-4 w-4" />
              Post
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {posts.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No questions yet. Be the first to start the conversation!
          </p>
        )}
        {posts.map((p) => (
          <div key={p.id} className="flex gap-3 rounded-xl border border-border p-4">
            <img src={p.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{p.author}</span>
                <span className="text-xs text-muted-foreground">{p.timeAgo}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.message}</p>
              <button className="mt-2 text-xs font-semibold text-primary hover:underline">
                {p.replies} replies
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
