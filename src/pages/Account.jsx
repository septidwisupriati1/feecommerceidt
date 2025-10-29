import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

export default function Account(){
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState(user?.profileImage || null)
  const [previewImage, setPreviewImage] = useState(user?.profileImage || null)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: user?.name || 'coba',
    email: user?.email || 'coba@example.com',
    phone: user?.phone || '081234567890',
    address: user?.address || 'Jl. Contoh No. 123, Jakarta',
  })

  // Sync with user context when it changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || 'coba',
        email: user.email || 'coba@example.com',
        phone: user.phone || '081234567890',
        address: user.address || 'Jl. Contoh No. 123, Jakarta',
      })
      setProfileImage(user.profileImage || null)
      setPreviewImage(user.profileImage || null)
    }
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar!')
        return
      }
      
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB!')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    setProfileImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Update user data with new profile image
    const updatedData = {
      ...formData,
      profileImage: previewImage
    }
    
    // Update AuthContext (will persist to localStorage)
    updateUser(updatedData)
    
    // Update local states
    setProfileImage(previewImage)
    setIsEditing(false)
    
    console.log('Data disimpan:', updatedData)
    alert('Profil berhasil diperbarui!')
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || 'coba',
      email: user?.email || 'coba@example.com',
      phone: user?.phone || '081234567890',
      address: user?.address || 'Jl. Contoh No. 123, Jakarta',
    })
    setPreviewImage(profileImage)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan.')) {
      // TODO: Hapus akun di backend
      console.log('Akun dihapus')
      logout()
      navigate('/')
      alert('Akun berhasil dihapus')
    }
  }

  return (
    <section className="account-page">
      <div className="account-container">
        <div className="account-card">
          <h2 style={{marginTop:0, marginBottom:'1.5rem', textAlign:'center'}}>Kelola Akun</h2>
          
          {/* Profile Image */}
          <div className="profile-image-section">
            <div 
              className={`profile-image-wrapper ${isEditing ? 'editable' : ''}`}
              onClick={isEditing ? handleImageClick : undefined}
              style={{cursor: isEditing ? 'pointer' : 'default'}}
              title={isEditing ? 'Klik untuk mengubah foto profil' : ''}
            >
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-image-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="48" height="48">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
              )}
              {isEditing && (
                <>
                  <div className="image-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="32" height="32">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                    <span>Ubah Foto</span>
                  </div>
                  {previewImage && (
                    <button 
                      type="button"
                      className="remove-image-btn" 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveImage()
                      }}
                      title="Hapus foto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{display: 'none'}}
            />
            {isEditing && (
              <p style={{textAlign:'center', color:'var(--muted)', fontSize:'.85rem', marginTop:'.75rem', marginBottom:0}}>
                Klik foto untuk mengubah • Format: JPG, PNG, GIF (Max 5MB)
              </p>
            )}
          </div>
          
          {!isEditing ? (
            // View Mode
            <>
              <div className="profile-info">
                <div className="info-item">
                  <label>Nama</label>
                  <p>{formData.name}</p>
                </div>
                
                <div className="info-item">
                  <label>E-mail</label>
                  <p>{formData.email}</p>
                </div>

                <div className="info-item">
                  <label>Telepon</label>
                  <p>{formData.phone}</p>
                </div>

                <div className="info-item">
                  <label>Alamat</label>
                  <p>{formData.address}</p>
                </div>
              </div>

              <div className="account-actions">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                  style={{flex: 1}}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  Edit Profil
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{flex: 1}}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  Keluar
                </button>
              </div>

              <button 
                onClick={handleDelete}
                className="btn-danger"
                style={{width: '100%', marginTop: '1rem'}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Hapus Akun
              </button>
            </>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nama</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Telepon</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Alamat</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit"
                  className="btn btn-primary"
                  style={{flex: 1}}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Simpan
                </button>
                
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  style={{flex: 1}}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
