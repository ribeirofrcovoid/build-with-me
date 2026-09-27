import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Building2,
  FileSignature,
  FileText,
  LayoutDashboard,
  Plus,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/propostas", label: "Propostas", icon: FileText },
  { to: "/contratos", label: "Contratos", icon: FileSignature },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/configuracoes", label: "Configurações", icon: Building2 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <aside className="no-print fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <FileText className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-sidebar-accent-foreground">
            DocuPro
          </span>
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={() => navigate({ to: "/novo" })}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-sidebar-primary px-4 py-2.5 text-sm font-semibold text-sidebar-primary-foreground transition-colors hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Novo Documento
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-6 py-4 text-xs text-sidebar-foreground/50">
          Propostas & contratos profissionais
        </div>
      </aside>

      <main className="ml-64 flex-1">{children}</main>
    </div>
  );
}
