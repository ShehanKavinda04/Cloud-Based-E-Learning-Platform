import { useLocation, useNavigate, Navigate } from "react-router-dom"
import { useApp } from "@/store/AppContext"
import { 
  PlaySquare, FileQuestion, FileText, Award, CheckCircle2, XCircle, 
  ChevronLeft, Play, Download, Lock
} from "lucide-react"
import { Button, Badge, Card } from "@/components/ui/Primitives"

export default function AdminCourseReviewPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const course = location.state?.course
  const { publishAdminCourse, rejectAdminCourse, addNotification } = useApp()
  const [activeTab, setActiveTab] = useState("videos")
  const [publishing, setPublishing] = useState(false)
  const [toast, setToast] = useState<{message: string, courseName: string, courseId: string} | null>(null)

  if (!course) {
    return <Navigate to="/courses" replace />
  }

  const handleApprove = async () => {
    setPublishing(true)
    await publishAdminCourse(course)

    addNotification({
      title: "Course Published",
      body: `Your course has been successfully published. Thank you.`,
      timeAgo: "Just now",
      unread: true
    })

    setToast({
      message: "Successfully Published",
      courseName: course.title,
      courseId: course.id
    })

    setTimeout(() => {
      setToast(null)
      setPublishing(false)
      navigate("/courses")
    }, 3000)
  }

  const handleReject = () => {
    rejectAdminCourse(course.id)
    navigate("/courses")
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="primary">{course.category}</Badge>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">Review Mode</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-foreground">{course.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            disabled={publishing}
            className="border-danger/30 text-danger hover:bg-danger/10 hover:text-danger shadow-sm disabled:opacity-50" 
            onClick={handleReject}
          >
            <XCircle className="mr-2 h-4 w-4" /> Reject
          </Button>
          <Button 
            variant="success" 
            disabled={publishing}
            className="shadow-lg shadow-success/20 hover:shadow-success/30 transition-shadow disabled:opacity-90 disabled:pointer-events-none" 
            onClick={handleApprove}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" /> 
            {publishing ? "Published" : "Approve & Publish"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Nav */}
        <Card className="p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto thin-scroll shadow-sm">
          <button 
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "videos" ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-muted"}`}
          >
            <PlaySquare className="h-5 w-5 shrink-0" /> 
            <span>Videos ({course.videos})</span>
          </button>
          <button 
            onClick={() => setActiveTab("quizzes")}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "quizzes" ? "bg-warning text-white shadow-md shadow-warning/20" : "text-muted-foreground hover:bg-muted"}`}
          >
            <FileQuestion className="h-5 w-5 shrink-0" /> 
            <span>Quizzes ({course.quizzes})</span>
          </button>
          <button 
            onClick={() => setActiveTab("papers")}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "papers" ? "bg-success text-white shadow-md shadow-success/20" : "text-muted-foreground hover:bg-muted"}`}
          >
            <FileText className="h-5 w-5 shrink-0" /> 
            <span>Past Papers ({course.papers})</span>
          </button>
          <button 
            onClick={() => setActiveTab("certificate")}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "certificate" ? "bg-purple-500 text-white shadow-md shadow-purple-500/20" : "text-muted-foreground hover:bg-muted"}`}
          >
            <Award className="h-5 w-5 shrink-0" /> 
            <span>Certificate Preview</span>
          </button>
        </Card>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === "videos" && (
            <Card className="overflow-hidden border-border bg-card shadow-sm">
              <div className="aspect-video w-full bg-black relative group">
                <img src={course.image} alt="Video Preview" className="h-full w-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-[0_0_30px_rgba(var(--color-primary),0.5)] backdrop-blur-sm transition-transform hover:scale-110">
                    <Play className="ml-1 h-8 w-8" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                  <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/3"></div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-white/80 text-xs font-medium">
                    <span>02:14 / 15:30</span>
                    <span>HD • Module 1</span>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-foreground">Module 1: Introduction to {course.category}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-3xl">
                  Reviewing the visual and audio quality of this lecture. The instructor should clearly articulate the fundamentals of the curriculum before diving into advanced topics. Ensure resolution is at least 1080p and audio is noise-free.
                </p>
                
                <h4 className="mt-8 mb-4 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Playlist Queue</h4>
                <div className="space-y-3">
                  {course.curriculum.map((item: string, i: number) => (
                    <div key={i} className={`flex items-center gap-4 rounded-xl border p-3.5 transition-colors ${i === 0 ? "border-primary/50 bg-primary/5 shadow-sm" : "border-border bg-muted/20 hover:bg-muted/50"}`}>
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${i === 0 ? "bg-primary text-white shadow-md shadow-primary/30" : "bg-muted text-muted-foreground border border-border/50"}`}>
                        {i === 0 ? <Play className="h-4 w-4 ml-0.5" /> : <Lock className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${i === 0 ? "text-primary" : "text-foreground"}`}>{item}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Video Lesson • 15 mins</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {activeTab === "quizzes" && (
            <div className="space-y-4">
              <Card className="p-6 md:p-8">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <FileQuestion className="h-6 w-6 text-warning" /> Quiz Verification
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Ensure the questions and answers strictly align with the curriculum.</p>
                  </div>
                  <Badge color="warning" className="w-fit text-sm px-3 py-1 shadow-sm">1 of {course.quizzes} Quizzes</Badge>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-muted/20 p-5 rounded-2xl border border-border/50">
                    <p className="font-semibold text-foreground mb-4 text-base"><span className="text-warning mr-2 font-bold">Q1.</span> Which of the following is a core concept taught in {course.curriculum[0]}?</p>
                    <div className="space-y-3 ml-2 md:ml-8">
                      <div className="rounded-xl border-2 border-success bg-success/5 p-4 flex items-center gap-3 text-sm font-semibold text-success shadow-sm">
                        <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                        The correct answer specific to this module that passes verification.
                      </div>
                      <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:border-muted-foreground/30">
                        <div className="h-5 w-5 shrink-0 rounded-full border-2 border-muted" />
                        An incorrect distractor answer designed to test comprehension.
                      </div>
                      <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:border-muted-foreground/30">
                        <div className="h-5 w-5 shrink-0 rounded-full border-2 border-muted" />
                        Another heavily related but incorrect concept commonly misunderstood.
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "papers" && (
            <Card className="p-6 md:p-8">
               <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <FileText className="h-6 w-6 text-success" /> Past Papers & Resources
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Verify the supplementary reading materials for typos or plagiarism.</p>
                  </div>
                  <Badge color="success" className="w-fit text-sm px-3 py-1 shadow-sm">{course.papers} Documents</Badge>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="group flex items-center justify-between rounded-2xl border border-border bg-muted/20 p-5 transition-all hover:bg-card hover:shadow-md hover:border-success/30 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success transition-transform group-hover:scale-110">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">Assignment_{num}_Brief.pdf</p>
                          <p className="text-xs text-muted-foreground mt-0.5">2.4 MB • PDF Document</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-10 w-10 shrink-0 p-0 rounded-full text-muted-foreground hover:text-success hover:bg-success/10">
                        <Download className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
            </Card>
          )}

          {activeTab === "certificate" && (
            <Card className="p-6 md:p-8">
              <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Award className="h-6 w-6 text-purple-500" /> Certificate Standard Review
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Verify the certificate template meets platform requirements before publishing.</p>
                  </div>
                  <Badge color="primary" className="w-fit text-sm px-3 py-1 shadow-sm">Official Template</Badge>
              </div>

              <div className="relative overflow-hidden rounded-3xl border-[12px] border-muted bg-card p-8 md:p-14 text-center shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                
                <Award className="mx-auto h-24 w-24 text-primary mb-6 drop-shadow-md" />
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-[0.3em] text-foreground opacity-10 mb-8">EduVantage</h2>
                
                <h3 className="text-3xl md:text-5xl font-serif text-foreground mb-6">Certificate of Completion</h3>
                <p className="text-muted-foreground mb-10 text-lg md:text-xl font-medium">This verifies that a student has successfully completed the course</p>
                
                <h4 className="text-2xl md:text-4xl font-bold text-primary mb-12 underline decoration-primary/20 underline-offset-[12px]">
                  {course.title}
                </h4>

                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mt-16 px-4 md:px-12 border-t-2 border-border/60 pt-10 gap-8">
                  <div className="text-center w-full md:w-auto order-2 md:order-1">
                    <p className="font-bold text-foreground text-xl signature-font">{course.instructor}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">Course Instructor</p>
                  </div>
                  <div className="h-32 w-32 shrink-0 rounded-full border-4 border-purple-500/20 bg-purple-500/5 flex items-center justify-center relative order-1 md:order-2 shadow-inner">
                    <Award className="h-12 w-12 text-purple-500 drop-shadow-md" />
                    <svg className="absolute inset-0 h-full w-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-500/40 stroke-dasharray-[12,8]" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Success Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-start gap-4 rounded-xl border border-success/30 bg-success/10 p-4 shadow-lg backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-white shadow-sm">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-success">{toast.message}</p>
              <p className="mt-1 text-sm text-foreground">{toast.courseName}</p>
              <p className="text-xs font-medium text-muted-foreground mt-0.5 uppercase tracking-wider">ID: {toast.courseId}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
