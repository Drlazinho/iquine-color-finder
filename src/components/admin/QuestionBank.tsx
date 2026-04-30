import { useState, useRef } from "react"
import { useQuestions } from "@/hooks/useQuestions"
import { useFlows, uid } from "@/hooks/useFlows"
import { HelpCircle, Trash2, List, Plus, X, Upload, Save, ImageIcon, Pencil } from "lucide-react"
import { QuizQuestion, QuizOption } from "@/types"
import { compressImage } from "@/lib/utils"

function newOption(): QuizOption {
  return { id: uid(), text: "" }
}

function newQuestion(): QuizQuestion {
  return { id: uid(), text: "", options: [newOption(), newOption(), newOption()] }
}

export function QuestionBank() {
  const { questions, ready: qReady, deleteQuestion, saveQuestion } = useQuestions()
  const { flows, ready: fReady } = useFlows()
  const [editing, setEditing] = useState<QuizQuestion | null>(null)

  if (!qReady || !fReady) return null

  if (editing) {
    return (
      <BankQuestionEditor
        initial={editing}
        onSave={(q) => {
          saveQuestion(q)
          setEditing(null)
        }}
        onCancel={() => setEditing(null)}
      />
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold">Banco de Perguntas</h2>
          <p className="text-sm text-muted-foreground">{questions.length} {questions.length === 1 ? "pergunta salva" : "perguntas salvas"}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Crie e edite perguntas para reutilizar nos seus fluxos de quiz.
          </p>
        </div>
        <button
          onClick={() => setEditing(newQuestion())}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Criar Pergunta
        </button>
      </div>

      {questions.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card p-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <HelpCircle className="h-7 w-7 text-iquine-red" />
          </div>
          <h3 className="mt-4 font-serif text-xl font-semibold">Nenhuma pergunta salva</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Clique em "Criar Pergunta" para adicionar a primeira ao seu banco.
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
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditing(q)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { if (confirm(`Excluir pergunta?`)) deleteQuestion(q.id) }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
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
                  const usedInFlows = flows.filter(f => f.questions.some(fq => fq.sourceBankId === q.id))
                  if (usedInFlows.length === 0) {
                    return <span className="text-xs text-muted-foreground italic">Nenhum fluxo utiliza esta pergunta ainda.</span>
                  }
                  return usedInFlows.map(f => (
                    <span key={f.id} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-foreground">
                      <List className="h-3 w-3" /> {f.name}
                    </span>
                  ))
                })()}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function BankQuestionEditor({
  initial,
  onSave,
  onCancel
}: {
  initial: QuizQuestion
  onSave: (q: QuizQuestion) => void
  onCancel: () => void
}) {
  const [question, setQuestion] = useState<QuizQuestion>(initial)

  const onChange = (patch: Partial<QuizQuestion>) => setQuestion(q => ({ ...q, ...patch }))
  const addOption = () => setQuestion(q => ({ ...q, options: [...q.options, newOption()] }))
  const updateOption = (oid: string, patch: Partial<QuizOption>) => setQuestion(q => ({
    ...q, options: q.options.map(o => o.id === oid ? { ...o, ...patch } : o)
  }))
  const removeOption = (oid: string) => setQuestion(q => ({
    ...q, options: q.options.filter(o => o.id !== oid)
  }))

  const handleSave = () => {
    console.log(question)
    if (!question.text.trim()) { alert("A pergunta precisa ter um texto."); return }
    const filled = question.options.filter(o => o.text.trim() || o.imageUrl)
    if (filled.length < 2) { alert("Preencha pelo menos 2 alternativas."); return }
    onSave(question)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold">{initial.text ? "Editar Pergunta" : "Nova Pergunta"}</h2>
          <p className="text-sm text-muted-foreground">Configure os detalhes da sua pergunta.</p>
        </div>
        <button onClick={onCancel} className="rounded-full p-2 hover:bg-secondary"><X className="h-5 w-5" /></button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <input
          type="text"
          value={question.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Ex.: Como você quer que esse espaço seja percebido?"
          className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Opções ({question.options.length}/8) · mínimo 2
          </p>
          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <BankOptionRow
                key={opt.id}
                index={i}
                option={opt}
                canRemove={question.options.length > 2}
                onChange={(p) => updateOption(opt.id, p)}
                onRemove={() => removeOption(opt.id)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addOption}
            disabled={question.options.length >= 8}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar Opção
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="rounded-full px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary">Cancelar</button>
        <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Save className="h-4 w-4" /> Salvar Pergunta
        </button>
      </div>
    </div>
  )
}

function BankOptionRow({ index, option, canRemove, onChange, onRemove }: any) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [showUrl, setShowUrl] = useState(false)

  const onPickFile = async (file: File) => {
    try {
      const compressed = await compressImage(file, 600)
      onChange({ imageUrl: compressed })
    } catch (err) {
      console.error(err)
      alert("Erro ao processar imagem.")
    }
  }

  return (
    <div className="rounded-xl border border-border bg-background p-3">
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
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
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
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickFile(f); e.target.value = "" }}
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
              className="w-full rounded-lg border border-input bg-card px-3 py-1.5 text-xs outline-none focus:border-primary"
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
  )
}
