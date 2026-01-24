import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Newspaper, Calendar, ExternalLink } from 'lucide-react';
import apiClient from '../api/client';

const BasindaBizPage = () => {
  const [pressItems, setPressItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPressItems();
  }, []);

  const fetchPressItems = async () => {
    try {
      const response = await apiClient.get('/api/press');
      setPressItems(response.data.items);
    } catch (error) {
      console.error('Error fetching press items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Basında Biz - KEESO</title>
        <meta name="description" content="KEESO basın haberleri ve medya yansımaları" />
      </Helmet>

      <div className="bg-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Newspaper className="text-[#1e3a8a]" size={48} />
              <h1 className="h-heading text-5xl font-bold text-[#1e3a8a]">Basında Biz</h1>
            </div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası'nın basında yer alan haberleri ve medya yansımaları.
            </p>
          </div>

          {/* Press Items Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : pressItems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pressItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-200 group"
                  data-testid="basinda-biz-kart"
                >
                  {/* Image */}
                  {item.cover_image ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.cover_image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-[#1e3a8a] to-[#3b5998] flex items-center justify-center">
                      <Newspaper className="text-white/50" size={64} />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Source Badge */}
                    {item.source && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#1e3a8a]/10 text-[#1e3a8a] rounded-full mb-3">
                        {item.source}
                      </span>
                    )}

                    <h3 className="h-heading text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2" />
                        {new Date(item.date).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>

                      {item.source_url && (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm font-medium text-[#1e3a8a] hover:text-[#dc2626] transition-colors"
                        >
                          Haberi Oku
                          <ExternalLink size={14} className="ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Newspaper className="text-gray-300 mx-auto mb-4" size={64} />
              <p className="text-lg text-gray-600">Henüz basın haberi eklenmemiştir.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BasindaBizPage;
