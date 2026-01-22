import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BuyerNavbar from "../components/BuyerNavbar";
import Footer from "../components/Footer";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Loader2 } from "lucide-react";
import { browseProducts, getCategories, formatCurrency } from "../services/productAPI";
import { products as staticProducts } from "../data/products";

export default function ProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });

  const CATEGORY_CACHE_KEY = 'categories_cache_v1';

  const getLocalCategories = () => {
    const map = new Map();
    staticProducts.forEach(p => {
      if (p.category_id && p.category) {
        map.set(p.category_id, { category_id: p.category_id, name: p.category });
      }
    });
    return Array.from(map.values());
  };

  const loadCachedCategories = () => {
    try {
      const cached = JSON.parse(localStorage.getItem(CATEGORY_CACHE_KEY));
      if (Array.isArray(cached) && cached.length) return cached;
    } catch (err) {
      console.warn('Category cache parse error', err);
    }
    return null;
  };

  const saveCachedCategories = (cats) => {
    try {
      localStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify(cats));
    } catch (err) {
      console.warn('Category cache save error', err);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Sync search term from URL (?q=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || "";
    setSearchQuery(q);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [location.search]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [pagination.page, selectedCategory, minPrice, maxPrice, sortBy, sortOrder]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchProducts();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchCategories = async () => {
    const localCats = getLocalCategories();
    const cachedCats = loadCachedCategories();
    if (cachedCats?.length) {
      setCategories(cachedCats);
    } else {
      setCategories(localCats);
    }

    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('categories-timeout')), 2000));
      const response = await Promise.race([getCategories(), timeoutPromise]);
      if (response?.success && Array.isArray(response.data)) {
        setCategories(response.data);
        saveCachedCategories(response.data);
      }
    } catch (err) {
      console.warn('Using fallback categories', err.message);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await browseProducts({
        page: pagination.page,
        limit: pagination.limit,
        category_id: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery,
        min_price: minPrice || undefined,
        max_price: maxPrice || undefined,
        sort_by: sortBy,
        sort_order: sortOrder
      });

      if (response?.success) {
        setProducts(response.data || []);
        if (response.pagination) {
          setPagination(prev => ({ ...prev, ...response.pagination }));
        }
        return;
      }
    } catch (err) {
      console.warn('Browse API failed, fallback to static products', err.message);

      // fallback to static data when API not reachable
      const filtered = staticProducts
        .filter(p => selectedCategory === 'all' || p.category_id === Number(selectedCategory))
        .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(p => !minPrice || p.price >= parseInt(minPrice))
        .filter(p => !maxPrice || p.price <= parseInt(maxPrice));

      const sorted = [...filtered].sort((a, b) => {
        const order = sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'price') return order * (a.price - b.price);
        if (sortBy === 'rating_average' || sortBy === 'rating') return order * ((a.rating || 0) - (b.rating || 0));
        if (sortBy === 'total_views') return order * ((a.views || 0) - (b.views || 0));
        return 0;
      });

      const pageSize = pagination.limit;
      const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
      const currentPage = Math.min(pagination.page, totalPages);
      const start = (currentPage - 1) * pageSize;
      const paged = sorted.slice(start, start + pageSize);

      const mapped = paged.map(p => ({
        ...p,
        product_id: p.id,
        rating_average: p.rating,
        total_reviews: p.reviews,
        primary_image: p.image,
        stock: p.stock ?? 100,
        total_views: p.views || 0,
        category: { category_id: p.category_id, name: p.category },
        seller: { store_name: "Toko" }
      }));

      setProducts(mapped);
      setPagination(prev => ({
        ...prev,
        page: currentPage,
        total: sorted.length,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProducts();
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("created_at");
    setSortOrder("desc");
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (value) => {
    const sortMap = {
      'terbaru': { sort_by: 'created_at', sort_order: 'desc' },
      'termurah': { sort_by: 'price', sort_order: 'asc' },
      'termahal': { sort_by: 'price', sort_order: 'desc' },
      'rating': { sort_by: 'rating_average', sort_order: 'desc' },
      'terpopuler': { sort_by: 'total_views', sort_order: 'desc' }
    };
    const sort = sortMap[value];
    setSortBy(sort.sort_by);
    setSortOrder(sort.sort_order);
  };

  const getCategoryGradient = (categoryName) => {
    const gradients = {
      'Elektronik': 'from-blue-400 to-blue-600',
      'Fashion': 'from-pink-400 to-pink-600',
      'Makanan & Minuman': 'from-green-400 to-green-600',
      'Kesehatan': 'from-red-400 to-red-600',
      'Rumah Tangga': 'from-yellow-400 to-yellow-600'
    };
    return gradients[categoryName] || 'from-gray-400 to-gray-600';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Navbar */}
      <BuyerNavbar />

      {/* Hero Section with Gradient */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.5) 0%, rgba(239, 246, 255, 0.3) 50%, rgba(255, 255, 255, 0.1) 100%)',
        padding: '3rem 0',
        borderBottom: '1px solid rgba(147, 197, 253, 0.2)'
      }}>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4" style={{ color: '#1e40af' }}>
            Katalog Produk
          </h1>
          <p className="text-lg text-center mb-6" style={{ color: '#6b7280' }}>
            Temukan berbagai produk pilihan dengan harga terbaik
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="lg:w-1/4">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Filter</h2>

                {/* Kategori */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Kategori</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Harga */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Harga</label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Harga Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Harga Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>

                {/* Clear Button */}
                <Button 
                  variant="outline" 
                  onClick={handleClear}
                  className="w-full cursor-pointer"
                >
                  Clear Filter
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Product Grid */}
          <main className="lg:w-3/4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Menampilkan <span className="font-semibold">{products.length}</span> dari {pagination.total} produk
              </p>
              <Select defaultValue="terbaru" onValueChange={handleSortChange}>
                <SelectTrigger className="w-48 cursor-pointer">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terbaru">Terbaru</SelectItem>
                  <SelectItem value="terpopuler">Terpopuler</SelectItem>
                  <SelectItem value="termurah">Harga Terendah</SelectItem>
                  <SelectItem value="termahal">Harga Tertinggi</SelectItem>
                  <SelectItem value="rating">Rating Tertinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Memuat produk...</span>
              </div>
            )}

            {/* Product Cards Grid */}
            {!loading && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Card 
                      key={product.product_id} 
                      onClick={() => navigate(`/produk/${product.product_id}`)}
                      className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                    >
                      <div className="relative">
                        <div className={`aspect-square bg-gradient-to-br ${getCategoryGradient(product.category.name)} flex items-center justify-center overflow-hidden`}>
                          {product.primary_image ? (
                            <img 
                              src={product.primary_image} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                // Fallback ke placeholder jika gambar error
                                e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                              }}
                            />
                          ) : (
                            // Gambar default jika tidak ada - bisa diubah icon/emoji di sini
                            <div className="text-6xl">🛍️</div>
                          )}
                        </div>
                        {product.stock === 0 && (
                          <span className="absolute top-2 right-2 text-xs bg-red-600 text-white px-2 py-1 rounded-full font-semibold shadow-md">
                            Habis
                          </span>
                        )}
                        {product.stock > 0 && product.stock < 10 && (
                          <span className="absolute top-2 right-2 text-xs bg-yellow-600 text-white px-2 py-1 rounded-full font-semibold shadow-md">
                            Stok Terbatas
                          </span>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="text-xs text-gray-500 mb-1">{product.category.name}</div>
                        <h3 className="font-semibold text-base mb-1 line-clamp-2 h-12 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-yellow-400 text-sm">
                            {'⭐'.repeat(Math.floor(product.rating_average || 0))}
                          </span>
                          <span className="text-xs text-gray-500">({product.rating_average?.toFixed(1) || '0.0'})</span>
                          <span className="text-xs text-gray-400 ml-1">
                            | {product.total_reviews || 0} ulasan
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="text-lg font-bold text-blue-600">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{product.seller?.store_name || 'Toko'}</span>
                          <span className="text-gray-400">
                            {product.total_views || 0} views
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={!pagination.hasPrev}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      ← Sebelumnya
                    </Button>
                    <span className="text-gray-600">
                      Halaman {pagination.page} dari {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={!pagination.hasNext}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Selanjutnya →
                    </Button>
                  </div>
                )}

                {/* No Results */}
                {products.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">
                      Produk Tidak Ditemukan
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Coba ubah filter atau kata kunci pencarian Anda
                    </p>
                    <Button onClick={handleClear} className="bg-blue-600 hover:bg-blue-700">
                      Reset Filter
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
