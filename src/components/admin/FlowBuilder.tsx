import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ColorCatalogMode, QuizFlow, QuizOption, QuizQuestion } from "@/types";
import { uid, useFlows } from "@/hooks/useFlows";
import { IquineLogo } from "@/components/IquineLogo";
import {
  ArrowDown, ArrowUp, ChevronDown, ChevronUp, ImageIcon, Plus, Trash2, Upload, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

function newOption(): QuizOption {
  return { id: uid(), text: "" };
}
function newQuestion(): QuizQuestion {
  return { id: uid(), text: "", options: [newOption(), newOption(), newOption()] };
}

export function FlowBuilder({ flowId }: { flowId?: string }) {
  const { getFlow, saveFlow, ready } = useFlows();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [colorMode, setColorMode] = useState<ColorCatalogMode>({ type: "ano" });
  const [questions, setQuestions] = useState<QuizQuestion[]>([newQuestion()]);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [isActive, setIsActive] = useState(false);
  const [activeFrom, setActiveFrom] = useState<string>("");
  const [activeTo, setActiveTo] = useState<string>("");
  const [error, setError] = useState("");
  const loaded = useRef(false);

  useEffect(() => {
    if (!ready || loaded.current) return;
    loaded.current = true;
    if (flowId) {
      const f = getFlow(flowId);
      if (f) {
        setName(f.name);
        setColorMode(f.colorMode);
        setQuestions(f.questions);
        setCreatedAt(f.createdAt);
        setIsActive(f.isActive);
        setActiveFrom(f.activeFrom || "");
        setActiveTo(f.activeTo || "");
      }
    }
  }, [ready, flowId, getFlow]);

  const updateQuestion = (id: string, patch: Partial<QuizQuestion>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const removeQuestion = (id: string) =>
    setQuestions((qs) => qs.filter((q) => q.id !== id));

  const moveQuestion = (idx: number, dir: -1 | 1) => {
    setQuestions((qs) => {
      const next = [...qs];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return qs;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const addOption = (qid: string) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qid && q.options.length < 8 ? { ...q, options: [...q.options, newOption()] } : q,
      ),
    );

  const updateOption = (qid: string, oid: string, patch: Partial<QuizOption>) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.map((o) => (o.id === oid ? { ...o, ...patch } : o)) }
          : q,
      ),
    );

  const removeOption = (qid: string, oid: string) =>
    setQuestions((qs) =>
      qs.map((q) => (q.id === qid ? { ...q, options: q.options.filter((o) => o.id !== oid) } : q)),
    );

  const validate = (): string | null => {
    if (!name.trim()) return "Dê um nome ao fluxo.";
    if (questions.length === 0) return "Adicione pelo menos uma pergunta.";
    for (const q of questions) {
      if (!q.text.trim()) return "Cada pergunta precisa de um texto.";
      const filled = q.options.filter((o) => o.text.trim());
      if (filled.length < 3) return `A pergunta "${q.text || "(sem título)"}" precisa de pelo menos 3 opções preenchidas.`;
    }
    return null;
  };

  const onSave = () => {
    const err = validate();
    if (err) { setError(err); return; }
    if (activeFrom && activeTo && activeFrom > activeTo) {
      setError('A data inicial deve ser anterior à data final.');
      return;
    }
    const flow: QuizFlow = {
      id: flowId || uid(),
      name: name.trim(),
      createdAt: createdAt || new Date().toISOString(),
      questions,
      colorMode,
      isActive,
      activeFrom: activeFrom || undefined,
      activeTo: activeTo || undefined,
    };
    saveFlow(flow);
    navigate({ to: "/admin" });
  };

  return (
    <main className="min-h-screen bg-background pb-32">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <IquineLogo />
            <div>
              <h1 className="font-serif text-xl font-bold">{flowId ? "Editar Fluxo" : "Novo Fluxo"}</h1>
              <p className="text-xs text-muted-foreground">Configure seu quiz de recomendação</p>
            </div>
          </div>
          <Link to="/admin" className="text-xs text-muted-foreground hover:text-foreground">← Voltar</Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-8 px-6 py-10">
        {/* Step 1 */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-iquine-red text-sm font-bold text-white">1</span>
            <h2 className="font-serif text-lg font-semibold">Configurações do Fluxo</h2>
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome do Fluxo *</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Quiz de Cor para Sala de Estar"
              className="mt-2 w-full rounded-full border border-input bg-background px-5 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <div className="mt-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Catálogo de cores</span>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {([
                { type: "ano", label: "Cores do Ano", icon: "🎨", desc: "Paleta selecionada anualmente" },
                { type: "catalogo", label: "Todas as Cores", icon: "📚", desc: "Catálogo completo Iquine" },
              ] as const).map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setColorMode({ type: m.type })}
                  className={cn(
                    "rounded-2xl border-2 p-4 text-left transition",
                    colorMode.type === m.type
                      ? "border-primary bg-accent"
                      : "border-border bg-background hover:border-primary/40",
                  )}
                >
                  <div className="text-2xl">{m.icon}</div>
                  <div className="mt-2 font-semibold">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-iquine-red text-sm font-bold text-white">2</span>
            <h2 className="font-serif text-lg font-semibold">Perguntas</h2>
            <span className="ml-auto text-xs text-muted-foreground">{questions.length} pergunta{questions.length === 1 ? "" : "s"}</span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                index={idx}
                total={questions.length}
                question={q}
                onChange={(patch) => updateQuestion(q.id, patch)}
                onRemove={() => removeQuestion(q.id)}
                onMove={(dir) => moveQuestion(idx, dir)}
                onAddOption={() => addOption(q.id)}
                onUpdateOption={(oid, patch) => updateOption(q.id, oid, patch)}
                onRemoveOption={(oid) => removeOption(q.id, oid)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setQuestions((qs) => [...qs, newQuestion()])}
            className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-foreground"
          >
            <Plus className="h-4 w-4" /> Adicionar Pergunta
          </button>
        </section>

        {/* Step 3 — Coleta de Dados (sempre incluído) */}
        {/* <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-iquine-red text-sm font-bold text-white">3</span>
            <h2 className="font-serif text-lg font-semibold">Coleta de Dados</h2>
            <span className="ml-auto rounded-full bg-iquine-red/10 px-3 py-0.5 text-xs font-semibold text-iquine-red">Sempre incluído</span>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Após responder todas as perguntas, o usuário será direcionado automaticamente para preencher seus dados de contato antes de ver o resultado.
          </p>
          <div className="grid gap-3 sm:grid-cols-3 opacity-60 pointer-events-none select-none">
            {[
              { label: "Telefone", placeholder: "(00) 00000-0000" },
              { label: "E-mail", placeholder: "seu@email.com" },
              { label: "CEP", placeholder: "00000-000" },
            ].map((f) => (
              <div key={f.label}>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</span>
                <div className="mt-2 w-full rounded-full border border-input bg-background px-5 py-3 text-sm text-muted-foreground">
                  {f.placeholder}
                </div>
              </div>
            ))}
          </div>
        </section> */}

        {/* Step 4 — Availability */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-iquine-red text-sm font-bold text-white">4</span>
            <h2 className="font-serif text-lg font-semibold">Disponibilidade</h2>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
            <div>
              <p className="font-medium">Fluxo ativo</p>
              <p className="text-xs text-muted-foreground">
                Apenas um fluxo pode estar ativo por vez. Ativar este desativará os demais.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive((v) => !v)}
              className={cn(
                "relative h-7 w-12 flex-shrink-0 rounded-full transition",
                isActive ? "bg-iquine-red" : "bg-muted",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all",
                  isActive ? "left-[22px]" : "left-0.5",
                )}
              />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Disponível a partir de</span>
              <input
                type="date"
                value={activeFrom}
                onChange={(e) => setActiveFrom(e.target.value)}
                className="mt-2 w-full rounded-full border border-input bg-background px-5 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Disponível até</span>
              <input
                type="date"
                value={activeTo}
                onChange={(e) => setActiveTo(e.target.value)}
                className="mt-2 w-full rounded-full border border-input bg-background px-5 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Deixe as datas em branco para disponibilidade sem restrição de período.
          </p>
        </section>

        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-3 px-6 py-4">
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">Cancelar</Link>
          <button
            onClick={onSave}
            className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Salvar Fluxo
          </button>
        </div>
      </div>
    </main>
  );
}

function QuestionCard({
  index, total, question, onChange, onRemove, onMove, onAddOption, onUpdateOption, onRemoveOption,
}: {
  index: number;
  total: number;
  question: QuizQuestion;
  onChange: (p: Partial<QuizQuestion>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  onAddOption: () => void;
  onUpdateOption: (oid: string, p: Partial<QuizOption>) => void;
  onRemoveOption: (oid: string) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-border bg-background">
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold">
          {index + 1}
        </span>
        <span className="flex-1 truncate text-sm font-medium">
          {question.text || <span className="text-muted-foreground">Pergunta sem título</span>}
        </span>
        <button onClick={() => onMove(-1)} disabled={index === 0} className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary disabled:opacity-30" aria-label="Mover para cima"><ArrowUp className="h-3.5 w-3.5" /></button>
        <button onClick={() => onMove(1)} disabled={index === total - 1} className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary disabled:opacity-30" aria-label="Mover para baixo"><ArrowDown className="h-3.5 w-3.5" /></button>
        <button onClick={() => setOpen(!open)} className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary" aria-label="Expandir">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <button onClick={onRemove} className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Excluir pergunta">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {open && (
        <div className="space-y-4 border-t border-border p-4">
          <input
            type="text"
            value={question.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Ex.: Como você quer que esse espaço seja percebido?"
            className="w-full rounded-xl border border-input bg-card px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Opções ({question.options.length}/8) · mínimo 3
            </p>
            <div className="space-y-2">
              {question.options.map((opt, i) => (
                <OptionRow
                  key={opt.id}
                  index={i}
                  option={opt}
                  canRemove={question.options.length > 3}
                  onChange={(p) => onUpdateOption(opt.id, p)}
                  onRemove={() => onRemoveOption(opt.id)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={onAddOption}
              disabled={question.options.length >= 8}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" /> Adicionar Opção
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function OptionRow({
  index, option, canRemove, onChange, onRemove,
}: {
  index: number;
  option: QuizOption;
  canRemove: boolean;
  onChange: (p: Partial<QuizOption>) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showUrl, setShowUrl] = useState(false);

  const onPickFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => onChange({ imageUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-start gap-3">
        <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
          {option.imageUrl ? (
            <>
              <img src={option.imageUrl} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => onChange({ imageUrl: undefined })}
                className="absolute right-0 top-0 rounded-full bg-black/60 p-0.5 text-white"
                aria-label="Remover imagem"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={option.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder={`Opção ${index + 1}`}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium hover:bg-accent"
            >
              <Upload className="h-3 w-3" /> Enviar imagem
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickFile(f); e.target.value = ""; }}
            />
            <button
              type="button"
              onClick={() => setShowUrl((v) => !v)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ou colar URL
            </button>
          </div>
          {showUrl && (
            <input
              type="url"
              value={option.imageUrl?.startsWith("data:") ? "" : option.imageUrl || ""}
              onChange={(e) => onChange({ imageUrl: e.target.value || undefined })}
              placeholder="https://…"
              className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
            />
          )}
        </div>

        <button
          onClick={onRemove}
          disabled={!canRemove}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
          aria-label="Remover opção"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
