import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteClient, saveClient, uid, useClients } from "@/lib/store";
import type { Client } from "@/lib/types";

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes — DocuPro" },
      { name: "description", content: "Cadastro de clientes para propostas e contratos." },
      { property: "og:title", content: "Clientes — DocuPro" },
      { property: "og:description", content: "Cadastro de clientes para propostas e contratos." },
    ],
  }),
  component: Clientes,
});

const EMPTY: Client = {
  id: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  document: "",
};

function Clientes() {
  const clients = useClients();
  const [form, setForm] = useState<Client>(EMPTY);
  const [open, setOpen] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    saveClient({ ...form, id: form.id || uid() });
    setForm(EMPTY);
    setOpen(false);
  }

  return (
    <div className="no-print px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastre os dados usados nos documentos.
          </p>
        </div>
        <button
          onClick={() => {
            setForm(EMPTY);
            setOpen((v) => !v);
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Novo cliente
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-6 grid grid-cols-2 gap-4 rounded-xl border bg-card p-6">
          <Field label="Nome do contato" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Empresa" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
          <Field label="E-mail" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Telefone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="CPF / CNPJ" value={form.document} onChange={(v) => setForm({ ...form, document: v })} />
          <div className="col-span-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Salvar cliente
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border bg-card">
        {clients.length === 0 ? (
          <p className="py-14 text-center text-sm text-muted-foreground">
            Nenhum cliente cadastrado ainda.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3">Contato</th>
                <th className="px-5 py-3">Empresa</th>
                <th className="px-5 py-3">E-mail</th>
                <th className="px-5 py-3">CPF / CNPJ</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-5 py-3.5 font-medium">{c.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.company || "—"}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.email || "—"}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.document || "—"}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => deleteClient(c.id)}
                      className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
      />
    </label>
  );
}
