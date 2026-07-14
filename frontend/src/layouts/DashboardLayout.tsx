import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  Award,
  User as UserIcon,
  Search,
  Bell,
  LogOut,
  Zap,
  LineChart,
  Menu,
  X,
  Users,
  GraduationCap
} from "lucide-react"
import { useApp } from "@/store/AppContext"
import { signOut } from "@/services/authService"
import { cn } from "@/lib/utils"

const STUDENT_NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/apply-courses", label: "Apply Courses", icon: Search },
  { to: "/courses", label: "My Courses", icon: BookOpen },
  { to: "/quizzes", label: "Quizzes", icon: FileQuestion },
  { to: "/certificates", label: "Certificates", icon: Award },
  { to: "/profile", label: "Profile", icon: UserIcon },
]

const ADMIN_NAV = [
  { to: "/console", label: "Console", icon: LineChart },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/student-about", label: "Student About", icon: Users },
  { to: "/lectures-about", label: "Lectures About", icon: GraduationCap },
  { to: "/profile", label: "Profile", icon: UserIcon },
]

export default function DashboardLayout() {
  const { user, setUser, notifications, markAllRead } = useApp()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)

  const nav = user?.role === "admin" ? ADMIN_NAV : STUDENT_NAV
  const unread = notifications.filter((n) => n.unread).length

  async function handleLogout() {
    await signOut()
    setUser(null)
    navigate("/")
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-dark text-dark-foreground transition-transform duration-300 lg:translate-x-0",
          mobileNav ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" className="h-9 w-9 rounded-xl object-cover" alt="EduVantage Logo" />
            <span className="text-lg font-bold">EduVantage</span>
          </div>
          <button
            className="text-slate-400 lg:hidden"
            onClick={() => setMobileNav(false)}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                onClick={() => setMobileNav(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-slate-300 hover:bg-dark-muted hover:text-white",
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-dark-muted p-3">
            <img
              src={user?.avatar || "/avatars/student.png"}
              alt=""
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs capitalize text-slate-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-dark-muted hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {mobileNav && (
        <div
          className="fixed inset-0 z-30 bg-dark/50 lg:hidden"
          onClick={() => setMobileNav(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-md md:px-8">
          <button
            className="text-muted-foreground lg:hidden"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search courses, lessons, instructors..."
              className="h-10 w-full rounded-xl border border-input bg-muted/50 pl-10 pr-4 text-sm outline-none transition-all duration-300 focus:border-primary focus:bg-card focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen((o) => !o)
                  if (!notifOpen) markAllRead()
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute right-2 top-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-danger text-[9px] text-white" />
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 z-40 mt-2 w-80 origin-top-right animate-fade-in rounded-2xl border border-border bg-card p-2 shadow-xl">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-semibold">Notifications</span>
                      <span className="text-xs text-primary">{notifications.length}</span>
                    </div>
                    <div className="max-h-80 space-y-1 overflow-y-auto thin-scroll">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-foreground">{n.title}</p>
                            <span className="text-xs text-muted-foreground">{n.timeAgo}</span>
                          </div>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                            {n.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <img
              src={user?.avatar || "/avatars/student.png"}
              alt="Your avatar"
              className="h-10 w-10 rounded-xl border border-border object-cover"
            />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
