import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, MapPin, Users, Share2 } from 'lucide-react';
import apiClient from '../api/client';

const ZiyaretDetayPage = () => {
  const { id } = useParams();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisit();
  }, [id]);

  const fetchVisit = async () => {
    try {
      const response = await apiClient.get(`/api/visits/${id}`);
      setVisit(response.data);
    } catch (error) {
      console.error('Error fetching visit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-12">
            <p className="text-xl text-gray-600">Ziyaret bulunamadı.</p>
            <Link
              to="/ziyaretler"
              className="inline-flex items-center mt-6 text-[#1e3a8a] hover:underline font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Ziyaretlere Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allImages = [visit.cover_image, ...(visit.gallery_images || [])].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{visit.title} - KEESO</title>
        <meta name="description" content={visit.description} />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Banner */}
        <div className="bg-[#1e3a8a] text-white py-8">
          <div className="mx-auto max-w-[1200px] px-6">
            <Link
              to="/ziyaretler"
              className="inline-flex items-center text-blue-200 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span style={{ fontFamily: "'Poppins', sans-serif" }}>Tüm Ziyaretler</span>
            </Link>
            
            <h1 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Poppins', sans-serif", lineHeight: 1.3 }}
            >
              {visit.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-blue-100">
              <div className="flex items-center">
                <Calendar size={18} className="mr-2" />
                <span style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  {new Date(visit.date).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-[1200px] px-6 py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Sol Taraf - Açıklama */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-24">
                <h2 
                  className="text-xl font-bold text-[#1e3a8a] mb-4 pb-4 border-b border-gray-100"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Ziyaret Hakkında
                </h2>
                <p 
                  className="text-gray-700 leading-relaxed"
                  style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '15px', lineHeight: 1.8 }}
                >
                  {visit.description}
                </p>
                
                {/* Paylaş */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Bu ziyareti paylaş
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                      className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <span className="text-sm font-bold">f</span>
                    </button>
                    <button 
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${visit.title}`, '_blank')}
                      className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
                    >
                      <span className="text-sm font-bold">X</span>
                    </button>
                    <button 
                      onClick={() => window.open(`https://wa.me/?text=${visit.title} ${window.location.href}`, '_blank')}
                      className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                    >
                      <span className="text-sm font-bold">W</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Taraf - Fotoğraflar */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 
                  className="text-xl font-bold text-[#1e3a8a] mb-6 pb-4 border-b border-gray-100"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Fotoğraf Galerisi
                  <span className="text-sm font-normal text-gray-500 ml-2">({allImages.length} fotoğraf)</span>
                </h2>
                
                {/* Ana Görsel */}
                {allImages.length > 0 && (
                  <div className="mb-6">
                    <img
                      src={allImages[0]}
                      alt={visit.title}
                      className="w-full h-[400px] object-cover rounded-xl shadow-sm"
                    />
                  </div>
                )}
                
                {/* Diğer Görseller Grid */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allImages.slice(1).map((image, index) => (
                      <div
                        key={index}
                        className="aspect-[4/3] overflow-hidden rounded-xl shadow-sm"
                      >
                        <img
                          src={image}
                          alt={`${visit.title} - ${index + 2}`}
                          data-testid="galeri-gorsel"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {allImages.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>Bu ziyarete ait fotoğraf bulunmamaktadır.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ZiyaretDetayPage;
