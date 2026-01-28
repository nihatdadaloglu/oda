import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Building, Target, Eye, Award, Shield, Handshake, FileText, ExternalLink } from 'lucide-react';

const KurumsalPage = () => {
  return (
    <>
      <Helmet>
        <title>Kurumsal - KEESO</title>
        <meta name="description" content="Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası hakkında bilgi, misyon ve vizyon" />
      </Helmet>

      {/* Hero Banner */}
      <div className="bg-[#1e3a8a] text-white py-16">
        <div className="mx-auto max-w-[1000px] px-6 text-center">
          <h1 
            className="text-4xl md:text-5xl mb-4"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
          >
            Kurumsal
          </h1>
          <p 
            className="text-blue-200 text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası olarak sektörün güvenilir çatısıyız
          </p>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-[1000px] px-6">

          {/* Hakkımızda */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#1e3a8a] rounded-xl flex items-center justify-center">
                  <Building className="text-white" size={24} />
                </div>
                <h2 
                  className="text-2xl text-[#1e3a8a]"
                  style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
                >
                  Odamız Hakkında
                </h2>
              </div>
              
              <div className="space-y-4" style={{ fontFamily: "'Open Sans', sans-serif", lineHeight: 1.9 }}>
                <p className="text-gray-700">
                  <strong className="text-[#1e3a8a]">Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası (KEESO)</strong>, 
                  5362 sayılı Esnaf ve Sanatkârlar Meslek Kuruluşları Kanunu kapsamında faaliyet gösteren, 
                  Kayseri'deki emlak sektöründe çalışan esnaf ve sanatkârların zorunlu üyeliğini içeren 
                  bir meslek kuruluşudur.
                </p>
                <p className="text-gray-700">
                  Odamız, üyelerinin ortak ihtiyaçlarının karşılanması, mesleki faaliyetlerinin kolaylaştırılması, 
                  geliştirilmesi, meslek mensupları arasında dayanışma ve birliğin sağlanması, mesleki 
                  disiplin ve ahlakın korunması amacıyla kurulmuştur.
                </p>
                <p className="text-gray-700">
                  KEESO, Kayseri'de emlak sektörünün düzenli, etik ve profesyonel standartlarda gelişmesini 
                  sağlamak için çeşitli eğitim, denetim ve danışmanlık hizmetleri sunmaktadır.
                </p>
              </div>
            </div>
          </section>

          {/* Misyon & Vizyon */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Misyon */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-[#dc2626] rounded-xl flex items-center justify-center">
                    <Target className="text-white" size={24} />
                  </div>
                  <h2 
                    className="text-xl text-[#1e3a8a]"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
                  >
                    Misyonumuz
                  </h2>
                </div>
                <p 
                  className="text-gray-700"
                  style={{ fontFamily: "'Open Sans', sans-serif", lineHeight: 1.8 }}
                >
                  Emlak sektöründe faaliyet gösteren üyelerimizin haklarını korumak, mesleki eğitim ve 
                  gelişim imkânları sağlamak, sektörde etik standartları yerleştirmek ve Kayseri'nin 
                  emlak sektörünün sürdürülebilir gelişimine katkıda bulunmaktır.
                </p>
              </div>

              {/* Vizyon */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-[#1e3a8a] rounded-xl flex items-center justify-center">
                    <Eye className="text-white" size={24} />
                  </div>
                  <h2 
                    className="text-xl text-[#1e3a8a]"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
                  >
                    Vizyonumuz
                  </h2>
                </div>
                <p 
                  className="text-gray-700"
                  style={{ fontFamily: "'Open Sans', sans-serif", lineHeight: 1.8 }}
                >
                  Türkiye'nin öncü emlakçılar odalarından biri olmak, üyelerimize en kaliteli hizmeti sunmak, 
                  sektörde güven ve profesyonelliğin sembolü haline gelmek, yerel ve ulusal düzeyde 
                  sektörün gelişimine öncülük etmektir.
                </p>
              </div>
            </div>
          </section>

          {/* Değerlerimiz */}
          <section className="mb-16">
            <h2 
              className="text-2xl text-[#1e3a8a] mb-8 text-center"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
            >
              Değerlerimiz
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-[#1e3a8a]" size={28} />
                </div>
                <h3 
                  className="text-lg text-gray-900 mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
                >
                  Güvenilirlik
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  Üyelerimize ve vatandaşlara karşı şeffaf ve güvenilir bir kurum olmak
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-[#dc2626]" size={28} />
                </div>
                <h3 
                  className="text-lg text-gray-900 mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
                >
                  Profesyonellik
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  Sektörde en yüksek mesleki standartları temsil etmek
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Handshake className="text-green-600" size={28} />
                </div>
                <h3 
                  className="text-lg text-gray-900 mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
                >
                  Dayanışma
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  Üyeler arasında birlik ve dayanışmayı güçlendirmek
                </p>
              </div>
            </div>
          </section>

          {/* Mevzuat */}
          <section>
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <FileText className="text-white" size={24} />
                </div>
                <h2 
                  className="text-2xl text-[#1e3a8a]"
                  style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
                >
                  Mevzuat
                </h2>
              </div>
              
              <div className="space-y-4">
                <a
                  href="https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5362.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <span 
                    className="text-gray-700 group-hover:text-[#1e3a8a]"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    5362 Sayılı Esnaf ve Sanatkârlar Meslek Kuruluşları Kanunu
                  </span>
                  <ExternalLink size={18} className="text-gray-400 group-hover:text-[#1e3a8a]" />
                </a>
                
                <a
                  href="#"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <span 
                    className="text-gray-700 group-hover:text-[#1e3a8a]"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    KEESO Oda İç Yönetmeliği
                  </span>
                  <ExternalLink size={18} className="text-gray-400 group-hover:text-[#1e3a8a]" />
                </a>
                
                <a
                  href="#"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <span 
                    className="text-gray-700 group-hover:text-[#1e3a8a]"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    Emlak Sektörü Mesleki Etik Kuralları
                  </span>
                  <ExternalLink size={18} className="text-gray-400 group-hover:text-[#1e3a8a]" />
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default KurumsalPage;
