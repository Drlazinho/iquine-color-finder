import { usePalettes } from "@/hooks/usePalettes";
import { Palette, Trash2 } from "lucide-react";

export function PaletteBank() {
  const { palettes, ready, deletePalette } = usePalettes();

  if (!ready) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold">Banco de Paletas de Cores</h2>
        <p className="text-sm text-muted-foreground">{palettes.length} {palettes.length === 1 ? "paleta salva" : "paletas salvas"}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Crie paletas personalizadas no Construtor de Fluxos e salve-as no banco para reutilizar facilmente.
        </p>
      </div>

      {palettes.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card p-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <Palette className="h-7 w-7 text-iquine-red" />
          </div>
          <h3 className="mt-4 font-serif text-xl font-semibold">Nenhuma paleta salva</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Para salvar uma paleta de cores, crie um novo fluxo, escolha a opção "Paleta Personalizada", adicione as cores e clique em "Salvar no Banco".
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
              <button
                onClick={() => { if (confirm(`Excluir paleta "${p.name}"?`)) deletePalette(p.id); }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </button>
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
          </article>
        ))}
      </div>
    </div>
  );
}
