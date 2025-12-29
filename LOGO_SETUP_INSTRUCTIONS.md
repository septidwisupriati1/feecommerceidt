# Instruksi Setup Logo Kurir

## Langkah 1: Simpan File Logo

Anda telah memberikan 4 file logo kurir. Silakan simpan file-file tersebut ke folder `public/couriers/` dengan nama file berikut:

1. **JNE Logo** → Simpan sebagai: `public/couriers/jne.png`
2. **J&T Express Logo** → Simpan sebagai: `public/couriers/jnt.png`
3. **SiCepat Logo** → Simpan sebagai: `public/couriers/sicepat.png`
4. **POS Indonesia Logo** → Simpan sebagai: `public/couriers/pos.png`

## Langkah 2: Logo Kurir Lainnya (Opsional)

Untuk kurir lain yang belum ada logonya, Anda dapat:

### Download logo resmi dari:
- **TIKI**: https://www.tiki.id atau cari "TIKI logo png"
- **Ninja Xpress**: https://www.ninjaxpress.co atau cari "Ninja Xpress logo png"
- **SAP Express**: https://www.sapexpress.id atau cari "SAP Express logo png"
- **Wahana**: https://www.wahana.com atau cari "Wahana logo png"
- **Lion Parcel**: https://lionparcel.com atau cari "Lion Parcel logo png"

### Simpan dengan nama:
- TIKI → `public/couriers/tiki.png`
- Ninja → `public/couriers/ninja.png`
- SAP → `public/couriers/sap.png`
- Wahana → `public/couriers/wahana.png`
- Lion → `public/couriers/lion.png`

## Langkah 3: Verifikasi Struktur Folder

Pastikan struktur folder Anda seperti ini:

```
fecommerce/
├── public/
│   └── couriers/
│       ├── jne.png          ✅ (sudah Anda berikan)
│       ├── jnt.png          ✅ (sudah Anda berikan)
│       ├── sicepat.png      ✅ (sudah Anda berikan)
│       ├── pos.png          ✅ (sudah Anda berikan)
│       ├── tiki.png         ⏳ (opsional)
│       ├── ninja.png        ⏳ (opsional)
│       ├── sap.png          ⏳ (opsional)
│       ├── wahana.png       ⏳ (opsional)
│       └── lion.png         ⏳ (opsional)
└── src/
    ├── components/
    │   └── CourierLogo.jsx
    └── data/
        └── couriers.js
```

## Langkah 4: Cara Menyimpan Logo

### Cara 1: Drag & Drop (Paling Mudah)
1. Buka folder `public/couriers/` di VS Code Explorer
2. Drag & drop file logo dari folder download Anda ke folder tersebut
3. Rename file sesuai nama yang benar (jne.png, jnt.png, dll)

### Cara 2: Copy Paste
1. Buka File Explorer Windows
2. Navigate ke folder project: `C:\Users\Hp\fecommerce\public\couriers\`
3. Copy-paste logo dari folder download
4. Rename sesuai nama yang benar

## Langkah 5: Test Logo

Setelah semua logo tersimpan:

1. Jalankan development server:
   ```bash
   npm run dev
   ```

2. Buka halaman seller pesanan (PesananPage)
3. Klik tombol "Kirim" pada pesanan yang sudah diproses
4. Logo kurir akan muncul di modal pemilihan kurir
5. Logo juga akan muncul di card pesanan setelah pengiriman diinput

## Fallback System

Jika logo tidak ditemukan atau gagal load, sistem akan otomatis menampilkan:
- **Badge berwarna** dengan kode kurir (contoh: "JNE", "J&T")
- Warna badge sesuai dengan brand color masing-masing kurir
- Ini memastikan UI tetap baik meskipun logo belum tersedia

## Troubleshooting

### Logo tidak muncul?

1. **Cek path file**:
   - Pastikan file ada di `public/couriers/`
   - Pastikan nama file HURUF KECIL semua (jne.png, bukan JNE.png)

2. **Cek format file**:
   - Format yang didukung: PNG, JPG, JPEG, WebP, SVG
   - Disarankan: PNG dengan background transparan

3. **Clear browser cache**:
   - Tekan Ctrl + F5 untuk hard reload
   - Atau buka DevTools > Network > Disable cache

4. **Restart dev server**:
   - Stop server (Ctrl + C)
   - Jalankan lagi: `npm run dev`

### Logo terlalu besar/kecil?

Logo akan otomatis di-resize sesuai konteks:
- Modal selector: 32px (h-8)
- Order card shipping info: 24px (h-6)
- Badge: 20px (h-5)

Gunakan logo dengan resolusi minimal 128x128px untuk hasil terbaik.

## Status Integrasi

### ✅ Sudah Terintegrasi:
- [x] Seller - Halaman Pesanan (PesananPage.jsx)
  - Modal pemilihan kurir dengan logo grid
  - Display logo di info pengiriman
  - Display logo di resi tracking

### 🔄 Akan Diintegrasikan:
- [ ] Admin - Halaman Pesanan
- [ ] Admin - Halaman Pengiriman
- [ ] Seller - Halaman Pengiriman
- [ ] Buyer - Halaman Checkout
- [ ] Buyer - Halaman Order History

---

**Catatan**: Folder `public/couriers/` sudah dibuat. Anda tinggal menyimpan file logo ke folder tersebut.
