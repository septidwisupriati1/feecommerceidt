/**
 * FAQ API Service
 * Handles all API calls for FAQ management
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/ecommerce';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all FAQs with optional filters
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status: 'active' or 'inactive'
 * @param {string} params.category - Filter by category
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 100)
 * @returns {Promise<Array>} Array of FAQ objects
 */
export const getAllFAQs = async (params = {}) => {
  try {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.category) queryParams.append('category', params.category);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = `${API_BASE_URL}/admin/faqs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.faqs || [];
  } catch (error) {
    console.warn('Failed to fetch FAQs from API, using fallback data:', error);
    return getFallbackFAQs();
  }
};

/**
 * Get FAQ by ID
 * @param {number} id - FAQ ID
 * @returns {Promise<Object>} FAQ object
 */
export const getFAQById = async (id) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/faqs/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.faq;
  } catch (error) {
    console.error('Failed to fetch FAQ by ID:', error);
    throw error;
  }
};

/**
 * Create new FAQ
 * @param {Object} faqData - FAQ data
 * @param {string} faqData.question - FAQ question
 * @param {string} faqData.answer - FAQ answer
 * @param {string} faqData.category - FAQ category
 * @param {number} faqData.order_index - Display order
 * @param {string} faqData.status - Status: 'active' or 'inactive'
 * @returns {Promise<Object>} Created FAQ object
 */
export const createFAQ = async (faqData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/faqs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(faqData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.faq;
  } catch (error) {
    console.error('Failed to create FAQ:', error);
    throw error;
  }
};

/**
 * Update existing FAQ
 * @param {number} id - FAQ ID
 * @param {Object} faqData - Updated FAQ data
 * @returns {Promise<Object>} Updated FAQ object
 */
export const updateFAQ = async (id, faqData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/faqs/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(faqData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.faq;
  } catch (error) {
    console.error('Failed to update FAQ:', error);
    throw error;
  }
};

/**
 * Delete FAQ
 * @param {number} id - FAQ ID
 * @returns {Promise<Object>} Success message
 */
export const deleteFAQ = async (id) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/faqs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to delete FAQ:', error);
    throw error;
  }
};

/**
 * Fallback FAQ data (used when API is not available)
 * This matches the structure currently used in FAQPage.jsx
 */
const getFallbackFAQs = () => {
  return [
    {
      faq_id: 1,
      question: 'Bagaimana cara mendaftar sebagai penjual?',
      answer: 'Anda dapat mendaftar sebagai penjual dengan mengklik tombol "Daftar Sebagai Penjual" di halaman utama, kemudian mengisi formulir pendaftaran dengan data toko dan dokumen yang diperlukan.',
      category: 'Akun',
      order_index: 1,
      status: 'active',
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z'
    },
    {
      faq_id: 2,
      question: 'Bagaimana cara menambahkan produk?',
      answer: 'Masuk ke dashboard penjual, klik menu "Produk Saya", lalu klik tombol "Tambah Produk". Isi informasi produk seperti nama, harga, deskripsi, dan upload foto produk.',
      category: 'Penjual',
      order_index: 2,
      status: 'active',
      created_at: '2025-01-02T00:00:00.000Z',
      updated_at: '2025-01-02T00:00:00.000Z'
    },
    {
      faq_id: 3,
      question: 'Bagaimana cara melakukan pembelian?',
      answer: 'Pilih produk yang ingin dibeli, klik "Tambah ke Keranjang", lalu lanjutkan ke halaman checkout. Pilih metode pembayaran dan alamat pengiriman, kemudian konfirmasi pesanan Anda.',
      category: 'Pembeli',
      order_index: 3,
      status: 'active',
      created_at: '2025-01-03T00:00:00.000Z',
      updated_at: '2025-01-03T00:00:00.000Z'
    },
    {
      faq_id: 4,
      question: 'Metode pembayaran apa saja yang tersedia?',
      answer: 'Kami menyediakan berbagai metode pembayaran: Transfer Bank (BCA, Mandiri, BNI, BRI), E-Wallet (GoPay, OVO, Dana, ShopeePay), dan Credit Card (Visa, Mastercard).',
      category: 'Pembayaran',
      order_index: 4,
      status: 'active',
      created_at: '2025-01-04T00:00:00.000Z',
      updated_at: '2025-01-04T00:00:00.000Z'
    },
    {
      faq_id: 5,
      question: 'Berapa lama proses pengiriman?',
      answer: 'Estimasi pengiriman tergantung pada jasa pengiriman yang dipilih dan lokasi tujuan. Biasanya berkisar antara 2-7 hari kerja untuk pengiriman reguler.',
      category: 'Pengiriman',
      order_index: 5,
      status: 'active',
      created_at: '2025-01-05T00:00:00.000Z',
      updated_at: '2025-01-05T00:00:00.000Z'
    },
    {
      faq_id: 6,
      question: 'Bagaimana cara melacak pesanan?',
      answer: 'Anda dapat melacak pesanan melalui menu "Pesanan Saya". Nomor resi akan otomatis muncul setelah penjual mengirim barang. Klik nomor resi untuk melihat tracking detail.',
      category: 'Pembeli',
      order_index: 6,
      status: 'active',
      created_at: '2025-01-06T00:00:00.000Z',
      updated_at: '2025-01-06T00:00:00.000Z'
    },
    {
      faq_id: 7,
      question: 'Bagaimana kebijakan pengembalian barang?',
      answer: 'Pembeli dapat mengajukan pengembalian dalam 7 hari setelah barang diterima jika barang tidak sesuai, rusak, atau cacat. Hubungi customer service untuk proses pengembalian.',
      category: 'Umum',
      order_index: 7,
      status: 'active',
      created_at: '2025-01-07T00:00:00.000Z',
      updated_at: '2025-01-07T00:00:00.000Z'
    },
    {
      faq_id: 8,
      question: 'Bagaimana cara mengubah kata sandi?',
      answer: 'Masuk ke halaman Profil, pilih menu "Keamanan", lalu klik "Ubah Kata Sandi". Masukkan kata sandi lama dan kata sandi baru Anda.',
      category: 'Akun',
      order_index: 8,
      status: 'active',
      created_at: '2025-01-08T00:00:00.000Z',
      updated_at: '2025-01-08T00:00:00.000Z'
    },
    {
      faq_id: 9,
      question: 'Bagaimana cara menarik dana dari penjualan?',
      answer: 'Dana dari penjualan dapat ditarik melalui menu "Rekening Penjual". Masukkan nomor rekening bank Anda dan tentukan jumlah yang ingin ditarik. Proses pencairan biasanya 1-3 hari kerja.',
      category: 'Penjual',
      order_index: 9,
      status: 'active',
      created_at: '2025-01-09T00:00:00.000Z',
      updated_at: '2025-01-09T00:00:00.000Z'
    },
    {
      faq_id: 10,
      question: 'Apakah ada biaya untuk menjual di platform ini?',
      answer: 'Pendaftaran sebagai penjual gratis. Kami hanya memotong komisi sebesar 5% dari setiap transaksi yang berhasil. Tidak ada biaya bulanan atau biaya tersembunyi lainnya.',
      category: 'Penjual',
      order_index: 10,
      status: 'active',
      created_at: '2025-01-10T00:00:00.000Z',
      updated_at: '2025-01-10T00:00:00.000Z'
    },
    {
      faq_id: 11,
      question: 'Bagaimana cara menghubungi customer service?',
      answer: 'Anda dapat menghubungi customer service melalui menu "Kotak Masuk" atau email ke support@solotechnopark.com. Kami siap membantu Anda 24/7.',
      category: 'Umum',
      order_index: 11,
      status: 'active',
      created_at: '2025-01-11T00:00:00.000Z',
      updated_at: '2025-01-11T00:00:00.000Z'
    },
    {
      faq_id: 12,
      question: 'Apakah data pribadi saya aman?',
      answer: 'Keamanan data Anda adalah prioritas kami. Kami menggunakan enkripsi SSL dan sistem keamanan berlapis untuk melindungi informasi pribadi dan transaksi Anda.',
      category: 'Umum',
      order_index: 12,
      status: 'active',
      created_at: '2025-01-12T00:00:00.000Z',
      updated_at: '2025-01-12T00:00:00.000Z'
    }
  ];
};

export default {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ
};
