import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, FileSignature, FileText, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { newDocDraft, saveDoc, uid, useClients, useSettings } from "@/lib/store";
import type { DocData } from "@/lib/types";
import { A4Preview } from "@/components/A4Preview";

export const Route = createFileRoute("/novo")({
  head: () => ({
    meta: [
      { title: "Novo Documento — DocuPro" },
      { name: "description", content: "Crie uma proposta comercial ou contrato de prestação de serviços." },
      { property: "og:title", content: "Novo Documento — DocuPro" },
      { property: "og:description", content: "Crie uma proposta comercial ou contrato de prestação de serviços." },
    ],
  }),
  component: NovoDocumento,
});

const STEPS = ["Tipo de documento", "Cobrança", "Escopo", "Revisão"];

function NovoDocumento() {
  const [step, setStep] = useState(0);
  const [doc, setDoc] = useState<DocData>(newDocDraft);
  const clients = useClients();
  const settings = useSettings();
  const navigate = useNavigate();

  const patch = (p: Partial<DocData>) => setDoc((d) => ({ ...d, ...p }));

  function finish() {
    saveDoc(doc);
    navigate({ to: "/documento/$id", params: { id: doc.id } });
  }

  return (
    <div className="no-print flex h-screen flex-col">
      {/* Header do wizard */}
      <div className="border-b bg-card px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-lg font-bold">Novo Documento</h1>
          <ol className="flex items-center gap-2 text-xs font-medium">
            {STEPS.map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                    i < step
                      ? "bg-success text-success-foreground"
                      : i === step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={i === step ? "text-foreground" : "text-muted-foreground"}>
                  {label}
                </span>
                {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-border" />}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Formulário */}
        <div className="w-[480px] shrink-0 overflow-y-auto border-r bg-card px-8 py-6">
          {step === 0 && (
            <div className="space-y-6">
              <StepTitle>Que tipo de documento você quer criar?</StepTitle>
              <div className="grid gap-3">
                <ChoiceCard
                  active={doc.type === "proposta"}
                  onClick={() => patch({ type: "proposta" })}
                  icon={<FileText className="h-5 w-5" />}
                  title="Proposta Comercial"
                  desc="Orçamento e escopo para aprovação do cliente."
                />
                <ChoiceCard
                  active={doc.type === "contrato"}
                  onClick={() => patch({ type: "contrato" })}
                  icon={<FileSignature className="h-5 w-5" />}
                  title="Contrato de Prestação de Serviços"
                  desc="Instrumento formal com cláusulas e assinaturas."
                />
              </div>
              <Field label="Título do documento">
                <input
                  value={doc.title}
                  onChange={(e) => patch({ title: e.target.value })}
                  placeholder="Ex: Redesign do site institucional"
                  className={inputCls}
                />
              </Field>
              <Field label="Cliente">
                <select
                  value={doc.clientId ?? ""}
                  onChange={(e) => {
                    const c = clients.find((c) => c.id === e.target.value);
                    patch({ clientId: c?.id ?? null, clientName: c ? (c.company || c.name) : "" });
                  }}
                  className={inputCls}
                >
                  <option value="">Selecionar cliente cadastrado…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company || c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Ou digite o nome do cliente">
                <input
                  value={doc.clientName}
                  onChange={(e) => patch({ clientId: null, clientName: e.target.value })}
                  placeholder="Ex: Padaria Pão Quente Ltda."
                  className={inputCls}
                />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <StepTitle>Como será a cobrança?</StepTitle>
              <div className="grid gap-3">
                <ChoiceCard
                  active={doc.billing === "pontual"}
                  onClick={() => patch({ billing: "pontual" })}
                  title="Projeto Pontual / Freelancer"
                  desc="Valor fechado, prazo final e marcos de pagamento."
                />
                <ChoiceCard
                  active={doc.billing === "recorrente"}
                  onClick={() => patch({ billing: "recorrente" })}
                  title="Contrato Recorrente / Contínuo"
                  desc="Mensalidade com vigência mínima e reajuste anual."
                />
              </div>

              {doc.billing === "pontual" ? (
                <div className="space-y-4">
                  <Field label="Valor total do projeto (R$)">
                    <input
                      type="number"
                      min={0}
                      value={doc.totalValue || ""}
                      onChange={(e) => patch({ totalValue: Number(e.target.value) })}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Prazo de entrega final">
                    <input
                      type="date"
                      value={doc.deadline}
                      onChange={(e) => patch({ deadline: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                  <div>
                    <span className="text-sm font-medium">Marcos de pagamento</span>
                    <div className="mt-2 space-y-2">
                      {doc.milestones.map((m) => (
                        <div key={m.id} className="flex items-center gap-2">
                          <input
                            value={m.label}
                            onChange={(e) =>
                              patch({
                                milestones: doc.milestones.map((x) =>
                                  x.id === m.id ? { ...x, label: e.target.value } : x,
                                ),
                              })
                            }
                            placeholder="Ex: Entrada (assinatura)"
                            className={`${inputCls} flex-1`}
                          />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={m.percent || ""}
                            onChange={(e) =>
                              patch({
                                milestones: doc.milestones.map((x) =>
                                  x.id === m.id ? { ...x, percent: Number(e.target.value) } : x,
                                ),
                              })
                            }
                            className={`${inputCls} w-20`}
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                          <button
                            onClick={() =>
                              patch({ milestones: doc.milestones.filter((x) => x.id !== m.id) })
                            }
                            className="rounded-md p-2 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          patch({
                            milestones: [...doc.milestones, { id: uid(), label: "", percent: 0 }],
                          })
                        }
                        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <Plus className="h-4 w-4" /> Adicionar marco
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Field label="Valor mensal (R$)">
                    <input
                      type="number"
                      min={0}
                      value={doc.monthlyValue || ""}
                      onChange={(e) => patch({ monthlyValue: Number(e.target.value) })}
                      className={inputCls}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Dia de vencimento">
                      <input
                        type="number"
                        min={1}
                        max={28}
                        value={doc.dueDay || ""}
                        onChange={(e) => patch({ dueDay: Number(e.target.value) })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Vigência mínima (meses)">
                      <select
                        value={doc.minTermMonths}
                        onChange={(e) => patch({ minTermMonths: Number(e.target.value) })}
                        className={inputCls}
                      >
                        {[3, 6, 12, 24].map((m) => (
                          <option key={m} value={m}>
                            {m} meses
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Aviso prévio (dias)">
                      <input
                        type="number"
                        min={0}
                        value={doc.noticeDays || ""}
                        onChange={(e) => patch({ noticeDays: Number(e.target.value) })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Índice de reajuste anual">
                      <select
                        value={doc.adjustmentIndex}
                        onChange={(e) => patch({ adjustmentIndex: e.target.value })}
                        className={inputCls}
                      >
                        {["IPCA", "IGP-M", "INPC", "Sem reajuste"].map((i) => (
                          <option key={i}>{i}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <StepTitle>Escopo e entregáveis</StepTitle>
              <p className="text-sm text-muted-foreground">
                Liste os itens do escopo. Desmarque o que não está incluso neste documento.
              </p>
              {doc.scope.map((item) => (
                <div key={item.id} className="space-y-2 rounded-lg border bg-background p-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.included}
                      onChange={(e) =>
                        patch({
                          scope: doc.scope.map((x) =>
                            x.id === item.id ? { ...x, included: e.target.checked } : x,
                          ),
                        })
                      }
                      className="h-4 w-4 accent-primary"
                      title="Entregável incluso"
                    />
                    <input
                      value={item.title}
                      onChange={(e) =>
                        patch({
                          scope: doc.scope.map((x) =>
                            x.id === item.id ? { ...x, title: e.target.value } : x,
                          ),
                        })
                      }
                      placeholder="Título do item (ex: Design das telas)"
                      className={`${inputCls} flex-1`}
                    />
                    <button
                      onClick={() => patch({ scope: doc.scope.filter((x) => x.id !== item.id) })}
                      className="rounded-md p-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={item.description}
                    onChange={(e) =>
                      patch({
                        scope: doc.scope.map((x) =>
                          x.id === item.id ? { ...x, description: e.target.value } : x,
                        ),
                      })
                    }
                    placeholder="Descrição detalhada do entregável…"
                    rows={2}
                    className={`${inputCls} resize-none`}
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  patch({
                    scope: [...doc.scope, { id: uid(), title: "", description: "", included: true }],
                  })
                }
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <Plus className="h-4 w-4" /> Adicionar item ao escopo
              </button>
              <p className="rounded-lg bg-muted px-4 py-3 text-xs text-muted-foreground">
                As cláusulas de propriedade intelectual, confidencialidade e foro de eleição são
                incluídas automaticamente no documento final.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <StepTitle>Revisão final</StepTitle>
              <p className="text-sm text-muted-foreground">
                Confira o documento ao lado. Se estiver tudo certo, salve para gerar o documento.
              </p>
              <dl className="space-y-2 rounded-lg border bg-background p-4 text-sm">
                <Row k="Tipo" v={doc.type === "proposta" ? "Proposta Comercial" : "Contrato de Prestação de Serviços"} />
                <Row k="Título" v={doc.title || "—"} />
                <Row k="Cliente" v={doc.clientName || "—"} />
                <Row
                  k="Cobrança"
                  v={doc.billing === "pontual" ? "Projeto pontual" : "Recorrente mensal"}
                />
                <Row k="Itens de escopo" v={String(doc.scope.filter((s) => s.title.trim()).length)} />
              </dl>
            </div>
          )}

          {/* Navegação */}
          <div className="mt-8 flex items-center justify-between border-t pt-5">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Avançar <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={finish}
                className="flex items-center gap-1.5 rounded-lg bg-success px-5 py-2 text-sm font-semibold text-success-foreground hover:brightness-105"
              >
                <Check className="h-4 w-4" /> Salvar documento
              </button>
            )}
          </div>
        </div>

        {/* Preview A4 em tempo real */}
        <div className="flex-1 overflow-y-auto bg-muted/40 px-10 py-8">
          <A4Preview doc={doc} company={settings} />
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-lg font-semibold">{children}</h2>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}

function ChoiceCard({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
        active ? "border-primary bg-accent" : "border-border bg-background hover:border-primary/40"
      }`}
    >
      {icon && <span className={active ? "text-primary" : "text-muted-foreground"}>{icon}</span>}
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{desc}</span>
      </span>
    </button>
  );
}
