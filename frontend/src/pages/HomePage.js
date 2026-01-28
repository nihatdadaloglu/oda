import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileText, Users, Phone, Building, Calendar, ChevronRight } from 'lucide-react';
import apiClient from '../api/client';

// Hero slider images and slogans
const heroSlides = [
  {
    image: '/images/erciyes-kayak.jpg',
    slogan: 'Uğurlu ve Güvenli Alışveriş Bu Çatının Altındaki Ofislerde',
    position: 'center top' // Erciyes dağı görünsün
  },
  {
    image: '/images/kayseri-meydan.jpg',
    slogan: 'Kayseri\'de Emlak Sektörünün Güçlü Çatısı',
    position: 'center 35%' // Saat kulesi + cami + bayraklar (orta-üst odak)
  },
  {
    image: '/images/kayseri-gece1.jpg',
    slogan: 'Profesyonel Hizmet, Güvenilir Çözümler',
    position: 'center 60%' // Şehir ışıkları + AVM (orta-alt odak)
  },
  {
    image: '/images/kayseri-gece2.jpg',
    slogan: 'Emlakta Güven, KEESO Güvencesi',
    position: 'center 45%' // Bulvar + Radisson + şehir (orta odak)
  }
];

const HomePage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    fetchLatestAnnouncements();
    fetchLatestVisits();
    
    // Slider interval
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // 5 saniyede bir değişir
    
    return () => clearInterval(interval);
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

      {/* Hero Section - Full Width with Slider */}
      <section className="relative bg-[#1e3a8a] text-white overflow-hidden">
        {/* Arka Plan Slider */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.image}
              src={slide.image}
              alt="Kayseri"
              style={{ objectPosition: slide.position }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentSlideIndex ? 'opacity-50' : 'opacity-0'
              }`}
            />
          ))}
        </div>
        {/* Logo - Sağ Taraf */}
        <div className="absolute right-8 lg:right-16 xl:right-24 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block">
          <img
            src="/keeso-logo-main.png"
            alt=""
            className="w-[400px] h-[400px] xl:w-[500px] xl:h-[500px] object-contain"
          />
        </div>
        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlideIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-20 sm:py-28">
          <div className="max-w-3xl">
            {/* Değişen Slogan */}
            <div className="relative h-[120px] sm:h-[140px] lg:h-[160px] mb-6">
              {heroSlides.map((slide, index) => (
                <h1 
                  key={index}
                  className={`absolute inset-0 h-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight transition-opacity duration-700 ${
                    index === currentSlideIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {slide.slogan}
                </h1>
              ))}
            </div>
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
                <p className="font-bold text-gray-900 text-lg">
                  Selim ATASOY
                </p>
                <p className="text-[#1e3a8a] font-medium">
                  KEESO Yönetim Kurulu Başkanı
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Visits */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-center mb-12">
            <h2 className="h-heading text-3xl sm:text-4xl font-bold text-[#1e3a8a] text-center">
              Son Ziyaretler ve Etkinlikler
            </h2>
          </div>

          {visits.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {visits.map((visit) => (
                <Link
                  key={visit.id}
                  to={`/ziyaretler/${visit.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={visit.cover_image}
                        alt={visit.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar size={16} className="mr-2" />
                        {new Date(visit.date).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <h3 className="h-heading text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors line-clamp-2">
                        {visit.title}
                      </h3>
                      <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                        {visit.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">Henüz ziyaret kaydı bulunmamaktadır.</p>
          )}
          
          <div className="text-center mt-10">
            <Link
              to="/ziyaretler"
              className="inline-flex items-center px-8 py-3 bg-[#1e3a8a] text-white font-semibold text-lg rounded-lg hover:bg-[#1b3479] transition-colors"
            >
              Tüm Ziyaretleri Görüntüle
              <ChevronRight size={24} className="ml-2" />
            </Link>
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
