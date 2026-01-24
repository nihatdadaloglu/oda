import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  LogOut, FileText, Upload, Newspaper, Image, CreditCard,
  Settings, Users, Mail, Edit, Trash2, Plus, UserCheck, GraduationCap, X
} from 'lucide-react';
import apiClient from '../api/client';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/admin/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    toast.success('Çıkış yapıldı');
    navigate('/admin/login');
  };

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>Admin Panel - KEESO</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <header className="bg-[#1e3a8a] text-white py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="h-heading text-xl font-bold">KEESO Admin Panel</h1>
                <p className="text-sm text-blue-200">{user.name} ({user.role})</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
              >
                <LogOut size={20} />
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/announcements" element={<AnnouncementsManager />} />
            <Route path="/documents" element={<DocumentsManager />} />
            <Route path="/trainings" element={<TrainingsManager />} />
            <Route path="/visits" element={<VisitsManager />} />
            <Route path="/payments" element={<PaymentsManager />} />
            <Route path="/board-members" element={<BoardMembersManager />} />
            <Route path="/contacts" element={<ContactsViewer />} />
            <Route path="/memberships" element={<MembershipsViewer />} />
            <Route path="/settings" element={<SettingsManager />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

// Admin Home Dashboard
const AdminHome = () => {
  const navigate = useNavigate();

  const modules = [
    { icon: Newspaper, title: 'Duyurular', path: '/admin/announcements', color: 'text-blue-600' },
    { icon: GraduationCap, title: 'Eğitim ve Seminerler', path: '/admin/trainings', color: 'text-purple-600' },
    { icon: FileText, title: 'Belgeler', path: '/admin/documents', color: 'text-green-600' },
    { icon: Image, title: 'Ziyaretler', path: '/admin/visits', color: 'text-pink-600' },
    { icon: CreditCard, title: 'Ödeme Kalemleri', path: '/admin/payments', color: 'text-orange-600' },
    { icon: UserCheck, title: 'Yönetim & Denetim Kurulu', path: '/admin/board-members', color: 'text-teal-600' },
    { icon: Mail, title: 'İletişim Mesajları', path: '/admin/contacts', color: 'text-red-600' },
    { icon: Users, title: 'Üyelik Başvuruları', path: '/admin/memberships', color: 'text-indigo-600' },
    { icon: Settings, title: 'Ayarlar', path: '/admin/settings', color: 'text-gray-600' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Yönetim Modülleri</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {modules.map((module) => (
          <button
            key={module.path}
            onClick={() => navigate(module.path)}
            className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-md transition-shadow"
          >
            <module.icon className={`${module.color} mb-3`} size={32} />
            <h3 className="font-semibold text-gray-900">{module.title}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};

// Announcements Manager
const AnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Genel Duyurular',
    cover_image: ''
  });

  const categories = ['Genel Duyurular', 'Eğitimler', 'Mevzuat', 'Etkinlikler', 'Önemli Bilgilendirmeler'];

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await apiClient.get('/api/announcements?limit=100');
      setAnnouncements(response.data.items);
    } catch (error) {
      toast.error('Duyurular yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await apiClient.put(`/api/announcements/${editingItem.id}`, formData);
        toast.success('Duyuru güncellendi');
      } else {
        await apiClient.post('/api/announcements', formData);
        toast.success('Duyuru oluşturuldu');
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({ title: '', content: '', category: 'Genel Duyurular', cover_image: '' });
      fetchAnnouncements();
    } catch (error) {
      toast.error('İşlem başarısız');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) return;
    try {
      await apiClient.delete(`/api/announcements/${id}`);
      toast.success('Duyuru silindi');
      fetchAnnouncements();
    } catch (error) {
      toast.error('Silme işlemi başarısız');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category,
      cover_image: item.cover_image || ''
    });
    setShowForm(true);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Duyurular</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
            setFormData({ title: '', content: '', category: 'Genel Duyurular', cover_image: '' });
          }}
          data-testid="admin-yeni-kayit-button"
          className="flex items-center space-x-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-md hover:bg-[#1b3479]"
        >
          <Plus size={20} />
          <span>Yeni Duyuru</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-4">{editingItem ? 'Duyuru Düzenle' : 'Yeni Duyuru'}</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Başlık"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <textarea
              placeholder="İçerik"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows="6"
              className="w-full px-4 py-2 border rounded-md"
            />
            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2 bg-[#1e3a8a] text-white rounded-md hover:bg-[#1b3479]">
                {editingItem ? 'Güncelle' : 'Oluştur'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-md">
                İptal
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white border rounded-lg overflow-hidden" data-testid="admin-tablo">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Başlık</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tarih</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {announcements.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{item.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(item.published_at).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 text-sm text-right space-x-2">
                  <button onClick={() => handleEdit(item)} data-testid="admin-duzenle-button" className="text-blue-600 hover:text-blue-800">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} data-testid="admin-sil-button" className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Documents Manager (simplified)
const DocumentsManager = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', file: null });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await apiClient.get('/api/documents');
      setDocuments(response.data.items);
    } catch (error) {
      toast.error('Belgeler yüklenemedi');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!formData.file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);
      const uploadResponse = await apiClient.post('/api/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await apiClient.post('/api/documents', {
        title: formData.title,
        description: formData.description,
        file_url: uploadResponse.data.file_url,
        tags: []
      });

      toast.success('Belge yüklendi');
      setFormData({ title: '', description: '', file: null });
      fetchDocuments();
    } catch (error) {
      toast.error('Yükleme başarısız');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu belgeyi silmek istediğinizden emin misiniz?')) return;
    try {
      await apiClient.delete(`/api/documents/${id}`);
      toast.success('Belge silindi');
      fetchDocuments();
    } catch (error) {
      toast.error('Silme başarısız');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Belgeler</h2>

      <form onSubmit={handleFileUpload} className="bg-white border rounded-lg p-6 mb-6">
        <h3 className="font-semibold mb-4">Yeni Belge Yükle</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Belge adı"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Açıklama"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="file"
            onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
            required
            accept=".pdf,.doc,.docx"
            className="w-full px-4 py-2 border rounded-md"
          />
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-[#1e3a8a] text-white rounded-md hover:bg-[#1b3479] disabled:opacity-50"
          >
            {uploading ? 'Yükleniyor...' : 'Yükle'}
          </button>
        </div>
      </form>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Belge Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Açıklama</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{doc.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{doc.description}</td>
                <td className="px-6 py-4 text-sm text-right">
                  <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Visits Manager
const VisitsManager = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    cover_image: '',
    gallery_images: []
  });

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await apiClient.get('/api/visits');
      setVisits(response.data.items);
    } catch (error) {
      toast.error('Ziyaretler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files, isGallery = false) => {
    setUploadingImages(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        const response = await apiClient.post('/api/upload', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedUrls.push(response.data.file_url);
      }
      
      if (isGallery) {
        setFormData({ ...formData, gallery_images: [...formData.gallery_images, ...uploadedUrls] });
      } else {
        setFormData({ ...formData, cover_image: uploadedUrls[0] });
      }
      toast.success('Resim(ler) yüklendi');
    } catch (error) {
      toast.error('Resim yükleme başarısız');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await apiClient.put(`/api/visits/${editingItem.id}`, formData);
        toast.success('Ziyaret güncellendi');
      } else {
        await apiClient.post('/api/visits', formData);
        toast.success('Ziyaret eklendi');
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({ title: '', date: '', description: '', cover_image: '', gallery_images: [] });
      fetchVisits();
    } catch (error) {
      toast.error('İşlem başarısız');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ziyareti silmek istediğinizden emin misiniz?')) return;
    try {
      await apiClient.delete(`/api/visits/${id}`);
      toast.success('Ziyaret silindi');
      fetchVisits();
    } catch (error) {
      toast.error('Silme başarısız');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      date: item.date.split('T')[0],
      description: item.description,
      cover_image: item.cover_image,
      gallery_images: item.gallery_images || []
    });
    setShowForm(true);
  };

  const removeGalleryImage = (index) => {
    const newGallery = [...formData.gallery_images];
    newGallery.splice(index, 1);
    setFormData({ ...formData, gallery_images: newGallery });
  };

  if (loading) return <div className="flex justify-center py-12"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ziyaretler</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
            setFormData({ title: '', date: '', description: '', cover_image: '', gallery_images: [] });
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-md hover:bg-[#1b3479]"
        >
          <Plus size={20} />
          <span>Yeni Ziyaret</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-4">{editingItem ? 'Ziyaret Düzenle' : 'Yeni Ziyaret Ekle'}</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Başlık"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <textarea
              placeholder="Açıklama"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="4"
              className="w-full px-4 py-2 border rounded-md"
            />
            
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kapak Resmi</label>
              {formData.cover_image ? (
                <div className="relative inline-block">
                  <img src={formData.cover_image} alt="Cover" className="w-32 h-32 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cover_image: '' })}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files.length && handleImageUpload([e.target.files[0]], false)}
                  disabled={uploadingImages}
                  className="w-full px-4 py-2 border rounded-md"
                />
              )}
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Galeri Resimleri</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.gallery_images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img} alt={`Gallery ${idx}`} className="w-24 h-24 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files.length && handleImageUpload(Array.from(e.target.files), true)}
                disabled={uploadingImages}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={uploadingImages}
                className="px-6 py-2 bg-[#1e3a8a] text-white rounded-md hover:bg-[#1b3479] disabled:opacity-50"
              >
                {uploadingImages ? 'Yükleniyor...' : editingItem ? 'Güncelle' : 'Ekle'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-md">
                İptal
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Başlık</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Resimler</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {visits.map((visit) => (
              <tr key={visit.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{visit.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(visit.date).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {(visit.gallery_images?.length || 0) + 1} resim
                </td>
                <td className="px-6 py-4 text-sm text-right space-x-2">
                  <button onClick={() => handleEdit(visit)} className="text-blue-600 hover:text-blue-800">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(visit.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PaymentsManager = () => <div><h2 className="text-2xl font-bold">Ödeme Kalemleri</h2><p className="text-gray-600 mt-4">Ödeme kalemi yönetimi burada yer alacaktır.</p></div>;

// Trainings Manager
const TrainingsManager = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    instructor: '',
    capacity: '',
    registration_link: '',
    cover_image: '',
    gallery_images: []
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await apiClient.get('/api/trainings');
      setTrainings(response.data);
    } catch (error) {
      toast.error('Eğitimler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files, isGallery = false) => {
    setUploadingImages(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        const response = await apiClient.post('/api/upload', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedUrls.push(response.data.file_url);
      }
      
      if (isGallery) {
        setFormData({ ...formData, gallery_images: [...formData.gallery_images, ...uploadedUrls] });
      } else {
        setFormData({ ...formData, cover_image: uploadedUrls[0] });
      }
      toast.success('Resim(ler) yüklendi');
    } catch (error) {
      toast.error('Resim yükleme başarısız');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeGalleryImage = (index) => {
    const newGallery = [...formData.gallery_images];
    newGallery.splice(index, 1);
    setFormData({ ...formData, gallery_images: newGallery });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : null
      };
      
      if (editingItem) {
        await apiClient.put(`/api/trainings/${editingItem.id}`, dataToSend);
        toast.success('Eğitim güncellendi');
      } else {
        await apiClient.post('/api/trainings', dataToSend);
        toast.success('Eğitim eklendi');
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({ title: '', description: '', date: '', time: '', location: '', instructor: '', capacity: '', registration_link: '', cover_image: '', gallery_images: [] });
      fetchTrainings();
    } catch (error) {
      toast.error('İşlem başarısız');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu eğitimi silmek istediğinizden emin misiniz?')) return;
    try {
      await apiClient.delete(`/api/trainings/${id}`);
      toast.success('Eğitim silindi');
      fetchTrainings();
    } catch (error) {
      toast.error('Silme başarısız');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      date: item.date.split('T')[0],
      time: item.time || '',
      location: item.location || '',
      instructor: item.instructor || '',
      capacity: item.capacity || '',
      registration_link: item.registration_link || '',
      cover_image: item.cover_image || '',
      gallery_images: item.gallery_images || []
    });
    setShowForm(true);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Eğitim ve Seminerler</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
            setFormData({ title: '', description: '', date: '', time: '', location: '', instructor: '', capacity: '', registration_link: '', cover_image: '', gallery_images: [] });
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-md hover:bg-[#1b3479]"
        >
          <Plus size={20} />
          <span>Yeni Eğitim</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-4">{editingItem ? 'Eğitim Düzenle' : 'Yeni Eğitim Ekle'}</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Eğitim Başlığı"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <textarea
              placeholder="Açıklama"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="3"
              className="w-full px-4 py-2 border rounded-md"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="time"
                placeholder="Saat"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <input
              type="text"
              placeholder="Konum"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Eğitmen"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Kontenjan"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="url"
              placeholder="Kayıt Linki"
              value={formData.registration_link}
              onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kapak Resmi</label>
              {formData.cover_image ? (
                <div className="relative inline-block">
                  <img src={formData.cover_image} alt="Cover" className="w-32 h-32 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cover_image: '' })}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files.length && handleImageUpload([e.target.files[0]], false)}
                  disabled={uploadingImages}
                  className="w-full px-4 py-2 border rounded-md"
                />
              )}
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Galeri Resimleri (Opsiyonel)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.gallery_images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img} alt={`Gallery ${idx}`} className="w-24 h-24 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files.length && handleImageUpload(Array.from(e.target.files), true)}
                disabled={uploadingImages}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={uploadingImages}
                className="px-6 py-2 bg-[#1e3a8a] text-white rounded-md hover:bg-[#1b3479] disabled:opacity-50"
              >
                {uploadingImages ? 'Yükleniyor...' : editingItem ? 'Güncelle' : 'Ekle'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-md">
                İptal
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Resim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Başlık</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Konum</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trainings.map((training) => (
              <tr key={training.id}>
                <td className="px-6 py-4">
                  {training.cover_image ? (
                    <img src={training.cover_image} alt={training.title} className="w-16 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                      <GraduationCap size={20} />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{training.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(training.date).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{training.location || '-'}</td>
                <td className="px-6 py-4 text-sm text-right space-x-2">
                  <button onClick={() => handleEdit(training)} className="text-blue-600 hover:text-blue-800">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(training.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Board Members Manager
const BoardMembersManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    board_type: 'yonetim',
    photo: '',
    bio: '',
    order: 0
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await apiClient.get('/api/board-members');
      setMembers(response.data);
    } catch (error) {
      toast.error('Üyeler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await apiClient.put(`/api/board-members/${editingItem.id}`, formData);
        toast.success('Üye güncellendi');
      } else {
        await apiClient.post('/api/board-members', formData);
        toast.success('Üye eklendi');
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({ name: '', position: '', board_type: 'yonetim', photo: '', bio: '', order: 0 });
      fetchMembers();
    } catch (error) {
      toast.error('İşlem başarısız');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu üyeyi silmek istediğinizden emin misiniz?')) return;
    try {
      await apiClient.delete(`/api/board-members/${id}`);
      toast.success('Üye silindi');
      fetchMembers();
    } catch (error) {
      toast.error('Silme başarısız');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      position: item.position,
      board_type: item.board_type,
      photo: item.photo || '',
      bio: item.bio || '',
      order: item.order || 0
    });
    setShowForm(true);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Yönetim & Denetim Kurulu</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
            setFormData({ name: '', position: '', board_type: 'yonetim', photo: '', bio: '', order: 0 });
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-md hover:bg-[#1b3479]"
        >
          <Plus size={20} />
          <span>Yeni Üye</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-4">{editingItem ? 'Üye Düzenle' : 'Yeni Üye Ekle'}</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ad Soyad"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Pozisyon (örn: Başkan, Üye)"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <select
              value={formData.board_type}
              onChange={(e) => setFormData({ ...formData, board_type: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="yonetim">Yönetim Kurulu</option>
              <option value="denetim">Denetim Kurulu</option>
            </select>
            <input
              type="text"
              placeholder="Fotoğraf URL (opsiyonel)"
              value={formData.photo}
              onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
            <textarea
              placeholder="Biyografi (opsiyonel)"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Sıra (küçük numara önce görünür)"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-md"
            />
            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2 bg-[#1e3a8a] text-white rounded-md hover:bg-[#1b3479]">
                {editingItem ? 'Güncelle' : 'Ekle'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-md">
                İptal
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ad Soyad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Pozisyon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Kurul</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Sıra</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{member.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{member.position}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {member.board_type === 'yonetim' ? 'Yönetim Kurulu' : 'Denetim Kurulu'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{member.order}</td>
                <td className="px-6 py-4 text-sm text-right space-x-2">
                  <button onClick={() => handleEdit(member)} className="text-blue-600 hover:text-blue-800">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ContactsViewer = () => <div><h2 className="text-2xl font-bold">İletişim Mesajları</h2><p className="text-gray-600 mt-4">Gelen iletişim formları burada görüntülenecektir.</p></div>;
const MembershipsViewer = () => <div><h2 className="text-2xl font-bold">Üyelik Başvuruları</h2><p className="text-gray-600 mt-4">Gelen üyelik başvuruları burada görüntülenecektir.</p></div>;

// Settings Manager
const SettingsManager = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    map_location: '',
    facebook: '',
    youtube: '',
    instagram: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get('/api/settings');
      setSettings(response.data);
      setFormData({
        address: response.data.address || '',
        phone: response.data.phone || '',
        email: response.data.email || '',
        whatsapp: response.data.whatsapp || '',
        map_location: response.data.map_location || '',
        facebook: response.data.facebook || '',
        youtube: response.data.youtube || '',
        instagram: response.data.instagram || ''
      });
    } catch (error) {
      toast.error('Ayarlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put('/api/settings', formData);
      toast.success('Ayarlar güncellendi');
      fetchSettings();
    } catch (error) {
      toast.error('Güncelleme başarısız');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="spinner"></div></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Site Ayarları</h2>

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6">
        <div className="space-y-6">
          {/* İletişim Bilgileri */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harita Konumu (lat,lng)</label>
                  <input
                    type="text"
                    value={formData.map_location}
                    onChange={(e) => setFormData({ ...formData, map_location: e.target.value })}
                    placeholder="38.7312,35.4787"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sosyal Medya */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sosyal Medya Linkleri</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="https://facebook.com/keeso"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
                <input
                  type="url"
                  value={formData.youtube}
                  onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                  placeholder="https://youtube.com/@keeso"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="https://instagram.com/keeso"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-[#1e3a8a] text-white font-medium rounded-md hover:bg-[#1b3479]"
          >
            Ayarları Kaydet
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;
