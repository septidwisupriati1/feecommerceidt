# Testing Guide: Seller Review Page

## Quick Test Steps

### 1. Start Development Server
```powershell
cd c:\Users\Hp\fecommerce
npm run dev
```

### 2. Login as Seller
1. Buka browser: `http://localhost:5173`
2. Login dengan akun seller
3. Setelah login, akan redirect ke `/seller` (halaman produk)

### 3. Navigate to Review Page
- Klik menu **"Ulasan"** di sidebar
- Atau langsung ke: `http://localhost:5173/seller/ulasan`

### 4. Test Features

#### A. View Statistics (Top Cards)
✅ Should display:
- **Rating Keseluruhan** - Average rating (contoh: 4.3)
- **Total Ulasan** - Number in blue card
- **Rating Tertinggi** - 5-star count in yellow card
- **Perlu Dibalas** - Pending reviews in red card
- **Rating Breakdown** - Bar chart showing distribution (5★ to 1★)

#### B. Test Filters
1. **Click "Semua"** - Shows all reviews
2. **Click "5 ⭐"** - Shows only 5-star reviews
3. **Click "4 ⭐"** - Shows only 4-star reviews
4. **Click "3 ⭐"** - Shows only 3-star reviews
5. **Click "2 ⭐"** - Shows only 2-star reviews
6. **Click "1 ⭐"** - Shows only 1-star reviews

Expected: Page refetches data when filter changes

#### C. Test Search
1. Type in search box: **"Smartphone"**
   - Should filter reviews containing "Smartphone" in product name
2. Type: **"Diana"**
   - Should filter reviews by customer name "Diana"
3. Type: **"bagus"**
   - Should filter reviews containing "bagus" in comment
4. Clear search
   - Should show all reviews again

Expected: Search filters locally (no API call)

#### D. Test Reply to Review
1. Find review **without reply** (no blue box below)
2. Click **"Balas Ulasan"** button
3. Type reply in prompt: **"Terima kasih atas reviewnya!"**
4. Click OK
5. Expected:
   - Alert: "Balasan berhasil dikirim!"
   - Page refreshes
   - Blue box appears with your reply
   - Button changes to "Edit Balasan"

#### E. Test Edit Reply
1. Find review **with reply** (has blue box)
2. Click **"Edit Balasan"** button
3. Modify reply in prompt
4. Click OK
5. Expected:
   - Alert: "Balasan berhasil diupdate!"
   - Reply updates in blue box

#### F. Test Pagination (if more than 10 reviews)
1. Scroll to bottom
2. Should see pagination buttons: **Previous | 1 2 3 | Next**
3. Click **Next** or page number
4. Expected:
   - Shows loading spinner
   - Displays next page of reviews
   - Current page highlighted in blue

#### G. Test Error Handling
1. **Simulate backend error:**
   - Stop backend server (if running)
   - Refresh page
2. Expected:
   - Shows 8 fallback reviews (dummy data)
   - Console log: "Using fallback data for seller reviews"
   - All features still work with dummy data

3. **Test error retry:**
   - If error occurs, should see red error box
   - Click **"Coba Lagi"** button
   - Should attempt to refetch data

#### H. Test Loading State
1. Refresh page (F5)
2. Expected:
   - Spinner icon appears
   - Text: "Memuat ulasan..."
   - Statistics hidden during load
   - Smooth transition when data loads

## Expected Data (Fallback Mode)

### Sample Reviews in Fallback:
1. **Headphone Wireless Premium** - 5⭐ by Diana Evans (with reply)
2. **Tas Ransel Anti Air** - 4⭐ by Alice Brown (with reply)
3. **Kemeja Batik Modern** - 3⭐ by Bob Wilson (no reply)
4. **Smartphone Android** - 5⭐ by John Doe (with reply)
5. **Keyboard Mechanical RGB** - 4⭐ by Henry Wilson (with reply)
6. **Monitor Gaming 144Hz** - 2⭐ by Jack Anderson (no reply)
7. **Webcam HD 1080p** - 5⭐ by Isabella Taylor (with reply)
8. **Kaos Polo Premium** - 4⭐ by Jane Smith (no reply)

### Statistics (Fallback):
- Total: 8 reviews
- Average: 4.1 rating
- 5★: 3 reviews
- 4★: 3 reviews
- 3★: 1 review
- 2★: 1 review
- Pending: 4 (need reply)

