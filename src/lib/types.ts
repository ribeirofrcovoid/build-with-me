export type DocType = "proposta" | "contrato";
export type BillingModel = "pontual" | "recorrente";
export type DocStatus = "rascunho" | "enviado" | "aprovado";

export interface PaymentMilestone {
  id: string;
  label: string;
  percent: number;
}

export interface ScopeItem {
  id: string;
  title: string;
  description: string;
  included: boolean;
}

export interface DocData {
  id: string;
  type: DocType;
  billing: BillingModel;
  title: string;
  clientId: string | null;
  clientName: string;
  // pontual
  totalValue: number;
  deadline: string;
  milestones: PaymentMilestone[];
  // recorrente
  monthlyValue: number;
  dueDay: number;
  minTermMonths: number;
  noticeDays: number;
  adjustmentIndex: string;
  scope: ScopeItem[];
  status: DocStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  document: string; // CPF/CNPJ
}

export interface CompanySettings {
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export const STATUS_LABEL: Record<DocStatus, string> = {
  rascunho: "Rascunho",
  enviado: "Enviado",
  aprovado: "Aprovado",
};

export const TYPE_LABEL: Record<DocType, string> = {
  proposta: "Proposta Comercial",
  contrato: "Contrato de Prestação de Serviços",
};
