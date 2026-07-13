import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
  GraduationCap,
  Presentation,
  ShieldCheck,
  Mail,
  Lock,
  User as UserIcon,
  Loader2,
  CheckCircle2,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/Primitives"
import { useApp } from "@/store/AppContext"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "@/services/authService"
import type { UserRole } from "@/services/models"
import { cn } from "@/lib/utils"

const ROLES: { key: UserRole; label: string; icon: typeof GraduationCap }[] = [
  { key: "student", label: "Student", icon: GraduationCap },
  { key: "instructor", label: "Instructor", icon: Presentation },
  { key: "admin", label: "Admin", icon: ShieldCheck },
]

const HIGHLIGHTS = [
  "10,000+ concurrent learners",
  "Adaptive video streaming",
  "Verified certificates",
]

export default function AuthPage() {
  const navigate = useNavigate()
  const { setUser } = useApp()

  const [mode, setMode] = useState<"login" | "signup">("login")
  const [role, setRole] = useState<UserRole>("student")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("student@eduvantage.io")
  const [password, setPassword] = useState("password")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user =
        mode === "login"
          ? await signInWithEmailAndPassword(email, password, role)
          : await createUserWithEmailAndPassword(name, email, password, role)
      setUser(user)
      navigate(role === "student" ? "/dashboard" : "/console")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left banner */}
      <div className="relative hidden w-1/2 overflow-hidden bg-dark lg:block">
        <img
          src="/banners/auth-banner.png"
          alt="Abstract EdTech learning illustration"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dark/80 via-dark/60 to-primary/40" />
        <div className="relative flex h-full flex-col justify-between p-12 text-dark-foreground">
          <div className="flex items-center gap-2">
            <img src="/logo.png" className="h-10 w-10 rounded-xl object-cover" alt="EduVantage Logo" />
            <span className="text-xl font-bold">EduVantage</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-balance text-4xl font-bold leading-tight">
              Learn without limits, at cloud scale.
            </h1>
            <p className="mt-4 text-pretty leading-relaxed text-slate-300">
              A premium learning experience for students, instructors, and
              administrators — all in one beautifully designed platform.
            </p>
            <ul className="mt-8 space-y-3">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-slate-400">
            Trusted by learners in 120+ countries.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <img src="/logo.png" className="h-10 w-10 rounded-xl object-cover" alt="EduVantage Logo" />
            <span className="text-xl font-bold">EduVantage</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in to continue your learning journey."
              : "Join thousands of learners today."}
          </p>

          {/* Role selector */}
          <div className="mt-6">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              I am a
            </span>
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-muted p-1.5">
              {ROLES.map((r) => {
                const Icon = r.icon
                const active = role === r.key
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRole(r.key)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl py-3 text-xs font-semibold transition-all duration-300",
                      active
                        ? "bg-card text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {r.label}
                  </button>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <Field
                icon={UserIcon}
                type="text"
                placeholder="Full name"
                value={name}
                onChange={setName}
              />
            )}
            <Field
              icon={Mail}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={setEmail}
            />
            <Field
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
            />

            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "New to EduVantage?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login")
                setError(null)
              }}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  icon: typeof Mail
  type: string
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-input bg-card pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-ring/30"
      />
    </div>
  )
}
