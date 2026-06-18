import { normalizeTransaction } from "@/utils/reportUtils";

const STATUS_TO_API = {
  Menunggu: "menunggu",
  Diproses: "diproses",
  Selesai: "selesai",
  Dibatalkan: "dibatalkan",
};

const STATUS_FROM_API = {
  menunggu: "Menunggu",
  diproses: "Diproses",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

const PAYMENT_TO_API = {
  "Belum Lunas": "belum_lunas",
  DP: "dp",
  Lunas: "lunas",
};

const PAYMENT_FROM_API = {
  belum_lunas: "Belum Lunas",
  dp: "DP",
  lunas: "Lunas",
};

const METHOD_TO_API = {
  Tunai: "tunai",
  Transfer: "transfer",
  QRIS: "qris",
  Debit: "debit",
};

const METHOD_FROM_API = {
  tunai: "Tunai",
  transfer: "Transfer",
  qris: "QRIS",
  debit: "Debit",
};

export function extractApiList(response) {
  const payload = response?.data;
  if (!payload) return [];
  const inner = payload.data ?? payload;
  if (Array.isArray(inner)) return inner;
  if (Array.isArray(inner?.data)) return inner.data;
  return [];
}

export function extractApiItem(response) {
  const payload = response?.data;
  if (!payload) return null;
  return payload.data ?? payload;
}

export function mapApiTransactionToLocal(tx) {
  const lineItems = (tx.items ?? []).map((item) => ({
    itemId: item.id ?? item.itemId,
    nama: item.name ?? item.nama ?? "",
    qty: item.qty ?? 0,
    harga: item.price ?? item.harga ?? 0,
    subtotal: item.subtotal ?? 0,
  }));

  const laundryType = (tx.laundry_type ?? tx.layananType ?? "kiloan").toLowerCase();
  const statusKey = (tx.status ?? "menunggu").toLowerCase();
  const paymentKey = (tx.payment_status ?? tx.paymentStatus ?? "belum_lunas").toLowerCase();
  const methodKey = (tx.payment_method ?? tx.metodePembayaran ?? "tunai").toLowerCase();

  return normalizeTransaction({
    id: tx.id,
    apiId: tx.id,
    invoice: tx.invoice ?? `INV-${tx.id}`,
    customer: tx.customer?.name ?? tx.customer ?? "",
    phone: tx.customer?.phone ?? tx.phone ?? "",
    outlet: tx.outlet?.name ?? tx.outlet ?? "",
    outletId: tx.outlet?.id ?? tx.outlet_id ?? null,
    layananType: laundryType === "satuan" ? "Satuan" : "Kiloan",
    service: tx.service?.name ?? tx.service ?? "",
    serviceId: tx.service?.id ?? tx.service_id ?? null,
    weight: Number(tx.weight ?? 0),
    lineItems,
    subtotal: Number(tx.subtotal ?? 0),
    diskon: Number(tx.discount ?? tx.diskon ?? 0),
    total: Number(tx.total ?? 0),
    metodePembayaran: METHOD_FROM_API[methodKey] ?? tx.metodePembayaran ?? "Tunai",
    paymentStatus: PAYMENT_FROM_API[paymentKey] ?? tx.paymentStatus ?? "Belum Lunas",
    status: STATUS_FROM_API[statusKey] ?? tx.status ?? "Menunggu",
    tanggal: String(tx.transaction_date ?? tx.tanggal ?? "").slice(0, 10),
    finishDate: tx.finished_at ? String(tx.finished_at).slice(0, 10) : tx.finishDate ?? null,
    cancelled: statusKey === "dibatalkan" || Boolean(tx.cancelled),
    kasir: tx.cashier?.name ?? tx.kasir ?? "—",
    kasirId: tx.cashier?.id ?? tx.kasirId ?? null,
    statusHistory: tx.statusHistory ?? [],
    paymentStatusHistory: tx.paymentStatusHistory ?? [],
  });
}

export function mapLocalPatchToApi(patch) {
  const payload = {};

  if (patch.status !== undefined) {
    payload.status = STATUS_TO_API[patch.status] ?? String(patch.status).toLowerCase();
  }
  if (patch.paymentStatus !== undefined) {
    payload.payment_status = PAYMENT_TO_API[patch.paymentStatus] ?? String(patch.paymentStatus).toLowerCase();
  }
  if (patch.finishDate !== undefined) {
    payload.finished_at = patch.finishDate || null;
  }
  if (patch.cancelled === true) {
    payload.status = "dibatalkan";
  }

  return payload;
}

export function mapFormToApiPayload(form, context) {
  const {
    subtotal,
    total,
    lineItems,
    customerId,
    outletId,
    serviceId,
    tanggal,
    user,
  } = context;

  const laundryType = form.layananType === "Satuan" ? "satuan" : "kiloan";
  const items = laundryType === "satuan"
    ? lineItems.map((line) => ({
      item_id: line.itemId,
      qty: line.qty,
      price: line.harga,
    }))
    : [];

  return {
    customer_id: customerId,
    outlet_id: outletId,
    service_id: laundryType === "kiloan" ? serviceId : null,
    laundry_type: laundryType,
    weight: laundryType === "kiloan" ? Number(form.weight) : 0,
    subtotal,
    discount: Number(form.diskon) || 0,
    total,
    payment_method: METHOD_TO_API[form.metodePembayaran] ?? "tunai",
    payment_status: PAYMENT_TO_API[form.paymentStatus] ?? "belum_lunas",
    status: "menunggu",
    transaction_date: tanggal,
    finished_at: form.finishDate || null,
    notes: `Dibuat oleh ${user?.name ?? "Kasir"}`,
    items,
  };
}
