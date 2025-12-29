# Shipping Cost Calculation (Cek Ongkir) API

API untuk menghitung ongkos kirim dari alamat toko ke alamat pembeli menggunakan Raja Ongkir Delivery API.

## 📋 Table of Contents

- [Features](#features)
- [Endpoints](#endpoints)
- [Usage Examples](#usage-examples)
- [Response Format](#response-format)
- [Configuration](#configuration)
- [Testing](#testing)

---

## ✨ Features

1. **Calculate Shipping Cost** - Hitung ongkir untuk produk yang dipilih
2. **Calculate from Cart** - Hitung ongkir langsung dari keranjang belanja
3. **Multiple Products Support** - Support untuk multiple produk dengan quantity
4. **Weight & Dimension Calculation** - Otomatis hitung total berat & dimensi
5. **Available Couriers** - Daftar kurir yang tersedia

---

## 🔗 Endpoints

### 1. Get Available Couriers

**Endpoint**: `GET /api/ecommerce/buyer/shipping-cost/couriers`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "message": "Available couriers retrieved successfully",
  "data": [
    {
      "code": "jne",
      "name": "JNE",
      "services": ["REG", "YES", "OKE"]
    },
    {
      "code": "jnt",
      "name": "J&T Express",
      "services": ["REG", "EZ"]
    }
  ]
}
```

---

### 2. Calculate Shipping Cost (Selected Products)

**Endpoint**: `POST /api/ecommerce/buyer/shipping-cost/calculate`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "shipping_address_id": 1,
  "products": [
    {
      "product_id": 1,
      "variant_id": null,
      "quantity": 2
    },
    {
      "product_id": 3,
      "variant_id": 5,
      "quantity": 1
    }
  ],
  "origin_pin_point": "-7.279849431298132,109.35114360314475",
  "destination_pin_point": "-7.30585,109.36814"
}
```

**Parameters**:
- `shipping_address_id` (required): ID alamat pengiriman user
- `products` (required): Array of products
  - `product_id` (required): ID produk
  - `variant_id` (optional): ID varian produk
  - `quantity` (required): Jumlah produk (minimum 1)
- `origin_pin_point` (optional): Koordinat GPS toko (latitude,longitude)
- `destination_pin_point` (optional): Koordinat GPS alamat tujuan (latitude,longitude)

**Response**:
```json
{
  "message": "Shipping cost calculated successfully",
  "data": {
    "origin": {
      "store_name": "Toko Elektronik Jaya",
      "address": "Jl. Senayan No. 123",
      "province": "DKI Jakarta",
      "regency": "Jakarta Selatan",
      "district": "Kebayoran Baru",
      "postal_code": "12190"
    },
    "destination": {
      "label": "Rumah",
      "recipient_name": "John Doe",
      "phone": "081234567890",
      "address": "Jl. Kebon Jeruk No. 45",
      "province": "DKI Jakarta",
      "regency": "Jakarta Barat",
      "district": "Kebon Jeruk",
      "postal_code": "11530"
    },
    "package": {
      "total_weight": 1500,
      "weight_unit": "gram",
      "total_volume": 0.0012,
      "volume_unit": "cubic_meter",
      "dimensions": {
        "length": 31.0,
        "width": 14.4,
        "height": 1.6,
        "unit": "cm"
      },
      "item_value": 7000000,
      "total_products": 2,
      "products": [
        {
          "product_id": 1,
          "name": "Smartphone Android X1",
          "variant": "Warna: Hitam",
          "quantity": 2,
          "price": 3500000,
          "weight": 195,
          "weight_unit": "gram",
          "dimensions": {
            "length": 15.5,
            "width": 7.2,
            "height": 0.8
          },
          "subtotal": 7000000,
          "image": "/uploads/products/phone1-1.jpg"
        }
      ]
    },
    "shipping_options": [
      {
        "courier_code": "jne",
        "courier_name": "JNE",
        "service_name": "REG",
        "service_description": "Layanan Reguler",
        "cost": 15000,
        "etd": "2-3 hari",
        "note": ""
      },
      {
        "courier_code": "jne",
        "courier_name": "JNE",
        "service_name": "YES",
        "service_description": "Layanan One Day Service",
        "cost": 25000,
        "etd": "1 hari",
        "note": ""
      }
    ],
    "api_response": {
      "status": "success",
      "message": "OK"
    }
  }
}
```

---

### 3. Calculate Shipping Cost from Cart

**Endpoint**: `POST /api/ecommerce/buyer/shipping-cost/calculate-from-cart`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "shipping_address_id": 1,
  "origin_pin_point": "-7.279849431298132,109.35114360314475",
  "destination_pin_point": "-7.30585,109.36814"
}
```

**Parameters**:
- `shipping_address_id` (required): ID alamat pengiriman user
- `origin_pin_point` (optional): Koordinat GPS toko
- `destination_pin_point` (optional): Koordinat GPS alamat tujuan

**Response**: Same as Calculate Shipping Cost endpoint

---

## 📝 Usage Examples

### Example 1: Calculate Shipping Cost for Specific Products

```javascript
const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer YOUR_ACCESS_TOKEN");
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "shipping_address_id": 1,
  "products": [
    {
      "product_id": 1,
      "variant_id": null,
      "quantity": 2
    },
    {
      "product_id": 3,
      "variant_id": 5,
      "quantity": 1
    }
  ],
  "origin_pin_point": "-7.279849431298132,109.35114360314475",
  "destination_pin_point": "-7.30585,109.36814"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:5000/api/ecommerce/buyer/shipping-cost/calculate", requestOptions)
  .then((response) => response.json())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```

---

### Example 2: Calculate Shipping Cost from Cart

```javascript
const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer YOUR_ACCESS_TOKEN");
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "shipping_address_id": 1,
  "destination_pin_point": "-7.30585,109.36814"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:5000/api/ecommerce/buyer/shipping-cost/calculate-from-cart", requestOptions)
  .then((response) => response.json())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```

---

### Example 3: Get Available Couriers

```javascript
const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer YOUR_ACCESS_TOKEN");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("http://localhost:5000/api/ecommerce/buyer/shipping-cost/couriers", requestOptions)
  .then((response) => response.json())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```

---

## ⚙️ Configuration

### Environment Variables (.env)

Pastikan variabel berikut sudah dikonfigurasi di `.env`:

```env
# Raja Ongkir Delivery API
SHIPPING_DELIVERY_API_KEY="mfhM26BK9e16021079a0ec59bcqL0jh6"
BASE_URL_DEVLIVERY="https://api-sandbox.collaborator.komerce.id/"
```

### API Documentation

Raja Ongkir Delivery API Documentation:
- Base URL: `https://api-sandbox.collaborator.komerce.id/`
- Endpoint: `/tariff/api/v1/calculate`
- Method: `GET`
- Headers: `x-api-key: YOUR_API_KEY`

---

## 🔍 How It Works

### 1. Weight Calculation

System akan menghitung total berat dengan logic:
- Ambil weight dari setiap produk
- Convert ke gram (support kg, lb, oz)
- Kalikan dengan quantity
- Total semua produk

**Example**:
```
Product 1: 195 gram x 2 = 390 gram
Product 2: 250 gram x 1 = 250 gram
Total Weight: 640 gram
```

---

### 2. Dimension Calculation

System akan menghitung total dimensi dengan logic:
- Ambil length, width, height dari setiap produk (dalam cm)
- Kalikan dengan quantity
- Total semua produk

**Example**:
```
Product 1: 15.5 x 7.2 x 0.8 cm x 2 = 31 x 14.4 x 1.6 cm
Product 2: 30 x 40 x 2 cm x 1 = 30 x 40 x 2 cm
Total Dimensions: 61 x 54.4 x 3.6 cm
Total Volume: 0.012 cubic meter
```

---

### 3. Item Value Calculation

System akan menghitung total nilai barang:
- Ambil price dari setiap produk
- Tambahkan price_adjust jika ada variant
- Kalikan dengan quantity
- Total semua produk

**Example**:
```
Product 1: Rp 3,500,000 x 2 = Rp 7,000,000
Product 2: (Rp 250,000 + Rp 10,000) x 1 = Rp 260,000
Total Value: Rp 7,260,000
```

---

## 🧪 Testing

### Prerequisites

1. Login sebagai buyer untuk mendapatkan token
2. Create shipping address
3. Add products to cart (optional untuk test cart endpoint)

---

### Test Flow

#### Step 1: Login as Buyer

```bash
POST http://localhost:5000/api/ecommerce/auth/login
Content-Type: application/json

{
  "email": "buyer1@ecommerce.com",
  "password": "Buyer123!"
}
```

**Save the access token from response**

---

#### Step 2: Get Shipping Addresses

```bash
GET http://localhost:5000/api/ecommerce/shipping-addresses
Authorization: Bearer <YOUR_TOKEN>
```

**Note the address_id**

---

#### Step 3: Get Available Couriers

```bash
GET http://localhost:5000/api/ecommerce/buyer/shipping-cost/couriers
Authorization: Bearer <YOUR_TOKEN>
```

---

#### Step 4: Calculate Shipping Cost

```bash
POST http://localhost:5000/api/ecommerce/buyer/shipping-cost/calculate
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "shipping_address_id": 1,
  "products": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "origin_pin_point": "-7.279849431298132,109.35114360314475",
  "destination_pin_point": "-7.30585,109.36814"
}
```

---

#### Step 5: Calculate from Cart (Optional)

```bash
# First, add products to cart
POST http://localhost:5000/api/ecommerce/buyer/cart/add
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}

# Then calculate shipping cost
POST http://localhost:5000/api/ecommerce/buyer/shipping-cost/calculate-from-cart
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "shipping_address_id": 1,
  "destination_pin_point": "-7.30585,109.36814"
}
```

---

## ❌ Error Responses

### 400 Bad Request

```json
{
  "error": "Shipping address is required",
  "hint": "Provide shipping_address_id"
}
```

```json
{
  "error": "Products are required",
  "hint": "Provide array of products with product_id, quantity, and optional variant_id"
}
```

```json
{
  "error": "Invalid product data",
  "hint": "Each product must have product_id and quantity >= 1"
}
```

```json
{
  "error": "Cart is empty",
  "hint": "Add products to cart before calculating shipping cost"
}
```

```json
{
  "error": "Insufficient stock for product \"Smartphone Android X1\"",
  "available": 10,
  "requested": 20
}
```

---

### 404 Not Found

```json
{
  "error": "Shipping address not found",
  "hint": "Make sure the address belongs to you"
}
```

```json
{
  "error": "Product with ID 999 not found"
}
```

```json
{
  "error": "Variant not found for product \"Kemeja Kasual Premium\""
}
```

---

### 500 Internal Server Error

```json
{
  "error": "Failed to calculate shipping cost",
  "details": "Shipping API configuration missing in .env"
}
```

---

## 📊 Database Schema Reference

### shipping_addresses Table

```prisma
model shipping_addresses {
  address_id    Int      @id @default(autoincrement())
  user_id       Int
  label         String   @db.VarChar(50)
  recipient_name String  @db.VarChar(100)
  phone         String   @db.VarChar(20)
  province      String   @db.VarChar(100)
  regency       String   @db.VarChar(100)
  district      String   @db.VarChar(100)
  village       String   @db.VarChar(100)
  postal_code   String   @db.VarChar(10)
  full_address  String   @db.Text
  is_primary    Boolean  @default(false)
}
```

---

### products Table

```prisma
model products {
  product_id      Int                @id @default(autoincrement())
  seller_id       Int
  name            String             @db.VarChar(200)
  price           Decimal            @db.Decimal(12, 2)
  stock           Int                @default(0)
  weight          Decimal            @db.Decimal(10, 2)
  weight_unit     String             @default("gram") @db.VarChar(20)
  length          Decimal            @db.Decimal(10, 2)
  width           Decimal            @db.Decimal(10, 2)
  height          Decimal            @db.Decimal(10, 2)
  
  seller          seller_profiles    @relation(...)
  variants        product_variants[]
}
```

---

### seller_profiles Table

```prisma
model seller_profiles {
  seller_id       Int              @id @default(autoincrement())
  user_id         Int              @unique
  store_name      String           @db.VarChar(100)
  province        String           @db.VarChar(100)
  regency         String           @db.VarChar(100)
  district        String           @db.VarChar(100)
  village         String           @db.VarChar(100)
  postal_code     String           @db.VarChar(10)
  full_address    String           @db.Text
}
```

---

## 🎯 Features Summary

| Feature | Endpoint | Method | Auth |
|---------|----------|--------|------|
| Get Available Couriers | `/buyer/shipping-cost/couriers` | GET | ✅ |
| Calculate Shipping Cost | `/buyer/shipping-cost/calculate` | POST | ✅ |
| Calculate from Cart | `/buyer/shipping-cost/calculate-from-cart` | POST | ✅ |

---

## 📝 Notes

1. **Pin Points**: Koordinat GPS (latitude,longitude) bersifat optional, API akan tetap bekerja dengan alamat saja
2. **Weight Units**: System support gram, kg, lb, oz - semua akan diconvert ke gram untuk API
3. **Dimensions**: Length, width, height dalam cm
4. **COD**: Saat ini default `cod=no`, bisa dikembangkan lebih lanjut
5. **Destination IDs**: Untuk hasil lebih akurat, perlu mapping province/regency ke destination_id Raja Ongkir

---

## 🔄 Future Improvements

1. **Province/Regency Mapping**: Map province & regency ke destination_id untuk hasil lebih akurat
2. **COD Support**: Add COD option di request body
3. **Multiple Sellers**: Handle produk dari multiple sellers (shipping cost per seller)
4. **Shipping Insurance**: Add opsi asuransi pengiriman
5. **Packing Size**: Smart packing algorithm untuk optimize dimensi
6. **Cache**: Cache hasil untuk alamat & produk yang sama
7. **Rate Limiting**: Implement rate limiting untuk API calls

---

## 📧 Support

Jika ada pertanyaan atau issues, hubungi tim development.

---

**Last Updated**: November 6, 2025
