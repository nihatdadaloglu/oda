import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import apiClient from '../api/client';
import { toast } from 'sonner';

const IletisimPage = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get('/api/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Settings fetch error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post('/api/contact', formData);
      toast.success('Mesajınız başarıyla gönderildi!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Mesaj gönderilemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>İletişim - KEESO</title>
        <meta name="description" content="KEESO ile iletişime geçin" />
      </Helmet>

      <div className="bg-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <h1 className="h-heading text-5xl font-bold text-[#1e3a8a] mb-10">İletişim</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <h2 className="h-heading text-2xl font-semibold text-[#1e3a8a] mb-6">İletişim Formu</h2>
              <form onSubmit={handleSubmit} className="space-y-4" data-testid="iletisim-form">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="iletisim-gonder-button"
                  className="w-full px-6 py-3 bg-[#1e3a8a] text-white font-medium rounded-md hover:bg-[#1b3479] disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="h-heading text-2xl font-semibold text-[#1e3a8a] mb-6">İletişim Bilgileri</h2>
              <div className="space-y-6 mb-8">
                {settings?.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-[#dc2626] flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Adres</h3>
                      <p className="text-gray-700">{settings.address}</p>
                    </div>
                  </div>
                )}
                {settings?.phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="text-[#dc2626] flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                      <a
                        href={`tel:${settings.phone}`}
                        className="text-[#1e3a8a] hover:underline"
                      >
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                )}
                {settings?.email && (
                  <div className="flex items-start space-x-3">
                    <Mail className="text-[#dc2626] flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">E-posta</h3>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-[#1e3a8a] hover:underline"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}
                {settings?.whatsapp && (
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="text-[#dc2626] flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                      <a
                        href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1e3a8a] hover:underline"
                      >
                        {settings.whatsapp}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Map */}
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3127.4876!2d35.4787!3d38.7312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDQzJzUyLjMiTiAzNcKwMjgnNDMuMyJF!5e0!3m2!1sen!2str!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="KEESO Harita"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IletisimPage;