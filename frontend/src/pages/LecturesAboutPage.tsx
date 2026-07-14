import { useState } from "react"
import { CheckCircle2, XCircle, Trash2, PauseCircle, GraduationCap } from "lucide-react"
import { Card, Badge, Button } from "@/components/ui/Primitives"

export default function LecturesAboutPage() {
  const [applicants, setApplicants] = useState([
    { id: "app1", name: "Dr. William Roberts", field: "Computer Science", email: "william.r@edu.org", date: "3 hours ago" },
    { id: "app2", name: "Emily Chen", field: "Data Science & AI", email: "echen@edu.org", date: "1 day ago" },
  ])

  const [lecturers, setLecturers] = useState([
    { id: "lec1", name: "Dr. Sarah Jenkins", status: "Active", courses: 3, avatar: "/avatars/instructor.png" },
    { id: "lec2", name: "Prof. Michael Chen", status: "Active", courses: 2, avatar: "/avatars/instructor.png" },
    { id: "lec3", name: "Elena Rodriguez", status: "On Hold", courses: 1, avatar: "/avatars/instructor.png" },
  ])

  function handleAcceptApplicant(id: string) {
    const app = applicants.find(a => a.id === id)
    if (app) {
      setLecturers([{ id: `lec_${Date.now()}`, name: app.name, status: "Active", courses: 0, avatar: "/avatars/instructor.png" }, ...lecturers])
      setApplicants(applicants.filter(a => a.id !== id))
    }
  }

  function handleRejectApplicant(id: string) {
    setApplicants(applicants.filter(a => a.id !== id))
  }

  function toggleLecturerStatus(id: string) {
    setLecturers(lecturers.map(l => l.id === id ? { ...l, status: l.status === "Active" ? "On Hold" : "Active" } : l))
  }

  function deleteLecturer(id: string) {
    setLecturers(lecturers.filter(l => l.id !== id))
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lectures About</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage lecturer applications and active teaching staff.
        </p>
      </div>

      {/* Applicants Panel */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">Lecturer Applicants</h3>
            <p className="text-sm text-muted-foreground">Pending teaching staff registrations.</p>
          </div>
          <Badge color="warning" className="text-sm px-3 py-1">
            Pending: {applicants.length}
          </Badge>
        </div>

        <div className="space-y-4">
          {applicants.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No pending applicants.</p>
          ) : (
            applicants.map(app => (
              <div key={app.id} className="flex items-center justify-between rounded-xl border border-border p-4 bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-sm text-foreground">{app.name}</h5>
                      <span className="text-[10px] text-muted-foreground">{app.date}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-primary font-medium">{app.field}</span>
                      <span className="text-xs text-muted-foreground">{app.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="success" className="text-xs" onClick={() => handleAcceptApplicant(app.id)}>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs text-danger hover:bg-danger/10 hover:text-danger" onClick={() => handleRejectApplicant(app.id)}>
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Lecturers Info Panel */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">Lecturers Info</h3>
            <p className="text-sm text-muted-foreground">Manage active teaching staff.</p>
          </div>
          <Badge color="primary" className="text-sm px-3 py-1">
            Total Staff: {lecturers.length}
          </Badge>
        </div>

        <div className="space-y-3">
          {lecturers.map(lecturer => (
            <div key={lecturer.id} className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-4">
                <img src={lecturer.avatar} alt={lecturer.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20" />
                <div>
                  <h4 className="font-medium text-sm text-foreground">{lecturer.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{lecturer.courses} Courses</Badge>
                    <span className={`text-[10px] font-semibold ${lecturer.status === "Active" ? "text-success" : "text-warning"}`}>
                      • {lecturer.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs text-warning hover:bg-warning/10 hover:text-warning" onClick={() => toggleLecturerStatus(lecturer.id)}>
                  <PauseCircle className="h-3.5 w-3.5 mr-1" /> {lecturer.status === "Active" ? "Put On Hold" : "Re-Activate"}
                </Button>
                <Button size="sm" variant="outline" className="text-xs text-danger hover:bg-danger/10 hover:text-danger" onClick={() => deleteLecturer(lecturer.id)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
