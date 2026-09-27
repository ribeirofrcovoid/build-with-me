import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { saveSettings, useSettings } from "@/lib/store";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações da Empresa — DocuPro" },
      { name: "description", content: "Dados da empresa exibidos no cabeçalho dos documentos." },
      { property: "og:title", content: "Configurações da Empresa — DocuPro" },
      {
        property: "og:description",
        content: "Dados da empresa exibidos no cabeçalho dos documentos.",
      },
    ],
  }),
  component: Configuracoes,
});

function Configuracoes() {
  const settings = useSettings();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    saveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="no-print px-8 py-8">
      <h1 className="font-display text-2xl font-bold tracking-tight">Configurações da Empresa</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Estes dados aparecem no cabeçalho de todas as propostas e contratos.
      </p>

      <form onSubmit={submit} className="mt-6 max-w-2xl space-y-4 rounded-xl border bg-card p-6">
        <Field label="Razão social / Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="CNPJ / CPF" value={form.document} onChange={(v) => setForm({ ...form, document: v })} />
          <Field label="Telefone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        </div>
        <Field label="E-mail" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Endereço" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          <Field
            label="Cidade/UF (foro de eleição)"
            value={form.city}
            onChange={(v) => setForm({ ...form, city: v })}
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Salvar alterações
          </button>
          {saved && <span className="text-sm font-medium text-success">Salvo com sucesso.</span>}
        </div>
      </form>
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
