import { useQuestions } from "@/hooks/useQuestions";
import { useFlows } from "@/hooks/useFlows";
import { HelpCircle, Trash2, List } from "lucide-react";

export function QuestionBank() {
  const { questions, ready: qReady, deleteQuestion } = useQuestions();
  const { flows, ready: fReady } = useFlows();

  if (!qReady || !fReady) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold">Banco de Perguntas</h2>
        <p className="text-sm text-muted-foreground">{questions.length} {questions.length === 1 ? "pergunta salva" : "perguntas salvas"}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Crie e edite perguntas diretamente no Construtor de Fluxos e salve-as no banco para reutilizar aqui.
        </p>
      </div>

      {questions.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card p-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <HelpCircle className="h-7 w-7 text-iquine-red" />
          </div>
          <h3 className="mt-4 font-serif text-xl font-semibold">Nenhuma pergunta salva</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Para salvar uma pergunta, abra um fluxo existente ou crie um novo, adicione uma pergunta e clique em "Salvar no Banco".
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {questions.map((q) => (
          <article key={q.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <HelpCircle className="h-5 w-5 text-iquine-red" />
              </div>
              <button
                onClick={() => { if (confirm(`Excluir pergunta?`)) deleteQuestion(q.id); }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold leading-tight">{q.text || "(Sem título)"}</h3>
            
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alternativas</p>
              <ul className="space-y-1">
                {q.options.map((opt, i) => (
                  <li key={opt.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold">{i + 1}</span>
                    <span className="truncate">{opt.text || "(vazia)"}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Usada nos fluxos</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(() => {
                  const usedInFlows = flows.filter(f => f.questions.some(fq => fq.sourceBankId === q.id));
                  if (usedInFlows.length === 0) {
                    return <span className="text-xs text-muted-foreground italic">Nenhum fluxo utiliza esta pergunta ainda.</span>;
                  }
                  return usedInFlows.map(f => (
                    <span key={f.id} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-foreground">
                      <List className="h-3 w-3" /> {f.name}
                    </span>
                  ));
                })()}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
