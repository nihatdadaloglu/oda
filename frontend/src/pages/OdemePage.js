import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink } from 'lucide-react';
import apiClient from '../api/client';

const OdemePage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await apiClient.get('/api/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Ödeme - KEESO</title>
        <meta name="description" content="KEESO ödeme seçenekleri" />
      </Helmet>

      <div className="bg-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <h1 className="h-heading text-5xl font-bold text-[#1e3a8a] mb-4">Ödeme</h1>
          <p className="text-gray-700 mb-8">
            Aidat ve diğer ödemelerinizi aşağıdaki seçenekler üzerinden güvenle yapabilirsiniz.
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : payments.length > 0 ? (
            <div className="space-y-6">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {payment.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{payment.description}</p>
                  <a
                    href={payment.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="odeme-button"
                    className="inline-flex items-center px-6 py-3 border border-[#1e3a8a] text-[#1e3a8a] font-medium rounded-md hover:bg-gray-100 transition-colors"
                  >
                    {payment.button_text}
                    <ExternalLink size={20} className="ml-2" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">
                Şu anda aktif ödeme seçeneği bulunmamaktadır.
              </p>
              <p className="text-sm text-gray-500">
                Ödeme bilgileri için lütfen bizimle iletişime geçiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OdemePage;