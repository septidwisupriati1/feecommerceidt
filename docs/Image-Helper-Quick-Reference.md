# 🖼️ Image Helper - Quick Reference

## 📦 Setup (One Time)

### 1. Import Helper
```javascript
import { getProductImageUrl, handleImageError } from '../utils/imageHelper';
```

### 2. Configure .env
```env
VITE_BACKEND_URL=http://localhost:5000
```

## 🚀 Usage - Copy & Paste Examples

### Product Image
```jsx
<img 
  src={getProductImageUrl(product.image_url)} 
  alt={product.name}
  onError={(e) => handleImageError(e)}
/>
```

### User Avatar
```jsx
import { getUserAvatarUrl, handleImageError } from '../utils/imageHelper';

<img 
  src={getUserAvatarUrl(user.avatar)} 
  alt={user.name}
  className="w-10 h-10 rounded-full"
  onError={(e) => handleImageError(e)}
/>
```

### Store Logo
```jsx
import { getStoreLogoUrl, handleImageError } from '../utils/imageHelper';

<img 
  src={getStoreLogoUrl(store.logo)} 
  alt={store.name}
  onError={(e) => handleImageError(e)}
/>
```

### Category Icon
```jsx
import { getCategoryIconUrl, handleImageError } from '../utils/imageHelper';

<img 
  src={getCategoryIconUrl(category.icon)} 
  alt={category.name}
  onError={(e) => handleImageError(e)}
/>
```

### Product Gallery (Multiple Images)
```jsx
import { getImageUrls, handleImageError } from '../utils/imageHelper';

const imageUrls = getImageUrls(product.images);

{imageUrls.map((url, index) => (
  <img 
    key={index}
    src={url} 
    alt={`${product.name} - ${index + 1}`}
    onError={(e) => handleImageError(e)}
  />
))}
```

### Primary Image
```jsx
import { getPrimaryImageUrl, handleImageError } from '../utils/imageHelper';

<img 
  src={getPrimaryImageUrl(product.images)} 
  alt={product.name}
  onError={(e) => handleImageError(e)}
/>
```

### Background Image
```jsx
import { getImageUrl } from '../utils/imageHelper';

<div 
  style={{ 
    backgroundImage: `url(${getImageUrl(store.banner_url)})` 
  }}
/>
```

### Custom Fallback
```jsx
<img 
  src={getProductImageUrl(product.image_url)} 
  onError={(e) => handleImageError(e, 'https://via.placeholder.com/200')}
/>
```

### With Lazy Loading
```jsx
<img 
  src={getProductImageUrl(product.image_url)} 
  loading="lazy"
  onError={(e) => handleImageError(e)}
/>
```

## 📝 Available Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `getImageUrl(path)` | Generic image URL | `getImageUrl('uploads/image.jpg')` |
| `getProductImageUrl(path)` | Product images | `getProductImageUrl(product.image_url)` |
| `getUserAvatarUrl(path)` | User avatars | `getUserAvatarUrl(user.avatar)` |
| `getStoreLogoUrl(path)` | Store logos | `getStoreLogoUrl(store.logo)` |
| `getCategoryIconUrl(path)` | Category icons | `getCategoryIconUrl(category.icon)` |
| `handleImageError(event)` | Error handling | `onError={(e) => handleImageError(e)}` |
| `getImageUrls(images)` | Multiple URLs | `getImageUrls(product.images)` |
| `getPrimaryImageUrl(images)` | Primary image | `getPrimaryImageUrl(product.images)` |

## ✅ Checklist

- [ ] Copy `imageHelper.js` to `src/utils/`
- [ ] Add `VITE_BACKEND_URL` to `.env`
- [ ] Import helper in component
- [ ] Replace hardcoded URLs with helper functions
- [ ] Add `onError` handler to all `<img>` tags
- [ ] Test dengan backend running
- [ ] Test dengan invalid URLs
- [ ] Update production `.env` saat deploy

## 🎯 Best Practices

1. ✅ **Always use helper functions** - Don't hardcode URLs
2. ✅ **Always add error handler** - Use `onError={(e) => handleImageError(e)}`
3. ✅ **Use specific functions** - `getProductImageUrl` vs generic `getImageUrl`
4. ✅ **Add alt text** - Accessibility important
5. ✅ **Use lazy loading** - Add `loading="lazy"` for better performance
6. ✅ **Test edge cases** - Empty, null, invalid paths

## 🐛 Common Issues

### Images not showing?
```bash
# Check backend is running
# Check VITE_BACKEND_URL in .env
# Check browser console for errors
# Restart Vite after changing .env
```

### CORS error?
```javascript
// Backend needs CORS config
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

### Wrong path?
```javascript
// Backend should return: 'uploads/products/image.jpg'
// NOT: 'http://localhost:5000/uploads/products/image.jpg'
```

## 📚 Full Documentation

See `docs/Image-URL-Configuration.md` for complete documentation.

See `src/examples/ImageHelperExamples.jsx` for more examples.

---

**Need help?** Check the full documentation or examples folder! 🚀
