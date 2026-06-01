import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { PlatformReferralProgram } from '../../types';
import { referralProgramService } from '../../services/referralProgramService';

const SuperAdminReferralsPage: React.FC = () => {
  const { language } = useLanguage();
  const [program, setProgram] = useState<PlatformReferralProgram | null>(null);

  useEffect(() => {
    setProgram(referralProgramService.getActivePlatformReferralProgram());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!program) return;
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = type === 'checkbox' ? e.target.checked : undefined;
    
    setProgram(prev => {
       if(!prev) return prev;
       return {
         ...prev,
         [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
       };
    });
  };

  const saveSettings = () => {
    if (program) {
      referralProgramService.updatePlatformReferralProgram(program);
      alert('Ayarlar kaydedildi / Settings saved.');
    }
  };

  if (!program) return <div>Yükleniyor...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Genel Referans Programı</h1>
          <p className="text-sm text-gray-500 mt-1">Platform geneli Business-to-Platform ödül programını yönetin.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 p-6 space-y-6">
        
        {/* Toggle Status */}
        <div className="flex items-center gap-3">
           <input 
              type="checkbox" 
              name="isActive"
              checked={program.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
           />
           <label className="text-sm font-bold text-slate-900 dark:text-slate-100">Program Aktif</label>
        </div>

        {/* Configurations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">1 Kalifiye Referans İçin Verilecek Ödül (Ay)</label>
              <input 
                 type="number" 
                 name="rewardPerQualifiedReferralMonths" 
                 value={program.rewardPerQualifiedReferralMonths} 
                 onChange={handleChange}
                 className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2" 
              />
           </div>
           
           <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">Milestone Limiti (Örn: 6 Referans)</label>
              <input 
                 type="number" 
                 name="milestoneRewardThreshold" 
                 value={program.milestoneRewardThreshold} 
                 onChange={handleChange}
                 className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2" 
              />
           </div>

           <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">Milestone Tamamlandığında Verilecek Ödül (Ay)</label>
              <input 
                 type="number" 
                 name="milestoneRewardMonths" 
                 value={program.milestoneRewardMonths} 
                 onChange={handleChange}
                 className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2" 
              />
           </div>

           <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">Kalifikasyon Kuralı</label>
              <select 
                 name="qualificationRule" 
                 value={program.qualificationRule} 
                 onChange={handleChange}
                 className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2"
              >
                 <option value="card_verified_trial_started">Kart Doğrulanıp Deneme Başladığında</option>
                 <option value="subscription_activated">Abonelik Tamamen Aktif Olduğunda (İlk Ödeme)</option>
              </select>
           </div>
        </div>

        <button 
           onClick={saveSettings} 
           className="bg-accent hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg transition"
        >
           Ayarları Kaydet
        </button>
      </div>

    </div>
  );
};

export default SuperAdminReferralsPage;
