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

      {/* Hero Section - Full Width with Overlay */}
      <section className="relative bg-[#1e3a8a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/erciyes-hero.jpg"
            alt="Kayseri Erciyes Dağı"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-20 sm:py-28">
          <div className="max-w-3xl">
            <h1 className="h-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Kayseri'de Emlak Sektörünün Güçlü Çatısı
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası olarak, sektörün profesyonel ve etik çerçevede gelişmesi için çalışıyoruz.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/uyelik"
                data-testid="hero-basvuru-cta"
                className="inline-flex items-center px-8 py-4 bg-[#dc2626] text-white font-semibold text-lg rounded-lg hover:bg-[#b91c1c] shadow-lg transition-all"
              >
                Üyelik Başvurusu
                <ChevronRight size={24} className="ml-2" />
              </Link>
              <Link
                to="/duyurular"
                data-testid="hero-duyurular-cta"
                className="inline-flex items-center px-8 py-4 bg-white text-[#1e3a8a] font-semibold text-lg rounded-lg hover:bg-gray-100 transition-all"
              >
                Duyurular
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <h2 className="h-heading text-3xl sm:text-4xl font-bold text-[#1e3a8a] mb-12 text-center">
            Hızlı Erişim
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                data-testid="quick-action-card"
                className="group bg-white rounded-xl p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-[#1e3a8a]"
              >
                <div className={`w-16 h-16 rounded-full ${action.color === 'text-[#1e3a8a]' ? 'bg-blue-100' : 'bg-red-100'} flex items-center justify-center mb-5`}>
                  <action.icon size={32} className={`${action.color}`} />
                </div>
                <h3 className="h-heading text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-10">
            <h2 className="h-heading text-3xl sm:text-4xl font-bold text-[#1e3a8a]">
              Son Duyurular
            </h2>
            <Link
              to="/duyurular"
              className="text-base font-semibold text-[#dc2626] hover:underline flex items-center"
            >
              Tümünü Görür
              <ChevronRight size={20} className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : announcements.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-6">
              {announcements.map((announcement) => (
                <Link
                  key={announcement.id}
                  to={`/duyurular/${announcement.id}`}
                  className="group bg-gray-50 rounded-xl p-8 hover:bg-white hover:shadow-lg transition-all border border-gray-200"
                  data-testid="announcement-card"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-[#1e3a8a] text-white rounded-full">
                      {announcement.category}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      {new Date(announcement.published_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1e3a8a] transition-colors">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-700 line-clamp-3 leading-relaxed">
                    {announcement.content.substring(0, 200)}...
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-12">Henüz duyuru bulunmamaktadır.</p>
          )}
        </div>
      </section>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-[#f8fafc] py-20">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <h2 className="h-heading text-3xl sm:text-4xl font-bold text-[#1e3a8a] mb-6">
                Hakkımızda
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-5">
                Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası (KEESO), Kayseri'de faaliyet gösteren 
                emlak danışmanlarının ve emlak sektöründe çalışan esnaf ve sanatkârların resmi meslek 
                kuruluşudur.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Amacımız, sektörde faaliyet gösteren üyelerimizin haklarını korumak, mesleki standartları 
                yükseltmek ve sektörün düzenli ve etik çerçevede gelişmesini sağlamaktır.
              </p>
              <Link
                to="/kurumsal"
                className="inline-flex items-center text-lg font-semibold text-[#dc2626] hover:underline"
              >
                Detaylı Bilgi
                <ChevronRight size={24} className="ml-1" />
              </Link>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-shadow">
                <Building size={40} className="text-[#1e3a8a] mx-auto mb-4" />
                <p className="text-base font-semibold text-gray-700 mb-1">Kurumsal</p>
                <p className="text-base font-semibold text-gray-700">Profesyonellik</p>
              </div>
              <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-shadow">
                <Users size={40} className="text-[#dc2626] mx-auto mb-4" />
                <p className="text-base font-semibold text-gray-700 mb-1">Güvenilir</p>
                <p className="text-base font-semibold text-gray-700">Hizmet</p>
              </div>
              <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-shadow">
                <FileText size={40} className="text-[#1e3a8a] mx-auto mb-4" />
                <p className="text-base font-semibold text-gray-700 mb-1">Etik</p>
                <p className="text-base font-semibold text-gray-700">Standartlar</p>
              </div>
              <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-shadow">
                <Phone size={40} className="text-[#dc2626] mx-auto mb-4" />
                <p className="text-base font-semibold text-gray-700 mb-1">7/24</p>
                <p className="text-base font-semibold text-gray-700">Destek</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
