# 🔧 CORS Error Fix

## Problem
```
Access to fetch at 'http://localhost:5000/...' from origin 'http://localhost:5174' 
has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a 
value 'http://localhost:5173' that is not equal to the supplied origin.
```

**Root Cause**: 
- Frontend running di port **5174**
- Backend CORS hanya allow port **5173**

---

## ✅ Solution (COMPLETED)

### Step 1: Kill Process di Port 5173
```powershell
Get-NetTCPConnection -LocalPort 5173 | 
  Select-Object -ExpandProperty OwningProcess | 
  ForEach-Object { Stop-Process -Id $_ -Force }
```
✅ **Status**: Done - Process killed

### Step 2: Restart Dev Server
```bash
npm run dev
```

Dev server akan running di `http://localhost:5173` (sesuai dengan CORS backend)

---

## 🎯 Expected Result

**Before:**
```
❌ Port 5173 in use, trying another one...
➜  Local:   http://localhost:5174/
❌ CORS Error
```

**After:**
```
✅ VITE v7.1.12  ready in XXX ms
➜  Local:   http://localhost:5173/
✅ No CORS Error
```

---

## 🔍 How to Verify

1. **Check Dev Server Port**
   - Open terminal
   - Should see: `Local: http://localhost:5173/`

2. **Check Browser Console**
   - Login sebagai buyer
   - Should NOT see CORS errors
   - API calls should succeed

3. **Check Network Tab**
   - Open DevTools > Network
   - API calls should return 200 OK
   - No preflight errors

---

## 🚨 If Problem Persists

### Option 1: Manual Port Check
```powershell
# Check what's using port 5173
netstat -ano | findstr :5173

# Kill by PID
taskkill /F /PID <PID_NUMBER>
```

### Option 2: Update Backend CORS (if you have access)

**File**: `backend/server.js` or `backend/app.js`

**Find**:
```javascript
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

**Replace with**:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174']
}));
```

### Option 3: Use Different Port in vite.config.js

**File**: `vite.config.js`

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Try different port
    open: true,
  },
});
```

Then update backend CORS to allow `http://localhost:5175`

---

## 📝 Notes

- Always ensure frontend port matches backend CORS configuration
- Port 5173 is Vite's default port
- If port is occupied, Vite automatically tries next available port
- Backend needs to explicitly allow each origin (CORS security)

---

## ✅ Checklist

- [x] Killed process on port 5173
- [ ] Restart dev server with `npm run dev`
- [ ] Verify running on port 5173
- [ ] Test login - should work without CORS error
- [ ] Test MyOrdersPage - should fetch data successfully
- [ ] Test BuyerDashboard - summary should load
