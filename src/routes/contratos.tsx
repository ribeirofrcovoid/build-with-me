import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useDocs } from "@/lib/store";
import { DocTable } from "@/components/DocTable";

export const Route = createFileRoute("/contratos")({
  head: () => ({
    meta: [
      { title: "Contratos — DocuPro" },
      { name: "description", content: "Gerencie seus contratos de prestação de serviços." },
      { property: "og:title", content: "Contratos — DocuPro" },
      { property: "og:description", content: "Gerencie seus contratos de prestação de serviços." },
    ],
  }),
  component: Contratos,
});

function Contratos() {
  const docs = useDocs().filter((d) => d.type === "contrato");
  return (
    <div className="no-print px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Contratos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Contratos de prestação de serviços pontuais e contínuos.
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
        <DocTable docs={docs} emptyLabel="Nenhum contrato criado ainda." />
      </div>
    </div>
  );
}
