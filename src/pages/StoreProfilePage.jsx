import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { products as localProducts, formatPrice } from '../data/products'
import { getImageUrl } from '../utils/imageHelper'
import buyerProductAPI from '../services/buyerProductAPI'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Loader2 } from 'lucide-react'
import { browseProducts, getCategories } from '../services/productAPI'

function slugify(name){
  if(!name) return ''
  return String(name).toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')
}

export default function StoreProfilePage(){
  const { storeName } = useParams()
  const decoded = decodeURIComponent(storeName || '')
  const navigate = useNavigate()

  const [storeProducts, setStoreProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0 })

  useEffect(() => {
    // load categories (best-effort)
    let mounted = true
    const loadCats = async () => {
      try {
        const res = await getCategories()
        if (res?.success && mounted) setCategories(res.data)
      } catch (err) {
        // fallback: derive from localProducts
        const map = new Map()
        localProducts.forEach(p => { if (p.category_id && p.category) map.set(p.category_id, { category_id: p.category_id, name: p.category }) })
        if (mounted) setCategories(Array.from(map.values()))
      }
    }
    loadCats()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await browseProducts({
          page: pagination.page,
          limit: pagination.limit,
          category_id: selectedCategory === 'all' ? undefined : selectedCategory,
          search: searchQuery || undefined,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
          sort_by: sortBy,
          sort_order: sortOrder
        })

        const data = res?.data || []
        const matched = data.filter(p => {
          const seller = p.seller?.store_name || p.seller_name || p.seller || ''
          return slugify(seller) === slugify(decoded)
        })
        if (mounted) {
          setStoreProducts(matched)
          if (res.pagination) setPagination(prev => ({ ...prev, total: res.pagination.total }))
        }
      } catch (err) {
        console.warn('Failed to fetch buyer products', err?.message || err)
        if (mounted) setError(err?.message || 'Gagal memuat produk')
        const filtered = localProducts
          .filter(p => selectedCategory === 'all' || p.category_id === Number(selectedCategory))
          .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .filter(p => !minPrice || p.price >= parseInt(minPrice))
          .filter(p => !maxPrice || p.price <= parseInt(maxPrice))
        const matched = filtered.filter(p => slugify(p.seller_name || p.seller || p.store_name || '') === slugify(decoded))
        if (mounted) setStoreProducts(matched)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetch()
    return () => { mounted = false }
  }, [decoded, pagination.page, selectedCategory, minPrice, maxPrice, sortBy, sortOrder, searchQuery])

  const handleClear = () => {
    setMinPrice('')
    setMaxPrice('')
    setSearchQuery('')
    setSelectedCategory('all')
    setSortBy('created_at')
    setSortOrder('desc')
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleSortChange = (value) => {
    const sortMap = {
      'terbaru': { sort_by: 'created_at', sort_order: 'desc' },
      'termurah': { sort_by: 'price', sort_order: 'asc' },
      'termahal': { sort_by: 'price', sort_order: 'desc' },
      'rating': { sort_by: 'rating_average', sort_order: 'desc' },
      'terpopuler': { sort_by: 'total_views', sort_order: 'desc' }
    }
    const s = sortMap[value]
    if (s) {
      setSortBy(s.sort_by)
      setSortOrder(s.sort_order)
    }
  }

  const sellerDisplayName = storeProducts[0]?.seller?.store_name || storeProducts[0]?.seller_name || storeProducts[0]?.seller || decoded.replace(/-/g,' ') || 'Toko'
  const sellerPhoto = storeProducts[0]?.seller?.store_photo || storeProducts[0]?.seller_photo || storeProducts[0]?.store_photo || ''

  return (
    <div style={{minHeight:'100vh', paddingTop:40, paddingBottom:80}}>
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="px-3">← Kembali</Button>
        </div>
        <div className="bg-white rounded-lg p-6 flex items-center gap-4">
          <div style={{width:80,height:80,borderRadius:999,overflow:'hidden',background:'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {sellerPhoto ? (
              <img src={getImageUrl(sellerPhoto)} alt={sellerDisplayName} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={(e)=>e.target.style.display='none'} />
            ) : (
              <div style={{fontWeight:700,fontSize:24}}>{(sellerDisplayName||'T').slice(0,2).toUpperCase()}</div>
            )}
          </div>
          <div>
            <h1 style={{fontSize:24,fontWeight:700}}>{sellerDisplayName}</h1>
            <div style={{color:'#6b7280'}}>Toko • Menjual {storeProducts.length} produk</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar filters */}
            <aside className="lg:w-1/4">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Filter</h2>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Cari</label>
                    <Input placeholder="Cari produk" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Kategori</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Semua Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.category_id} value={cat.category_id.toString()}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Harga</label>
                    <Input type="number" placeholder="Harga Min" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} className="mb-2" />
                    <Input type="number" placeholder="Harga Max" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleClear} className="w-full">Clear</Button>
                    <Button onClick={() => setPagination(prev => ({ ...prev, page: 1 }))} className="w-full">Terapkan</Button>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Main content - sort + grid */}
            <main className="lg:w-3/4">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">Menampilkan <span className="font-semibold">{storeProducts.length}</span> produk</p>
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

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                  <span className="ml-3 text-gray-600">Memuat produk...</span>
                </div>
              ) : error ? (
                <div className="p-6 bg-white rounded text-red-600">{error}</div>
              ) : storeProducts.length === 0 ? (
                <div className="p-6 bg-white rounded">Tidak ada produk untuk toko ini.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {storeProducts.map(p => {
                    const pid = p.product_id || p.id || p.productId
                    const img = p.primary_image || p.images?.[0]?.image_url || p.image
                    const badge = p.badge || null
                    const rating = p.rating_average ?? p.rating ?? 0
                    const sold = p.sold ?? p.total_sold ?? 0
                    const location = p.seller?.store_name || p.location || ''
                    return (
                      <Card key={pid} onClick={() => navigate(`/produk/${pid}`)} className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                        <div className="relative">
                          <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                            <img src={getImageUrl(img)} alt={p.name || p.title} className="w-full h-full object-cover" />
                          </div>
                          {badge && (
                            <span className={`absolute top-2 right-2 text-xs ${badge.color || 'bg-red-600'} text-white px-2 py-1 rounded-full font-semibold`}>
                              {badge.text || ''}
                            </span>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-base mb-1 line-clamp-2 h-12">{p.name || p.title}</h3>
                          <div className="flex items-center gap-1 mb-2">
                            <span className="text-yellow-400">{'⭐'.repeat(Math.floor(rating))}</span>
                            <span className="text-xs text-gray-500">({(rating||0).toFixed(1)})</span>
                          </div>
                          <div className="mb-2">
                            <span className="text-lg font-bold text-blue-600">{formatPrice(p.price || p.amount || 0)}</span>
                            {p.originalPrice && (
                              <span className="text-xs text-gray-400 line-through ml-2">{formatPrice(p.originalPrice)}</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{location}</span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Terjual {sold}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
