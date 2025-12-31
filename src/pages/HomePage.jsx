import { Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { getFeaturedProducts, formatPrice, getCategoryGradient } from "../data/products";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomePage() {
  const navigate = useNavigate();
  const featuredProducts = getFeaturedProducts(8);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="bg-linear-to-b from-blue-500 via-blue-300 via-30% to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pb-10">
        {/* Decorative stars/sparkles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-2 h-2 bg-white rounded-full opacity-60 top-20 left-[15%] animate-pulse"></div>
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-40 top-40 left-[25%] animate-pulse delay-75"></div>
          <div className="absolute w-2 h-2 bg-white rounded-full opacity-50 top-60 right-[20%] animate-pulse delay-150"></div>
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-30 top-32 right-[35%] animate-pulse delay-300"></div>
          <div className="absolute w-2 h-2 bg-white rounded-full opacity-40 bottom-40 left-[40%] animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Hero Text */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Cari Barang Impian Mu
              <br />
              Bersama e-commerce
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              Platform belanja mudah, cepat dan terpercaya
              <br />
              Temukan Berbagai Produk Menarik dengan harga terjangkau
            </p>
          </div>

          {/* Search Card */}
          <Card className="max-w-4xl mx-auto shadow-2xl bg-white/80 backdrop-blur-md">
            <CardContent className="p-6">
              {/* Search Inputs */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Cari produk dan kategori"
                    className="pl-10 h-12"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Surakarta, Indonesia"
                    className="pl-10 h-12"
                  />
                </div>
                <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                  Cari
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elektronik">Elektronik</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="olahraga">Olahraga</SelectItem>
                    <SelectItem value="makanan">Makanan</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Kondisi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Baru</SelectItem>
                    <SelectItem value="used">Bekas</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Harga" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-100k">0 - 100rb</SelectItem>
                    <SelectItem value="100k-500k">100rb - 500rb</SelectItem>
                    <SelectItem value="500k-1jt">500rb - 1jt</SelectItem>
                    <SelectItem value="1jt-5jt">1jt - 5jt</SelectItem>
                    <SelectItem value="5jt+">5jt+</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐ 5 Bintang</SelectItem>
                    <SelectItem value="4">⭐ 4+ Bintang</SelectItem>
                    <SelectItem value="3">⭐ 3+ Bintang</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Pengiriman" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sameday">Same Day</SelectItem>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="gratis">Gratis Ongkir</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Toko" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="official">Official Store</SelectItem>
                    <SelectItem value="verified">Terverifikasi</SelectItem>
                    <SelectItem value="all">Semua Toko</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2 ml-auto">
                  <Button variant="link" className="text-blue-600">
                    Urut Berdasarkan
                  </Button>
                  <Button variant="link" className="text-blue-600">
                    Baru Dipost
                  </Button>
                </div>
              </div>

              {/* Clear Button */}
              <div className="mt-4 text-right">
                <Button variant="ghost" className="text-gray-600">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Produk Terlaris 🔥
            </h2>
            <Button variant="link" className="text-blue-600">
              Lihat Semua Produk →
            </Button>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card 
                key={product.id} 
                onClick={() => navigate(`/produk/${product.id}`)}
                className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              >
                <div className="relative">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`absolute top-2 right-2 text-xs ${product.badge.color} text-white px-2 py-1 rounded-full font-semibold`}>
                    {product.badge.text}
                  </span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-base mb-1 line-clamp-2 h-12">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-400">
                      {'⭐'.repeat(Math.floor(product.rating))}
                    </span>
                    <span className="text-xs text-gray-500">({product.rating})</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-lg font-bold text-blue-600">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{product.location}</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                      Terjual {product.sold}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
