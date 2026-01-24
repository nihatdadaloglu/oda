import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import apiClient from '../api/client';
import { toast } from 'sonner';

const AdminLoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Giriş başarılı!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Girişi - KEESO</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <img src="/keeso-logo.png" alt="KEESO" className="h-16 w-16 mx-auto mb-4" />
              <h1 className="h-heading text-2xl font-bold text-[#1e3a8a]">Admin Girişi</h1>
              <p className="text-sm text-gray-600 mt-2">Yönetim paneline erişim</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" data-testid="admin-login-form">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@keeso.gov.tr"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                data-testid="admin-login-button"
                className="w-full px-6 py-3 bg-[#1e3a8a] text-white font-medium rounded-md hover:bg-[#1b3479] disabled:opacity-50 transition-colors"
              >
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Varsayılan Admin Kullanıcıları:</p>
              <p className="text-xs mt-2">admin@keeso.gov.tr / admin123</p>
              <p className="text-xs">admin2@keeso.gov.tr / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;