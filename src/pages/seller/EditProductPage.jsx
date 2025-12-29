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

export default function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [productNotFound, setProductNotFound] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    condition: 'new',
    images: []
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = [
    'Elektronik',
    'Fashion Pria',
    'Fashion Wanita',
    'Kesehatan & Kecantikan',
    'Makanan & Minuman',
    'Rumah Tangga',
    'Olahraga',
    'Mainan & Hobi',
    'Buku & Alat Tulis',
    'Otomotif'
  ];

  // Load product data on mount
  useEffect(() => {
    const loadProduct = () => {
      try {
        const products = JSON.parse(localStorage.getItem('seller_products') || '[]');
        const product = products.find(p => p.id === parseInt(id) || p.product_id === parseInt(id));
        
        if (!product) {
          setProductNotFound(true);
          return;
        }

        // Populate form with existing data
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          stock: product.stock?.toString() || '',
          category: product.category || '',
          weight: product.weight?.toString() || '',
          length: product.length?.toString() || '',
          width: product.width?.toString() || '',
          height: product.height?.toString() || '',
          condition: product.condition || 'new',
          images: []
        });

        // Load existing images
        if (product.images && Array.isArray(product.images)) {
          setImagePreviews(product.images);
        } else if (product.primary_image) {
          setImagePreviews([product.primary_image]);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setProductNotFound(true);
      }
    };

    loadProduct();
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
      alert('Maksimal 5 gambar');
      return;
    }

    files.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} terlalu besar. Maksimal 2MB`);
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
      alert('Maksimal 5 gambar');
      return;
    }

    imageFiles.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} terlalu besar. Maksimal 2MB`);
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

    if (!formData.category) {
      newErrors.category = 'Kategori harus dipilih';
    }

    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Berat harus lebih dari 0';
    }

    if (imagePreviews.length === 0) {
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
      // Get existing products from localStorage
      const products = JSON.parse(localStorage.getItem('seller_products') || '[]');
      const productIndex = products.findIndex(p => p.id === parseInt(id) || p.product_id === parseInt(id));
      
      if (productIndex === -1) {
        throw new Error('Produk tidak ditemukan');
      }

      // Update product data
      const updatedProduct = {
        ...products[productIndex],
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        weight: parseFloat(formData.weight),
        length: formData.length ? parseFloat(formData.length) : null,
        width: formData.width ? parseFloat(formData.width) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        condition: formData.condition,
        images: imagePreviews, // Base64 images
        primary_image: imagePreviews[0] || null,
        updated_at: new Date().toISOString()
      };

      // Update in array
      products[productIndex] = updatedProduct;
      localStorage.setItem('seller_products', JSON.stringify(products));

      // Simulasi delay API
      await new Promise(resolve => setTimeout(resolve, 500));

      alert('Produk berhasil diperbarui!');
      navigate('/seller/product');
    } catch (error) {
      console.error('Error updating product:', error);
      alert(error.message || 'Terjadi kesalahan saat memperbarui produk');
    } finally {
      setLoading(false);
    }

    /* TODO: Uncomment untuk backend integration
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('weight', formData.weight);
      
      if (formData.length) formDataToSend.append('length', formData.length);
      if (formData.width) formDataToSend.append('width', formData.width);
      if (formData.height) formDataToSend.append('height', formData.height);
      formDataToSend.append('condition', formData.condition);

      // Append new images
      formData.images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      // Keep existing images that are base64 strings
      const existingImages = imagePreviews.filter(img => img.startsWith('data:'));
      if (existingImages.length > 0) {
        formDataToSend.append('existing_images', JSON.stringify(existingImages));
      }

      const response = await fetch(`http://localhost:5000/api/ecommerce/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui produk');
      }

      alert('Produk berhasil diperbarui!');
      navigate('/seller/product');
    } catch (error) {
      console.error('Error updating product:', error);
      alert(error.message || 'Terjadi kesalahan saat memperbarui produk');
    } finally {
      setLoading(false);
    }
    */
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
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-xs mt-1">{errors.category}</p>
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
                      Berat (gram) <span className="text-red-500">*</span>
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
                      Panjang (cm)
                    </label>
                    <Input
                      type="number"
                      name="length"
                      value={formData.length}
                      onChange={handleInputChange}
                      placeholder="30"
                      min="0"
                      className="w-full border-gray-300"
                    />
                  </div>

                  {/* Lebar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lebar (cm)
                    </label>
                    <Input
                      type="number"
                      name="width"
                      value={formData.width}
                      onChange={handleInputChange}
                      placeholder="20"
                      min="0"
                      className="w-full border-gray-300"
                    />
                  </div>

                  {/* Tinggi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tinggi (cm)
                    </label>
                    <Input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="10"
                      min="0"
                      className="w-full border-gray-300"
                    />
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
    </SellerSidebar>
  );
}
