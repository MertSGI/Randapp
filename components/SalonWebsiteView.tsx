import React, { useState } from 'react';
import { SalonBusinessProfile, Staff, Service } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SalonWebsiteViewProps {
  tenant: any;
  businessProfile: SalonBusinessProfile | null;
  staffList: Staff[];
  servicesList: Service[];
  handleStaffSelect: (staff: Staff) => void;
  handleServiceSelect: (service: Service) => void;
  language: string;
}

const SalonWebsiteView: React.FC<SalonWebsiteViewProps> = ({
  tenant, businessProfile, staffList, servicesList, handleStaffSelect, handleServiceSelect, language
}) => {
  const [currentCoverIndex, setCurrentCoverIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const coverImages = businessProfile?.cover_images?.length 
    ? businessProfile.cover_images 
    : businessProfile?.cover_image_url 
      ? [businessProfile.cover_image_url] 
      : [];

  const handleNextCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (coverImages.length > 0) {
      setCurrentCoverIndex((prev) => (prev + 1) % coverImages.length);
    }
  };

  const handlePrevCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (coverImages.length > 0) {
       setCurrentCoverIndex((prev) => (prev === 0 ? coverImages.length - 1 : prev - 1));
    }
  };

  const directionsUrl = businessProfile?.address ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${businessProfile.address} ${businessProfile.district || ''} ${businessProfile.city || ''}`)}` : undefined;

  const scrollToBooking = () => {
     document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-50 dark:bg-slate-900 min-h-screen relative shadow-2xl rounded-[2rem] overflow-hidden border-4 border-gray-100 dark:border-slate-800">
      
      {/* Top sticky header */}
      <div className="sticky top-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md z-40 border-b border-gray-100 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
         <div className="flex items-center gap-3">
            {businessProfile?.logo_url ? (
               <img src={businessProfile.logo_url} alt="Logo" className="w-10 h-10 rounded-lg object-cover shadow-sm bg-white" />
            ) : (
               <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-lg shadow-sm">
                 {tenant?.name?.charAt(0) || 'S'}
               </div>
            )}
            <span className="font-bold text-gray-900 dark:text-white truncate max-w-[180px]">{tenant?.name}</span>
         </div>
      </div>

      <div className="pb-8">
        <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
          <div className="relative h-56 w-full bg-gray-200 dark:bg-slate-700 group cursor-pointer" onClick={() => coverImages.length > 0 && setLightboxImage(coverImages[currentCoverIndex])}>
            {coverImages.length > 0 ? (
                <>
                   <img src={coverImages[currentCoverIndex]} alt="Cover" className="w-full h-full object-cover transition-opacity duration-300" />
                   {coverImages.length > 1 && (
                     <>
                        <button onClick={handlePrevCover} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                        </button>
                        <button onClick={handleNextCover} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                           {coverImages.map((_, i) => (
                              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentCoverIndex ? 'bg-white' : 'bg-white/40'}`} />
                           ))}
                        </div>
                     </>
                   )}
                </>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                   Kapak Fotoğrafı Yok
                </div>
            )}
          </div>
          
          <div className="px-6 pb-6 text-center">
            {businessProfile?.logo_url ? (
              <img src={businessProfile.logo_url} alt="Profile" className="w-24 h-24 bg-white rounded-full border-4 border-white dark:border-slate-800 shadow-md mx-auto -mt-12 object-cover relative z-10" />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-md mx-auto -mt-12 flex items-center justify-center text-white font-bold text-3xl relative z-10 bg-accent">
                {tenant?.name?.charAt(0) || 'S'}
              </div>
            )}
            
            <h1 className="text-2xl font-bold mt-3 text-gray-900 dark:text-white">{tenant?.name}</h1>
            {businessProfile?.short_description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">{businessProfile.short_description}</p>
            )}
            
            {businessProfile?.address && (
              <p className="text-xs text-gray-500 mt-3 flex items-center justify-center gap-1.5 max-w-sm mx-auto">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {businessProfile.address}
              </p>
            )}

            <div className="flex justify-center gap-3 mt-6">
               {businessProfile?.whatsapp_number && (
                   <a href={`https://wa.me/${businessProfile.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition shadow-sm">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                   </a>
               )}
               {businessProfile?.instagram_url && (
                   <a href={businessProfile.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition shadow-sm">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                   </a>
               )}
               {directionsUrl && (
                   <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition shadow-sm">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   </a>
               )}
            </div>

            <button onClick={scrollToBooking} className="mt-8 w-full py-4 bg-accent text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-blue-600 transition transform hover:-translate-y-0.5">
              Randevu Al
            </button>
          </div>
        </div>

        <div className="p-6 space-y-10 bg-slate-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
            {(businessProfile?.featured_message || businessProfile?.about_text) && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                {businessProfile.featured_message && <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{businessProfile.featured_message}</h3>}
                {businessProfile.about_text && <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{businessProfile.about_text}</p>}
              </div>
            )}

            {businessProfile?.gallery_images && businessProfile.gallery_images.length > 0 && (
                <div>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">Galeri</h3>
                   <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar snap-x">
                      {businessProfile.gallery_images.map((img, idx) => (
                         <div key={idx} className="shrink-0 w-48 h-48 rounded-2xl overflow-hidden shadow-sm snap-start cursor-pointer border border-gray-100 dark:border-slate-700" onClick={() => setLightboxImage(img)}>
                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                         </div>
                      ))}
                   </div>
                </div>
            )}

            {servicesList.length > 0 && (
                <div>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">Hizmetlerimiz</h3>
                   <div className="grid grid-cols-2 gap-4">
                      {servicesList.map(service => (
                         <button 
                           key={service.id}
                           onClick={() => {
                             handleServiceSelect(service);
                             scrollToBooking();
                           }}
                           className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-left hover:border-accent hover:shadow-md transition group flex flex-col justify-between"
                           style={{ minHeight: '110px' }}
                         >
                           <div>
                             <h4 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-accent transition">{language === 'tr' ? service.name_tr : service.name}</h4>
                             <div className="mt-1 text-xs text-gray-500">{service.duration} dk</div>
                           </div>
                           <div className="font-bold text-accent text-lg mt-3">₺{service.price}</div>
                         </button>
                      ))}
                   </div>
                </div>
            )}

            <div id="booking-section" className="scroll-mt-20">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Randevunuzu Oluşturun</h3>
               <div className="space-y-4">
                  <button 
                    onClick={() => {
                        const availableStaff = staffList.filter(s => s.id !== 'stf_1');
                        const randomStaff = availableStaff.length > 0 ? availableStaff[Math.floor(Math.random() * availableStaff.length)] : staffList[0];
                        if (randomStaff) {
                          handleStaffSelect({ ...randomStaff, name: `En Yakın Müsait` });
                        }
                    }}
                    className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center gap-4 hover:border-accent hover:bg-blue-50/50 dark:hover:bg-slate-800 transition group shadow-sm"
                  >
                     <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-slate-700 text-blue-500 flex items-center justify-center group-hover:scale-110 transition shrink-0">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <div className="text-left flex-1">
                        <div className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-accent transition">Fark Etmez</div>
                        <div className="text-sm text-gray-500">En yakın müsaitliğe yönlendir</div>
                     </div>
                     <div className="bg-gray-100 dark:bg-slate-700 p-2 rounded-full group-hover:bg-blue-100 group-hover:text-accent transition text-gray-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                     </div>
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-200 dark:border-slate-700" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 bg-slate-50 dark:bg-slate-900 text-xs text-gray-500 uppercase tracking-widest font-medium">veya uzman seç</span>
                    </div>
                  </div>

                  {staffList.map(staff => (
                     <button
                       key={staff.id}
                       onClick={() => handleStaffSelect(staff)}
                       className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center gap-4 hover:border-accent hover:shadow-md transition group shadow-sm relative overflow-hidden"
                     >
                       {staff.id === 'stf_1' && <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-yellow-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10 tracking-widest">MASTER</div>}
                       {staff.image ? (
                          <img src={staff.image} alt={staff.name} className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-white dark:border-slate-700 shadow-sm" />
                       ) : (
                          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0 border-2 border-white dark:border-slate-700 shadow-sm text-gray-400">
                             <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                          </div>
                       )}
                       <div className="text-left flex-1">
                          <div className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-accent transition">{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.title}</div>
                       </div>
                       <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-full group-hover:bg-blue-50 group-hover:text-accent transition text-gray-400">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                       </div>
                     </button>
                  ))}
               </div>
            </div>
        </div>
      </div>

      {lightboxImage && (
         <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setLightboxImage(null)}>
            <div className="relative max-w-4xl w-full max-h-[90vh]">
               <button className="absolute -top-12 right-0 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 backdrop-blur-md transition" onClick={() => setLightboxImage(null)}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
               <img src={lightboxImage} alt="Enlarged" className="w-full h-full object-contain mx-auto rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </div>
         </div>
      )}
    </div>
  );
};

export default SalonWebsiteView;
