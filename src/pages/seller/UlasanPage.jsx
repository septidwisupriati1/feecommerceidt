import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import SellerSidebar from "../../components/SellerSidebar";
import Footer from '../../components/Footer';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  PhotoIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  NoSymbolIcon,
  ExclamationTriangleIcon,
  EllipsisVerticalIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { 
  getSellerReviews, 
  getSellerReviewStats,
  replyToReview,
  formatDate,
  getStatusLabel,
  getStatusColor
} from '../../services/sellerReviewAPI';

export default function UlasanPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('approved');
  const [sortBy, setSortBy] = useState('latest');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [blockedReviews, setBlockedReviews] = useState([]);
  
  // State for API data
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_reviews: 0,
    limit: 10
  });

  // Load blocked reviews from localStorage on mount
  useEffect(() => {
    const savedBlockedReviews = localStorage.getItem('blockedReviews');
    if (savedBlockedReviews) {
      try {
        setBlockedReviews(JSON.parse(savedBlockedReviews));
      } catch (e) {
        console.error('Error loading blocked reviews:', e);
      }
    }
  }, []);

  // Save blocked reviews to localStorage when it changes
  useEffect(() => {
    if (blockedReviews.length > 0) {
      localStorage.setItem('blockedReviews', JSON.stringify(blockedReviews));
    }
  }, [blockedReviews]);

  // Fetch reviews when filters change
  useEffect(() => {
    fetchReviews();
  }, [pagination.current_page, filterRating, filterStatus, sortBy]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: pagination.current_page,
        limit: pagination.limit,
        rating: filterRating !== 'all' ? parseInt(filterRating) : undefined,
        status: filterStatus,
        sort: sortBy
      };

      const result = await getSellerReviews(params);
      
      if (result.success) {
        // Merge with local replies from localStorage
        const localReplies = JSON.parse(localStorage.getItem('localReplies') || '{}');
        console.log('Local replies from localStorage:', localReplies);
        console.log('Reviews from API:', result.data.reviews);
        
        const mergedReviews = result.data.reviews.map(review => {
          const reviewId = review.id;
          console.log(`Checking review ${reviewId}, has local reply:`, !!localReplies[reviewId]);
          
          if (localReplies[reviewId]) {
            return {
              ...review,
              seller_reply: localReplies[reviewId],
              sellerReply: localReplies[reviewId],
              replied: true
            };
          }
          return review;
        });
        
        console.log('Merged reviews:', mergedReviews);
        setReviews(mergedReviews);
        setPagination(result.data.pagination);
      } else {
        setError(result.message || 'Gagal memuat ulasan');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await getSellerReviewStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleBlockUser = async (reviewId, customerName) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin memblokir pengguna "${customerName}"?\n\nPengguna yang diblokir tidak akan bisa memberikan ulasan lagi pada produk Anda.`
    );
    
    if (confirmed) {
      try {
        // Simulate API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 500));
        // Add review ID to blocked list
        setBlockedReviews(prev => [...prev, reviewId]);
        alert(`Pengguna "${customerName}" berhasil diblokir.\n\nMereka tidak akan bisa memberikan ulasan pada produk Anda lagi.`);
        setOpenDropdownId(null);
        // Refresh reviews
        // fetchReviews();
      } catch (error) {
        alert('Gagal memblokir pengguna. Silakan coba lagi.');
      }
    }
  };

  const handleDeleteReview = async (reviewId, customerName) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus ulasan dari "${customerName}"?\n\nTindakan ini tidak dapat dibatalkan.`
    );
    
    if (confirmed) {
      try {
        // Simulate API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 500));
        alert(`Ulasan dari "${customerName}" berhasil dihapus.`);
        // Refresh reviews
        fetchReviews();
        setOpenDropdownId(null);
      } catch (error) {
        alert('Gagal menghapus ulasan. Silakan coba lagi.');
      }
    }
  };

  const handleReportReview = async (reviewId, customerName) => {
    const reasons = [
      'Spam atau iklan',
      'Konten tidak pantas',
      'Bahasa kasar atau ofensif',
      'Review palsu atau tidak valid',
      'Ujaran kebencian',
      'Lainnya'
    ];
    
    const reasonList = reasons.map((r, i) => `${i + 1}. ${r}`).join('\n');
    const selectedReason = prompt(
      `Laporkan Ulasan dari "${customerName}"\n\nPilih alasan pelaporan (masukkan nomor 1-${reasons.length}):\n\n${reasonList}`,
      '1'
    );
    
    if (selectedReason && parseInt(selectedReason) >= 1 && parseInt(selectedReason) <= reasons.length) {
      const reasonIndex = parseInt(selectedReason) - 1;
      let additionalInfo = '';
      
      if (reasonIndex === reasons.length - 1) {
        additionalInfo = prompt('Mohon jelaskan alasan lainnya:');
        if (!additionalInfo) return;
      }
      
      const confirmed = window.confirm(
        `Anda akan melaporkan ulasan ini dengan alasan:\n"${reasons[reasonIndex]}"${additionalInfo ? `\n\nDetail: ${additionalInfo}` : ''}\n\nLanjutkan?`
      );
      
      if (confirmed) {
        try {
          // Simulate API call - replace with actual API
          await new Promise(resolve => setTimeout(resolve, 500));
          alert(
            `Laporan berhasil dikirim!\n\nTim kami akan meninjau ulasan ini dalam 1-2 hari kerja. Terima kasih atas laporan Anda.`
          );
          // Refresh reviews
          fetchReviews();
          setOpenDropdownId(null);
        } catch (error) {
          alert('Gagal mengirim laporan. Silakan coba lagi.');
        }
      }
    } else if (selectedReason !== null) {
      alert('Pilihan tidak valid. Silakan pilih nomor 1-' + reasons.length);
    }
  };

  const toggleDropdown = (reviewId, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    console.log('Toggle dropdown for review ID:', reviewId);
    console.log('Current openDropdownId:', openDropdownId);
    setOpenDropdownId(prevId => prevId === reviewId ? null : reviewId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownId !== null && !event.target.closest('.dropdown-menu-container')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  const handleReply = async (reviewId, existingReply = '') => {
    const replyText = prompt(
      existingReply ? 'Edit balasan Anda:' : 'Tulis balasan Anda:', 
      existingReply
    );
    
    if (replyText && replyText.trim()) {
      try {
        const result = await replyToReview(reviewId, replyText.trim());
        
        if (result.success) {
          // Update local state immediately
          setReviews(prevReviews => 
            prevReviews.map(review => 
              (review.id || `review-${prevReviews.indexOf(review)}`) === reviewId
                ? { 
                    ...review, 
                    seller_reply: replyText.trim(),
                    sellerReply: replyText.trim() 
                  }
                : review
            )
          );
          
          // Save to localStorage for persistence
          const localReplies = JSON.parse(localStorage.getItem('localReplies') || '{}');
          localReplies[reviewId] = replyText.trim();
          localStorage.setItem('localReplies', JSON.stringify(localReplies));
          console.log('Saved reply to localStorage:', reviewId, replyText.trim());
          console.log('All local replies:', localReplies);
          
          alert(existingReply ? 'Balasan berhasil diupdate!' : 'Balasan berhasil dikirim!');
          fetchStats(); // Refresh stats
        } else {
          alert('Gagal mengirim balasan: ' + result.message);
        }
      } catch (err) {
        alert('Terjadi kesalahan: ' + err.message);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  const handleFilterChange = (rating) => {
    setFilterRating(rating);
    setPagination(prev => ({ ...prev, current_page: 1 })); // Reset to page 1
  };

  const handleRefresh = () => {
    fetchReviews();
    fetchStats();
  };

  // Dummy data ulasan
  const dummyReviews = [
    {
      id: 1,
      orderId: 'ORD-006',
      customer: {
        name: 'Diana Evans',
        avatar: 'DE',
        verified: true
      },
      product: {
        name: 'Headphone Wireless Premium',
        image: '🎧'
      },
      rating: 5,
      comment: 'Produk sangat bagus! Suara jernih, bass mantap, dan nyaman dipakai berjam-jam. Packing rapi, pengiriman cepat. Recommended seller! 👍',
      images: ['📷', '📷', '📷'],
      date: '2025-01-05 14:30',
      helpful: 12,
      replied: true,
      sellerReply: 'Terima kasih banyak atas reviewnya! Semoga awet dan puas dengan produknya ya kak 🙏'
    },
    {
      id: 2,
      orderId: 'ORD-004',
      customer: {
        name: 'Alice Brown',
        avatar: 'AB',
        verified: true
      },
      product: {
        name: 'Tas Ransel Anti Air',
        image: '🎒'
      },
      rating: 5,
      comment: 'Kualitas tasnya bagus banget, benar-benar anti air. Banyak kantong, muat laptop 15 inch. Seller fast response, recommended!',
      images: ['📷'],
      date: '2025-01-04 10:20',
      helpful: 8,
      replied: true,
      sellerReply: 'Terima kasih kak! Senang mendengar produknya sesuai harapan 😊'
    },
    {
      id: 3,
      orderId: 'ORD-003',
      customer: {
        name: 'Bob Johnson',
        avatar: 'BJ',
        verified: false
      },
      product: {
        name: 'Sepatu Sneakers Sport',
        image: '👟'
      },
      rating: 4,
      comment: 'Sepatu bagus, nyaman dipakai. Cuma pengirimannya agak lama. Overall ok lah',
      images: [],
      date: '2025-01-03 16:45',
      helpful: 5,
      replied: false,
      sellerReply: ''
    },
    {
      id: 4,
      orderId: 'ORD-001',
      customer: {
        name: 'John Doe',
        avatar: 'JD',
        verified: true
      },
      product: {
        name: 'Smartphone Android Terbaru',
        image: '📱'
      },
      rating: 5,
      comment: 'HP mantap! Performa kencang, kamera jernih, baterai awet. Sesuai deskripsi. Pengiriman cepat dan packing aman. Makasih seller!',
      images: ['📷', '📷'],
      date: '2025-01-02 09:15',
      helpful: 15,
      replied: true,
      sellerReply: 'Terima kasih kak atas kepercayaannya! Ditunggu order selanjutnya 🙏'
    },
    {
      id: 5,
      orderId: 'ORD-009',
      customer: {
        name: 'Henry Wilson',
        avatar: 'HW',
        verified: true
      },
      product: {
        name: 'Keyboard Mechanical RGB',
        image: '⌨️'
      },
      rating: 4,
      comment: 'Keyboard bagus, switch responsive, RGB nya keren. Minus dikit di kabel yang agak pendek. Tapi overall good product!',
      images: ['📷'],
      date: '2025-01-01 11:30',
      helpful: 6,
      replied: true,
      sellerReply: 'Terima kasih reviewnya kak! Untuk kabel memang standar 1.5m, bisa pakai extension cable jika perlu lebih panjang 😊'
    },
    {
      id: 6,
      orderId: 'ORD-011',
      customer: {
        name: 'Jack Anderson',
        avatar: 'JA',
        verified: false
      },
      product: {
        name: 'Power Bank 20000mAh',
        image: '🔋'
      },
      rating: 3,
      comment: 'Power bank lumayan, tapi kapasitas kayaknya ga full 20000mAh. Charging agak lama. Harga masih oke lah',
      images: [],
      date: '2024-12-30 15:00',
      helpful: 3,
      replied: false,
      sellerReply: ''
    },
    {
      id: 9,
      orderId: 'ORD-015',
      customer: {
        name: 'Michael Chen',
        avatar: 'MC',
        verified: false
      },
      product: {
        name: 'Earphone TWS Bluetooth',
        image: '🎧'
      },
      rating: 1,
      comment: 'TIDAK SESUAI DESKRIPSI! Barang rusak, suara pecah-pecah, bluetooth sering putus. Seller tidak responsif. MENGECEWAKAN!!!',
      images: ['📷'],
      date: '2024-12-27 08:45',
      helpful: 1,
      replied: false,
      sellerReply: ''
    },
    {
      id: 10,
      orderId: 'ORD-018',
      customer: {
        name: 'Sarah Martinez',
        avatar: 'SM',
        verified: true
      },
      product: {
        name: 'Smartwatch Fitness Tracker',
        image: '⌚'
      },
      rating: 1,
      comment: 'Sangat kecewa! Produk tidak berfungsi dengan baik, layar touchscreen error, baterai cepat habis. Tidak worth it dengan harganya.',
      images: [],
      date: '2024-12-26 13:20',
      helpful: 2,
      replied: false,
      sellerReply: ''
    },
    {
      id: 11,
      orderId: 'ORD-020',
      customer: {
        name: 'Tommy Wijaya',
        avatar: 'TW',
        verified: false
      },
      product: {
        name: 'Case HP Premium',
        image: '📱'
      },
      rating: 1,
      comment: 'JELEK! Bahannya murahan, tidak sesuai gambar. Case gampang lepas, ga protect HP sama sekali. JANGAN BELI!',
      images: ['📷', '📷'],
      date: '2024-12-25 19:30',
      helpful: 0,
      replied: false,
      sellerReply: ''
    },
    {
      id: 7,
      orderId: 'ORD-010',
      customer: {
        name: 'Ivy Taylor',
        avatar: 'IT',
        verified: true
      },
      product: {
        name: 'Webcam HD 1080p',
        image: '📹'
      },
      rating: 5,
      comment: 'Webcam bagus banget untuk meeting online! Gambar jernih, auto focus cepat, mic built-in juga clear. Worth it!',
      images: ['📷', '📷'],
      date: '2024-12-29 13:20',
      helpful: 10,
      replied: true,
      sellerReply: 'Terima kasih kak! Senang produknya membantu aktivitas meeting 🎉'
    },
    {
      id: 8,
      orderId: 'ORD-002',
      customer: {
        name: 'Jane Smith',
        avatar: 'JS',
        verified: true
      },
      product: {
        name: 'Kaos Polo Premium Cotton',
        image: '👕'
      },
      rating: 4,
      comment: 'Bahan kaos adem dan nyaman. Ukuran pas. Warna sesuai gambar. Recommended!',
      images: [],
      date: '2024-12-28 10:00',
      helpful: 7,
      replied: false,
      sellerReply: ''
    }
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  // Search filtering (local filtering after API fetch)
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.review_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
      {/* Page Header */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Ulasan Produk
          </h1>
          <p className="text-lg text-blue-50 text-center">
            Lihat dan balas ulasan dari pelanggan
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <Button 
              onClick={handleRefresh}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Memuat ulasan...</p>
          </div>
        )}

        {/* Statistics Overview */}
        {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Rating Summary */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Keseluruhan</h3>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-yellow-500">
                    {stats ? stats.average_rating?.toFixed(1) : '0.0'}
                  </div>
                  <div className="mt-2">{stats && renderStars(Math.round(stats.average_rating))}</div>
                  <p className="text-sm text-gray-600 mt-2">{stats?.total_reviews || 0} ulasan</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = stats?.rating_breakdown?.[star] || 0;
                    const total = stats?.total_reviews || 1;
                    const percentage = ((count / total) * 100).toFixed(0);
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-8">{star} ⭐</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ChatBubbleLeftIcon className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Total Ulasan</p>
                      <p className="text-sm text-gray-600">Semua rating</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-blue-600">
                    {stats?.total_reviews || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <StarIcon className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Rating Tertinggi</p>
                      <p className="text-sm text-gray-600">Bintang 5</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-yellow-600">
                    {stats?.rating_breakdown?.[5] || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ChatBubbleLeftIcon className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Perlu Dibalas</p>
                      <p className="text-sm text-gray-600">Belum ada balasan</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-red-600">
                    {stats?.pending_reviews || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Filter and Search */}
        {!loading && (
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari ulasan, pelanggan, atau produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => handleFilterChange('all')}
                  variant={filterRating === 'all' ? 'default' : 'outline'}
                  className={filterRating === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  size="sm"
                >
                  Semua
                </Button>
                {[5, 4, 3, 2, 1].map(rating => (
                  <Button
                    key={rating}
                    onClick={() => handleFilterChange(rating.toString())}
                    variant={filterRating === rating.toString() ? 'default' : 'outline'}
                    className={filterRating === rating.toString() ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                    size="sm"
                  >
                    {rating} ⭐
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Reviews List */}
        {!loading && (
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-gray-400">
                  <StarIcon className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">Tidak ada ulasan</p>
                  <p className="text-sm">Belum ada ulasan yang sesuai dengan filter</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review, index) => {
              const customerName = review.customer?.name || review.guest_name || 'Anonymous';
              const customerAvatar = customerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
              const reviewText = review.review_text || review.comment || '';
              const reviewDate = review.created_at || review.date || new Date().toISOString();
              const productName = review.product?.name || 'Product';
              const productImage = review.product?.image || '📦';
              const orderId = review.order_id || review.orderId || '-';
              const hasReply = review.seller_reply || review.sellerReply;
              const reviewId = review.id || `review-${index}`;
              const isDropdownOpen = openDropdownId === reviewId;
              const isBlocked = blockedReviews.includes(reviewId);
              
              // Debug log
              if (hasReply) {
                console.log(`Review ${reviewId} has reply:`, hasReply);
              }
              
              return (
              <Card key={reviewId} className={`shadow-lg hover:shadow-xl transition-shadow ${isBlocked ? 'opacity-60 border-2 border-red-300' : ''}`}>
                <CardContent className="p-6">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Customer Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {customerAvatar}
                      </div>

                      {/* Customer Info & Review */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{customerName}</h4>
                          {review.customer?.verified && (
                            <CheckBadgeIcon className="h-5 w-5 text-blue-500" title="Pembeli Terverifikasi" />
                          )}
                          {isBlocked && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300">
                              <NoSymbolIcon className="h-3 w-3" />
                              Diblokir
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600">
                            {formatDate(reviewDate)}
                          </span>
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                          <span className="text-xl">{productImage}</span>
                          <span>{productName}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-blue-600 font-mono">{orderId}</span>
                        </div>

                        {/* Review Comment */}
                        <p className="text-gray-700 mb-3">{reviewText}</p>

                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mb-3">
                            {review.images.map((img, idx) => (
                              <div key={idx} className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                                {typeof img === 'string' && img.startsWith('http') ? (
                                  <img src={img} alt={`Review ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  img
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Helpful Counter */}
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                            <HandThumbUpIcon className="h-4 w-4" />
                            <span>Membantu ({review.helpful || 0})</span>
                          </button>
                        </div>

                        {/* Seller Reply */}
                        {hasReply && (
                          <div className="mt-4 ml-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                S
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-gray-900">Seller (Penjual)</p>
                                <p className="text-xs text-gray-600">Balasan Penjual</p>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm">{hasReply}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Three-dot Menu */}
                    <div className="relative ml-2 dropdown-menu-container">
                      <button
                        onClick={(e) => toggleDropdown(reviewId, e)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Opsi lainnya"
                        type="button"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div 
                          className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBlockUser(reviewId, customerName);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-red-600 hover:bg-red-50"
                            type="button"
                          >
                            <NoSymbolIcon className="h-5 w-5" />
                            <span className="font-medium">Blokir Pengguna</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteReview(reviewId, customerName);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-orange-600 hover:bg-orange-50 border-t border-gray-100"
                            type="button"
                          >
                            <TrashIcon className="h-5 w-5" />
                            <span className="font-medium">Hapus Ulasan</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReportReview(reviewId, customerName);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-yellow-600 hover:bg-yellow-50 border-t border-gray-100"
                            type="button"
                          >
                            <ExclamationTriangleIcon className="h-5 w-5" />
                            <span className="font-medium">Laporkan</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {!hasReply ? (
                      <Button
                        onClick={() => handleReply(reviewId)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                        Balas Ulasan
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleReply(reviewId, hasReply)}
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-50"
                      >
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                        Edit Balasan
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              );
            })
          )}
        </div>
        )}

        {/* Pagination */}
        {!loading && pagination.total_pages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  variant={pagination.current_page === page ? 'default' : 'outline'}
                  size="sm"
                  className={pagination.current_page === page ? 'bg-blue-600' : ''}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.total_pages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </SellerSidebar>
  );
}
