# Dokumentasi Implementasi Materi Pertemuan 11

## Ringkasan Perubahan

Proyek telah diupdate dengan implementasi materi Pertemuan 11 tentang:
1. **Penggunaan useEffect Hook**
2. **useEffect dengan Dependencies State**
3. **Dynamic Route dengan Parameter Handling**

---

## 📁 File yang Diubah/Dibuat

### 1. Custom Hooks (Baru)

#### `src/hooks/useFetch.js`
- **Tujuan**: Custom hook untuk fetch data dengan proper dependency management
- **Fitur**:
  - Loading state management
  - Error handling
  - Refetch function
  - Dependencies array support

**Contoh Penggunaan**:
```jsx
const { data, loading, error, refetch } = useFetch(
  () => apiClient.get('/endpoint'),
  [dependencyValue]
);
```

#### `src/hooks/useContactDetail.js`
- **Tujuan**: Hook khusus untuk dynamic route dengan data fetching
- **Fitur**:
  - Extract contactId dari URL params
  - Fetch detail data berdasarkan ID
  - Memory leak prevention

**Contoh Penggunaan**:
```jsx
const { data, loading, error, contactId } = useContactDetail(fetchDetailFn);
```

---

### 2. Views/Components yang Diupdate

#### `src/views/Contacts.jsx`
**Perubahan**:
- ✅ Tambah `useState` untuk contacts, filteredContacts, searchQuery
- ✅ Tambah `useEffect` untuk initial fetch (dependencies: [])
- ✅ Tambah `useEffect` untuk filter search (dependencies: [searchQuery, contacts])
- ✅ Loading state dengan spinner
- ✅ Error state dengan error message dan retry button
- ✅ Search functionality dengan real-time filtering
- ✅ Empty state handling

**Konsep Materi Diimplementasikan**:
- useEffect tanpa dependencies → fetch data saat mount
- useEffect dengan dependencies → filter saat search berubah
- Cleanup function jika ada async operation

---

#### `src/views/ContactDetail.jsx`
**Perubahan**:
- ✅ Tambah `useState` untuk contact, loading, error
- ✅ Tambah `useEffect` dengan dependency [contactId]
- ✅ Memory leak prevention dengan isMounted flag
- ✅ Loading state UI
- ✅ Error state UI dengan descriptive messages
- ✅ Re-fetch saat contactId berubah

**Konsep Materi Diimplementasikan**:
- Dynamic route parameter dengan useParams
- useEffect dengan specific dependency (contactId)
- Cleanup function untuk prevent memory leak
- Side effect handling untuk navigation changes

---

#### `src/views/Dashboard.jsx`
**Perubahan**:
- ✅ Tambah state untuk dashboardData, loading, error
- ✅ Tambah `useEffect` untuk fetch dashboard metrics
- ✅ Loading UI dengan spinner
- ✅ Error UI dengan error message
- ✅ State management untuk task checklist
- ✅ Dinamis render data dari state

**Konsep Materi Diimplementasikan**:
- useEffect untuk data initialization
- Multiple state management
- UI reactivity based on state changes

---

#### `src/views/DashboardAnalytics.jsx`
**Perubahan**:
- ✅ Tambah state untuk analyticsData, loading, error
- ✅ Tambah `useEffect` untuk fetch analytics
- ✅ Loading skeleton/spinner
- ✅ Error boundary with retry
- ✅ Dinamis chart data dari state

**Konsep Materi Diimplementasikan**:
- useEffect untuk data fetching
- State management untuk complex data structures
- Loading/error states handling

---

## 🎯 Konsep Materi yang Diimplementasikan

### 1. useEffect Hook Basics
```jsx
useEffect(() => {
  // Side effect code here
  console.log('Component mounted or dependencies changed');
  
  // Optional: Cleanup function
  return () => {
    console.log('Cleanup');
  };
}, []); // Dependencies array
```

### 2. Dependencies Array Variations

#### Tidak ada dependencies (jalankan setiap render)
```jsx
useEffect(() => {
  console.log('Runs on every render');
});
```

#### Empty array (jalankan hanya saat mount)
```jsx
useEffect(() => {
  console.log('Runs once on mount');
}, []);
```

#### Dengan dependencies (jalankan saat dependencies berubah)
```jsx
useEffect(() => {
  console.log('Runs when searchQuery changes');
}, [searchQuery]); // Hanya re-run jika searchQuery berubah
```

