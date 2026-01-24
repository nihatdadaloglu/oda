import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar } from 'lucide-react';
import apiClient from '../api/client';

const ZiyaretlerPage = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await apiClient.get('/api/visits');
      setVisits(response.data.items);
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Ziyaretler - KEESO</title>
        <meta name="description" content="KEESO ziyaretleri ve etkinlikleri" />
      </Helmet>

      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="h-heading text-4xl font-bold text-[#1e3a8a] mb-8">Ziyaretler</h1>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : visits.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {visits.map((visit) => (
                <Link
                  key={visit.id}
                  to={`/ziyaretler/${visit.id}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow" data-testid="ziyaret-kart">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={visit.cover_image}
                        alt={visit.title}
                        data-testid="galeri-gorsel"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar size={16} className="mr-1" />
                        {new Date(visit.date).toLocaleDateString('tr-TR')}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {visit.title}
                      </h3>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {visit.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-12">Henüz ziyaret kaydı bulunmamaktadır.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ZiyaretlerPage;