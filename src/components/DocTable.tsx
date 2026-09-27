import { Link } from "@tanstack/react-router";
import { Copy, FileText, Link2, Trash2 } from "lucide-react";
import type { DocData, DocStatus } from "@/lib/types";
import { deleteDoc, saveDoc, uid, useDocs } from "@/lib/store";
import { brl, dateBR } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

const NEXT_STATUS: Record<DocStatus, DocStatus> = {
  rascunho: "enviado",
  enviado: "aprovado",
  aprovado: "rascunho",
};

export function DocTable({ docs, emptyLabel }: { docs: DocData[]; emptyLabel: string }) {
  const all = useDocs();

  function duplicate(doc: DocData) {
    saveDoc({
      ...doc,
      id: uid(),
      title: `${doc.title} (cópia)`,
      status: "rascunho",
      createdAt: new Date().toISOString(),
    });
  }

  function copyLink(doc: DocData) {
    const url = `${window.location.origin}/documento/${doc.id}`;
    navigator.clipboard.writeText(url).catch(() => window.prompt("Copie o link:", url));
  }

  function cycleStatus(doc: DocData) {
    saveDoc({ ...doc, status: NEXT_STATUS[doc.status] });
  }

  if (docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-16 text-center">
        <FileText className="h-10 w-10 text-muted-foreground/40" />
        <p className="mt-3 text-sm font-medium text-muted-foreground">{emptyLabel}</p>
        <Link
          to="/novo"
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Criar primeiro documento
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-3">Documento</th>
            <th className="px-5 py-3">Cliente</th>
            <th className="px-5 py-3">Valor</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Atualizado</th>
            <th className="px-5 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <tr key={doc.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="px-5 py-3.5">
                <Link
                  to="/documento/$id"
                  params={{ id: doc.id }}
                  className="font-medium text-foreground hover:text-primary hover:underline"
                >
                  {doc.title || "Sem título"}
                </Link>
              </td>
              <td className="px-5 py-3.5 text-muted-foreground">{doc.clientName || "—"}</td>
              <td className="px-5 py-3.5 font-medium">
                {brl(doc.billing === "pontual" ? doc.totalValue : doc.monthlyValue)}
                {doc.billing === "recorrente" && (
                  <span className="text-xs text-muted-foreground">/mês</span>
                )}
              </td>
              <td className="px-5 py-3.5">
                <button
                  onClick={() => cycleStatus(doc)}
                  title="Clique para alternar o status"
                  className="transition-transform hover:scale-105"
                >
                  <StatusBadge status={doc.status} />
                </button>
              </td>
              <td className="px-5 py-3.5 text-muted-foreground">{dateBR(doc.updatedAt)}</td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => copyLink(doc)}
                    title="Copiar link de visualização"
                    className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Link2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => duplicate(doc)}
                    title="Duplicar como novo modelo"
                    className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Excluir este documento?")) deleteDoc(doc.id);
                    }}
                    title="Excluir"
                    className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <span className="hidden">{all.length}</span>
    </div>
  );
}
