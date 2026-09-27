import type { DocStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/types";

const STYLES: Record<DocStatus, string> = {
  rascunho: "bg-muted text-muted-foreground",
  enviado: "bg-accent text-accent-foreground",
  aprovado: "bg-success text-success-foreground",
};

export function StatusBadge({ status }: { status: DocStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
