import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Download } from 'lucide-react';
import apiClient from '../api/client';

const HizmetlerPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await apiClient.get('/api/documents');
      setDocuments(response.data.items);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Hizmetler - KEESO</title>
        <meta name="description" content="KEESO hizmetleri ve doküman merkezi" />
      </Helmet>

      <div className="bg-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <h1 className="h-heading text-5xl font-bold text-[#1e3a8a] mb-10">Hizmetler</h1>

          {/* Hizmetlerimiz */}
          <section className="mb-12">
            <h2 className="h-heading text-2xl font-semibold text-[#1e3a8a] mb-6">Hizmetlerimiz</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Esnaf Kaydı</h3>
                <p className="text-sm text-gray-700">Esnaf ve sanatkâr kaydı işlemleriniz için başvuru yapabilirsiniz.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Mesleki Eğitim</h3>
                <p className="text-sm text-gray-700">Emlak sektörüne yönelik eğitim programlarımıza katılabilirsiniz.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Danışmanlık</h3>
                <p className="text-sm text-gray-700">Hukuki ve mesleki konularda uzman danışmanlık hizmeti sağlıyoruz.</p>
              </div>
            </div>
          </section>

          {/* Doküman Merkezi */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="text-[#dc2626]" size={24} />
              <h2 className="h-heading text-2xl font-semibold text-[#1e3a8a]">Doküman Merkezi</h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="spinner"></div>
              </div>
            ) : documents.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden" data-testid="dokuman-tablosu">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Belge Adı</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Açıklama</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{doc.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="dokuman-indir-button"
                            className="inline-flex items-center text-[#1e3a8a] hover:text-[#1b3479]"
                          >
                            <Download size={16} className="mr-1" />
                            İndir
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-600 py-12">Henüz doküman bulunmamaktadır.</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default HizmetlerPage;