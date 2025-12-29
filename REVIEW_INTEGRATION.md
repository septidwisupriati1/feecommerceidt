# Review Integration Documentation

## Overview
Halaman Ulasan Seller telah diintegrasikan dengan backend API menggunakan service `sellerReviewAPI.js`.

## Files Modified/Created

### 1. `src/services/sellerReviewAPI.js` ✅ CREATED
API service untuk mengelola ulasan produk seller.

**Endpoints:**
- `GET /api/ecommerce/seller/reviews` - Fetch ulasan dengan filter
- `GET /api/ecommerce/seller/reviews/stats` - Statistik ulasan
- `POST /api/ecommerce/seller/reviews/:id/reply` - Balas ulasan

**Functions:**
```javascript
getSellerReviews(params)
  - Query params: page, limit, product_id, rating, status, sort
  - Returns: { success, message, data: { reviews, pagination } }

getSellerReviewStats()
  - Returns: { success, data: { total_reviews, average_rating, rating_breakdown, pending_reviews, recent_reviews } }

replyToReview(reviewId, replyText)
  - Post seller reply to review
  - Returns: { success, message, data: { review } }
```

**Helper Functions:**
- `formatDate(dateString)` - Format tanggal Indonesia
- `getStatusLabel(status)` - Label status review
- `getStatusColor(status)` - Warna status badge
- `getRatingStars(rating)` - Generate rating stars

**Fallback Mode:**
- Menyediakan 8 sample reviews jika backend tidak tersedia
- Mendukung filtering dan sorting di client-side
- Data realistis untuk development

### 2. `src/pages/seller/UlasanPage.jsx` ✅ UPDATED
Halaman review seller telah diintegrasikan dengan API.

**State Management:**
```javascript
// API Data
const [reviews, setReviews] = useState([]);
const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [pagination, setPagination] = useState({...});

// Filters
const [searchQuery, setSearchQuery] = useState('');
const [filterRating, setFilterRating] = useState('all');
const [filterStatus, setFilterStatus] = useState('approved');
const [sortBy, setSortBy] = useState('latest');
```

**Key Features:**
1. **Auto-fetch on mount** - useEffect fetch reviews dan stats
2. **Filter triggers refetch** - Rating, status, sort otomatis fetch ulang
3. **Local search** - Search dilakukan setelah data di-fetch
4. **Loading state** - Spinner saat loading
5. **Error handling** - Pesan error dengan tombol retry
6. **Pagination** - Previous/Next buttons
7. **Reply to reviews** - Modal prompt untuk balas ulasan
8. **Edit reply** - Edit balasan yang sudah ada

**Functions:**
```javascript
fetchReviews() - Fetch reviews dari API dengan filter
fetchStats() - Fetch statistik ulasan
handleReply(reviewId, existingReply) - Balas/edit balasan
handlePageChange(newPage) - Ganti halaman
handleFilterChange(rating) - Filter rating + reset page
handleRefresh() - Refresh data
```

## API Response Structure

### Review Object
```javascript
{
  id: number,
  product: {
    id: number,
    name: string,
    image: string // emoji atau URL
  },
  customer: {
    name: string,
    verified: boolean
  } | null,
  guest_name: string | null,
  rating: number (1-5),
  review_text: string,
  images: string[], // array of URLs atau emoji
  created_at: string (ISO date),
  order_id: string,
  seller_reply: string | null,
  helpful: number,
  status: 'pending' | 'approved' | 'rejected'
}
```

### Stats Object
```javascript
{
  total_reviews: number,
  average_rating: number,
  rating_breakdown: {
    1: number,
    2: number,
    3: number,
    4: number,
    5: number
  },
  pending_reviews: number,
  recent_reviews: Review[]
}
```

## How It Works

### 1. Initial Load
```
Component Mount 
  → fetchReviews() ← Call API with default params
  → fetchStats() ← Get statistics
  → Update state (reviews, stats)
  → Display data
```

