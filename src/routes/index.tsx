import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useFlows } from "@/hooks/useFlows";
import { IquineLogo } from "@/components/IquineLogo";
import { Settings, Clock } from "lucide-react";
import { isFlowAvailable } from "@/types";

export const Route = createFileRoute("/")({
  component: Welcome,
  head: () => ({
    meta: [
      { title: "Iquine — Encontre Sua Cor" },
      { name: "description", content: "Encontre a cor perfeita para o seu ambiente." },
    ],
  }),
});

function Welcome() {
  const { flows, ready } = useFlows();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const availableFlow = useMemo(
    () => flows.find((f) => isFlowAvailable(f)),
    [flows],
  );

  const start = () => {
    if (!name.trim()) { setError("Digite seu nome para começar"); return; }
    if (!availableFlow) return;
    sessionStorage.setItem("iquine_user_name", name.trim());
    navigate({ to: "/quiz/$flowId", params: { flowId: availableFlow.id } });
  };

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
            Quiz indisponível<br/>
            <em className="not-italic font-light">no momento</em>
          </h1>
          <p className="max-w-xs text-sm text-white/80">
            Nenhum quiz está disponível agora. Volte em breve para descobrir as cores perfeitas para o seu ambiente.
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/60">Iquine Tintas</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-iquine-red text-white">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.4), transparent 40%)",
      }} />

      <Link to="/admin" className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs backdrop-blur transition hover:bg-white/20">
        <Settings className="h-3.5 w-3.5" /> Admin
      </Link>

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-between px-6 py-10">
        <IquineLogo variant="white" className="mt-2" />

        <div className="flex w-full flex-col items-center gap-8 text-center animate-[fade-in_0.6s_ease-out]">
          <h1 className="font-serif text-6xl font-bold leading-[0.95] sm:text-7xl">
            Encontre<br/><em className="not-italic font-light">sua cor</em>
          </h1>
          <p className="max-w-xs text-sm text-white/80">
            Um quiz rápido para descobrir as cores perfeitas para o seu ambiente.
          </p>

          <div className="w-full space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") start(); }}
              placeholder="Digite seu nome"
              className="w-full rounded-full border border-white/30 bg-white/10 px-6 py-4 text-center text-white placeholder:text-white/60 backdrop-blur outline-none focus:border-white"
            />
            {error && <p className="text-xs text-white/90">{error}</p>}
          </div>

          <button
            onClick={start}
            disabled={!ready || !availableFlow}
            className="w-full rounded-full bg-white px-8 py-4 font-semibold tracking-wide text-iquine-red transition hover:bg-white/90 disabled:opacity-50"
          >
            INICIAR
          </button>
        </div>

        <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Iquine Tintas</p>
      </div>
    </main>
  );
}
