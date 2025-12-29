import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { getAllFAQs, createFAQ, updateFAQ, deleteFAQ } from '../../services/faqAPI';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Umum'
  });

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'Umum', label: 'Umum' },
    { value: 'Akun', label: 'Akun' },
    { value: 'Penjual', label: 'Penjual' },
    { value: 'Pembeli', label: 'Pembeli' },
    { value: 'Pembayaran', label: 'Pembayaran' },
    { value: 'Pengiriman', label: 'Pengiriman' }
  ];

  // Fetch FAQs on component mount
  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const data = await getAllFAQs({ limit: 100 });
      setFaqs(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getCategoryLabel = (value) => {
    return categories.find(cat => cat.value === value)?.label || value;
  };

  const handleAddFAQ = async () => {
    if (formData.question && formData.answer) {
      try {
        const newFAQ = await createFAQ({
          question: formData.question,
          answer: formData.answer,
          category: formData.category,
          status: 'active'
        });
        
        // Refresh FAQ list
        await fetchFAQs();
        
        setShowAddModal(false);
        setFormData({ question: '', answer: '', category: 'Umum' });
        alert('FAQ berhasil ditambahkan!');
      } catch (error) {
        alert('Gagal menambahkan FAQ: ' + error.message);
      }
    }
  };

  const handleEditFAQ = async () => {
    if (selectedFAQ && formData.question && formData.answer) {
      try {
        await updateFAQ(selectedFAQ.faq_id, {
          question: formData.question,
          answer: formData.answer,
          category: formData.category
        });
        
        // Refresh FAQ list
        await fetchFAQs();
        
        setShowEditModal(false);
        setSelectedFAQ(null);
        setFormData({ question: '', answer: '', category: 'Umum' });
        alert('FAQ berhasil diperbarui!');
      } catch (error) {
        alert('Gagal memperbarui FAQ: ' + error.message);
      }
    }
  };

  const handleDeleteFAQ = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
      try {
        await deleteFAQ(id);
        
        // Refresh FAQ list
        await fetchFAQs();
        
        alert('FAQ berhasil dihapus!');
      } catch (error) {
        alert('Gagal menghapus FAQ: ' + error.message);
      }
    }
  };

  const openEditModal = (faq) => {
    setSelectedFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category
    });
    setShowEditModal(true);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Loading state
  if (loading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat FAQ...</p>
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <QuestionMarkCircleIcon className="h-12 w-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
              FAQ (Pertanyaan yang Sering Diajukan)
            </h1>
          </div>
          <p className="text-lg text-blue-50 text-center">
            Kelola pertanyaan dan jawaban untuk membantu pengguna
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari pertanyaan atau jawaban..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <PlusIcon className="h-5 w-5" />
              Tambah FAQ
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Total FAQ</p>
            <p className="text-3xl font-bold text-blue-600">{faqs.length}</p>
          </div>
          {categories.slice(1, 4).map(cat => (
            <div key={cat.value} className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-1">{cat.label}</p>
              <p className="text-3xl font-bold text-gray-800">
                {faqs.filter(faq => faq.category === cat.value).length}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <QuestionMarkCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Tidak ada FAQ yang sesuai</p>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <div key={faq.faq_id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          {getCategoryLabel(faq.category)}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleExpand(faq.faq_id)}
                        className="flex items-start justify-between w-full text-left group"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors flex-1">
                          {faq.question}
                        </h3>
                        {expandedId === faq.faq_id ? (
                          <ChevronUpIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDownIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {expandedId === faq.faq_id && (
                        <div className="mt-4 text-gray-700 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(faq)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFAQ(faq.faq_id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Hapus"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Tambah FAQ Baru</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ question: '', answer: '', category: 'Umum' });
                  }}
                  className="text-white hover:bg-blue-700 p-1 rounded transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.filter(cat => cat.value !== 'all').map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pertanyaan <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan pertanyaan..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jawaban <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="6"
                    placeholder="Masukkan jawaban lengkap..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ question: '', answer: '', category: 'Umum' });
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddFAQ}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Edit FAQ</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedFAQ(null);
                    setFormData({ question: '', answer: '', category: 'Umum' });
                  }}
                  className="text-white hover:bg-blue-700 p-1 rounded transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.filter(cat => cat.value !== 'all').map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pertanyaan <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan pertanyaan..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jawaban <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="6"
                    placeholder="Masukkan jawaban lengkap..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedFAQ(null);
                    setFormData({ question: '', answer: '', category: 'Umum' });
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleEditFAQ}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </AdminSidebar>
  );
};

export default FAQPage;
