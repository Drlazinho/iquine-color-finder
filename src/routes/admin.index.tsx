import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useFlows } from "@/hooks/useFlows";
import { IquineLogo } from "@/components/IquineLogo";
import { Plus, Pencil, Eye, Trash2, Palette, FileText } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Admin — Iquine" }] }),
});

function AdminDashboard() {
  const { flows, ready, deleteFlow } = useFlows();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <IquineLogo variant="red" />
            <div>
              <h1 className="font-serif text-xl font-bold">Painel Administrativo</h1>
              <p className="text-xs text-muted-foreground">Gerencie seus quizzes de cor</p>
            </div>
          </div>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">Ver site →</Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold">Fluxos de Quiz</h2>
            <p className="text-sm text-muted-foreground">{flows.length} {flows.length === 1 ? "fluxo" : "fluxos"} cadastrado{flows.length === 1 ? "" : "s"}</p>
          </div>
          <button
            onClick={() => navigate({ to: "/admin/flow/new" })}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Criar Novo Fluxo
          </button>
        </div>

        {ready && flows.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-border bg-card p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <Palette className="h-7 w-7 text-iquine-red" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-semibold">Nenhum fluxo ainda</h3>
            <p className="mt-2 text-sm text-muted-foreground">Crie seu primeiro quiz de recomendação de cor.</p>
            <button
              onClick={() => navigate({ to: "/admin/flow/new" })}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> Criar Novo Fluxo
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flows.map((flow) => (
            <article key={flow.id} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                  <FileText className="h-5 w-5 text-iquine-red" />
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] uppercase tracking-wider text-secondary-foreground">
                  {flow.colorMode.type === "ano" ? "Cores do Ano" : "Catálogo"}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold leading-tight">{flow.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {flow.questions.length} {flow.questions.length === 1 ? "pergunta" : "perguntas"} · criado em {new Date(flow.createdAt).toLocaleDateString("pt-BR")}
              </p>
              <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                <Link to="/admin/flow/$flowId/edit" params={{ flowId: flow.id }}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-xs font-medium hover:bg-accent">
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </Link>
                <Link to="/quiz/$flowId" params={{ flowId: flow.id }} target="_blank"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-xs font-medium hover:bg-accent">
                  <Eye className="h-3.5 w-3.5" /> Visualizar
                </Link>
                <button
                  onClick={() => { if (confirm(`Excluir "${flow.name}"?`)) deleteFlow(flow.id); }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Excluir"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
