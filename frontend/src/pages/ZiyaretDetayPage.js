import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, X } from 'lucide-react';
import apiClient from '../api/client';

const ZiyaretDetayPage = () => {
  const { id } = useParams();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">Ziyaret bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{visit.title} - KEESO</title>
        <meta name="description" content={visit.description} />
      </Helmet>

      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/ziyaretler"
            className="inline-flex items-center text-[#1e3a8a] hover:underline mb-6"
          >
            <ArrowLeft size={20} className="mr-1" />
            Ziyaretlere Dön
          </Link>

          <h1 className="h-heading text-4xl font-bold text-[#1e3a8a] mb-4">
            {visit.title}
          </h1>

          <div className="flex items-center text-gray-600 mb-8">
            <Calendar size={16} className="mr-2" />
            <span>
              {new Date(visit.date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed">{visit.description}</p>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[visit.cover_image, ...(visit.gallery_images || [])].map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${visit.title} - ${index + 1}`}
                  data-testid="galeri-gorsel"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          data-testid="galeri-dialog"
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ZiyaretDetayPage;