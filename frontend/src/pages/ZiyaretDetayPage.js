import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import apiClient from '../api/client';

const ZiyaretDetayPage = () => {
  const { id } = useParams();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const allImages = visit ? [visit.cover_image, ...(visit.gallery_images || [])].filter(Boolean) : [];

  const openGallery = (index) => {
    setCurrentIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Klavye kontrolü
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!galleryOpen) return;
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryOpen]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="bg-white py-16">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <p className="text-xl text-gray-600">Ziyaret bulunamadı.</p>
          <Link to="/ziyaretler" className="inline-flex items-center mt-4 text-[#1e3a8a] hover:underline">
            <ArrowLeft size={18} className="mr-1" /> Geri Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{visit.title} - KEESO</title>
      </Helmet>

      <div className="bg-white py-10">
        <div className="mx-auto max-w-[900px] px-6">
          
          {/* Geri Butonu */}
          <Link
            to="/ziyaretler"
            className="inline-flex items-center text-[#1e3a8a] hover:text-[#dc2626] transition-colors mb-8"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
          >
            <ArrowLeft size={20} className="mr-2" />
            Ziyaretlere Dön
          </Link>

          {/* Başlık */}
          <h1 
            className="text-3xl md:text-4xl text-[#1e3a8a] mb-4"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
          >
            {visit.title}
          </h1>

          {/* Tarih */}
          <div className="flex items-center text-gray-500 mb-8 pb-6 border-b border-gray-200">
            <Calendar size={18} className="mr-2 text-[#dc2626]" />
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '15px' }}>
              {new Date(visit.date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </span>
          </div>

          {/* Açıklama */}
          <p 
            className="text-gray-700 mb-10"
            style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '16px', lineHeight: 1.9 }}
          >
            {visit.description}
          </p>

          {/* Fotoğraf Galerisi */}
          {allImages.length > 0 && (
            <div>
              <h2 
                className="text-xl text-[#1e3a8a] mb-6"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
              >
                Fotoğraf Galerisi ({allImages.length})
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {allImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="cursor-pointer group"
                    onClick={() => openGallery(index)}
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                      <img
                        src={image}
                        alt={`${visit.title} - ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Galeri Lightbox */}
      {galleryOpen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Kapat Butonu */}
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 p-2"
          >
            <X size={32} />
          </button>

          {/* Önceki Butonu */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 p-2 bg-black/30 rounded-full"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Resim */}
          <div className="max-w-[90vw] max-h-[85vh] flex items-center justify-center">
            <img
              src={allImages[currentIndex]}
              alt={`${visit.title} - ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>

          {/* Sonraki Butonu */}
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 p-2 bg-black/30 rounded-full"
          >
            <ChevronRight size={40} />
          </button>

          {/* Alt Bilgi */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-center">
            <p className="text-lg font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {currentIndex + 1} / {allImages.length}
            </p>
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ZiyaretDetayPage;
