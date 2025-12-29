# 🎨 Cara Mengganti Logo dengan Gambar Eksternal

## ✅ Perubahan yang Sudah Dilakukan

File `LandingPage-New.jsx` sudah diubah untuk menggunakan gambar logo:

```jsx
<img 
  src="/images/logo.png" 
  alt="E-Commerce Logo" 
  className={styles.navbarLogo}
/>
```

---

## 📁 Lokasi File Logo

Letakkan file logo Anda di salah satu lokasi berikut:

### **Opsi 1: Folder Public (Recommended)** ✅
```
public/
└── images/
    └── logo.png          ← Letakkan logo di sini
```

**Path di code**: `/images/logo.png`

### **Opsi 2: Folder Public/Images/Logo**
```
public/
└── images/
    └── logo/
        └── logo.png      ← Letakkan logo di sini
```

**Path di code**: `/images/logo/logo.png`

### **Opsi 3: Folder Assets (Import)**
```
src/
└── assets/
    └── logo.png          ← Letakkan logo di sini
```

**Cara import**:
```jsx
import logo from '../assets/logo.png';

<img src={logo} alt="Logo" />
```

---

## 🖼️ Format Logo yang Direkomendasikan

### **Spesifikasi**:
- **Ukuran**: 64x64px atau 128x128px (square)
- **Format**: PNG (dengan background transparan)
- **Ukuran File**: Max 50KB
- **Background**: Transparan untuk hasil terbaik

### **Alternatif Format**:
- SVG (scalable, ukuran kecil) - **Recommended!**
- WebP (ukuran lebih kecil dari PNG)
- JPG (jika background solid)

---

## 💻 Cara Implementasi

### **1. Gambar dari Folder Public**

```jsx
// LandingPage-New.jsx
<img 
  src="/images/logo.png"           // Path dari folder public
  alt="E-Commerce Logo" 
  className={styles.navbarLogo}
/>
```

### **2. Gambar dari URL Eksternal (CDN/Online)**

```jsx
<img 
  src="https://example.com/logo.png"  // URL lengkap
  alt="E-Commerce Logo" 
  className={styles.navbarLogo}
/>
```

### **3. Import dari Assets (Local)**

```jsx
// Di bagian atas file
import logo from '../assets/logo.png';

// Di component
<img 
  src={logo}                          // Variabel import
  alt="E-Commerce Logo" 
  className={styles.navbarLogo}
/>
```

### **4. Menggunakan SVG**

**Opsi A: SVG sebagai file**
```jsx
<img 
  src="/images/logo.svg" 
  alt="E-Commerce Logo" 
  className={styles.navbarLogo}
/>
```

**Opsi B: SVG sebagai Component (inline)**
```jsx
// Import SVG
import { ReactComponent as Logo } from '../assets/logo.svg';

// Gunakan sebagai component
<Logo className={styles.navbarLogo} />
```

---

## 🎨 Styling Logo

### **CSS yang Sudah Ada**

File: `LandingPage.module.css`

```css
.navbarLogo {
  width: 2rem;      /* 32px */
  height: 2rem;     /* 32px */
  color: #2563eb;   /* Warna (untuk SVG) */
}
```

### **Customization**

**Ubah ukuran logo**:
```css
.navbarLogo {
  width: 3rem;      /* Lebih besar: 48px */
  height: 3rem;
}

/* Atau ukuran custom */
.navbarLogo {
  width: 120px;
  height: 40px;     /* Rectangular logo */
  object-fit: contain;  /* Jaga proporsi */
}
```

**Tambah efek**:
```css
.navbarLogo {
  width: 2rem;
  height: 2rem;
  transition: all 0.3s;
  cursor: pointer;
}

.navbarLogo:hover {
  transform: scale(1.1);    /* Zoom saat hover */
  filter: brightness(1.2);  /* Lebih terang */
}
```

**Logo dengan border/shadow**:
```css
.navbarLogo {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;              /* Rounded */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);  /* Shadow */
  padding: 0.25rem;                   /* Space di dalam */
  background: white;                  /* Background putih */
}
```

---

