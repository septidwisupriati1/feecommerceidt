import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import CartSuccessToast from '../../components/CartSuccessToast';
import { getProductDetail, updateProduct, getCategories as fetchCategoriesApi } from '../../services/sellerProductAPI';

export default function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [productNotFound, setProductNotFound] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const normalizeImageValue = (img) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    if (typeof img === 'object') return img.image_url || img.url || img.path || img.src || img.image || img.imageUrl || '';
    return '';
  };

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
  const [toast, setToast] = useState({ show: false, message: '' });
  const [navigateAfterToast, setNavigateAfterToast] = useState(false);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        setLoading(true);
        // categories
        try {
          const catRes = await fetchCategoriesApi();
          if (catRes?.data && Array.isArray(catRes.data)) setCategories(catRes.data);
        } catch (err) {
          console.warn('Gagal memuat kategori', err.message);
        }

        const res = await getProductDetail(id);
        const data = res?.data || res;
        if (!data) {
          setProductNotFound(true);
          return;
        }

        const imagesFromApi = Array.isArray(data.images)
          ? data.images.map(normalizeImageValue).filter(Boolean)
          : [
              normalizeImageValue(data.primary_image),
              normalizeImageValue(data.image_url),
              normalizeImageValue(data.image),
              normalizeImageValue(data.thumbnail),
              normalizeImageValue(data.cover_image)
            ].filter(Boolean);

        setFormData({
          name: data.name || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          stock: data.stock?.toString() || '',
          category_id: data.category_id || data.category?.category_id || data.category || '',
          weight: data.weight?.toString() || '',
          length: data.length?.toString() || '',
          width: data.width?.toString() || '',
          height: data.height?.toString() || '',
          weight_unit: data.weight_unit || 'gram',
          condition: data.condition || 'new',
          images: []
        });

        setImagePreviews(imagesFromApi);
      } catch (error) {
        console.error('Error loading product:', error);
        setProductNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (imagePreviews.length + files.length > 5) {
      setToast({ show: true, message: 'Maksimal 5 gambar' });
      return;
    }

    files.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        setToast({ show: true, message: `File ${file.name} terlalu besar. Maksimal 2MB` });
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

    // Reset input
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imagePreviews.length + imageFiles.length > 5) {
      setToast({ show: true, message: 'Maksimal 5 gambar' });
      return;
    }

    imageFiles.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        setToast({ show: true, message: `File ${file.name} terlalu besar. Maksimal 2MB` });
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

    // Optional numeric fields: validate only if filled (weight, length, width, height)
    if (formData.weight && parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Berat harus lebih dari 0 jika diisi';
    }

    if (formData.length && parseFloat(formData.length) <= 0) {
      newErrors.length = 'Panjang harus lebih dari 0 jika diisi';
    }

    if (formData.width && parseFloat(formData.width) <= 0) {
      newErrors.width = 'Lebar harus lebih dari 0 jika diisi';
    }

    if (formData.height && parseFloat(formData.height) <= 0) {
      newErrors.height = 'Tinggi harus lebih dari 0 jika diisi';
    }

    // Images optional on edit; allow keep existing

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({ show: true, message: 'Mohon lengkapi semua field yang wajib diisi' });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        weight_unit: formData.weight_unit || 'gram',
        length: formData.length ? parseFloat(formData.length) : undefined,
        width: formData.width ? parseFloat(formData.width) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        condition: formData.condition,
        images: imagePreviews.map((url) => ({ url: normalizeImageValue(url) })),
      };

      await updateProduct(id, payload);
      setToast({ show: true, message: 'Produk berhasil diperbarui!' });
      setNavigateAfterToast(true);
    } catch (error) {
      console.error('Error updating product:', error);
      setToast({ show: true, message: error.message || 'Terjadi kesalahan saat memperbarui produk' });
    } finally {
      setLoading(false);
    }
  };

  if (productNotFound) {
    return (
      <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <InformationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Produk Tidak Ditemukan</h2>
              <p className="text-gray-600 mb-6">
                Produk yang Anda cari tidak ditemukan atau telah dihapus.
              </p>
              <Button
                onClick={() => navigate('/seller/product')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Kembali ke Daftar Produk
              </Button>
            </CardContent>
          </Card>
        </div>
      </SellerSidebar>
    );
  }

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
                  className="text-white hover:bg-blue-500"
                  size="sm"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">Edit Produk</h1>
                  <p className="text-blue-100 text-xs md:text-sm">Perbarui informasi produk Anda</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="container mx-auto px-4 py-6 md:py-8">
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
            
            {/* Informasi Dasar Produk */}
            <Card className="shadow-md border-t-4 border-t-blue-600">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <InformationCircleIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">Informasi Dasar</h2>
                </div>

                <div className="space-y-4">
                  {/* Nama Produk */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Produk <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Contoh: Laptop ASUS ROG Gaming"
                      className={`w-full ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Deskripsi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Produk <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="5"
                      placeholder="Jelaskan detail produk Anda..."
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                    )}
                  </div>

                  {/* Kategori */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id || ''}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.category_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((cat) => (
                        <option key={cat.category_id || cat.name} value={cat.category_id || cat.name}>
                          {cat.name || cat}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && (
                      <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>
                    )}
                  </div>

                  {/* Kondisi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kondisi <span className="text-red-500">*</span>
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
                        <span className="text-sm">Baru</span>
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
                        <span className="text-sm">Bekas</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Harga & Stok */}
            <Card className="shadow-md border-t-4 border-t-yellow-500">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Harga & Stok</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Harga */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga (Rp) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="100000"
                      min="0"
                      step="1000"
                      className={`w-full ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                    )}
                  </div>

                  {/* Stok */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stok <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="10"
                      min="0"
                      className={`w-full ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pengiriman */}
            <Card className="shadow-md border-t-4 border-t-green-500">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Informasi Pengiriman</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Berat */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Berat (gram) <span className="text-gray-400 text-xs">(opsional)</span>
                    </label>
                    <Input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="500"
                      min="0"
                      className={`w-full ${errors.weight ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.weight && (
                      <p className="text-red-500 text-xs mt-1">{errors.weight}</p>
                    )}
                  </div>

                  {/* Panjang */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Panjang (cm) <span className="text-gray-400 text-xs">(opsional)</span>
                    </label>
                    <Input
                      type="number"
                      name="length"
                      value={formData.length}
                      onChange={handleInputChange}
                      placeholder="30"
                      min="0"
                      className={`w-full ${errors.length ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.length && (
                      <p className="text-red-500 text-xs mt-1">{errors.length}</p>
                    )}
                  </div>

                  {/* Lebar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lebar (cm) <span className="text-gray-400 text-xs">(opsional)</span>
                    </label>
                    <Input
                      type="number"
                      name="width"
                      value={formData.width}
                      onChange={handleInputChange}
                      placeholder="20"
                      min="0"
                      className={`w-full ${errors.width ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.width && (
                      <p className="text-red-500 text-xs mt-1">{errors.width}</p>
                    )}
                  </div>

                  {/* Tinggi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tinggi (cm) <span className="text-gray-400 text-xs">(opsional)</span>
                    </label>
                    <Input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="10"
                      min="0"
                      className={`w-full ${errors.height ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.height && (
                      <p className="text-red-500 text-xs mt-1">{errors.height}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gambar Produk */}
            <Card className="shadow-md border-t-4 border-t-purple-500">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <PhotoIcon className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">Foto Produk</h2>
                </div>

                {/* Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center cursor-pointer transition-colors ${
                    errors.images ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <PhotoIcon className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm md:text-base text-gray-600 mb-2">
                    <span className="text-blue-600 font-medium">Klik untuk upload</span> atau drag & drop
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">
                    PNG, JPG, JPEG (Maks. 2MB per gambar, maksimal 5 gambar)
                  </p>
                  {errors.images && (
                    <p className="text-red-500 text-xs mt-2">{errors.images}</p>
                  )}
                </div>

                {/* Preview Images */}
                {imagePreviews.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Gambar Terpilih ({imagePreviews.length}/5)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Utama
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {imagePreviews.length < 5 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          <PlusIcon className="h-8 w-8 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pb-6">
              <Button
                type="button"
                onClick={() => navigate('/seller/product')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <CartSuccessToast
        show={toast.show}
        message={toast.message}
        onClose={() => {
          setToast({ show: false, message: '' });
          if (navigateAfterToast) {
            setNavigateAfterToast(false);
            navigate('/seller/product');
          }
        }}
      />
    </SellerSidebar>
  );
}
