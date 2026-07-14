import { useState } from "react"
import { Users, CheckCircle2, XCircle, Trash2, PauseCircle } from "lucide-react"
import { Card, Badge, Button } from "@/components/ui/Primitives"

export default function StudentAboutPage() {
  const [registrations, setRegistrations] = useState([
    { id: "reg1", name: "Alice Johnson", email: "alice.j@example.com", date: "2 mins ago" },
    { id: "reg2", name: "David Smith", email: "david.s@example.com", date: "1 hour ago" },
  ])

  const [applications, setApplications] = useState([
    { id: "app1", name: "James Carter", course: "Advanced React & Frontend Architecture", date: "Yesterday" },
    { id: "app2", name: "Sophia Lee", course: "Cloud Computing & DevOps Essentials", date: "2 days ago" },
  ])

  const [students, setStudents] = useState([
    { id: "stu1", name: "Marcus Lee", status: "Active", courses: 2, avatar: "/avatars/student.png" },
    { id: "stu2", name: "Jessica Smith", status: "Active", courses: 1, avatar: "/avatars/student.png" },
    { id: "stu3", name: "Raj Patel", status: "On Hold", courses: 1, avatar: "/avatars/student.png" },
  ])

  function handleAcceptRegistration(id: string) {
    const user = registrations.find((r) => r.id === id)
    if (user) {
      setStudents([{ id: `stu_${Date.now()}`, name: user.name, status: "Active", courses: 0, avatar: "/avatars/student.png" }, ...students])
      setRegistrations(registrations.filter((r) => r.id !== id))
    }
  }

  function handleRejectRegistration(id: string) {
    setRegistrations(registrations.filter((r) => r.id !== id))
  }

  function handleAcceptApplication(id: string) {
    setApplications(applications.filter((a) => a.id !== id))
  }

  function handleRejectApplication(id: string) {
    setApplications(applications.filter((a) => a.id !== id))
  }

  function toggleStudentStatus(id: string) {
    setStudents(students.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "On Hold" : "Active" } : s))
  }

  function deleteStudent(id: string) {
    setStudents(students.filter(s => s.id !== id))
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Student About</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage student registrations, course applications, and active student profiles.
        </p>
      </div>

      {/* Student Request Panel */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">Student Requests</h3>
            <p className="text-sm text-muted-foreground">Pending registrations and course applications.</p>
          </div>
          <Badge color="warning" className="text-sm px-3 py-1">
            Pending: {registrations.length + applications.length}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* New Registrations */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">New Registrations</h4>
            {registrations.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No pending registrations.</p>
            ) : (
              registrations.map(reg => (
                <div key={reg.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 bg-muted/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-sm text-foreground">{reg.name}</h5>
                      <p className="text-xs text-muted-foreground">{reg.email}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{reg.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="success" className="w-full text-xs" onClick={() => handleAcceptRegistration(reg.id)}>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" className="w-full text-xs text-danger hover:bg-danger/10 hover:text-danger" onClick={() => handleRejectRegistration(reg.id)}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Course Applications */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">Course Applications</h4>
            {applications.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No pending applications.</p>
            ) : (
              applications.map(app => (
                <div key={app.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 bg-muted/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-sm text-foreground">{app.name}</h5>
                      <p className="text-xs text-primary font-medium mt-0.5 line-clamp-1" title={app.course}>{app.course}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{app.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="success" className="w-full text-xs" onClick={() => handleAcceptApplication(app.id)}>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="w-full text-xs text-danger hover:bg-danger/10 hover:text-danger" onClick={() => handleRejectApplication(app.id)}>
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Student About Us Panel */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">Student About Us</h3>
            <p className="text-sm text-muted-foreground">Manage active platform students.</p>
          </div>
          <Badge color="success" className="text-sm px-3 py-1">
            Total Enrolled: {students.length}
          </Badge>
        </div>

        <div className="space-y-3">
          {students.map(student => (
            <div key={student.id} className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-4">
                <img src={student.avatar} alt={student.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20" />
                <div>
                  <h4 className="font-medium text-sm text-foreground">{student.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{student.courses} Courses</Badge>
                    <span className={`text-[10px] font-semibold ${student.status === "Active" ? "text-success" : "text-warning"}`}>
                      • {student.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs text-warning hover:bg-warning/10 hover:text-warning" onClick={() => toggleStudentStatus(student.id)}>
                  <PauseCircle className="h-3.5 w-3.5 mr-1" /> {student.status === "Active" ? "Put On Hold" : "Re-Activate"}
                </Button>
                <Button size="sm" variant="outline" className="text-xs text-danger hover:bg-danger/10 hover:text-danger" onClick={() => deleteStudent(student.id)}>
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
