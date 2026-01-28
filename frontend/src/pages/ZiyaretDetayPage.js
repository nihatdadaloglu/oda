import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar } from 'lucide-react';
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

  const allImages = [visit.cover_image, ...(visit.gallery_images || [])].filter(Boolean);

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

          {/* Fotoğraflar */}
          {allImages.length > 0 && (
            <div>
              <h2 
                className="text-xl text-[#1e3a8a] mb-6"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
              >
                Fotoğraflar
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {allImages.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow">
                    <img
                      src={image}
                      alt={`${visit.title} - ${index + 1}`}
                      className="w-full h-[280px] object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ZiyaretDetayPage;
