import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Upload, Search } from 'lucide-react';
import apiClient from '../api/client';
import { toast } from 'sonner';

const UyelikPage = () => {
  const [activeTab, setActiveTab] = useState('basvuru');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    tax_number: '',
    note: ''
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [queryValue, setQueryValue] = useState('');
  const [queryResult, setQueryResult] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      files.forEach(file => {
        formDataToSend.append('files', file);
      });

      await apiClient.post('/api/membership', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Başvurunuz başarıyla alındı!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        tax_number: '',
        note: ''
      });
      setFiles([]);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Başvuru gönderilemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/membership/status?query=${queryValue}`);
      setQueryResult(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Başvuru bulunamadı');
      } else {
        toast.error('Sorgulama yapılamadı');
      }
      setQueryResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Üyelik - KEESO</title>
        <meta name="description" content="KEESO üyelik başvurusu ve üyelik sorgulama" />
      </Helmet>

      <div className="bg-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <h1 className="h-heading text-5xl font-bold text-[#1e3a8a] mb-10">Üyelik</h1>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('sartlar')}
              className={`px-4 py-2 font-medium ${activeTab === 'sartlar' ? 'border-b-2 border-[#1e3a8a] text-[#1e3a8a]' : 'text-gray-600'}`}
            >Üyelik Şartları
            </button>
            <button
              onClick={() => setActiveTab('basvuru')}
              className={`px-4 py-2 font-medium ${activeTab === 'basvuru' ? 'border-b-2 border-[#1e3a8a] text-[#1e3a8a]' : 'text-gray-600'}`}
            >
              Başvuru Formu
            </button>
            <button
              onClick={() => setActiveTab('sorgula')}
              className={`px-4 py-2 font-medium ${activeTab === 'sorgula' ? 'border-b-2 border-[#1e3a8a] text-[#1e3a8a]' : 'text-gray-600'}`}
            >
              Başvuru Sorgula
            </button>
          </div>

          {/* Üyelik Şartları */}
          {activeTab === 'sartlar' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="h-heading text-xl font-semibold text-[#1e3a8a] mb-4">Üyelik Şartları</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Kayseri'de emlak sektöründe faaliyet göstermek</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Esnaf ve sanatkâr belgesi sahibi olmak</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Vergi mükellefiyeti bulunmak</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">18 yaşını doldurmuş olmak</span>
                </li>
              </ul>
              <h3 className="h-heading text-lg font-semibold text-[#1e3a8a] mt-6 mb-3">Gerekli Belgeler</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Nüfus cüzdani fotokopisi</li>
                <li>• İkametgâh belgesi</li>
                <li>• Vergi levhası</li>
                <li>• İşyeri kira sözleşmesi veya tapu</li>
              </ul>
            </div>
          )}

          {/* Başvuru Formu */}
          {activeTab === 'basvuru' && (
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="uyelik-basvuru-form">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Numarası *</label>
                <input
                  type="text"
                  name="tax_number"
                  value={formData.tax_number}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Not (Opsiyonel)</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Upload size={16} className="inline mr-1" />
                  Belgeler Yükle
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                {files.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">{files.length} dosya seçildi</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                data-testid="uyelik-basvuru-gonder"
                className="w-full px-6 py-3 bg-[#1e3a8a] text-white font-medium rounded-md hover:bg-[#1b3479] disabled:opacity-50 transition-colors"
              >
                {loading ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
              </button>
            </form>
          )}

          {/* Başvuru Sorgula */}
          {activeTab === 'sorgula' && (
            <div>
              <form onSubmit={handleQuerySubmit} className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta veya Vergi Numarası
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={queryValue}
                    onChange={(e) => setQueryValue(e.target.value)}
                    required
                    placeholder="ornek@email.com veya 1234567890"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    data-testid="uyelik-sorgula-button"
                    className="px-6 py-2 bg-[#1e3a8a] text-white font-medium rounded-md hover:bg-[#1b3479] disabled:opacity-50 transition-colors"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </form>

              {queryResult && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Başvuru Durumu</h3>
                  <p className="text-gray-700 mb-1"><strong>Ad Soyad:</strong> {queryResult.name}</p>
                  <p className="text-gray-700 mb-1"><strong>Durum:</strong> 
                    <span className={`ml-2 px-2 py-1 text-sm rounded ${
                      queryResult.status === 'approved' ? 'bg-green-100 text-green-800' :
                      queryResult.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {queryResult.status === 'approved' ? 'Onaylandı' :
                       queryResult.status === 'pending' ? 'Beklemede' : 'Reddedildi'}
                    </span>
                  </p>
                  <p className="text-gray-700"><strong>Başvuru Tarihi:</strong> {new Date(queryResult.created_at).toLocaleDateString('tr-TR')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UyelikPage;