import React from 'react';
import { SalonBusinessProfile, Staff, Service } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SalonWebsiteViewProps {
  tenant: any;
  businessProfile: SalonBusinessProfile | null;
  staffList: Staff[];
  servicesList: Service[];
  handleStaffSelect: (staff: Staff) => void;
  language: string;
}

const SalonWebsiteView: React.FC<SalonWebsiteViewProps> = ({
  tenant, businessProfile, staffList, servicesList, handleStaffSelect, language
}) => {
  return (
    <div className="space-y-12">
      {businessProfile && businessProfile.is_public_profile_enabled && (
          <div className="space-y-12 mb-12 border-b border-gray-200 dark:border-slate-700 pb-12">
            {/* Hero Section */}
            {businessProfile.cover_image_url && (
                <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-sm relative">
                  <img src={businessProfile.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                      <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{tenant?.name}</h1>
                        {businessProfile.short_description && (
                            <p className="text-lg text-white/90">{businessProfile.short_description}</p>
                        )}
                      </div>
                  </div>
                </div>
            )}

            {/* About Section */}
            {(businessProfile.about_text || businessProfile.featured_message) && (
                <div className="max-w-3xl mx-auto text-center space-y-6">
                  {businessProfile.featured_message && (
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">{businessProfile.featured_message}</h3>
                  )}
                  {businessProfile.about_text && (
                      <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{businessProfile.about_text}</p>
                  )}
                </div>
            )}

            {/* Gallery */}
            {businessProfile.gallery_images && businessProfile.gallery_images.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Salonumuzdan Kareler</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {businessProfile.gallery_images.map((img, idx) => (
                        <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-full h-48 object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity" />
                      ))}
                  </div>
                </div>
            )}

            {/* Contact Info */}
            <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-8 max-w-3xl mx-auto text-center space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">İletişim & Konum</h3>
                {businessProfile.address && <p className="text-gray-600 dark:text-gray-300"><strong>Adres:</strong> {businessProfile.address} {businessProfile.district && `, ${businessProfile.district}`} {businessProfile.city && `, ${businessProfile.city}`}</p>}
                {businessProfile.opening_hours_summary && <p className="text-gray-600 dark:text-gray-300"><strong>Çalışma Saatleri:</strong> {businessProfile.opening_hours_summary}</p>}
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  {businessProfile.address && (
                      <>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${businessProfile.address} ${businessProfile.district || ''} ${businessProfile.city || ''}`)}`}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          Yol Tarifi Al
                        </a>
                        <a 
                          href={businessProfile.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${businessProfile.address} ${businessProfile.district || ''} ${businessProfile.city || ''}`)}`}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 bg-gray-600 dark:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l6-3 5.447 2.724A1 1 0 0121 7.618v10.764a1 1 0 01-1.447.894L15 17l-6 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7v13M15 4v13" /></svg>
                          Haritada Aç
                        </a>
                      </>
                  )}
                  {businessProfile.whatsapp_number && (
                      <a href={`https://wa.me/${businessProfile.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition">
                        WhatsApp
                      </a>
                  )}
                  {businessProfile.instagram_url && (
                      <a href={businessProfile.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition">
                        Instagram
                      </a>
                  )}
                </div>
            </div>
          </div>
      )}

      <div className="scroll-mt-24" id="booking-section">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10 transition-colors duration-300">Randevu Oluştur</h2>

      
      {/* Empty State */}
      {staffList.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg">{language === 'tr' ? 'Şu anda aktif personel bulunmuyor.' : 'No active staff members available at the moment.'}</p>
        </div>
      )}

      {/* Master Featured Card */}
      {staffList.filter(s => s.id === 'stf_1' || s.name.toLowerCase().includes('mustafa ali yılmaz')).map(owner => (
          <button
          key={owner.id}
          onClick={() => handleStaffSelect(owner)}
          className="w-full max-w-2xl mx-auto relative flex flex-col md:flex-row items-center p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-md hover:shadow-xl hover:border-accent/40 dark:hover:border-accent/50 transition-all duration-300 text-center md:text-left group mb-10"
        >
          <div className="w-32 h-32 md:w-36 md:h-36 shrink-0 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden mb-6 md:mb-0 md:mr-8 transition-colors duration-300">
            {owner.image ? (
                <img src={owner.image} alt={owner.name} className="w-full h-full object-cover" />
            ) : (
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            )}
          </div>
          <div>
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-amber-200 to-yellow-400 dark:from-yellow-500 dark:to-amber-600 text-yellow-900 dark:text-yellow-50 text-xs font-bold rounded-full mb-3 shadow-sm uppercase tracking-wider transition-colors duration-300">
              {language === 'tr' ? 'Kurucu / Master Designer' : 'Founder / Master Designer'}
            </div>
            <h3 className="font-bold text-2xl md:text-3xl text-gray-900 dark:text-white group-hover:text-accent transition-colors mb-2">{owner.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto md:mx-0 transition-colors duration-300">
              {language === 'tr' 
                  ? 'Yılların tecrübesiyle kendi tarzınızı baştan yaratın.\n(Özel randevu gerektirir)' 
                  : 'Redesign your style with years of master experience.\n(Requires priority appointment)'}
            </p>
          </div>
        </button>
      ))}

      {/* Other Staff Members Grid */}
      <div className="max-w-4xl mx-auto mt-12">
          <h3 className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
              {language === 'tr' ? 'Uzman Seçimi' : 'Select Specialist'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* ANY STAFF OPTION */}
          <button
              onClick={() => {
                  const availableStaff = staffList.filter(s => s.id !== 'stf_1');
                  const randomStaff = availableStaff.length > 0 ? availableStaff[Math.floor(Math.random() * availableStaff.length)] : staffList[0];
                  handleStaffSelect({ ...randomStaff, name: `En Yakın Müsait: ${randomStaff.name}` });
              }}
              className="relative flex flex-col items-center p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-800/50 shadow-sm hover:shadow-lg hover:border-accent/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 text-center group"
              >
              <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-slate-700 text-blue-500 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-sm mb-4 transition-colors duration-300">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-accent transition-colors">{language === 'tr' ? 'Bana Fark Etmez' : 'Any Staff'}</h3>
              <p className="text-sm text-gray-500 mt-1">{language === 'tr' ? 'En yakın müsaitliğe yönlendir' : 'Get nearest availability'}</p>
          </button>

          {staffList.filter(s => s.id !== 'stf_1' && !s.name.toLowerCase().includes('mustafa ali yılmaz')).map((staff) => (
                  <button
                  key={staff.id}
                  onClick={() => handleStaffSelect(staff)}
                  className="relative flex flex-col items-center p-6 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg hover:border-accent/50 transition-all duration-300 text-center group"
                  >
                  <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-sm overflow-hidden mb-4 transition-colors duration-300">
                      {staff.image ? (
                          <img src={staff.image} alt={staff.name} className="w-full h-full object-cover" />
                      ) : (
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                      )}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-accent transition-colors">{staff.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">{staff.title}</p>
                  </button>
              ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default SalonWebsiteView;
