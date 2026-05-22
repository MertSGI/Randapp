import React, { useState, useEffect } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { useLanguage } from '../contexts/LanguageContext';
import { businessProfileService } from '../services/businessProfileService';
import { SalonBusinessProfile } from '../types';

const BusinessProfileTab: React.FC = () => {
  const { tenant } = useTenant();
  const { language } = useLanguage();
  const [profile, setProfile] = useState<Partial<SalonBusinessProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    if (tenant) {
      businessProfileService.getBusinessProfile(tenant.id).then(data => {
        if (data) setProfile(data);
        setLoading(false);
      });
    }
  }, [tenant]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;
    setSaving(true);
    setMessage(null);
    try {
      await businessProfileService.updateBusinessProfile(tenant.id, profile);
      setMessage({ type: 'success', text: language === 'tr' ? 'Profil başarıyla güncellendi.' : 'Profile updated successfully.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Bir hata oluştu.' });
    }
    setSaving(false);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const urls = e.target.value.split('\n').filter(url => url.trim() !== '');
    setProfile({ ...profile, gallery_images: urls });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 p-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-slate-700 pb-4">
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">İşletme Profili & Web Sitesi</h2>
         <a 
           href={`/#/book`} 
           target="_blank" 
           rel="noopener noreferrer"
           className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition font-medium"
         >
           Site Önizlemesini Aç
         </a>
      </div>

      {message && (
        <div className={`p-4 rounded-md mb-6 font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Toggle Public Profile */}
        <div className="flex items-center">
            <input 
              id="is_public_profile_enabled" 
              type="checkbox" 
              checked={profile.is_public_profile_enabled ?? true} 
              onChange={e => setProfile({...profile, is_public_profile_enabled: e.target.checked})} 
              className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
            />
            <label htmlFor="is_public_profile_enabled" className="ml-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
              Profil Web Sitesini Etkinleştir (Müşteriler salon sayfasını görebilir)
            </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kısa Açıklama (Slogan)</label>
            <input 
              type="text" 
              value={profile.short_description || ''} 
              onChange={e => setProfile({...profile, short_description: e.target.value})}
              className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-sm dark:text-white focus:ring-accent focus:border-accent"
              placeholder="Şehrin en iyi tasarım stüdyosu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
            <input 
              type="text" 
              value={profile.business_category || ''} 
              onChange={e => setProfile({...profile, business_category: e.target.value})}
              className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-sm dark:text-white focus:ring-accent focus:border-accent"
              placeholder="Güzellik & Kuaför, Klinik vb."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hakkımızda Metni</label>
          <textarea 
            rows={4}
            value={profile.about_text || ''} 
            onChange={e => setProfile({...profile, about_text: e.target.value})}
            className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-sm dark:text-white focus:ring-accent focus:border-accent"
            placeholder="İşletmenizin hikayesi, deneyimleriniz ve misyonunuz..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">İletişim & Konum</h3>
              <div className="space-y-3">
                 <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">WhatsApp Numarası</label>
                    <input 
                       type="text" value={profile.whatsapp_number || ''} onChange={e => setProfile({...profile, whatsapp_number: e.target.value})}
                       className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-sm dark:text-white"
                       placeholder="+905551234567"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Açık Adres</label>
                    <textarea 
                       rows={2} value={profile.address || ''} onChange={e => setProfile({...profile, address: e.target.value})}
                       className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-sm dark:text-white"
                    />
                 </div>
                 <div className="flex gap-2">
                    <div className="flex-1">
                       <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">İlçe</label>
                       <input type="text" value={profile.district || ''} onChange={e => setProfile({...profile, district: e.target.value})} className="w-full rounded-md border p-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    </div>
                    <div className="flex-1">
                       <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">İl</label>
                       <input type="text" value={profile.city || ''} onChange={e => setProfile({...profile, city: e.target.value})} className="w-full rounded-md border p-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Google Haritalar URL (Opsiyonel)</label>
                    <input 
                       type="text" value={profile.google_maps_url || ''} onChange={e => setProfile({...profile, google_maps_url: e.target.value})}
                       className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-sm dark:text-white"
                       placeholder="https://maps.app.goo.gl/..."
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Bu link müşterilerin kolayca yol tarifi alması için kullanılacaktır. Google Haritalar'dan "Paylaş" &gt; "Bağlantıyı kopyala" diyerek alabilirsiniz.</p>
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram URL</label>
                    <input 
                       type="text" value={profile.instagram_url || ''} onChange={e => setProfile({...profile, instagram_url: e.target.value})}
                       className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-sm dark:text-white"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Çalışma Saatleri (Özet Metin)</label>
                    <input 
                       type="text" value={profile.opening_hours_summary || ''} onChange={e => setProfile({...profile, opening_hours_summary: e.target.value})}
                       className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-sm dark:text-white"
                       placeholder="Hafta içi 09:00 - 19:00"
                    />
                 </div>
              </div>
           </div>

           <div>
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Görseller</h3>
              <div className="space-y-3">
                 <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Kapak Fotoğrafı URL</label>
                    <input 
                       type="text" value={profile.cover_image_url || ''} onChange={e => setProfile({...profile, cover_image_url: e.target.value})}
                       className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-sm dark:text-white"
                    />
                    {profile.cover_image_url && <img src={profile.cover_image_url} alt="Cover Preview" className="mt-2 h-20 w-auto rounded object-cover shadow-sm" />}
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Galeri Görselleri (Her satıra bir URL)</label>
                    <textarea 
                       rows={5} 
                       value={(profile.gallery_images || []).join('\n')} 
                       onChange={handleGalleryChange}
                       className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-xs dark:text-white"
                       placeholder="https://image1.jpg&#10;https://image2.jpg"
                    />
                 </div>
              </div>
           </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-accent hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md shadow-sm disabled:opacity-50 transition"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessProfileTab;
