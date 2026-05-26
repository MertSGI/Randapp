import React, { useState, useRef } from 'react';
import * as GeminiService from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenant } from '../contexts/TenantContext';
import { planService } from '../services/planService';
import ReactMarkdown from 'react-markdown';

const AIVisualizerPage: React.FC = () => {
  const { language } = useLanguage();
  const { tenant } = useTenant();
  const [prompt, setPrompt] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const planId = tenant?.planId || 'professional';
  const plan = planService.getPlan(planId);
  const aiEnabled = plan?.aiRecommendationsEnabled ?? false;
  const visualizationEnabled = plan?.aiVisualizationEnabled ?? false;

  if (!aiEnabled) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold dark:text-white mb-4">
          {language === 'tr' ? 'Bu AI özelliği mevcut paketinizde bulunmuyor.' : 'This AI feature is not included in your current plan.'}
        </h1>
        <p className="text-gray-500">
          {language === 'tr' ? 'Özelliği kullanmak için üst pakete geçin.' : 'Upgrade your plan to unlock this feature.'}
        </p>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string);
        setAnalysisResult(null); 
        setGeneratedImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const checkQuotaExceeded = () => {
    const quota = plan?.aiMonthlyQuota || 0;
    // Mock quota check logic
    const currentUsage = parseInt(localStorage.getItem('mock_ai_usage') || '0', 10);
    if (quota > 0 && currentUsage >= quota) {
      alert(language === 'tr' ? "Aylık AI kullanım kotanıza ulaştınız." : "Your monthly AI quota has been reached.");
      return true;
    }
    localStorage.setItem('mock_ai_usage', (currentUsage + 1).toString());
    return false;
  };

  const handleConsultation = async () => {
    if (checkQuotaExceeded()) return;

    setIsGenerating(true);
    // Simulate reading super admin rules
    const settingsStr = localStorage.getItem('randapp_ai_settings');
    const aiConfig = settingsStr ? JSON.parse(settingsStr) : { enableAiVisualization: true };

    const result = await GeminiService.generateFullConsultation(prompt, uploadedImage || undefined, language);
    
    if (result) {
        setAnalysisResult(result.text);
        if (visualizationEnabled && aiConfig.enableAiVisualization && result.image) {
            setGeneratedImage(result.image);
        }
    } else {
        setAnalysisResult(language === 'tr' ? "Tavsiye oluşturulamadı. Lütfen tekrar deneyin." : "Could not generate recommendation.");
    }
    setIsGenerating(false);
  };

  const t = {
    en: {
      title: "AI Recommendation",
      subtitle: "Describe what you want, and optionally upload a photo. Our AI proxy will generate personalized suggestions.",
      uploadTitle: "1. Upload Your Photo (Optional)",
      uploadDesc: "Your photo is only used for temporary processing to generate recommendations. Please do not upload images containing sensitive personal information.",
      uploadBtn: "Choose Photo",
      promptLabel: "2. What kind of style or color do you want?",
      promptPlaceholder: "e.g., Short messy fringe...",
      generateBtn: "Get Recommendation",
      generating: "Analyzing & Designing...",
      resultsTitle: "Your Personal Recommendation",
      premiumVisualizationNotice: "Premium AI visualization will be powered through secure backend AI processing. It is not processed directly in the browser."
    },
    tr: {
      title: "Yapay Zeka Tavsiyesi",
      subtitle: "İstediğiniz stili anlatın, isterseniz fotoğraf yükleyin. Güvenli AI sağlayıcımız kişiselleştirilmiş öneriler sunacak.",
      uploadTitle: "1. Fotoğrafınızı Yükleyin (Opsiyonel)",
      uploadDesc: "Fotoğrafınız yalnızca geçici olarak öneri oluşturmak için kullanılır. Lütfen hassas kişisel bilgi içeren görseller yüklemeyin.",
      uploadBtn: "Fotoğraf Seç",
      promptLabel: "2. Nasıl bir stil veya renk istersiniz?",
      promptPlaceholder: "örn., Yanlar kısa üstler dağınık...",
      generateBtn: "Tavsiye Al",
      generating: "Analiz Ediliyor & Tasarlanıyor...",
      resultsTitle: "Kişisel Tavsiyeniz",
      premiumVisualizationNotice: "Premium AI görselleştirme güvenli backend AI işleme üzerinden çalışacaktır. Doğrudan tarayıcı içinde işlenmez."
    }
  }[language];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 md:p-8 transition-colors duration-300">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{t.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{t.subtitle}</p>

        <div className="space-y-8">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-600">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.uploadTitle}</h3>
              <p className="text-xs text-gray-500 mb-4">{t.uploadDesc}</p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />
                
                {uploadedImage ? (
                  <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 border-2 border-accent">
                    <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-xl bg-slate-200 dark:bg-slate-600 flex items-center justify-center shrink-0">
                    <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 rounded-xl font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {uploadedImage ? (language === 'tr' ? 'Değiştir' : 'Change') : t.uploadBtn}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">{t.promptLabel}</label>
              <textarea
                className="w-full rounded-xl border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white shadow-sm focus:border-accent focus:ring-accent p-4 border"
                rows={3}
                placeholder={t.promptPlaceholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <button
                onClick={handleConsultation}
                disabled={isGenerating || (!uploadedImage && !prompt)}
                className="w-full py-4 mt-4 rounded-xl font-bold text-white bg-accent hover:bg-blue-600 shadow-lg shadow-accent/20 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                {isGenerating ? t.generating : t.generateBtn}
              </button>
            </div>
            
            {(analysisResult || generatedImage) && (
               <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6">{t.resultsTitle}</h3>
                  <div className="flex flex-col md:flex-row gap-8">
                     {visualizationEnabled ? (
                         generatedImage && (
                             <div className="w-full md:w-1/2">
                                 <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm relative pt-[100%]">
                                     <img src={generatedImage} className="absolute inset-0 w-full h-full object-cover" alt="Preview"/>
                                 </div>
                                 <p className="mt-2 text-xs text-gray-400 italic text-center px-4">{t.premiumVisualizationNotice}</p>
                             </div>
                         )
                     ) : null}
                     {analysisResult && (
                         <div className={`w-full ${(visualizationEnabled && generatedImage) ? 'md:w-1/2' : ''} prose prose-slate dark:prose-invert text-sm`}>
                             <ReactMarkdown>{analysisResult}</ReactMarkdown>
                         </div>
                     )}
                  </div>
               </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AIVisualizerPage;