## 📝 Contoh Lengkap

### **Contoh 1: Logo PNG dari Public**

```jsx
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarBrand} onClick={() => navigate('/')}>
          <img 
            src="/images/logo.png" 
            alt="E-Commerce Logo" 
            className={styles.navbarLogo}
          />
          <span className={styles.navbarTitle}>E-Commerce</span>
        </div>
      </div>
    </nav>
  );
}
```

### **Contoh 2: Logo dari URL Online**

```jsx
<img 
  src="https://cdn.example.com/my-logo.png" 
  alt="E-Commerce Logo" 
  className={styles.navbarLogo}
  onError={(e) => {
    // Fallback jika gambar gagal load
    e.target.src = '/images/logo-fallback.png';
  }}
/>
```

### **Contoh 3: Logo dengan Loading State**

```jsx
import { useState } from "react";
import { ShoppingBag } from "lucide-react";

export default function LandingPage() {
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    <div className={styles.navbarBrand}>
      {!logoLoaded && <ShoppingBag className={styles.navbarLogo} />}
      <img 
        src="/images/logo.png" 
        alt="Logo" 
        className={styles.navbarLogo}
        style={{ display: logoLoaded ? 'block' : 'none' }}
        onLoad={() => setLogoLoaded(true)}
        onError={() => setLogoLoaded(false)}
      />
      <span className={styles.navbarTitle}>E-Commerce</span>
    </div>
  );
}
```

---

## 🔧 Troubleshooting

### ❌ Logo tidak muncul

**Solusi**:
1. Pastikan file ada di folder `public/images/`
2. Cek nama file (case-sensitive): `logo.png` ≠ `Logo.PNG`
3. Refresh browser (Ctrl + F5)
4. Cek console browser untuk error
5. Pastikan path benar: `/images/logo.png` (mulai dari root)

### ❌ Logo terlalu besar/kecil

**Solusi**:
```css
.navbarLogo {
  width: auto;          /* Auto width */
  height: 2.5rem;       /* Fixed height */
  max-width: 150px;     /* Max width */
}
```

### ❌ Logo terdistorsi

**Solusi**:
```css
.navbarLogo {
  object-fit: contain;  /* Jaga proporsi */
  /* atau */
  object-fit: cover;    /* Fill container */
}
```

### ❌ Logo PNG background tidak transparan

**Solusi**:
1. Edit gambar dengan Photoshop/GIMP
2. Save as PNG dengan alpha channel
3. Atau gunakan online tool: [remove.bg](https://remove.bg)

---

## 🎁 Bonus: Multiple Logo (Light/Dark Mode)

```jsx
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);

  return (
    <img 
      src={isDark ? "/images/logo-dark.png" : "/images/logo-light.png"}
      alt="Logo" 
      className={styles.navbarLogo}
    />
  );
}
```

---

## 📋 Checklist Implementasi

- [ ] Siapkan file logo (PNG/SVG, 64x64px)
- [ ] Letakkan di folder `public/images/`
- [ ] Update path di component: `src="/images/logo.png"`
- [ ] Test di browser
- [ ] Sesuaikan ukuran di CSS jika perlu
- [ ] Tambah fallback untuk error handling
- [ ] Kompres gambar untuk performa

---

## 🌐 Sumber Logo Gratis

- [Flaticon](https://flaticon.com) - Icon & logo gratis
- [LogoMakr](https://logomakr.com) - Buat logo online
- [Canva](https://canva.com) - Design logo
- [Hatchful](https://hatchful.shopify.com) - Logo generator

---

## 📚 Referensi File

| File | Lokasi | Fungsi |
|------|--------|--------|
| LandingPage-New.jsx | src/pages/ | Component navbar |
| LandingPage.module.css | src/pages/ | Styling navbar |
| logo.png | public/images/ | File logo |

---

**💡 Rekomendasi**: Gunakan format **SVG** untuk logo karena:
- ✅ Scalable (tidak pecah di ukuran apapun)
- ✅ Ukuran file sangat kecil
- ✅ Bisa diubah warnanya via CSS
- ✅ Retina-ready
