import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import { useCallback, useMemo, useState } from "react"
import { useFlows } from "@/hooks/useFlows"
import { IquineLogo } from "@/components/IquineLogo"
import { Settings, Clock } from "lucide-react"
import { isFlowAvailable } from "@/types"
import logoIquine from "@/assets/logo-iquine.png"
import { motion, AnimatePresence } from "framer-motion"

export const Route = createFileRoute("/")({
  component: Welcome,
  head: () => ({
    meta: [
      { title: "Iquine — Encontre Sua Cor" },
      { name: "description", content: "Encontre a cor perfeita para o seu ambiente." },
    ],
  }),
})

function Welcome() {
  const { flows, ready } = useFlows()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [transitioning, setTransitioning] = useState(false)

  const handleStart = useCallback(() => {
    setTransitioning(true)
    // After animation completes, switch to q1
    setTimeout(() => {
      setTransitioning(false)
    }, 1200)
  }, [])

  const availableFlow = useMemo(
    () => flows.find((f) => isFlowAvailable(f)),
    [flows],
  )

  const start = () => {
    if (!name.trim()) { setError("Digite seu nome para começar"); return }
    if (!availableFlow) return
    sessionStorage.setItem("iquine_user_name", name.trim())
    navigate({ to: "/quiz/$flowId", params: { flowId: availableFlow.id } })
  }

  // Unavailable screen
  if (ready && !availableFlow) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-iquine-red text-white">
        <Link to="/admin" className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs backdrop-blur transition hover:bg-white/20">
          <Settings className="h-3.5 w-3.5" /> Admin
        </Link>
        <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 py-10 text-center">
          <IquineLogo variant="white" />
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur">
            <Clock className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Quiz indisponível<br />
            <em className="not-italic font-light">no momento</em>
          </h1>
          <p className="max-w-xs text-sm text-white/80">
            Nenhum quiz está disponível agora. Volte em breve para descobrir as cores perfeitas para o seu ambiente.
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/60">Iquine Tintas</p>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-iquine-red text-white">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.4), transparent 40%)",
      }} />

      <Link to="/admin" className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs backdrop-blur transition hover:bg-white/20">
        <Settings className="h-3.5 w-3.5" /> Admin
      </Link>

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 py-10">
        <motion.img
          src={logoIquine}
          alt="Iquine"
          animate={
            transitioning
              ? { width: 112, y: -(window.innerHeight / 2 - 32 - 56) }
              : { width: 192, y: 0 }
          }
          transition={{ duration: 0.6, delay: transitioning ? 0.3 : 0, ease: "easeInOut" }}
        />
        <div className="flex w-full flex-col items-center gap-8 text-center animate-[fade-in_0.6s_ease-out]">
          <h1 className="text-5xl font-black text-white leading-tight">
            Encontre<br />sua cor
          </h1>

          <div className="w-full space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError("") }}
              onKeyDown={(e) => { if (e.key === "Enter") start() }}
              placeholder="Digite seu nome"
              className="w-64 rounded-full bg-white/90 px-6 py-4 text-center text-base font-medium text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/60"
            />
            {error && <p className="text-xs text-white/90">{error}</p>}
          </div>

          <button
            onClick={start}
            disabled={!ready || !availableFlow}
            className="rounded-full bg-white px-16 py-5 text-xl font-bold text-gray-800 shadow-xl transition hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            INICIAR
          </button>
        </div>
      </div>
    </main>
  )
}
