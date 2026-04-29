import { createFileRoute } from "@tanstack/react-router";
import { FlowBuilder } from "@/components/admin/FlowBuilder";

export const Route = createFileRoute("/admin/flow/new")({
  component: () => <FlowBuilder />,
  head: () => ({ meta: [{ title: "Novo Fluxo — Iquine" }] }),
});
