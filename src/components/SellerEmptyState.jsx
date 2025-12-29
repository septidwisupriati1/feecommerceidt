import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { 
  Package, 
  MessageSquare, 
  ShoppingBag, 
  Star, 
  TrendingUp,
  Rocket,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function SellerEmptyState({ 
  type = 'products', 
  title,
  description,
  actionText,
  actionLink,
  showOnboarding = true 
}) {
  const navigate = useNavigate();

  const emptyStates = {
    products: {
      icon: Package,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      title: 'Belum Ada Produk',
      description: 'Mulai berjualan dengan menambahkan produk pertama Anda. Produk yang menarik akan meningkatkan penjualan!',
      actionText: 'Tambah Produk Pertama',
      actionLink: '/seller/product/add',
      tips: [
        'Gunakan foto produk yang jelas dan menarik',
        'Tulis deskripsi yang detail dan informatif',
        'Tentukan harga yang kompetitif',
        'Pastikan stok produk selalu update'
      ]
    },
    chat: {
      icon: MessageSquare,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      title: 'Belum Ada Percakapan',
      description: 'Chat akan muncul ketika ada pembeli yang menghubungi Anda atau admin mengirim pesan.',
      actionText: 'Mulai Chat Baru',
      actionLink: null,
      tips: [
        'Balas pesan pembeli dengan cepat',
        'Gunakan bahasa yang sopan dan ramah',
        'Berikan informasi produk yang lengkap',
        'Tawarkan solusi untuk masalah pembeli'
      ]
    },
    orders: {
      icon: ShoppingBag,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      title: 'Belum Ada Pesanan',
      description: 'Pesanan akan muncul ketika pembeli melakukan pembelian produk Anda. Pastikan produk Anda menarik!',
      actionText: 'Lihat Produk Saya',
      actionLink: '/seller/product',
      tips: [
        'Pastikan produk selalu ready stock',
        'Proses pesanan dengan cepat',
        'Kemas barang dengan rapi dan aman',
        'Kirim pesanan tepat waktu'
      ]
    },
    sold: {
      icon: TrendingUp,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      title: 'Belum Ada Produk Terjual',
      description: 'Data produk terjual akan muncul setelah Anda menyelesaikan transaksi dengan pembeli.',
      actionText: 'Lihat Pesanan',
      actionLink: '/seller/pesanan',
      tips: [
        'Tingkatkan kualitas produk',
        'Optimalkan foto dan deskripsi',
        'Berikan harga yang menarik',
        'Promosikan produk Anda'
      ]
    },
    reviews: {
      icon: Star,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      title: 'Belum Ada Ulasan',
      description: 'Ulasan akan muncul setelah pembeli memberikan rating dan komentar untuk produk Anda.',
      actionText: 'Lihat Produk Terjual',
      actionLink: '/seller/produk-terjual',
      tips: [
        'Berikan pelayanan terbaik',
        'Pastikan kualitas produk sesuai deskripsi',
        'Komunikasi yang baik dengan pembeli',
        'Tangani komplain dengan profesional'
      ]
    }
  };

  const state = emptyStates[type] || emptyStates.products;
  const Icon = state.icon;

  const handleAction = () => {
    if (actionLink || state.actionLink) {
      navigate(actionLink || state.actionLink);
    }
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card className="border-2 border-dashed border-gray-300 shadow-xl">
          <CardContent className="p-8 md:p-12">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 ${state.iconBg} rounded-full flex items-center justify-center relative`}>
                <Icon className={`w-10 h-10 ${state.iconColor}`} />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-yellow-700" />
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {title || state.title}
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                {description || state.description}
              </p>
            </div>

            {/* Action Button */}
            {(actionLink || state.actionLink || type === 'chat') && (
              <div className="flex justify-center mb-8">
                <Button
                  onClick={handleAction}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-6 text-lg"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  {actionText || state.actionText}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {/* Tips */}
            {showOnboarding && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                  Tips untuk Anda:
                </h3>
                <ul className="space-y-3">
                  {state.tips.map((tip, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Help Card */}
        <Card className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-yellow-900" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">Butuh Bantuan?</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Tim support kami siap membantu Anda memulai berjualan di platform kami.
                </p>
                <Button
                  onClick={() => navigate('/seller/faq')}
                  variant="outline"
                  size="sm"
                  className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                >
                  Lihat FAQ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
