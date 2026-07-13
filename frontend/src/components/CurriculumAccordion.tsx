import { useState } from "react"
import { ChevronDown, CheckCircle2, Circle, PlayCircle, FileText, FileQuestion } from "lucide-react"
import type { Lesson, Module } from "@/services/models"
import { cn } from "@/lib/utils"

const TYPE_ICON = {
  video: PlayCircle,
  reading: FileText,
  quiz: FileQuestion,
}

export function CurriculumAccordion({
  modules,
  completedIds,
  activeLessonId,
  onToggleComplete,
  onSelectLesson,
}: {
  modules: Module[]
  completedIds: string[]
  activeLessonId?: string
  onToggleComplete: (lessonId: string) => void
  onSelectLesson: (lesson: Lesson) => void
}) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(modules.map((m, i) => [m.id, i === 0])),
  )

  return (
    <div className="space-y-2">
      {modules.map((mod, idx) => {
        const isOpen = open[mod.id]
        const modDone = mod.lessons.filter((l) => completedIds.includes(l.id)).length
        return (
          <div key={mod.id} className="overflow-hidden rounded-xl border border-border">
            <button
              onClick={() => setOpen((o) => ({ ...o, [mod.id]: !o[mod.id] }))}
              className="flex w-full items-center justify-between gap-2 bg-muted/40 px-4 py-3 text-left transition-colors hover:bg-muted"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Module {idx + 1}</p>
                <p className="truncate text-sm font-semibold text-foreground">{mod.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {modDone}/{mod.lessons.length}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </div>
            </button>

            {isOpen && (
              <div className="divide-y divide-border">
                {mod.lessons.map((lesson) => {
                  const done = completedIds.includes(lesson.id)
                  const active = activeLessonId === lesson.id
                  const Icon = TYPE_ICON[lesson.type]
                  return (
                    <div
                      key={lesson.id}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 transition-colors",
                        active ? "bg-primary/10" : "hover:bg-muted/40",
                      )}
                    >
                      <button
                        onClick={() => onToggleComplete(lesson.id)}
                        aria-label={done ? "Mark incomplete" : "Mark complete"}
                        className="flex-shrink-0"
                      >
                        {done ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={() => onSelectLesson(lesson)}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 flex-shrink-0",
                            active ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        <span
                          className={cn(
                            "truncate text-sm",
                            active ? "font-semibold text-primary" : "text-foreground",
                          )}
                        >
                          {lesson.title}
                        </span>
                      </button>
                      <span className="flex-shrink-0 text-xs text-muted-foreground">
                        {lesson.duration}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
