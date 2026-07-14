import { useState, useEffect } from "react"
import { Mail, Shield, Save, Bell, Moon, Globe, Trash2, Upload } from "lucide-react"
import { Card, Badge, Button } from "@/components/ui/Primitives"
import { useApp } from "@/store/AppContext"

export default function ProfilePage() {
  const { user, setUser } = useApp()
  const [name, setName] = useState(user?.name ?? "")
  const [avatar, setAvatar] = useState(user?.avatar || "/avatars/student.png")
  const [bio, setBio] = useState(
    "Lifelong learner passionate about technology, design, and building useful things.",
  )
  const [saved, setSaved] = useState(false)

  const toggles = [
    { label: "Email notifications", icon: Bell },
    { label: "Dark mode", icon: Moon },
    { label: "Public profile", icon: Globe },
  ]

  const [switches, setSwitches] = useState(() => [
    true, // Email notifications
    document.documentElement.classList.contains("dark"), // Dark mode (read from DOM)
    true, // Public profile
  ])

  // Sync dark mode toggle state with document.documentElement.classList
  useEffect(() => {
    const isDark = switches[1]
    if (isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [switches])

  function save() {
    if (user) setUser({ ...user, name, avatar })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Profile & Settings</h1>

      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary to-indigo-400" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <div className="relative group shrink-0">
              <img
                src={avatar}
                alt="Your avatar"
                className="h-24 w-24 rounded-2xl border-4 border-card object-cover shadow-md transition-opacity group-hover:opacity-80"
              />
              <div className="absolute inset-0 rounded-2xl border-4 border-transparent bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                <label className="cursor-pointer p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors" title="Upload new photo">
                  <Upload className="h-4 w-4" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => setAvatar(e.target?.result as string)
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </label>
                <button 
                  onClick={() => setAvatar("/avatars/student.png")}
                  className="cursor-pointer p-1.5 hover:bg-destructive/80 hover:text-white rounded-lg text-white/80 transition-colors"
                  title="Remove photo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
              <div className="mt-1 flex items-center gap-2">
                <Badge color="primary">
                  <Shield className="h-3 w-3" />
                  <span className="capitalize">{user?.role}</span>
                </Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-[3fr_2fr]">
        <Card className="p-6">
          <h3 className="font-bold text-foreground">Edit details</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-card px-3.5 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <Button onClick={save}>
              <Save className="h-4 w-4" />
              {saved ? "Saved!" : "Save changes"}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-foreground">Preferences</h3>
          <div className="mt-4 space-y-1">
            {toggles.map((t, i) => {
              const Icon = t.icon
              return (
                <label
                  key={t.label}
                  className="flex items-center justify-between py-2.5 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {t.label}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={switches[i]}
                    onChange={() =>
                      setSwitches((s) => s.map((v, idx) => (idx === i ? !v : v)))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
                      switches[i] ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-transform duration-300 ${
                        switches[i] ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </label>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
