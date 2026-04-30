import { useState } from "react";
import { usePalettes } from "@/hooks/usePalettes";
import { useFlows, uid } from "@/hooks/useFlows";
import { Palette, Trash2, List, Plus, X, Save, Pencil } from "lucide-react";
import { ColorPalette } from "@/types";

export function PaletteBank() {
  const { palettes, ready: pReady, deletePalette, savePalette } = usePalettes();
  const { flows, ready: fReady } = useFlows();
  const [editing, setEditing] = useState<ColorPalette | null>(null);

  if (!pReady || !fReady) return null;

  if (editing) {
    return (
      <BankPaletteEditor
        initial={editing}
        onSave={(p) => {
          savePalette(p);
          setEditing(null);
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold">Banco de Paletas de Cores</h2>
          <p className="text-sm text-muted-foreground">{palettes.length} {palettes.length === 1 ? "paleta salva" : "paletas salvas"}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Crie paletas personalizadas e salve-as no banco para reutilizar facilmente.
          </p>
        </div>
        <button
          onClick={() => setEditing({ id: uid(), name: "", colors: [] })}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Criar Paleta
        </button>
      </div>

      {palettes.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card p-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <Palette className="h-7 w-7 text-iquine-red" />
          </div>
          <h3 className="mt-4 font-serif text-xl font-semibold">Nenhuma paleta salva</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Clique em "Criar Paleta" para adicionar a primeira ao seu banco.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {palettes.map((p) => (
          <article key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <Palette className="h-5 w-5 text-iquine-red" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditing(p)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { if (confirm(`Excluir paleta "${p.name}"?`)) deletePalette(p.id); }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold leading-tight">{p.name || "(Sem nome)"}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {p.colors.length} {p.colors.length === 1 ? "cor" : "cores"}
            </p>
            
            <div className="mt-4 flex flex-wrap gap-1">
              {p.colors.slice(0, 8).map((color) => (
                <div
                  key={color.id}
                  className="h-6 w-6 rounded-full shadow-sm border border-black/10"
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name} (${color.hex})`}
                />
              ))}
              {p.colors.length > 8 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">
                  +{p.colors.length - 8}
                </div>
              )}
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Usada nos fluxos</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(() => {
                  const usedInFlows = flows.filter(f => f.customPalette?.sourceBankId === p.id);
                  if (usedInFlows.length === 0) {
                    return <span className="text-xs text-muted-foreground italic">Nenhum fluxo utiliza esta paleta ainda.</span>;
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

function BankPaletteEditor({
  initial,
  onSave,
  onCancel
}: {
  initial: ColorPalette;
  onSave: (p: ColorPalette) => void;
  onCancel: () => void;
}) {
  const [palette, setPalette] = useState<ColorPalette>(initial);

  const handleSave = () => {
    if (!palette.name.trim()) { alert("Dê um nome para a paleta."); return; }
    if (palette.colors.length === 0) { alert("Adicione pelo menos uma cor."); return; }
    onSave(palette);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold">{initial.name ? "Editar Paleta" : "Nova Paleta"}</h2>
          <p className="text-sm text-muted-foreground">Adicione as cores da sua paleta personalizada.</p>
        </div>
        <button onClick={onCancel} className="rounded-full p-2 hover:bg-secondary"><X className="h-5 w-5" /></button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <input
          type="text"
          value={palette.name}
          onChange={(e) => setPalette((p) => ({ ...p, name: e.target.value }))}
          placeholder="Nome da Paleta (ex.: Tons Terrosos)"
          className="mb-6 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
        />

        <div className="space-y-3">
          {palette.colors.map((c) => (
            <div key={c.id} className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border">
                <input
                  type="color"
                  value={c.hex}
                  onChange={(e) => setPalette((p) => ({ ...p, colors: p.colors.map((x) => x.id === c.id ? { ...x, hex: e.target.value } : x) }))}
                  className="h-12 w-12 -translate-x-1 -translate-y-1 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={c.name}
                onChange={(e) => setPalette((p) => ({ ...p, colors: p.colors.map((x) => x.id === c.id ? { ...x, name: e.target.value } : x) }))}
                placeholder="Nome da cor"
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setPalette((p) => ({ ...p, colors: p.colors.filter((x) => x.id !== c.id) }))}
                className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPalette((p) => ({ ...p, colors: [...p.colors, { id: uid(), name: "", hex: "#000000" }] }))}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium hover:bg-secondary"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar Cor
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="rounded-full px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary">Cancelar</button>
        <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Save className="h-4 w-4" /> Salvar Paleta
        </button>
      </div>
    </div>
  );
}
