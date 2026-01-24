import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileText, Users, Phone, Building, Calendar, ChevronRight } from 'lucide-react';
import apiClient from '../api/client';

const HomePage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestAnnouncements();
  }, []);

  const fetchLatestAnnouncements = async () => {
    try {
      const response = await apiClient.get('/api/announcements?limit=5');
      setAnnouncements(response.data.items);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: Users,
      title: 'Üyelik Başvurusu',
      description: 'Yeni üyelik başvurunuzu yapabilirsiniz',
      link: '/uyelik',
      color: 'text-[#1e3a8a]',
    },
    {
      icon: FileText,
      title: 'Belgeler',
      description: 'Resmi belgelere ulaşın',
      link: '/hizmetler',
      color: 'text-[#dc2626]',
    },
    {
      icon: Calendar,
      title: 'Duyurular',
      description: 'Güncel duyuruları takip edin',
      link: '/duyurular',
      color: 'text-[#1e3a8a]',
    },
    {
      icon: Phone,
      title: 'İletişim',
      description: 'Bizimle iletişime geçin',
      link: '/iletisim',
      color: 'text-[#dc2626]',
    },
  ];

  return (
    <>
      <Helmet>
        <title>KEESO - Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası</title>
        <meta
          name="description"
          content="Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası resmi web sitesi. Üyelik başvuruları, duyurular ve hizmetlerimiz hakkında bilgi edinin."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="h-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1e3a8a] tracking-tight">
                Kayseri'de Emlak Sektörünün Güçlü Çatısı
              </h1>
              <p className="mt-4 text-lg text-gray-700 max-w-prose">
                Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası olarak, sektörün profesyonel ve etik çerçevede gelişmesi için çalışıyoruz.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/uyelik"
                  data-testid="hero-basvuru-cta"
                  className="inline-flex items-center px-6 py-3 bg-[#1e3a8a] text-white font-medium rounded-md hover:bg-[#1b3479] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1e3a8a] transition-colors"
                >
                  Üyelik Başvurusu
                  <ChevronRight size={20} className="ml-2" />
                </Link>
                <Link
                  to="/duyurular"
                  data-testid="hero-duyurular-cta"
                  className="inline-flex items-center px-6 py-3 border border-[#1e3a8a] text-[#1e3a8a] font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Duyurular
                </Link>
              </div>
            </div>
            <div className="aspect-[16/10] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <img
                src="/images/erciyes-hero.jpg"
                alt="Kayseri Erciyes Dağı"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="h-heading text-2xl sm:text-3xl font-semibold text-[#1e3a8a] mb-8 text-center">
            Hızlı Erişim
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                data-testid="quick-action-card"
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all group"
              >
                <action.icon size={32} className={`${action.color} mb-3`} />
                <h3 className="h-heading text-base font-semibold text-gray-900 mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="h-heading text-2xl sm:text-3xl font-semibold text-[#1e3a8a]">
              Son Duyurular
            </h2>
            <Link
              to="/duyurular"
              className="text-sm font-medium text-[#dc2626] hover:underline"
            >
              Tümünü Görür
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Link
                  key={announcement.id}
                  to={`/duyurular/${announcement.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  data-testid="announcement-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-[#1e3a8a] text-white rounded">
                          {announcement.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(announcement.published_at).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {announcement.content.substring(0, 150)}...
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 flex-shrink-0 ml-4" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-12">Henüz duyuru bulunmamaktadır.</p>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="h-heading text-2xl sm:text-3xl font-semibold text-[#1e3a8a] mb-4">
                Hakkımızda
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası (KEESO), Kayseri'de faaliyet gösteren 
                emlak danışmanlarının ve emlak sektöründe çalışan esnaf ve sanatkârların resmi meslek 
                kuruluşudur.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Amacımız, sektörde faaliyet gösteren üyelerimizin haklarını korumak, mesleki standartları 
                yükseltmek ve sektörün düzenli ve etik çerçevede gelişmesini sağlamaktır.
              </p>
              <Link
                to="/kurumsal"
                className="inline-flex items-center text-[#dc2626] font-medium hover:underline"
              >
                Detaylı Bilgi
                <ChevronRight size={20} className="ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <Building size={32} className="text-[#1e3a8a] mx-auto mb-2" />
                <p className="text-sm text-gray-600">Kurumsal</p>
                <p className="text-sm text-gray-600">Profesyonellik</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <Users size={32} className="text-[#dc2626] mx-auto mb-2" />
                <p className="text-sm text-gray-600">Güvenilir</p>
                <p className="text-sm text-gray-600">Hizmet</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <FileText size={32} className="text-[#1e3a8a] mx-auto mb-2" />
                <p className="text-sm text-gray-600">Etik</p>
                <p className="text-sm text-gray-600">Standartlar</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <Phone size={32} className="text-[#dc2626] mx-auto mb-2" />
                <p className="text-sm text-gray-600">7/24</p>
                <p className="text-sm text-gray-600">Destek</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
