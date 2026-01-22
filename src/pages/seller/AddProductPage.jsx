import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import SellerSidebar from "../../components/SellerSidebar";
import Footer from '../../components/Footer';
import {
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  InformationCircleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { createProduct, getCategories as fetchCategoriesApi, uploadProductImages } from '../../services/sellerProductAPI';
import CartSuccessToast from '../../components/CartSuccessToast';

export default function AddProductPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    weight_unit: 'gram',
    condition: 'new',
    images: []
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [productToast, setProductToast] = useState({ show: false, message: '' });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategoriesApi();
        if (res?.success && Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (Array.isArray(res?.data)) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Gagal memuat kategori:', err);
      }
    };

    loadCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (imagePreviews.length + files.length > 3) {
      alert('Maksimal 3 gambar');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, file]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama produk harus diisi';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi produk harus diisi';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Harga harus lebih dari 0';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stok tidak boleh negatif';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Kategori harus dipilih';
    }

    // Shipping info are REQUIRED by backend
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Berat harus diisi dan lebih dari 0';
    }

    if (!formData.length || parseFloat(formData.length) <= 0) {
      newErrors.length = 'Panjang harus diisi dan lebih dari 0';
    }

    if (!formData.width || parseFloat(formData.width) <= 0) {
      newErrors.width = 'Lebar harus diisi dan lebih dari 0';
    }

    if (!formData.height || parseFloat(formData.height) <= 0) {
      newErrors.height = 'Tinggi harus diisi dan lebih dari 0';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'Minimal 1 gambar produk';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setLoading(true);

    try {
      // First upload images to backend and get URLs
      const uploadRes = await uploadProductImages(formData.images);
      let uploadedImages = [];
      if (uploadRes && uploadRes.success && uploadRes.data && Array.isArray(uploadRes.data.images)) {
        uploadedImages = uploadRes.data.images.map(img => ({ url: img.url }));
      } else if (uploadRes && Array.isArray(uploadRes.images)) {
        uploadedImages = uploadRes.images.map(img => ({ url: img.url }));
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: parseInt(formData.category_id),
        status: 'active',
        weight: parseFloat(formData.weight),
        weight_unit: formData.weight_unit || 'gram',
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        images: uploadedImages,
        variants: [],
      };

      await createProduct(payload);
      setProductToast({ show: true, message: 'Produk berhasil ditambahkan!' });
    } catch (error) {
      console.error('Error creating product:', error);
      alert(error.message || 'Terjadi kesalahan saat menambahkan produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 md:py-6 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                {/* Hamburger Menu */}
                <Button
                  onClick={() => setIsSidebarOpen(true)}
                  variant="ghost"
                  className="text-white hover:bg-blue-500 md:hidden"
                  size="sm"
                >
                  <Bars3Icon className="h-6 w-6" />
                </Button>
                
                <Button
                  onClick={() => navigate('/seller/product')}
                  variant="ghost"
                  className="text-white hover:bg-blue-500 p-2"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Tambah Produk Baru</h1>
                  <p className="text-blue-100 mt-1 text-xs md:text-sm hidden sm:block">Lengkapi informasi produk Anda</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Left Column - Product Images */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4 md:p-6">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Foto Produk</h2>
                  
                  {/* Image Upload Area */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <PhotoIcon className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-2 md:mb-3" />
                    <p className="text-xs md:text-sm text-gray-600 mb-1">Klik untuk upload gambar</p>
                    <p className="text-xs text-gray-500">Max 2MB per file, maksimal 5 gambar</p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  {errors.images && (
                    <p className="text-sm text-red-600 mt-2">{errors.images}</p>
                  )}

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Preview ({imagePreviews.length}/5)</p>
                      <div className="grid grid-cols-2 gap-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                            {index === 0 && (
                              <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                Utama
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex gap-2">
                      <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-blue-800">
                        <p className="font-medium mb-1">Tips Foto Produk:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Gunakan background polos</li>
                          <li>Pencahayaan yang baik</li>
                          <li>Tampilkan produk dari berbagai sudut</li>
                          <li>Foto pertama akan menjadi gambar utama</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Product Information */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Basic Information */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Informasi Dasar</h2>
                  
                  <div className="space-y-4">
                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Produk <span className="text-red-600">*</span>
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Contoh: Sepatu Olahraga Nike Air Max"
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">Pilih kategori</option>
                        {categories.map(cat => (
                          <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                        ))}
                      </select>
                      {errors.category_id && (
                        <p className="text-sm text-red-600 mt-1">{errors.category_id}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi Produk <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Jelaskan detail produk, spesifikasi, kelebihan, dll."
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                      )}
                    </div>

                    {/* Condition */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kondisi Produk <span className="text-red-600">*</span>
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="condition"
                            value="new"
                            checked={formData.condition === 'new'}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <span>Baru</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="condition"
                            value="used"
                            checked={formData.condition === 'used'}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <span>Bekas</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Stock */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Harga & Stok</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Harga (Rp) <span className="text-red-600">*</span>
                      </label>
                      <Input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        className={errors.price ? 'border-red-500' : ''}
                      />
                      {errors.price && (
                        <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                      )}
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stok <span className="text-red-600">*</span>
                      </label>
                      <Input
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        className={errors.stock ? 'border-red-500' : ''}
                      />
                      {errors.stock && (
                        <p className="text-sm text-red-600 mt-1">{errors.stock}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Informasi Pengiriman</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Weight */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Berat (gram) <span className="text-red-600">*</span>
                      </label>
                      <Input
                        name="weight"
                        type="number"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        className={errors.weight ? 'border-red-500' : ''}
                      />
                      {errors.weight && (
                        <p className="text-sm text-red-600 mt-1">{errors.weight}</p>
                      )}
                    </div>

                    {/* Length */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Panjang (cm) <span className="text-red-600">*</span>
                      </label>
                      <Input
                        name="length"
                        type="number"
                        value={formData.length}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    {/* Width */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lebar (cm) <span className="text-red-600">*</span>
                      </label>
                      <Input
                        name="width"
                        type="number"
                        value={formData.width}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tinggi (cm) <span className="text-red-600">*</span>
                      </label>
                      <Input
                        name="height"
                        type="number"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                <Button
                  type="button"
                  onClick={() => navigate('/seller/product')}
                  variant="outline"
                  className="flex-1 w-full sm:w-auto"
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Tambah Produk
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      </div>
      <Footer />
      <CartSuccessToast
        show={productToast.show}
        message={productToast.message}
        onClose={() => {
          setProductToast({ show: false, message: '' });
          navigate('/seller/product');
        }}
      />
    </SellerSidebar>
  );
}
