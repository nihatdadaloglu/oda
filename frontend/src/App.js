import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import KurumsalPage from './pages/KurumsalPage';
import YonetimKuruluPage from './pages/YonetimKuruluPage';
import UyelikPage from './pages/UyelikPage';
import HizmetlerPage from './pages/HizmetlerPage';
import DuyurularPage from './pages/DuyurularPage';
import DuyuruDetayPage from './pages/DuyuruDetayPage';
import ZiyaretlerPage from './pages/ZiyaretlerPage';
import ZiyaretDetayPage from './pages/ZiyaretDetayPage';
import OdemePage from './pages/OdemePage';
import IletisimPage from './pages/IletisimPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App min-h-screen flex flex-col bg-gray-50">
          <Helmet>
            <html lang="tr" />
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Helmet>
          
          <Header />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/kurumsal" element={<KurumsalPage />} />
              <Route path="/yonetim-kurulu" element={<YonetimKuruluPage />} />
              <Route path="/uyelik" element={<UyelikPage />} />
              <Route path="/hizmetler" element={<HizmetlerPage />} />
              <Route path="/duyurular" element={<DuyurularPage />} />
              <Route path="/duyurular/:id" element={<DuyuruDetayPage />} />
              <Route path="/ziyaretler" element={<ZiyaretlerPage />} />
              <Route path="/ziyaretler/:id" element={<ZiyaretDetayPage />} />
              <Route path="/odeme" element={<OdemePage />} />
              <Route path="/iletisim" element={<IletisimPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
          </main>
          
          <Footer />
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
