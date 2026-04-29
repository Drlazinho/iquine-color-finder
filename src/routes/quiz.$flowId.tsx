import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useFlows } from "@/hooks/useFlows";
import { IquineLogo } from "@/components/IquineLogo";
import { ChevronLeft, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz/$flowId")({
  component: QuizPlayer,
});

function QuizPlayer() {
  const { flowId } = Route.useParams();
  const { getFlow, ready } = useFlows();
  const navigate = useNavigate();
  const flow = useMemo(() => (ready ? getFlow(flowId) : undefined), [ready, flowId, getFlow]);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showHint, setShowHint] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => { setShowHint(false); setAnimKey((k) => k + 1); }, [step]);

  if (ready && !flow) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Quiz não encontrado.</p>
          <Link to="/" className="mt-4 inline-flex rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground">Voltar</Link>
        </div>
      </main>
    );
  }
  if (!flow) return <main className="min-h-screen bg-background" />;

  const question = flow.questions[step];
  const total = flow.questions.length;
  const isOdd = step % 2 === 1;
  const bgClass = isOdd ? "bg-iquine-charcoal" : "bg-iquine-taupe";

  const selected = question ? answers[question.id] : undefined;

  const next = () => {
    if (!selected) { setShowHint(true); return; }
    if (step + 1 < total) setStep(step + 1);
    else {
      sessionStorage.setItem("iquine_answers", JSON.stringify(answers));
      navigate({ to: "/quiz/$flowId/contact", params: { flowId } });
    }
  };

  const back = () => {
    if (step === 0) navigate({ to: "/" });
    else setStep(step - 1);
  };

  if (!question) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="text-center text-muted-foreground">Este quiz ainda não tem perguntas.</div>
      </main>
    );
  }

  return (
    <main className={cn("min-h-screen text-white transition-colors duration-500", bgClass)}>
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-6">
        {/* progress */}
        <div className="flex gap-1.5">
          {flow.questions.map((_, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
              <div className={cn("h-full bg-white transition-all duration-500", i <= step ? "w-full" : "w-0")} />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center"><IquineLogo variant="white" /></div>

        <div key={animKey} className="mt-8 flex-1 animate-[slide-in_0.45s_cubic-bezier(0.22,1,0.36,1)]">
          <p className="text-xs uppercase tracking-[0.25em] text-white/60">
            Pergunta {step + 1} de {total}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
            {question.text}
          </h1>
          <p className="mt-2 text-sm text-white/70">Selecione uma opção para continuar:</p>

          <ul className="mt-6 space-y-3">
            {question.options.map((opt) => {
              const isSel = selected === opt.id;
              return (
                <li key={opt.id}>
                  <button
                    onClick={() => { setAnswers({ ...answers, [question.id]: opt.id }); setShowHint(false); }}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-all",
                      isSel
                        ? "border-white bg-white/15 ring-2 ring-white"
                        : "border-white/20 bg-white/5 hover:bg-white/10",
                    )}
                  >
                    {opt.imageUrl ? (
                      <img src={opt.imageUrl} alt="" className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <ImageIcon className="h-5 w-5 text-white/40" />
                      </div>
                    )}
                    <span className="flex-1 font-medium">{opt.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6 space-y-3 pb-2">
          {showHint && <p className="text-center text-xs text-white/80">Selecione uma opção (obrigatório)</p>}
          <button
            onClick={next}
            className={cn(
              "w-full rounded-full px-8 py-4 font-semibold tracking-wide transition",
              selected ? "bg-iquine-red text-white hover:bg-iquine-red-dark" : "bg-white/20 text-white/60",
            )}
          >
            {step + 1 === total ? "CONTINUAR" : "PRÓXIMO"}
          </button>
          <button onClick={back} className="flex w-full items-center justify-center gap-1 text-sm text-white/70 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Voltar
          </button>
        </div>
      </div>
    </main>
  );
}
