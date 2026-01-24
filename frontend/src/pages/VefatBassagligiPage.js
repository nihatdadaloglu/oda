import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Calendar, User } from 'lucide-react';
import apiClient from '../api/client';

const VefatBassagligiPage = () => {
  const [condolences, setCondolences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCondolences();
  }, []);

  const fetchCondolences = async () => {
    try {
      const response = await apiClient.get('/api/condolences');
      setCondolences(response.data.items);
    } catch (error) {
      console.error('Error fetching condolences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Vefat ve Başsağlığı - KEESO</title>
        <meta name="description" content="KEESO vefat ve başsağlığı duyuruları" />
      </Helmet>

      <div className="bg-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Heart className="text-gray-600" size={48} />
              <h1 className="h-heading text-5xl font-bold text-gray-800">Vefat ve Başsağlığı</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Kaybettiğimiz değerli üyelerimize ve yakınlarına Allah'tan rahmet, ailelerine ve sevenlerine başsağlığı diliyoruz.
            </p>
          </div>

          {/* Condolences List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : condolences.length > 0 ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {condolences.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-xl p-8 border-l-4 border-gray-400 shadow-sm hover:shadow-md transition-shadow"
                  data-testid="vefat-kart"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="h-heading text-2xl font-bold text-gray-800 mb-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center text-gray-600">
                        <User size={16} className="mr-2" />
                        <span className="font-medium">{item.person_name}</span>
                        {item.relation && (
                          <span className="ml-2 text-gray-500">({item.relation})</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 bg-white px-4 py-2 rounded-full">
                      <Calendar size={16} className="mr-2" />
                      {new Date(item.date).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {item.content}
                  </div>

                  {/* Footer Message */}
                  <div className="mt-6 pt-4 border-t border-gray-200 text-center text-gray-600 italic">
                    "Mekanı cennet olsun."
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="text-gray-300 mx-auto mb-4" size={64} />
              <p className="text-lg text-gray-600">Henüz duyuru eklenmemiştir.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VefatBassagligiPage;
