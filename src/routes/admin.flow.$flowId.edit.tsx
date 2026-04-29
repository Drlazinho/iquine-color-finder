import { createFileRoute } from "@tanstack/react-router";
import { FlowBuilder } from "@/components/admin/FlowBuilder";

export const Route = createFileRoute("/admin/flow/$flowId/edit")({
  component: EditFlow,
  head: () => ({ meta: [{ title: "Editar Fluxo — Iquine" }] }),
});

function EditFlow() {
  const { flowId } = Route.useParams();
  return <FlowBuilder flowId={flowId} />;
}
