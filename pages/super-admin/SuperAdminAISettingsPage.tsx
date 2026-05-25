import React, { useState, useEffect } from 'react';

const SuperAdminAISettingsPage: React.FC = () => {
    const [settings, setSettings] = useState(() => {
        const stored = localStorage.getItem('randapp_ai_settings');
        return stored ? JSON.parse(stored) : {
            systemPrompt: 'You are an AI Style Advisor...',
            enableImageGeneration: true,
            maxRequestsPerMonth: 100,
            disclaimerText: 'Fotoğrafınız yalnızca öneri oluşturmak için kullanılır.'
        };
    });

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        localStorage.setItem('randapp_ai_settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="p-8 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Yapay Zeka Ayarları (Platform Düzeyi)</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 space-y-6">
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sistem Promptu (Talimatı)</label>
                    <textarea 
                       className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-3 text-sm dark:text-white"
                       rows={4}
                       value={settings.systemPrompt}
                       onChange={e => setSettings({...settings, systemPrompt: e.target.value})}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Görüntü Üretimi (Image Generation)</h4>
                        <p className="text-xs text-gray-500">Kullanıcılara tavsiye sonrası görsel sunulmasına izin ver.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={settings.enableImageGeneration} onChange={e => setSettings({...settings, enableImageGeneration: e.target.checked})} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Aylık Limit (Demo)</label>
                    <input 
                       type="number"
                       className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-sm dark:text-white"
                       value={settings.maxRequestsPerMonth}
                       onChange={e => setSettings({...settings, maxRequestsPerMonth: parseInt(e.target.value)})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Müşteri Yasal Uyarı Metni</label>
                    <input 
                       type="text"
                       className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-sm dark:text-white"
                       value={settings.disclaimerText}
                       onChange={e => setSettings({...settings, disclaimerText: e.target.value})}
                    />
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <button onClick={handleSave} className="bg-accent text-white px-6 py-2 rounded-md font-medium hover:bg-blue-600">
                        Kaydet
                    </button>
                    {saved && <span className="ml-4 text-green-600 text-sm">Doğrulandı ve Kaydedildi!</span>}
                </div>
            </div>
        </div>
    );
};

export default SuperAdminAISettingsPage;
