# 🔗 Integrasi API Backend - HomePage

## ✅ Yang Sudah Dilakukan

HomePage-New.jsx sudah terintegrasi penuh dengan API backend untuk mengambil data produk dari database.

---

## 📋 Fitur yang Terintegrasi

### 1️⃣ **Fetch Produk dari Database**
```javascript
const fetchProducts = async () => {
  const params = {
    page: pagination.page,
    limit: 12,
    search: searchQuery || undefined,
    category_id: selectedCategory !== 'all' ? selectedCategory : undefined,
    sort_by: 'created_at',
    sort_order: 'desc'
  };

  const response = await browseProducts(params);
  
  if (response.success) {
    setProducts(response.data);
    setPagination(response.pagination);
  }
};
```

### 2️⃣ **Fetch Kategori dari Database**
```javascript
const fetchCategories = async () => {
  const response = await getCategories();
  if (response.success) {
    setCategories([
      { category_id: 'all', name: 'Semua' },
      ...response.data
    ]);
  }
};
```

### 3️⃣ **Search dengan Debounce**
```javascript
// User ketik di input
setSearchInput(value)
  ↓
// Tunggu 500ms (debounce)
  ↓
// Baru hit API
fetchProducts()
```

### 4️⃣ **Filter Kategori**
Klik kategori → Update selectedCategory → Fetch produk baru

### 5️⃣ **Pagination**
```javascript
// Tombol Prev/Next
<button onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}>
```

### 6️⃣ **Image dari Backend**
```javascript
import { getImageUrl } from '../utils/imageHelper';

<img src={getImageUrl(product.primary_image)} />
```

---

## 🔄 Data Flow

```
User Action
    ↓
Update State (category, search, page)
    ↓
Trigger useEffect
    ↓
Call fetchProducts()
    ↓
Hit API: browseProducts()
    ↓
Backend: Query database
    ↓
Response: { success: true, data: [...], pagination: {...} }
    ↓
Update State: setProducts(), setPagination()
    ↓
Re-render UI dengan data baru
```

---

## 📊 State Management

```javascript
const [products, setProducts] = useState([]);          // Data produk dari API
const [categories, setCategories] = useState([]);      // Data kategori dari API
const [loading, setLoading] = useState(true);          // Loading state
const [selectedCategory, setSelectedCategory] = useState("all");
const [searchInput, setSearchInput] = useState("");    // Input search (real-time)
const [searchQuery, setSearchQuery] = useState("");    // Query search (debounced)
const [pagination, setPagination] = useState({
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 1
});
```

---

## 🎯 API Endpoints yang Digunakan

### 1. Browse Products
```
GET /api/products/browse
```

