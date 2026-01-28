import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Youtube, Instagram } from 'lucide-react';
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
    { label: 'Eğitim ve Seminerler', path: '/egitim-seminerler' },
    { label: 'Duyurular', path: '/duyurular' },
    { label: 'İletişim', path: '/iletisim' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto" data-testid="footer-container">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/keeso-logo-main.png" alt="KEESO" className="h-10 w-10" />
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
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              KEESO, Kayseri'de faaliyet gösteren emlak danışmanlarının resmi meslek kuruluşudur.
              Sektörün düzenli ve etik çerçevede gelişmesini sağlamaktayız.
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center space-x-3">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center hover:bg-[#1b3479] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
              )}
              {settings?.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#dc2626] text-white rounded-full flex items-center justify-center hover:bg-[#b91c1c] transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size={20} />
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-full flex items-center justify-center hover:from-purple-700 hover:to-pink-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              )}
            </div>
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
