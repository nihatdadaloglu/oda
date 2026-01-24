import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { GraduationCap, Calendar, MapPin, Users, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import apiClient from '../api/client';

const EgitimSeminerlerPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

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

  const openGallery = (training, index = 0) => {
    setSelectedTraining(training);
    setGalleryIndex(index);
  };

  const closeGallery = () => {
    setSelectedTraining(null);
    setGalleryIndex(0);
  };

  const getAllImages = (training) => {
    const images = [];
    if (training.cover_image) images.push(training.cover_image);
    if (training.gallery_images) images.push(...training.gallery_images);
    return images;
  };

  const nextImage = () => {
    if (!selectedTraining) return;
    const images = getAllImages(selectedTraining);
    setGalleryIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!selectedTraining) return;
    const images = getAllImages(selectedTraining);
    setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);
  };

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
                  className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border-2 ${
                    isPast(training.date) ? 'border-gray-200 opacity-90' : 'border-[#1e3a8a]'
                  }`}
                  data-testid="egitim-kart"
                >
                  {/* Image Section */}
                  {training.cover_image && (
                    <div 
                      className="relative h-56 overflow-hidden cursor-pointer group"
                      onClick={() => openGallery(training, 0)}
                    >
                      <img 
                        src={training.cover_image} 
                        alt={training.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <span className="text-white text-sm font-medium">Galeriyi Görüntüle</span>
                      </div>
                      {/* Gallery Count Badge */}
                      {training.gallery_images && training.gallery_images.length > 0 && (
                        <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                          +{training.gallery_images.length} Resim
                        </div>
                      )}
                      {/* Status Badge on Image */}
                      <div className="absolute top-3 left-3">
                        {isPast(training.date) ? (
                          <span className="px-4 py-1.5 text-sm font-semibold bg-gray-700 text-white rounded-full">
                            Tamamlandı
                          </span>
                        ) : (
                          <span className="px-4 py-1.5 text-sm font-semibold bg-green-600 text-white rounded-full">
                            Yaklaşan
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="p-8">
                    {/* Status Badge (if no image) */}
                    {!training.cover_image && (
                      <>
                        {isPast(training.date) ? (
                          <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-gray-200 text-gray-700 rounded-full mb-4">
                            Tamamlandı
                          </span>
                        ) : (
                          <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-green-100 text-green-700 rounded-full mb-4">
                            Yaklaşan
                          </span>
                        )}
                      </>
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

                    {/* Gallery Thumbnails */}
                    {training.gallery_images && training.gallery_images.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-3">Galeri</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {training.gallery_images.slice(0, 4).map((img, idx) => (
                            <img 
                              key={idx}
                              src={img} 
                              alt={`${training.title} - ${idx + 1}`}
                              className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                              onClick={() => openGallery(training, idx + 1)}
                            />
                          ))}
                          {training.gallery_images.length > 4 && (
                            <div 
                              className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors flex-shrink-0"
                              onClick={() => openGallery(training, 4)}
                            >
                              <span className="text-sm font-medium text-gray-600">+{training.gallery_images.length - 4}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

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

      {/* Image Gallery Modal */}
      {selectedTraining && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeGallery}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            onClick={closeGallery}
          >
            <X size={32} />
          </button>
          
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
          >
            <ChevronLeft size={32} />
          </button>
          
          <div className="max-w-4xl max-h-[80vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img 
              src={getAllImages(selectedTraining)[galleryIndex]} 
              alt={`${selectedTraining.title} - ${galleryIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <p className="text-white text-center mt-4 text-lg">
              {selectedTraining.title} ({galleryIndex + 1} / {getAllImages(selectedTraining).length})
            </p>
          </div>
          
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </>
  );
};

export default EgitimSeminerlerPage;