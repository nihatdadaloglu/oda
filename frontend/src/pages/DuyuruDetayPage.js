import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar } from 'lucide-react';
import apiClient from '../api/client';

const DuyuruDetayPage = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      const response = await apiClient.get(`/api/announcements/${id}`);
      setAnnouncement(response.data);
    } catch (error) {
      console.error('Error fetching announcement:', error);
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

  if (!announcement) {
    return (
      <div className="bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">Duyuru bulunamadı.</p>
          <div className="text-center mt-4">
            <Link to="/duyurular" className="text-[#1e3a8a] hover:underline">
              Duyurulara Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{announcement.title} - KEESO</title>
        <meta name="description" content={announcement.content.substring(0, 160)} />
      </Helmet>

      <div className="bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/duyurular"
            className="inline-flex items-center text-[#1e3a8a] hover:underline mb-6"
          >
            <ArrowLeft size={20} className="mr-1" />
            Duyurulara Dön
          </Link>

          <article>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-[#1e3a8a] text-white rounded">
                {announcement.category}
              </span>
            </div>

            <h1 className="h-heading text-4xl font-bold text-[#1e3a8a] mb-4">
              {announcement.title}
            </h1>

            <div className="flex items-center text-gray-600 mb-8">
              <Calendar size={16} className="mr-2" />
              <span>
                {new Date(announcement.published_at).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            {announcement.cover_image && (
              <div className="mb-8">
                <img
                  src={announcement.cover_image}
                  alt={announcement.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {announcement.content}
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default DuyuruDetayPage;