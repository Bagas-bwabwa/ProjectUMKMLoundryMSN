import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook untuk fetch data dengan dependency management
 * Materi Pertemuan 11: useEffect dengan dependencies state
 * 
 * @param {function} fetchFn - Function yang melakukan API call
 * @param {array} dependencies - Dependencies array untuk re-fetch
 * @returns {object} { data, loading, error, refetch }
 */
export function useFetch(fetchFn, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
}
