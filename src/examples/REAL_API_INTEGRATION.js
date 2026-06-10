/**
 * CONTOH: Integrasi Real API
 * File ini menunjukkan bagaimana cara menggunakan custom hooks dengan real API calls
 * 
 * Materi Pertemuan 11: useEffect + API Integration
 */

import { apiClient } from '@/services/apiClient';

// ============================================================================
// CONTOH 1: Fetch Contacts dari Real API
// ============================================================================

/**
 * Service function untuk fetch contacts
 * @param {string} searchQuery - Optional search filter
 * @returns {Promise<Array>} Array of contacts
 */
export const fetchContactsFromAPI = async (searchQuery = '') => {
  try {
    // Contoh API endpoint - sesuaikan dengan backend Anda
    const response = await apiClient.get('/contacts', {
      params: { 
        search: searchQuery,
        limit: 50,
      }
    });
    return response.data.data; // Adjust sesuai API response structure
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    throw error;
  }
};

/**
 * Service function untuk fetch contact detail
 * @param {string} contactId - Contact ID
 * @returns {Promise<Object>} Contact detail
 */
export const fetchContactDetailFromAPI = async (contactId) => {
  try {
    const response = await apiClient.get(`/contacts/${contactId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Contact not found');
    }
    throw error;
  }
};

// ============================================================================
// CONTOH 2: Menggunakan Custom Hook dengan Real API
// ============================================================================

/**
 * Contoh implementasi di Contacts.jsx dengan real API
 */
const ContactsWithRealAPI_Example = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect untuk fetch contacts saat search berubah
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dari API dengan search parameter
        const data = await fetchContactsFromAPI(searchQuery);
        setContacts(data);
      } catch (err) {
        setError(
          err instanceof Error 
            ? err.message 
            : "Failed to load contacts"
        );
      } finally {
        setLoading(false);
      }
    };

    // Debounce search untuk mengurangi API calls
    const debounceTimer = setTimeout(() => {
      fetchContacts();
    }, 300); // Wait 300ms before fetching

    // Cleanup debounce timer
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]); // Re-fetch saat searchQuery berubah

  // ... rest of component
};

// ============================================================================
// CONTOH 3: Dynamic Route dengan API
// ============================================================================

/**
 * Contoh implementasi ContactDetail dengan real API
 */
const ContactDetailWithRealAPI_Example = () => {
  const { contactId } = useParams();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contactId) {
      setError("Contact ID not provided");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchContactDetailFromAPI(contactId);
        
        if (isMounted) {
          setContact(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error 
              ? err.message 
              : "Failed to load contact"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetail();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, [contactId]); // Re-fetch saat contactId berubah

  // ... rest of component
};

// ============================================================================
// CONTOH 4: Dashboard dengan Multiple API Calls
// ============================================================================

/**
 * Service functions untuk dashboard analytics
 */
export const fetchDashboardStats = async () => {
  try {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDashboardChart = async (period = 'week') => {
  try {
    const response = await apiClient.get('/dashboard/chart', {
      params: { period }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Contoh implementasi dashboard dengan multiple API calls
 */
const DashboardWithRealAPI_Example = () => {
  const [stats, setStats] = useState(null);
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect untuk fetch semua dashboard data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data secara parallel
        const [statsData, chartData] = await Promise.all([
          fetchDashboardStats(),
          fetchDashboardChart('week')
        ]);

        setStats(statsData);
        setChart(chartData);
      } catch (err) {
        setError(
          err instanceof Error 
            ? err.message 
            : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Fetch hanya saat mount

  // useEffect untuk refresh chart jika period berubah
  useEffect(() => {
    const refreshChart = async (period) => {
      try {
        const chartData = await fetchDashboardChart(period);
        setChart(chartData);
      } catch (err) {
        console.error('Failed to refresh chart:', err);
      }
    };

    // Bisa dipicu dari UI
    // refreshChart('month');
  }, []); // Setup saat mount

  // ... rest of component
};

// ============================================================================
// CONTOH 5: Debouncing untuk Search
// ============================================================================

/**
 * Custom hook untuk search dengan debounce
 */
export const useSearchContacts = (delay = 300) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchContactsFromAPI(searchQuery);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, delay]);

  return { searchQuery, setSearchQuery, results, loading, error };
};

// ============================================================================
// CONTOH 6: Pagination dengan useEffect
// ============================================================================

/**
 * Contoh fetch paginated data
 */
const ContactsWithPagination_Example = () => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get('/contacts', {
          params: { 
            page,
            limit: 10,
          }
        });

        // Append ke existing contacts (jangan replace)
        setContacts(prev => 
          page === 1 
            ? response.data.data 
            : [...prev, ...response.data.data]
        );

        // Check if ada more data
        setHasMore(response.data.hasMore);
      } catch (err) {
        console.error('Failed to fetch page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [page]); // Re-fetch saat page berubah

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  return {
    contacts,
    loading,
    hasMore,
    loadMore,
  };
};

// ============================================================================
// CONTOH 7: Refresh/Refetch Pattern
// ============================================================================

/**
 * Custom hook dengan refetch capability
 */
export const useFetchWithRefresh = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const executeRefetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error occurred");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    executeRefetch();
  }, dependencies);

  return { 
    data, 
    loading, 
    error, 
    refetch: executeRefetch 
  };
};

// Penggunaan:
// const { data, loading, error, refetch } = useFetchWithRefresh(
//   () => fetchContactsFromAPI(),
//   []
// );

// ============================================================================
// CONTOH 8: Error Recovery
// ============================================================================

/**
 * Hook dengan automatic retry logic
 */
export const useFetchWithRetry = (
  fetchFn, 
  dependencies = [], 
  maxRetries = 3
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchWithRetry = async (attempt = 1) => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchFn();

        if (isMounted) {
          setData(result);
          setRetryCount(0); // Reset retry count on success
        }
      } catch (err) {
        if (isMounted) {
          if (attempt < maxRetries) {
            // Exponential backoff
            const delay = Math.pow(2, attempt) * 1000;
            setTimeout(() => {
              if (isMounted) {
                setRetryCount(attempt);
                fetchWithRetry(attempt + 1);
              }
            }, delay);
          } else {
            setError(
              err instanceof Error 
                ? err.message 
                : "Failed after retries"
            );
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWithRetry();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, retryCount };
};

// ============================================================================
// TIPS & BEST PRACTICES
// ============================================================================

/**
 * TIPS untuk API Integration:
 * 
 * 1. ALWAYS cleanup async operations:
 *    - Use isMounted flag untuk prevent state update after unmount
 *    - Clear timeouts/intervals di return function
 * 
 * 2. DEPENDENCIES array harus include semua external values:
 *    - Lupa include dependency = infinite loop atau stale data
 * 
 * 3. HANDLE loading dan error states:
 *    - Tidak hanya di useEffect, tapi di UI juga
 * 
 * 4. USE appropriate patterns:
 *    - Debounce untuk search
 *    - Throttle untuk scroll events
 *    - Exponential backoff untuk retries
 * 
 * 5. AVOID common pitfalls:
 *    - Jangan mutate state directly
 *    - Jangan return Promise dari useEffect
 *    - Jangan create object di dependencies (will cause infinite loop)
 */