**Parameters**:
- `page`: Halaman ke berapa (1, 2, 3, ...)
- `limit`: Jumlah produk per halaman (12)
- `search`: Keyword pencarian (optional)
- `category_id`: ID kategori (optional)
- `sort_by`: Field untuk sort (created_at)
- `sort_order`: Urutan sort (desc/asc)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "product_id": 1,
      "name": "Smartphone Gaming",
      "price": 12500000,
      "primary_image": "/uploads/products/phone.jpg",
      "rating_average": 4.8,
      "total_reviews": 156,
      "stock": 50,
      "category": {
        "category_id": 1,
        "name": "Elektronik"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5
  }
}
```

### 2. Get Categories
```
GET /api/categories
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "name": "Elektronik"
    },
    {
      "category_id": 2,
      "name": "Fashion"
    }
  ]
}
```

---

## 🚀 Cara Kerja

### **Search Produk**
1. User ketik di search bar
2. `setSearchInput(value)` → Update input
3. Debounce 500ms
4. `setSearchQuery(value)` → Trigger API call
5. API dipanggil dengan parameter `search`
6. Produk filtered ditampilkan

### **Filter Kategori**
1. User klik button kategori
2. `setSelectedCategory(id)` → Update kategori
3. `setPagination({ page: 1 })` → Reset ke halaman 1
4. useEffect triggered
5. API dipanggil dengan parameter `category_id`
6. Produk kategori tertentu ditampilkan

### **Pagination**
1. User klik "Selanjutnya" atau "Sebelumnya"
2. `setPagination({ page: newPage })`
3. useEffect triggered
4. API dipanggil dengan parameter `page`
5. Produk halaman baru ditampilkan

---

## 🎨 Loading States

### Loading
```jsx
{loading && (
  <div className={styles.loadingContainer}>
    <div className={styles.spinner}></div>
  </div>
)}
```

### Empty State
```jsx
{!loading && products.length === 0 && (
  <div className={styles.emptyState}>
    <Package className={styles.emptyStateIcon} />
    <h3>Produk tidak ditemukan</h3>
  </div>
)}
```

### Products Grid
```jsx
{!loading && products.length > 0 && (
  <div className={styles.productsGrid}>
    {products.map(product => ...)}
  </div>
)}
```

---

## 🔧 Troubleshooting

### Produk tidak muncul
**Cek**:
1. Backend server running? `npm run dev` di folder backend
2. Database ada data? Cek tabel `products`
3. CORS enabled? Cek `cors` di backend
4. Console browser ada error? F12 → Console

### Search tidak bekerja
**Cek**:
1. Debounce working? Tunggu 500ms setelah ketik
2. Parameter `search` dikirim? Cek Network tab F12
3. Backend handle search? Cek endpoint `/api/products/browse`

### Kategori tidak filter
**Cek**:
1. `category_id` dikirim? Cek Network tab
2. Backend handle filter kategori? 
3. Data kategori ada? Cek response `/api/categories`

### Pagination tidak jalan
**Cek**:
1. `totalPages` dari API benar?
2. Button disabled dengan benar?
3. Parameter `page` dikirim?

### Gambar tidak muncul
**Cek**:
1. Path gambar benar? `/uploads/products/...`
2. Backend serve static files?
3. `getImageUrl()` diimport?
4. Fallback placeholder ada?

---

## ⚡ Performance

### Optimasi yang Sudah Diterapkan

1. **Debounce Search** (500ms)
   - Mengurangi API calls saat user mengetik
   - Hanya hit API setelah user berhenti mengetik

2. **Pagination**
   - Load 12 produk per halaman
   - Tidak load semua produk sekaligus

3. **useEffect Dependencies**
   - Hanya re-fetch saat dependency berubah
   - Menghindari infinite loop

4. **Image Lazy Loading** (browser default)
   - Browser otomatis lazy load images

5. **Error Handling**
   - Fallback placeholder untuk gambar error
   - Prevent crash saat API error

---

## 📝 Next Steps (Optional)

### Fitur Tambahan yang Bisa Ditambahkan:

1. **Sort Options**
```javascript
const [sortBy, setSortBy] = useState('created_at');
const [sortOrder, setSortOrder] = useState('desc');

// Dropdown sort
<select onChange={(e) => setSortBy(e.target.value)}>
  <option value="created_at">Terbaru</option>
  <option value="price">Harga</option>
  <option value="rating_average">Rating</option>
</select>
```

2. **Price Range Filter**
```javascript
const [minPrice, setMinPrice] = useState('');
const [maxPrice, setMaxPrice] = useState('');

// Tambah ke API params
min_price: minPrice || undefined,
max_price: maxPrice || undefined
```

3. **View Mode (Grid/List)**
```javascript
const [viewMode, setViewMode] = useState('grid');

<div className={viewMode === 'grid' ? styles.productsGrid : styles.productsList}>
```

4. **Infinite Scroll**
```javascript
// Ganti pagination dengan infinite scroll
const handleScroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    loadMoreProducts();
  }
};
```

5. **Skeleton Loading**
```jsx
{loading && (
  <div className={styles.productsGrid}>
    {[...Array(12)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)}
```

---

## ✅ Checklist Integrasi

- [x] Import API functions (browseProducts, getCategories)
- [x] Setup state management
- [x] Fetch categories on mount
- [x] Fetch products dengan filters
- [x] Search dengan debounce
- [x] Filter kategori
- [x] Pagination controls
- [x] Loading states
- [x] Empty states
- [x] Error handling (image fallback)
- [x] Image helper integration
- [x] Responsive design
- [x] CSS pagination styles

---

**🎉 HomePage Sudah Terintegrasi Penuh dengan Backend!**

Data produk sekarang diambil dari database real-time, bukan lagi dari sample data.
