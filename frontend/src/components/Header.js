import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Ana Sayfa', path: '/' },
    { label: 'Kurumsal', path: '/kurumsal' },
    { label: 'Yönetim Kurulu', path: '/yonetim-kurulu' },
    { label: 'Üyelik', path: '/uyelik' },
    { label: 'Eğitim ve Seminerler', path: '/egitim-seminerler' },
    { label: 'Duyurular', path: '/duyurular' },
    { label: 'Ziyaretler', path: '/ziyaretler' },
    { label: 'Ödeme', path: '/odeme' },
    { label: 'İletişim', path: '/iletisim' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200"
      data-testid="header-navbar"
    >
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" data-testid="header-logo">
            <img src="/keeso-logo.png" alt="KEESO Logo" className="h-12 w-12" />
            <div className="hidden md:block">
              <div className="h-heading text-lg font-semibold text-[#1e3a8a] leading-tight">
                KEESO
              </div>
              <div className="text-xs text-gray-600">Kayseri Emlakçılar Odası</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                data-testid="header-nav-link"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'text-[#1e3a8a] bg-gray-100'
                    : 'text-gray-700 hover:text-[#1e3a8a] hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="header-nav-link-mobile"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'text-[#1e3a8a] bg-gray-100'
                      : 'text-gray-700 hover:text-[#1e3a8a] hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
