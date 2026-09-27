import { useSyncExternalStore } from "react";
import type { Client, CompanySettings, DocData } from "./types";

const DOCS_KEY = "docupro:docs";
const CLIENTS_KEY = "docupro:clients";
const SETTINGS_KEY = "docupro:settings";

const DEFAULT_SETTINGS: CompanySettings = {
  name: "Sua Empresa Ltda.",
  document: "00.000.000/0001-00",
  email: "contato@suaempresa.com.br",
  phone: "(11) 3000-0000",
  address: "Av. Paulista, 1000 — Bela Vista",
  city: "São Paulo/SP",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
  listeners.forEach((l) => l());
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ---- Documents ----
export function getDocs(): DocData[] {
  return read<DocData[]>(DOCS_KEY, []);
}
export function saveDoc(doc: DocData) {
  const docs = getDocs();
  const i = docs.findIndex((d) => d.id === doc.id);
  const next = { ...doc, updatedAt: new Date().toISOString() };
  if (i >= 0) docs[i] = next;
  else docs.unshift(next);
  write(DOCS_KEY, docs);
}
export function deleteDoc(id: string) {
  write(
    DOCS_KEY,
    getDocs().filter((d) => d.id !== id),
  );
}

// ---- Clients ----
export function getClients(): Client[] {
  return read<Client[]>(CLIENTS_KEY, []);
}
export function saveClient(client: Client) {
  const clients = getClients();
  const i = clients.findIndex((c) => c.id === client.id);
  if (i >= 0) clients[i] = client;
  else clients.unshift(client);
  write(CLIENTS_KEY, clients);
}
export function deleteClient(id: string) {
  write(
    CLIENTS_KEY,
    getClients().filter((c) => c.id !== id),
  );
}

// ---- Settings ----
export function getSettings(): CompanySettings {
  return read<CompanySettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
}
export function saveSettings(s: CompanySettings) {
  write(SETTINGS_KEY, s);
}

// ---- Hooks ----
export function useDocs() {
  return useSyncExternalStore(subscribe, getDocs, () => [] as DocData[]);
}
export function useClients() {
  return useSyncExternalStore(subscribe, getClients, () => [] as Client[]);
}
export function useSettings() {
  return useSyncExternalStore(subscribe, getSettings, () => DEFAULT_SETTINGS);
}

export function newDocDraft(): DocData {
  return {
    id: uid(),
    type: "proposta",
    billing: "pontual",
    title: "",
    clientId: null,
    clientName: "",
    totalValue: 0,
    deadline: "",
    milestones: [
      { id: uid(), label: "Entrada (assinatura)", percent: 50 },
      { id: uid(), label: "Entrega final", percent: 50 },
    ],
    monthlyValue: 0,
    dueDay: 10,
    minTermMonths: 12,
    noticeDays: 30,
    adjustmentIndex: "IPCA",
    scope: [{ id: uid(), title: "", description: "", included: true }],
    status: "rascunho",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
