import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Shield } from 'lucide-react';
import apiClient from '../api/client';

const YonetimKuruluPage = () => {
  const [yonetimKurulu, setYonetimKurulu] = useState([]);
  const [denetimKurulu, setDenetimKurulu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoardMembers();
  }, []);

  const fetchBoardMembers = async () => {
    try {
      const response = await apiClient.get('/api/board-members');
      const members = response.data;
      setYonetimKurulu(members.filter(m => m.board_type === 'yonetim'));
      setDenetimKurulu(members.filter(m => m.board_type === 'denetim'));
    } catch (error) {
      console.error('Error fetching board members:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMemberCard = (member) => (
    <div key={member.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-8 text-center border border-gray-100">
      <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <Users size={48} className="text-[#1e3a8a]" />
        )}
      </div>
      <h3 className="h-heading text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
      <p className="text-lg text-[#dc2626] font-semibold mb-3">{member.position}</p>
      {member.bio && (
        <p className="text-base text-gray-600 leading-relaxed">{member.bio}</p>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Yönetim Kurulu - KEESO</title>
        <meta name="description" content="KEESO Yönetim Kurulu ve Denetim Kurulu üyeleri" />
      </Helmet>

      <div className="bg-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          {/* Yönetim Kurulu */}
          <section className="mb-20">
            <div className="flex items-center justify-center space-x-3 mb-12">
              <Users className="text-[#1e3a8a]" size={40} />
              <h1 className="h-heading text-5xl font-bold text-[#1e3a8a]">Yönetim Kurulu</h1>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="spinner"></div>
              </div>
            ) : yonetimKurulu.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {yonetimKurulu.map(renderMemberCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">Yönetim Kurulu üyeleri yakında eklenecektir.</p>
              </div>
            )}
          </section>

          {/* Denetim Kurulu */}
          <section>
            <div className="flex items-center justify-center space-x-3 mb-12">
              <Shield className="text-[#dc2626]" size={40} />
              <h2 className="h-heading text-4xl font-bold text-[#1e3a8a]">Denetim Kurulu</h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="spinner"></div>
              </div>
            ) : denetimKurulu.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {denetimKurulu.map(renderMemberCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">Denetim Kurulu üyeleri yakında eklenecektir.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default YonetimKuruluPage;