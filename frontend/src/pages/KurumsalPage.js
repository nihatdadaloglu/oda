import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Building, Users, FileText, Target } from 'lucide-react';

const KurumsalPage = () => {
  return (
    <>
      <Helmet>
        <title>Kurumsal - KEESO</title>
        <meta name="description" content="KEESO hakkında bilgi, misyon, vizyon ve yönetim kurulu" />
      </Helmet>

      <div className="bg-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <h1 className="h-heading text-5xl font-bold text-[#1e3a8a] mb-10">
            Kurumsal
          </h1>

          {/* Hakkımızda */}
          <section className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <Building className="text-[#dc2626]" size={24} />
              <h2 className="h-heading text-2xl font-semibold text-[#1e3a8a]">
                Oda Hakkında
              </h2>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası (KEESO), 5362 sayılı Esnaf ve Sanatkârlar 
                Meslek Kuruluşları Kanunu kapsamında faaliyet gösteren, Kayseri'deki emlak sektöründe 
                çalışan esnaf ve sanatkârların zorunlu üyeliğini içeren bir meslek kuruluşudur.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Odamız, üyelerinin ortak ihtiyaçlarının karşılanması, mesleki faaliyetlerinin kolaylaştırılması, 
                geliştirilmesi, meslek mensupları arasında dayanışma ve birliğin sağlanması, mesleki 
                disiplin ve ahlakın korunması amacıyla kurulmuştur.
              </p>
              <p className="text-gray-700 leading-relaxed">
                KEESO, Kayseri'de emlak sektörünün düzenli, etik ve profesyonel standartlarda gelişmesini 
                sağlamak için çeşitli eğitim, denetim ve danışmanlık hizmetleri sunmaktadır.
              </p>
            </div>
          </section>

          {/* Misyon & Vizyon */}
          <section className="mb-12">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="text-[#dc2626]" size={24} />
                  <h2 className="h-heading text-xl font-semibold text-[#1e3a8a]">
                    Misyonumuz
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Emlak sektöründe faaliyet gösteren üyelerimizin haklarını korumak, mesleki eğitim ve 
                  gelişim imkânları sağlamak, sektörde etik standartları yerleştirmek ve Kayseri'nin 
                  emlak sektörünün sürdürülebilir gelişimine katkıda bulunmaktır.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="text-[#1e3a8a]" size={24} />
                  <h2 className="h-heading text-xl font-semibold text-[#1e3a8a]">
                    Vizyonumuz
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Türkiye'nin öncü emlakçılar odalarından biri olmak, üyelerimize en kaliteli hizmeti sunmak, 
                  sektörde güven ve profesyonelliğin sembolü haline gelmek, yerel ve ulusal düzeyde 
                  sektörün gelişimine öncüluk etmektir.
                </p>
              </div>
            </div>
          </section>

          {/* Yönetim Kurulu */}
          <section className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="text-[#dc2626]" size={24} />
              <h2 className="h-heading text-2xl font-semibold text-[#1e3a8a]">
                Yönetim Kurulu
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold text-gray-900 mb-1">Ahmet Yılmaz</h3>
                <p className="text-sm text-[#dc2626] mb-2">Başkan</p>
                <p className="text-xs text-gray-600">KEESO Başkanı</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold text-gray-900 mb-1">Mehmet Demir</h3>
                <p className="text-sm text-[#dc2626] mb-2">Başkan Yardımcısı</p>
                <p className="text-xs text-gray-600">Yönetim Kurulu Üyesi</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold text-gray-900 mb-1">Ayşe Kaya</h3>
                <p className="text-sm text-[#dc2626] mb-2">Genel Sekreter</p>
                <p className="text-xs text-gray-600">Yönetim Kurulu Üyesi</p>
              </div>
            </div>
          </section>

          {/* Mevzuat */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="text-[#dc2626]" size={24} />
              <h2 className="h-heading text-2xl font-semibold text-[#1e3a8a]">
                Mevzuat
              </h2>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-[#1e3a8a] underline"
                  >
                    5362 Sayılı Esnaf ve Sanatkârlar Meslek Kuruluşları Kanunu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-[#1e3a8a] underline"
                  >
                    KEESO İç Yönetmeliği
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-[#1e3a8a] underline"
                  >
                    Emlak Sektörü Etik Kuralları
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default KurumsalPage;