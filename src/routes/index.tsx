import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, FileSignature, FileText, Plus, Send } from "lucide-react";
import { useDocs } from "@/lib/store";
import { brl } from "@/lib/format";
import { DocTable } from "@/components/DocTable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — DocuPro" },
      { name: "description", content: "Visão geral das suas propostas e contratos." },
      { property: "og:title", content: "Dashboard — DocuPro" },
      { property: "og:description", content: "Visão geral das suas propostas e contratos." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const docs = useDocs();
  const propostas = docs.filter((d) => d.type === "proposta");
  const contratos = docs.filter((d) => d.type === "contrato");
  const aprovados = docs.filter((d) => d.status === "aprovado");
  const enviados = docs.filter((d) => d.status === "enviado");
  const pipeline = enviados.reduce(
    (sum, d) => sum + (d.billing === "pontual" ? d.totalValue : d.monthlyValue),
    0,
  );
  const mrr = contratos
    .filter((d) => d.billing === "recorrente" && d.status === "aprovado")
    .reduce((sum, d) => sum + d.monthlyValue, 0);

  const cards = [
    { label: "Propostas", value: propostas.length, icon: FileText },
    { label: "Contratos", value: contratos.length, icon: FileSignature },
    { label: "Aprovados", value: aprovados.length, icon: CheckCircle2 },
    { label: "Aguardando resposta", value: enviados.length, icon: Send },
  ];

  return (
    <div className="no-print px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão geral das suas propostas e contratos.
          </p>
        </div>
        <Link
          to="/novo"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Novo Documento
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
              <Icon className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <span className="text-sm font-medium text-muted-foreground">
            Pipeline em aberto (enviados)
          </span>
          <p className="mt-2 font-display text-2xl font-bold text-primary">{brl(pipeline)}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <span className="text-sm font-medium text-muted-foreground">
            Receita recorrente mensal (contratos ativos)
          </span>
          <p className="mt-2 font-display text-2xl font-bold text-success">{brl(mrr)}</p>
        </div>
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold">Documentos recentes</h2>
      <div className="mt-3">
        <DocTable docs={docs.slice(0, 8)} emptyLabel="Nenhum documento ainda." />
      </div>
    </div>
  );
}
