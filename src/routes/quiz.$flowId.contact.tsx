import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { IquineLogo } from "@/components/IquineLogo";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz/$flowId/contact")({
  component: ContactStep,
});

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function formatCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function ContactStep() {
  const { flowId } = Route.useParams();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; email?: string; cep?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (phone.replace(/\D/g, "").length < 10) e.phone = "Telefone inválido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "E-mail inválido";
    if (cep.replace(/\D/g, "").length !== 8) e.cep = "CEP inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    sessionStorage.setItem(
      "iquine_contact",
      JSON.stringify({ phone, email, cep }),
    );
    navigate({ to: "/quiz/$flowId/result", params: { flowId } });
  };

  return (
    <main className="min-h-screen bg-iquine-charcoal text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-6">
        <div className="mt-2 flex justify-center">
          <IquineLogo variant="white" />
        </div>

        <div className="mt-10 flex-1 animate-[slide-in_0.45s_cubic-bezier(0.22,1,0.36,1)]">
          <p className="text-xs uppercase tracking-[0.25em] text-white/60">
            Quase lá
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
            Para ver sua cor ideal,<br />
            <em className="not-italic font-light">deixe seu contato</em>
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Usaremos essas informações para enviar sua paleta personalizada.
          </p>

          <div className="mt-8 space-y-4">
            <Field
              label="Telefone"
              value={phone}
              onChange={(v) => { setPhone(formatPhone(v)); setErrors({ ...errors, phone: undefined }); }}
              placeholder="(00) 00000-0000"
              inputMode="tel"
              error={errors.phone}
            />
            <Field
              label="E-mail"
              value={email}
              onChange={(v) => { setEmail(v); setErrors({ ...errors, email: undefined }); }}
              placeholder="seu@email.com"
              type="email"
              inputMode="email"
              error={errors.email}
            />
            <Field
              label="CEP"
              value={cep}
              onChange={(v) => { setCep(formatCep(v)); setErrors({ ...errors, cep: undefined }); }}
              placeholder="00000-000"
              inputMode="numeric"
              error={errors.cep}
            />
          </div>
        </div>

        <div className="mt-6 space-y-3 pb-2">
          <button
            onClick={submit}
            className="w-full rounded-full bg-iquine-red px-8 py-4 font-semibold tracking-wide text-white transition hover:bg-iquine-red-dark"
          >
            VER RESULTADO
          </button>
          <Link
            to="/quiz/$flowId"
            params={{ flowId }}
            className="flex w-full items-center justify-center gap-1 text-sm text-white/70 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" /> Voltar
          </Link>
        </div>
      </div>
    </main>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", inputMode, error,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
  inputMode?: "tel" | "email" | "numeric" | "text";
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-white/60">
        {label}
      </label>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-full border bg-white/5 px-5 py-3.5 text-white placeholder:text-white/40 outline-none transition",
          error ? "border-iquine-red" : "border-white/20 focus:border-white",
        )}
      />
      {error && <p className="mt-1.5 text-xs text-iquine-red">{error}</p>}
    </div>
  );
}
