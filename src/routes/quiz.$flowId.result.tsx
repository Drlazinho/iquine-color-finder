import { createFileRoute, Link } from "@tanstack/react-router";
import { useFlows } from "@/hooks/useFlows";
import { IquineLogo } from "@/components/IquineLogo";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/quiz/$flowId/result")({
  component: Result,
});

const COLOR_POOL = [
  { name: "Terracota Suave", hex: "#C97B5E" },
  { name: "Branco Neve", hex: "#F5F2EC" },
  { name: "Cinza Urbano", hex: "#7A7A7A" },
  { name: "Verde Sálvia", hex: "#9CA98A" },
  { name: "Azul Profundo", hex: "#2E4057" },
  { name: "Areia Dourada", hex: "#D4B483" },
  { name: "Rosa Antigo", hex: "#C08081" },
  { name: "Mostarda Quente", hex: "#C9A227" },
  { name: "Verde Floresta", hex: "#3F6634" },
  { name: "Lavanda Calma", hex: "#9A8FB5" },
  { name: "Off-White Pérola", hex: "#EDE6D6" },
  { name: "Carvão Elegante", hex: "#3A3A3A" },
];

// Cor aleatória — cada vez que o resultado é exibido, uma cor diferente é sorteada
function randomColor() {
  return COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)];
}

function Result() {
  const { flowId } = Route.useParams();
  const { getFlow, ready } = useFlows();
  const flow = useMemo(() => (ready ? getFlow(flowId) : undefined), [ready, flowId, getFlow]);
  const [name, setName] = useState("");
  const [color, setColor] = useState(() => randomColor());

  useEffect(() => {
    setName(sessionStorage.getItem("iquine_user_name") || "");
  }, []);

  const modeLabel = flow?.colorMode.type === "ano" ? "Cores do Ano" : "Todas as Cores do Catálogo";

  return (
    <main className="min-h-screen bg-iquine-cream">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
        <div className="flex justify-center"><IquineLogo variant="red" /></div>

        <div className="mt-10 flex-1 animate-[slide-up_0.6s_cubic-bezier(0.22,1,0.36,1)]">
          <p className="text-xs uppercase tracking-[0.3em] text-iquine-red">Sua cor ideal</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Encontramos sua cor{name ? `, ${name}` : ""}!
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Com base nas suas respostas, escolhemos a cor perfeita do catálogo{" "}
            <span className="font-semibold text-foreground">{modeLabel}</span>.
          </p>

          <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
            <div
              className="h-64 w-full"
              style={{ background: color.hex }}
            />
            <div className="p-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Iquine Tintas
              </p>
              <p className="mt-2 font-serif text-3xl font-semibold">{color.name}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {color.hex}
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Enviaremos sua paleta personalizada para o e-mail informado.
          </p>
        </div>

        <Link to="/" className="mt-8 w-full rounded-full bg-iquine-red px-8 py-4 text-center font-semibold tracking-wide text-white transition hover:bg-iquine-red-dark">
          RECOMEÇAR
        </Link>
      </div>
    </main>
  );
}
