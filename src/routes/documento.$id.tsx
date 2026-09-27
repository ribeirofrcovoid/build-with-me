import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Copy, Link2, Pencil, Printer, Trash2 } from "lucide-react";
import { deleteDoc, getDocs, saveDoc, uid, useDocs, useSettings } from "@/lib/store";
import type { DocStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/types";
import { A4Preview } from "@/components/A4Preview";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/documento/$id")({
  head: () => ({
    meta: [
      { title: "Documento — DocuPro" },
      { name: "description", content: "Visualização e exportação do documento." },
      { property: "og:title", content: "Documento — DocuPro" },
      { property: "og:description", content: "Visualização e exportação do documento." },
    ],
  }),
  component: DocumentoPage,
});

const NEXT_STATUS: Record<DocStatus, DocStatus> = {
  rascunho: "enviado",
  enviado: "aprovado",
  aprovado: "rascunho",
};

function DocumentoPage() {
  const { id } = Route.useParams();
  const docs = useDocs();
  const settings = useSettings();
  const navigate = useNavigate();
  const doc = docs.find((d) => d.id === id) ?? getDocs().find((d) => d.id === id);

  if (!doc) {
    return (
      <div className="no-print flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Documento não encontrado.</p>
        <Link to="/" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  function copyLink() {
    navigator.clipboard
      .writeText(window.location.href)
      .catch(() => window.prompt("Copie o link:", window.location.href));
  }

  function duplicate() {
    if (!doc) return;
    const copy = {
      ...doc,
      id: uid(),
      title: `${doc.title} (cópia)`,
      status: "rascunho" as DocStatus,
      createdAt: new Date().toISOString(),
    };
    saveDoc(copy);
    navigate({ to: "/documento/$id", params: { id: copy.id } });
  }

  return (
    <div>
      {/* Barra de ações */}
      <div className="no-print sticky top-0 z-20 flex items-center justify-between border-b bg-card px-8 py-3.5">
        <div className="flex items-center gap-3">
          <Link
            to={doc.type === "proposta" ? "/propostas" : "/contratos"}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
          <span className="text-border">|</span>
          <h1 className="font-display text-sm font-semibold">{doc.title || "Sem título"}</h1>
          <StatusBadge status={doc.status} />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={doc.status}
            onChange={(e) => saveDoc({ ...doc, status: e.target.value as DocStatus })}
            className="rounded-lg border bg-background px-3 py-2 text-sm font-medium outline-none focus:border-ring"
            title="Alterar status"
          >
            {(Object.keys(STATUS_LABEL) as DocStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <ActionBtn onClick={copyLink} icon={<Link2 className="h-4 w-4" />} label="Copiar link" />
          <ActionBtn onClick={duplicate} icon={<Copy className="h-4 w-4" />} label="Duplicar" />
          <ActionBtn
            onClick={() => navigate({ to: "/novo" })}
            icon={<Pencil className="h-4 w-4" />}
            label="Novo"
          />
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Printer className="h-4 w-4" /> Exportar PDF
          </button>
          <button
            onClick={() => {
              if (confirm("Excluir este documento?")) {
                deleteDoc(doc.id);
                navigate({ to: "/" });
              }
            }}
            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Documento A4 */}
      <div className="bg-muted/40 px-10 py-8">
        <A4Preview doc={doc} company={settings} />
      </div>
    </div>
  );
}

function ActionBtn({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
    >
      {icon} {label}
    </button>
  );
}
