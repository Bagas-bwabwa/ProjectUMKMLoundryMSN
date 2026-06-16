import { useCallback, useEffect, useState } from "react";

const STORAGE_PREFIX = "laundry_msn_";

function load(key, initial) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : initial;
  } catch {
    return initial;
  }
}

export function useLocalData(key, initialData) {
  const [data, setData] = useState(() => load(key, initialData));

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  }, [key, data]);

  const add = useCallback((item) => {
    setData((prev) => {
      const id = prev.length ? Math.max(...prev.map((d) => d.id)) + 1 : 1;
      return [...prev, { ...item, id }];
    });
  }, []);

  const update = useCallback((id, item) => {
    setData((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...item, id } : d))
    );
  }, []);

  const remove = useCallback((id) => {
    setData((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return { data, setData, add, update, remove };
}

export function getLocalData(key, initialData) {
  return load(key, initialData);
}
