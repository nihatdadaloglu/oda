import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, ChevronRight } from 'lucide-react';
import apiClient from '../api/client';

const DuyurularPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [total, setTotal] = useState(0);

  const categories = [
    'Genel Duyurular',
    'Eğitimler',
    'Mevzuat',
    'Etkinlikler',
    'Önemli Bilgilendirmeler'
  ];

  useEffect(() => {
    fetchAnnouncements();
  }, [category, searchQuery]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (searchQuery) params.search = searchQuery;
      
      const response = await apiClient.get('/api/announcements', { params });
      setAnnouncements(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Duyurular - KEESO</title>
        <meta name="description" content="KEESO duyuruları ve haberler" />
      </Helmet>

      <div className="bg-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <h1 className="h-heading text-5xl font-bold text-[#1e3a8a] mb-10">Duyurular</h1>

          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Duyurularda ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="duyurular-ara-input"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                data-testid="duyurular-kategori-select"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : announcements.length > 0 ? (
            <>
              <p className="text-sm text-gray-600 mb-4">{total} duyuru bulundu</p>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Link
                    key={announcement.id}
                    to={`/duyurular/${announcement.id}`}
                    data-testid="duyuru-kart"
                    className="block border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-[#1e3a8a] text-white rounded">
                            {announcement.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(announcement.published_at).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {announcement.title}
                        </h3>
                        <p className="text-gray-700 line-clamp-2">
                          {announcement.content.substring(0, 200)}...
                        </p>
                      </div>
                      <ChevronRight size={24} className="text-gray-400 flex-shrink-0 ml-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Sonuç bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DuyurularPage;