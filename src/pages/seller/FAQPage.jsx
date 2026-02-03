import React, { useEffect, useMemo, useState } from 'react';
import SellerSidebar from '../../components/SellerSidebar';
import Footer from '../../components/Footer';
import { 
  QuestionMarkCircleIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { getPublicFAQs } from '../../services/faqAPI';

const FAQPage = () => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      try {
        const data = await getPublicFAQs({ limit: 200, audience: 'seller' });
        setFaqs(data || []);
      } catch (err) {
        console.error('Gagal memuat FAQ seller:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(faqs.map((faq) => faq.category || 'Umum')));
    return [
      { id: 'all', label: 'Semua' },
      ...unique.map((cat) => ({ id: cat, label: cat }))
    ];
  }, [faqs]);

  const toggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <SellerSidebar>
        <div className="p-6 flex justify-center items-center min-h-screen text-gray-600">Memuat FAQ...</div>
      </SellerSidebar>
    );
  }

  return (
    <SellerSidebar>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <QuestionMarkCircleIcon className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-800">FAQ - Pertanyaan Umum</h1>
          </div>
          <p className="text-gray-600">
            Temukan jawaban untuk pertanyaan yang sering diajukan oleh penjual
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Menampilkan {filteredFaqs.length} dari {faqs.length} pertanyaan
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const faqId = faq.faq_id ?? faq.id;
              return (
              <div key={faqId} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <button
                  onClick={() => toggleQuestion(faqId)}
                  className="w-full flex items-start justify-between p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 text-left">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                  </div>
                  {expandedQuestion === faqId ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  )}
                </button>
                {expandedQuestion === faqId && (
                  <div className="px-5 pb-5 pl-14">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <QuestionMarkCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">Tidak ada hasil ditemukan</p>
              <p className="text-gray-400 text-sm">Coba gunakan kata kunci lain atau pilih kategori berbeda</p>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-sm p-6 border border-red-100">
          <div className="flex items-start gap-4">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Masih Butuh Bantuan?</h3>
              <p className="text-gray-600 mb-4">
                Tidak menemukan jawaban yang Anda cari? Tim dukungan kami siap membantu Anda!
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Hubungi Support
                </button>
                <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Kirim Feedback
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/seller/syarat" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-red-300 transition-colors">
            <h4 className="font-semibold text-gray-800 mb-1">Syarat & Ketentuan</h4>
            <p className="text-sm text-gray-600">Pelajari aturan dan kebijakan platform</p>
          </a>
          <a href="/seller/privasi" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-red-300 transition-colors">
            <h4 className="font-semibold text-gray-800 mb-1">Privasi & Kebijakan</h4>
            <p className="text-sm text-gray-600">Ketahui bagaimana kami melindungi data Anda</p>
          </a>
          <a href="/seller/panduan" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-red-300 transition-colors">
            <h4 className="font-semibold text-gray-800 mb-1">Panduan Penjual</h4>
            <p className="text-sm text-gray-600">Tutorial lengkap untuk penjual pemula</p>
          </a>
        </div>
      </div>
      <Footer />
    </SellerSidebar>
  );
};

export default FAQPage;
