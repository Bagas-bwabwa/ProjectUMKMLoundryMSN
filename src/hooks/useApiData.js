import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/services/apiClient";
import { getStoredToken } from "@/services/authService";

const STORAGE_PREFIX = "laundry_msn_";

function loadLocal(key, initial) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : initial;
  } catch {
    return initial;
  }
}

function saveLocal(key, data) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
}

/**
 * Map from pageConfigs storageKey → API endpoint name in apiClient.js
 */
const STORAGE_TO_API = {
  outlets: "outlets",
  services: "services",
  items: "items",
  expenses: "expenses",
  customers: "customers",
};

/**
 * Map API response fields to local field names used by frontend.
 * The frontend uses Indonesian field names (nama, harga, dll.)
 * while the API uses English names (name, price, etc.)
 */
function mapApiToLocal(storageKey, apiItem) {
  switch (storageKey) {
    case "outlets":
      return {
        id: apiItem.id,
        nama: apiItem.name,
        kota: apiItem.city,
        alamat: apiItem.address,
        telepon: apiItem.phone,
        status: apiItem.is_active !== false ? "Aktif" : "Nonaktif",
      };
    case "services":
      return {
        id: apiItem.id,
        nama: apiItem.name,
        harga: Number(apiItem.price),
        estimasi: apiItem.estimate ?? "-",
        status: apiItem.is_active !== false ? "Aktif" : "Nonaktif",
      };
    case "items":
      return {
        id: apiItem.id,
        nama: apiItem.name,
        harga: Number(apiItem.price),
        status: apiItem.is_active !== false ? "Aktif" : "Nonaktif",
      };
    case "expenses":
      return {
        id: apiItem.id,
        tanggal: apiItem.expense_date ?? "",
        kategori: apiItem.category ?? "",
        outlet: apiItem.outlet?.name ?? "",
        nominal: Number(apiItem.amount ?? 0),
        keterangan: apiItem.description ?? "",
      };
    case "customers":
      return {
        id: apiItem.id,
        name: apiItem.name,
        phone: apiItem.phone,
        email: apiItem.email,
        address: apiItem.address,
      };
    default:
      return apiItem;
  }
}

function mapLocalToApi(storageKey, localItem) {
  switch (storageKey) {
    case "outlets":
      return {
        name: localItem.nama,
        city: localItem.kota,
        address: localItem.alamat,
        phone: localItem.telepon,
        is_active: localItem.status !== "Nonaktif",
      };
    case "services":
      return {
        name: localItem.nama,
        price: Number(localItem.harga),
        estimate: localItem.estimasi,
        is_active: localItem.status !== "Nonaktif",
      };
    case "items":
      return {
        name: localItem.nama,
        price: Number(localItem.harga),
        is_active: localItem.status !== "Nonaktif",
      };
    case "expenses": {
      // Need outlet_id - try to find from local outlets data
      const outlets = loadLocal("outlets", []);
      const outlet = outlets.find((o) => o.nama === localItem.outlet);
      return {
        outlet_id: outlet?.id ?? localItem.outlet_id ?? 1,
        category: localItem.kategori,
        amount: Number(localItem.nominal),
        description: localItem.keterangan,
        expense_date: localItem.tanggal,
      };
    }
    default:
      return localItem;
  }
}

function extractList(response) {
  const payload = response?.data;
  if (!payload) return [];
  const inner = payload.data ?? payload;
  if (Array.isArray(inner)) return inner;
  if (Array.isArray(inner?.data)) return inner.data;
  return [];
}

function extractItem(response) {
  const payload = response?.data;
  if (!payload) return null;
  return payload.data ?? payload;
}

/**
 * Enhanced useLocalData that syncs with backend API when available.
 * Falls back to localStorage if API is not available.
 */
export function useApiData(storageKey, initialData) {
  const [data, setData] = useState(() => loadLocal(storageKey, initialData));
  const [loading, setLoading] = useState(false);
  const apiEndpoint = STORAGE_TO_API[storageKey];
  const syncedRef = useRef(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveLocal(storageKey, data);
  }, [storageKey, data]);

  // Sync from API on mount
  useEffect(() => {
    if (!apiEndpoint || !getStoredToken() || syncedRef.current) return;
    syncedRef.current = true;
    let mounted = true;

    async function fetchFromApi() {
      setLoading(true);
      try {
        const response = await api[apiEndpoint].getAll({ per_page: 500 });
        const items = extractList(response);
        if (mounted && items.length > 0) {
          const mapped = items.map((item) => mapApiToLocal(storageKey, item));
          setData(mapped);
        }
      } catch {
        // API not available, keep local data
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchFromApi();
    return () => { mounted = false; };
  }, [apiEndpoint, storageKey]);

  const add = useCallback(
    async (item) => {
      // Try API first
      if (apiEndpoint && getStoredToken()) {
        try {
          const apiPayload = mapLocalToApi(storageKey, item);
          const response = await api[apiEndpoint].create(apiPayload);
          const created = extractItem(response);
          if (created) {
            const mapped = mapApiToLocal(storageKey, created);
            setData((prev) => [...prev, mapped]);
            return;
          }
        } catch {
          // Fall through to local
        }
      }

      // Local fallback
      setData((prev) => {
        const id = prev.length ? Math.max(...prev.map((d) => d.id)) + 1 : 1;
        return [...prev, { ...item, id }];
      });
    },
    [apiEndpoint, storageKey]
  );

  const update = useCallback(
    async (id, item) => {
      // Try API first
      if (apiEndpoint && getStoredToken()) {
        try {
          const apiPayload = mapLocalToApi(storageKey, item);
          const response = await api[apiEndpoint].update(id, apiPayload);
          const updated = extractItem(response);
          if (updated) {
            const mapped = mapApiToLocal(storageKey, updated);
            setData((prev) => prev.map((d) => (d.id === id ? { ...mapped, id } : d)));
            return;
          }
        } catch {
          // Fall through to local
        }
      }

      // Local fallback
      setData((prev) => prev.map((d) => (d.id === id ? { ...d, ...item, id } : d)));
    },
    [apiEndpoint, storageKey]
  );

  const remove = useCallback(
    async (id) => {
      // Try API first
      if (apiEndpoint && getStoredToken()) {
        try {
          await api[apiEndpoint].delete(id);
        } catch {
          // Continue with local delete anyway
        }
      }

      setData((prev) => prev.filter((d) => d.id !== id));
    },
    [apiEndpoint, storageKey]
  );

  return { data, setData, add, update, remove, loading };
}
