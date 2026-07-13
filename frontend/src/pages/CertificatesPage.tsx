import { Award, Download, Share2, CheckCircle2 } from "lucide-react"
import { Card, Badge, Button } from "@/components/ui/Primitives"
import { useApp } from "@/store/AppContext"

export default function CertificatesPage() {
  const { user, courseProgressPct, courses } = useApp()

  const certs = courses.map((c) => ({
    course: c,
    pct: courseProgressPct(c.id),
  }))

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Certificates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete a course to unlock its verified certificate.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {certs.map(({ course, pct }) => {
          const unlocked = pct === 100
          return (
            <Card key={course.id} className="overflow-hidden">
              <div className="relative border-b border-border bg-gradient-to-br from-dark to-dark-muted p-6 text-dark-foreground">
                <div className="flex items-start justify-between">
                  <Award className={unlocked ? "h-10 w-10 text-warning" : "h-10 w-10 text-slate-600"} />
                  {unlocked ? (
                    <Badge color="success">
                      <CheckCircle2 className="h-3 w-3" /> Earned
                    </Badge>
                  ) : (
                    <Badge color="muted">{pct}% complete</Badge>
                  )}
                </div>
                <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">
                  Certificate of Completion
                </p>
                <h3 className="text-balance text-lg font-bold">{course.title}</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Awarded to <span className="font-semibold text-white">{user?.name}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 p-4">
                <Button variant="primary" size="sm" disabled={!unlocked} className="flex-1">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" disabled={!unlocked}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