### 3. Dynamic Routes dengan Parameters
```jsx
// Route definition
{ path: "contacts/:contactId", element: <ContactDetailPage /> }

// Extract parameter
const { contactId } = useParams();

// Use in useEffect
useEffect(() => {
  fetchContactDetail(contactId);
}, [contactId]); // Re-fetch jika contactId berubah
```

### 4. Cleanup Functions
```jsx
useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    const result = await apiCall();
    if (isMounted) {
      setState(result);
    }
  };

  fetchData();

  // Cleanup function
  return () => {
    isMounted = false; // Prevent memory leak
  };
}, []);
```

---

## 🔄 Best Practices Diimplementasikan

### ✅ Loading States
```jsx
if (loading) {
  return <LoadingSpinner />;
}
```

### ✅ Error Handling
```jsx
if (error) {
  return <ErrorMessage error={error} onRetry={refetch} />;
}
```

### ✅ Memory Leak Prevention
```jsx
useEffect(() => {
  let isMounted = true;
  
  const fetchData = async () => {
    const data = await fetch();
    if (isMounted) setState(data); // Hanya update jika still mounted
  };
  
  return () => { isMounted = false; }; // Cleanup
}, []);
```

### ✅ Conditional Dependencies
```jsx
useEffect(() => {
  // Fetch hanya jika contactId tersedia
  if (!contactId) {
    setError('ID not provided');
    return;
  }
  
  fetchDetail(contactId);
}, [contactId]); // Only re-run if contactId changes
```

---

## 📊 Integrasi API

Semua komponen sekarang siap untuk integrasi dengan real API:

```jsx
// Di hooks atau komponen
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await apiClient.get('/endpoint');
      setData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };
  
  fetchData();
}, []);
```

---

## 🚀 Cara Menggunakan Custom Hooks

### useFetch Hook
```jsx
import { useFetch } from '@/hooks/useFetch';

function MyComponent() {
  const { data, loading, error, refetch } = useFetch(
    async () => {
      const response = await apiClient.get('/users');
      return response.data;
    },
    [] // dependencies
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <div>{data}</div>;
}
```

### useContactDetail Hook
```jsx
import { useContactDetail } from '@/hooks/useContactDetail';

function ContactDetailPage() {
  const { data, loading, error } = useContactDetail(
    async (id) => {
      const response = await apiClient.get(`/contacts/${id}`);
      return response.data;
    }
  );

  // UI rendering
}
```

---

## ✨ Fitur yang Ditambahkan

### 1. Search Functionality (Contacts)
- Real-time search filtering
- Case-insensitive search
- Search across multiple fields (name, email, phone)

### 2. Dynamic Routing (ContactDetail)
- Automatic re-fetch saat URL parameter berubah
- Proper error handling untuk invalid IDs
- Loading state saat fetch

### 3. Task Checklist (Dashboard)
- Interactive checkbox for tasks
- Visual feedback dengan line-through
- State persistence

### 4. Analytics Data Fetching (DashboardAnalytics)
- Structured state management
- Proper loading/error states
- Chart data dari state

---

## 📝 Testing Tips

### Test Loading State
```jsx
// Komponen akan menampilkan spinner saat loading
// Jalankan dengan simulasi delay di API call
```

### Test Error Handling
```jsx
// Throw error di fetch function
// Komponen akan menampilkan error message
```

### Test Dynamic Route
```jsx
// Navigate ke /contacts/1, /contacts/2, dll
// Komponen akan re-fetch data sesuai ID
```

### Test Search
```jsx
// Type di search input
// Filtered contacts akan update dalam real-time
```

---

## 🔗 Referensi

- React Hooks Documentation: https://react.dev/reference/react
- useEffect Hook: https://react.dev/reference/react/useEffect
- React Router useParams: https://reactrouter.com/en/main/hooks/useParams

---

## 📌 Catatan Penting

1. **Dependencies Array**: Selalu include semua variable yang digunakan di dalam useEffect
2. **Memory Leak**: Selalu cleanup di useEffect untuk prevent memory leak
3. **Async Operation**: Jangan return Promise dari useEffect, gunakan function async di dalam effect
4. **Infinite Loop**: Hati-hati dengan dependencies array, bisa cause infinite loop jika salah

---

Semua implementasi sudah siap untuk integrasi dengan backend API!
