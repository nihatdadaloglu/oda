import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { GraduationCap, Calendar, MapPin, Users, Clock } from 'lucide-react';
import apiClient from '../api/client';

const EgitimSeminerlerPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await apiClient.get('/api/trainings');
      setTrainings(response.data);
    } catch (error) {
      console.error('Error fetching trainings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainings = trainings.filter(training => {
    const trainingDate = new Date(training.date);
    const now = new Date();
    
    if (filter === 'upcoming') return trainingDate >= now;
    if (filter === 'past') return trainingDate < now;
    return true;
  });

  const isPast = (date) => new Date(date) < new Date();

  return (
    <>
      <Helmet>
        <title>Eğitim ve Seminerler - KEESO</title>
        <meta name="description" content="KEESO eğitim programları ve seminerler" />
      </Helmet>

      <div className="bg-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <GraduationCap className="text-[#1e3a8a]" size={48} />
              <h1 className="h-heading text-5xl font-bold text-[#1e3a8a]">Eğitim ve Seminerler</h1>
            </div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Emlak sektöründe profesyonelleşme ve sürekli gelişim için düzenlediğimiz eğitim programları ve seminerlere katılabilirsiniz.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center space-x-4 mb-12">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-[#1e3a8a] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                filter === 'upcoming'
                  ? 'bg-[#1e3a8a] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yaklaşan
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                filter === 'past'
                  ? 'bg-[#1e3a8a] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Geçmiş
            </button>
          </div>

          {/* Trainings List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : filteredTrainings.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {filteredTrainings.map((training) => (
                <div
                  key={training.id}
                  className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-8 border-2 ${
                    isPast(training.date) ? 'border-gray-200 opacity-75' : 'border-[#1e3a8a]'
                  }`}
                  data-testid="egitim-kart"
                >
                  {/* Status Badge */}
                  {isPast(training.date) ? (
                    <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-gray-200 text-gray-700 rounded-full mb-4">
                      Tamamlandı
                    </span>
                  ) : (
                    <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-green-100 text-green-700 rounded-full mb-4">
                      Yaklaşan
                    </span>
                  )}

                  <h3 className="h-heading text-2xl font-bold text-gray-900 mb-4">
                    {training.title}
                  </h3>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    {training.description}
                  </p>

                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-[#dc2626] flex-shrink-0" size={20} />
                      <span className="font-medium">
                        {new Date(training.date).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </span>
                    </div>

                    {training.time && (
                      <div className="flex items-center space-x-3">
                        <Clock className="text-[#dc2626] flex-shrink-0" size={20} />
                        <span>{training.time}</span>
                      </div>
                    )}

                    {training.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="text-[#dc2626] flex-shrink-0" size={20} />
                        <span>{training.location}</span>
                      </div>
                    )}

                    {training.instructor && (
                      <div className="flex items-center space-x-3">
                        <Users className="text-[#dc2626] flex-shrink-0" size={20} />
                        <span>Eğitmen: {training.instructor}</span>
                      </div>
                    )}

                    {training.capacity && (
                      <div className="flex items-center space-x-3">
                        <Users className="text-[#dc2626] flex-shrink-0" size={20} />
                        <span>Kontenjan: {training.capacity} kişi</span>
                      </div>
                    )}
                  </div>

                  {!isPast(training.date) && training.registration_link && (
                    <div className="mt-6">
                      <a
                        href={training.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full text-center px-6 py-3 bg-[#dc2626] text-white font-semibold rounded-lg hover:bg-[#b91c1c] transition-colors"
                      >
                        Kayıt Ol
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <GraduationCap className="text-gray-300 mx-auto mb-4" size={64} />
              <p className="text-lg text-gray-600">
                {filter === 'upcoming'
                  ? 'Yaklaşan eğitim bulunmamaktadır.'
                  : filter === 'past'
                  ? 'Geçmiş eğitim kaydı bulunmamaktadır.'
                  : 'Henüz eğitim programı eklenmemiştir.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EgitimSeminerlerPage;