### 2. Filter Change
```
User clicks filter button
  → handleFilterChange(rating)
  → Update filterRating state
  → Reset pagination to page 1
  → useEffect detects change
  → fetchReviews() with new filter
  → Display updated results
```

### 3. Reply to Review
```
User clicks "Balas Ulasan"
  → handleReply(reviewId)
  → Show prompt for reply text
  → Call replyToReview(reviewId, text)
  → If success:
    → fetchReviews() to refresh
    → fetchStats() to update counts
    → Show success alert
```

### 4. Search (Local)
```
User types in search box
  → Update searchQuery state
  → filteredReviews computed
  → Filter by customer name, product name, review text
  → Display filtered results (no API call)
```

## Testing the Integration

### Test Scenarios:

1. **Normal Flow (Backend Available)**
   - Open page → Should fetch real data from API
   - Filter by rating → Should refetch with filter
   - Search → Should filter locally
   - Reply → Should post to API and refresh

2. **Fallback Mode (Backend Unavailable)**
   - API fails → Falls back to dummy data (8 reviews)
   - All features still work with local data
   - Console shows "Using fallback data" message

3. **Error Handling**
   - Network error → Shows error message with "Coba Lagi" button
   - Click retry → Calls handleRefresh()

4. **Loading States**
   - Shows spinner while fetching
   - Statistics, filters, and reviews hidden during load
   - Smooth transition when data arrives

## Development Tips

### Enable Console Logs
Check browser console for:
- "Fetching seller reviews with params: {...}"
- "Using fallback data for seller reviews"
- "Error fetching reviews: ..."

### Test Filters
```javascript
// All reviews
filterRating: 'all'

// Only 5 stars
filterRating: '5'

// Approved reviews
filterStatus: 'approved'

// Latest first
sortBy: 'latest'
```

### API Integration Checklist
✅ Service file created (sellerReviewAPI.js)
✅ Imported in UlasanPage
✅ State management setup
✅ useEffect for auto-fetch
✅ Loading state implemented
✅ Error handling added
✅ Pagination implemented
✅ Filter triggers refetch
✅ Reply functionality integrated
✅ Fallback data available
✅ Helper functions (formatDate, renderStars)

## Next Steps

### Recommended Improvements:
1. **Replace prompt() with Modal** - Better UX untuk reply
2. **Image Preview** - Click untuk zoom foto review
3. **Export Excel** - Download laporan ulasan
4. **Filter by Product** - Dropdown pilih produk
5. **Sort Options** - Dropdown untuk berbagai sort (newest, oldest, highest rating, lowest rating)
6. **Bulk Actions** - Reply multiple reviews at once
7. **Rich Text Editor** - Format balasan (bold, italic, emoticon)

### Backend Requirements:
Pastikan backend menyediakan endpoints:
- `GET /api/ecommerce/seller/reviews?page=1&limit=10&rating=5&status=approved&sort=latest`
- `GET /api/ecommerce/seller/reviews/stats`
- `POST /api/ecommerce/seller/reviews/:id/reply` with body: `{ reply_text: "..." }`

## Troubleshooting

### Issue: Reviews tidak muncul
**Solution:** 
- Check browser console for errors
- Verify token di localStorage
- Test API endpoint dengan Postman
- Pastikan fallback mode bekerja (8 dummy reviews)

### Issue: Filter tidak berfungsi
**Solution:**
- Check useEffect dependencies: `[pagination.current_page, filterRating, filterStatus, sortBy]`
- Verify handleFilterChange reset pagination
- Check API params di console log

### Issue: Reply gagal
**Solution:**
- Verify reviewId valid
- Check API response di Network tab
- Pastikan seller authenticated
- Test dengan fallback mode

---

**Integration Status:** ✅ COMPLETE
**Last Updated:** January 2025
**Developer:** GitHub Copilot
