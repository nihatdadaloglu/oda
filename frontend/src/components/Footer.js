import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import apiClient from '../api/client';

const Footer = () => {
  const [settings, setSettings] = useState(null);

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

  const quickLinks = [
    { label: 'Ana Sayfa', path: '/' },
    { label: 'Kurumsal', path: '/kurumsal' },
    { label: 'Üyelik', path: '/uyelik' },
    { label: 'Hizmetler', path: '/hizmetler' },
    { label: 'Duyurular', path: '/duyurular' },
    { label: 'İletişim', path: '/iletisim' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto" data-testid="footer-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/keeso-logo.png" alt="KEESO" className="h-10 w-10" />
              <div className="h-heading text-lg font-semibold text-[#1e3a8a]">
                KEESO
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası
            </p>
            <div className="space-y-2">
              {settings?.address && (
                <div className="flex items-start space-x-2 text-sm text-gray-700">
                  <MapPin size={16} className="mt-1 flex-shrink-0" />
                  <span>{settings.address}</span>
                </div>
              )}
              {settings?.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Phone size={16} />
                  <a href={`tel:${settings.phone}`} className="hover:text-[#1e3a8a]">
                    {settings.phone}
                  </a>
                </div>
              )}
              {settings?.email && (
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Mail size={16} />
                  <a href={`mailto:${settings.email}`} className="hover:text-[#1e3a8a]">
                    {settings.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="h-heading text-base font-semibold text-[#1e3a8a] mb-4">
              Hızlı Erişim
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-700 hover:text-[#1e3a8a] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="h-heading text-base font-semibold text-[#1e3a8a] mb-4">
              Hakkımızda
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              KEESO, Kayseri'de faaliyet gösteren emlak danışmanlarının resmi meslek kuruluşudur.
              Sektörün düzenli ve etik çerçevede gelişmesini sağlamaktayız.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
