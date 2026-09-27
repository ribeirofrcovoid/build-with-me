import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useDocs } from "@/lib/store";
import { DocTable } from "@/components/DocTable";

export const Route = createFileRoute("/propostas")({
  head: () => ({
    meta: [
      { title: "Propostas — DocuPro" },
      { name: "description", content: "Gerencie suas propostas comerciais." },
      { property: "og:title", content: "Propostas — DocuPro" },
      { property: "og:description", content: "Gerencie suas propostas comerciais." },
    ],
  }),
  component: Propostas,
});

function Propostas() {
  const docs = useDocs().filter((d) => d.type === "proposta");
  return (
    <div className="no-print px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Propostas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Propostas comerciais para projetos pontuais e recorrentes.
          </p>
        </div>
        <Link
          to="/novo"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Novo Documento
        </Link>
      </div>
      <div className="mt-6">
        <DocTable docs={docs} emptyLabel="Nenhuma proposta criada ainda." />
      </div>
    </div>
  );
}
