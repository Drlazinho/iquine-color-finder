import { createFileRoute, Link } from "@tanstack/react-router";
import { useFlows } from "@/hooks/useFlows";
import { IquineLogo } from "@/components/IquineLogo";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/quiz/$flowId/result")({
  component: Result,
});

const MOCK_COLORS = [
  { name: "Terracota Suave", hex: "#C97B5E" },
  { name: "Branco Neve", hex: "#F5F2EC" },
  { name: "Cinza Urbano", hex: "#7A7A7A" },
  { name: "Verde Sálvia", hex: "#9CA98A" },
  { name: "Azul Profundo", hex: "#2E4057" },
];

function Result() {
  const { flowId } = Route.useParams();
  const { getFlow, ready } = useFlows();
  const flow = useMemo(() => (ready ? getFlow(flowId) : undefined), [ready, flowId, getFlow]);
  const [name, setName] = useState("");

  useEffect(() => {
    setName(sessionStorage.getItem("iquine_user_name") || "");
  }, []);

  const modeLabel = flow?.colorMode.type === "ano" ? "Cores do Ano" : "Todas as Cores do Catálogo";

  return (
    <main className="min-h-screen bg-iquine-cream">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
        <div className="flex justify-center"><IquineLogo variant="red" /></div>

        <div className="mt-10 flex-1 animate-[slide-up_0.6s_cubic-bezier(0.22,1,0.36,1)]">
          <p className="text-xs uppercase tracking-[0.3em] text-iquine-red">Sua paleta</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Sua cor ideal foi encontrada{name ? `, ${name}` : ""}!
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Selecionamos uma paleta personalizada com base nas suas respostas, dentro do catálogo{" "}
            <span className="font-semibold text-foreground">{modeLabel}</span>.
          </p>

          <div className="mt-8 space-y-3">
            {MOCK_COLORS.map((c, i) => (
              <div key={c.name}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3 shadow-sm animate-[slide-up_0.5s_ease-out]"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}>
                <div className="h-16 w-16 flex-shrink-0 rounded-xl shadow-inner" style={{ background: c.hex }} />
                <div className="flex-1">
                  <p className="font-serif text-lg font-semibold">{c.name}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link to="/" className="mt-8 w-full rounded-full bg-iquine-red px-8 py-4 text-center font-semibold tracking-wide text-white transition hover:bg-iquine-red-dark">
          RECOMEÇAR
        </Link>
      </div>
    </main>
  );
}
