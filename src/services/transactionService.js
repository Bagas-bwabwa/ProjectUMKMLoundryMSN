import { api } from "@/services/apiClient";
import {
  extractApiItem,
  extractApiList,
  mapApiTransactionToLocal,
  mapFormToApiPayload,
  mapLocalPatchToApi,
} from "@/utils/apiBridge";
import { getStoredToken } from "@/services/authService";

export function hasApiSession() {
  return Boolean(getStoredToken());
}

export async function fetchTransactionsFromApi() {
  const response = await api.transactions.getAll({ per_page: 500 });
  return extractApiList(response).map(mapApiTransactionToLocal);
}

async function fetchOutlets() {
  const response = await api.outlets.getAll();
  return extractApiList(response);
}

async function fetchServices() {
  const response = await api.services.getAll();
  return extractApiList(response);
}

async function fetchCustomers() {
  const response = await api.customers.getAll({ per_page: 500 });
  return extractApiList(response);
}

async function resolveOutletId(outletName) {
  const outlets = await fetchOutlets();
  const match = outlets.find((o) => o.name === outletName || o.nama === outletName);
  return match?.id ?? outlets[0]?.id ?? null;
}

async function resolveServiceId(serviceName) {
  if (!serviceName) return null;
  const services = await fetchServices();
  const match = services.find((s) => s.name === serviceName || s.nama === serviceName);
  return match?.id ?? null;
}

async function ensureCustomerId(name, phone) {
  const customers = await fetchCustomers();
  const normalizedPhone = phone?.trim();
  const existing = customers.find((c) =>
    (normalizedPhone && c.phone === normalizedPhone) ||
    c.name?.toLowerCase() === name.trim().toLowerCase()
  );
  if (existing?.id) return existing.id;

  const fallbackPhone = normalizedPhone || `08${String(Date.now()).slice(-9)}`;
  const created = await api.customers.create({
    name: name.trim(),
    phone: fallbackPhone,
  });
  return extractApiItem(created)?.id ?? null;
}

export async function createTransactionOnApi(form, context) {
  const customerId = await ensureCustomerId(form.customer, form.phone);
  const outletId = await resolveOutletId(form.outlet);
  if (!customerId || !outletId) return null;

  const serviceId = form.layananType === "Kiloan"
    ? await resolveServiceId(form.service)
    : null;

  const payload = mapFormToApiPayload(form, {
    ...context,
    customerId,
    outletId,
    serviceId,
  });

  const response = await api.transactions.create(payload);
  const created = extractApiItem(response);
  return created ? mapApiTransactionToLocal(created) : null;
}

export async function updateTransactionOnApi(transactionId, patch) {
  const payload = mapLocalPatchToApi(patch);
  if (!Object.keys(payload).length) return null;
  const response = await api.transactions.update(transactionId, payload);
  const updated = extractApiItem(response);
  return updated ? mapApiTransactionToLocal(updated) : null;
}