## Console Logs to Check

### Normal Operation:
```
Fetching seller reviews with params: {page: 1, limit: 10, status: 'approved', sort: 'latest'}
Fetching seller review stats...
```

### Fallback Mode:
```
Using fallback data for seller reviews
Showing 8 sample reviews
```

### Errors:
```
Error fetching reviews: [error message]
Failed to load reviews
```

## Visual Checks

### ✅ Statistics Section
- [ ] Two cards side-by-side (desktop)
- [ ] Stacked cards (mobile)
- [ ] Rating number large and yellow
- [ ] Star icons filled correctly
- [ ] Bar chart shows correct percentages
- [ ] Numbers update when data changes

### ✅ Search & Filter Bar
- [ ] Search box on left with magnifying glass icon
- [ ] Filter buttons on right
- [ ] Active filter highlighted (blue or yellow)
- [ ] Responsive layout (wraps on mobile)

### ✅ Review Cards
- [ ] Avatar circle with initials
- [ ] Customer name bold
- [ ] Blue verified badge (if applicable)
- [ ] Star rating yellow
- [ ] Date formatted: "5 Jan 2025"
- [ ] Product emoji/image + name
- [ ] Order ID in blue mono font
- [ ] Review text readable
- [ ] Review images displayed (if any)
- [ ] Helpful counter clickable
- [ ] Seller reply in blue box with left border
- [ ] Reply/Edit button at bottom

### ✅ Loading State
- [ ] Spinner centered
- [ ] "Memuat ulasan..." text below spinner
- [ ] Content hidden during load

### ✅ Empty State
- [ ] Gray star icon centered
- [ ] "Tidak ada ulasan" message
- [ ] "Belum ada ulasan yang sesuai dengan filter" subtitle

### ✅ Error State
- [ ] Red background box
- [ ] Error message displayed
- [ ] "Coba Lagi" button visible
- [ ] Refresh icon on button

## Browser Testing

Test on:
- ✅ Chrome (main browser)
- ✅ Firefox
- ✅ Edge
- ✅ Mobile view (Chrome DevTools)

## Performance Checks

1. **Initial Load** - Should load within 1-2 seconds
2. **Filter Change** - Instant with loading indicator
3. **Search** - Instant (no API call)
4. **Reply** - Submit within 1 second
5. **Pagination** - Smooth transition

## Common Issues & Solutions

### Issue: "Tidak ada ulasan" shows but should have data
**Check:**
- Filter is not too restrictive
- Status filter matches available reviews
- Search query matches some reviews
- Fallback data loaded correctly

### Issue: Reply button doesn't work
**Check:**
- Console for JavaScript errors
- Network tab for API call
- Token in localStorage
- Review ID is valid

### Issue: Statistics show NaN or 0
**Check:**
- Stats API returned data
- Fallback stats object correct
- rating_breakdown object has all keys (1-5)

### Issue: Page keeps loading
**Check:**
- useEffect dependencies correct
- No infinite loop in fetchReviews()
- Backend responding
- Network tab for stuck requests

## Backend Integration Test

When backend is ready, test these scenarios:

1. **Empty Database**
   - Should show "Tidak ada ulasan"
   - Stats should show all zeros

2. **With Real Data**
   - Reviews should match database
   - Filter should work server-side
   - Pagination should work correctly
   - Stats should calculate correctly

3. **Reply Submission**
   - POST to `/seller/reviews/:id/reply`
   - Should update database
   - Refresh should show new reply

4. **Error Scenarios**
   - 401 Unauthorized → Redirect to login
   - 403 Forbidden → Access denied message
   - 500 Server Error → Error message with retry

---

## Test Checklist

Before marking as complete:
- [ ] Statistics display correctly
- [ ] All filter buttons work
- [ ] Search filters locally
- [ ] Reply to review works
- [ ] Edit reply works
- [ ] Pagination works (if applicable)
- [ ] Loading state appears
- [ ] Error state with retry button
- [ ] Empty state when no reviews
- [ ] Fallback data works
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] All API calls include token
- [ ] Date formatting correct
- [ ] Rating stars display correctly

---

**Test Status:** Ready for Testing
**Fallback Mode:** Available (8 sample reviews)
**Backend Required:** Optional (works without backend)
