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
    { label: 'Basında Biz', path: '/basinda-biz' },
    { label: 'Vefat ve Başsağlığı', path: '/vefat-bassagligi' },
    { label: 'Ödeme', path: '/odeme' },
    { label: 'İletişim', path: '/iletisim' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className="sticky top-0 z-50 bg-[#1e3a8a] shadow-lg"
      data-testid="header-navbar"
    >
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" data-testid="header-logo">
            <img src="/keeso-logo-main.png" alt="KEESO Logo" className="h-14 w-14" />
            <div className="hidden md:block">
              <div className="text-xl text-white leading-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                KEESO
              </div>
              <div className="text-xs text-blue-200" style={{ fontFamily: "'Open Sans', sans-serif" }}>Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                data-testid="header-nav-link"
                className={`px-3 py-2 text-sm rounded-md transition-all ${
                  isActive(item.path)
                    ? 'text-white bg-white/20 shadow-inner'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, letterSpacing: '0.02em' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/10"
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="header-nav-link-mobile"
                  className={`px-3 py-2 text-sm font-semibold rounded-md transition-all ${
                    isActive(item.path)
                      ? 'text-white bg-white/20'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
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
