import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileText, Users, Phone, Building, Calendar, ChevronRight } from 'lucide-react';
import apiClient from '../api/client';

const HomePage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestAnnouncements();
    fetchLatestVisits();
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

  const fetchLatestVisits = async () => {
    try {
      const response = await apiClient.get('/api/visits?limit=3');
      setVisits(response.data.items);
    } catch (error) {
      console.error('Error fetching visits:', error);
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
      icon: Calendar,
      title: 'Eğitim ve Seminerler',
      description: 'Eğitim programlarına katılın',
      link: '/egitim-seminerler',
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

      {/* Hero Section - Full Width with Overlay and Visits */}
      <section className="relative bg-[#1e3a8a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/erciyes-hero.jpg"
            alt="Kayseri Erciyes Dağı"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Title and CTA */}
            <div className="max-w-2xl">
              <h1 className="h-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
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

            {/* Right: Latest Visits */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
              <h3 className="h-heading text-xl font-bold text-[#1e3a8a] mb-4 flex items-center">
                <Calendar size={24} className="mr-2 text-[#dc2626]" />
                Son Ziyaretler ve Etkinlikler
              </h3>
              {visits.length > 0 ? (
                <div className="space-y-4">
                  {visits.slice(0, 3).map((visit) => (
                    <Link
                      key={visit.id}
                      to={`/ziyaretler/${visit.id}`}
                      className="group block"
                    >
                      <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={visit.cover_image}
                            alt={visit.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">
                            {new Date(visit.date).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#1e3a8a] transition-colors line-clamp-2 mb-1">
                            {visit.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">Henüz ziyaret kaydı bulunmamaktadır.</p>
              )}
              <Link
                to="/ziyaretler"
                className="mt-4 block text-center px-4 py-2 bg-[#1e3a8a] text-white font-semibold text-sm rounded-lg hover:bg-[#1b3479] transition-colors"
              >
                Tüm Ziyaretleri Görüntüle
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Başkan'dan Mesaj */}
      <section className="bg-gradient-to-r from-[#f8fafc] to-white py-12 border-y border-gray-100">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1">
              <div className="relative max-w-sm mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] to-[#dc2626] rounded-2xl transform rotate-2"></div>
                <img
                  src="https://customer-assets.emergentagent.com/job_keeso-kurumsal/artifacts/na1b4co3_IMG_1666.JPG"
                  alt="KEESO Başkanı"
                  className="relative rounded-2xl shadow-xl w-full object-cover aspect-[3/4]"
                />
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="h-heading text-2xl sm:text-3xl font-bold text-[#1e3a8a] mb-4">
                Başkan'dan Mesaj
              </h2>
              <div className="space-y-3 text-base text-gray-700 leading-relaxed">
                <p>
                  Değerli Üyelerimiz ve Ziyaretçilerimiz,
                </p>
                <p>
                  Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası olarak, sektörümüzün gelişimi ve 
                  üyelerimizin haklarının korunması için var gücümüzle çalışmaktayız. Emlak sektöründe 
                  profesyonelleşme, etik değerlere bağlılık ve sürekli gelişim ilkelerimizin merkezinde 
                  yer almaktadır.
                </p>
                <p>
                  Odamız, üyelerimize en iyi hizmeti sunmak, sektörel gelişmeleri takip etmek ve 
                  meslektaşlarımızın sorunlarına çözüm üretmek için kesintisiz çalışmalarına devam etmektedir.
                </p>
                <p className="font-semibold text-[#1e3a8a] mt-4">
                  Saygılarımla,
                </p>
                <p className="font-bold text-gray-900">
                  KEESO Başkanı
                </p>
              </div>
            </div>
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
                <p className="text-base font-semibold text-gray-700 mb-1">Denetim</p>
                <p className="text-base font-semibold text-gray-700">Kontrol</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
