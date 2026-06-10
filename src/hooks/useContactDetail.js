import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Custom hook untuk handle dynamic route dengan data fetching
 * Materi Pertemuan 11: Dynamic Route + useEffect
 * 
 * @param {function} fetchFn - Function untuk fetch detail data by id
 * @returns {object} { data, loading, error, contactId }
 */
export function useContactDetail(fetchFn) {
  const { contactId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contactId) {
      setError('Contact ID not provided');
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn(contactId);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contact');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [contactId, fetchFn]);

  return { data, loading, error, contactId };
}
