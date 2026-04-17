import React, { useState, useRef } from 'react';
import * as GeminiService from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';

const AIVisualizerPage: React.FC = () => {
  const { language } = useLanguage();
  const [prompt, setPrompt] = useState<string>('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string);
        setAnalysisResult(null); // reset previous analysis
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) return;
    setIsAnalyzing(true);
    const result = await GeminiService.analyzeHairCondition(uploadedImage, language);
    if (result) setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    const result = await GeminiService.generateHaircutImage(prompt, size, uploadedImage || undefined);
    if (result) setGeneratedImage(result);
    setIsGenerating(false);
  };

  const handleEdit = async () => {
    if (!editPrompt || !generatedImage) return;
    setIsEditing(true);
    const result = await GeminiService.editHaircutImage(generatedImage, editPrompt);
    if (result) setGeneratedImage(result);
    setIsEditing(false);
  };

  const t = {
    en: {
      title: "AI Hairstyle Visualizer & Analyst",
      subtitle: "Upload your photo for a professional hair analysis and visualize new styles! Supports up to 4K resolution.",
      uploadTitle: "1. Upload Your Photo (Optional but recommended)",
      uploadBtn: "Choose Photo",
      analyzeBtn: "Analyze My Hair",
      analyzing: "Analyzing Hair...",
      promptLabel: "2. What kind of haircut or color?",
      promptPlaceholder: "e.g., Short messy fringe, color it blonde...",
      sizeLabel: "Image Size",
      generateBtn: "Generate New Style",
      generating: "Generating...",
      editTitle: "3. Refine Result",
      editLabel: "How should we adjust it?",
      editPlaceholder: "e.g., Make the hair darker, make it curly...",
      editBtn: "Apply Edit",
      editing: "Editing..."
    },
    tr: {
      title: "Yapay Zeka Stil Uzmanı & Analisti",
      subtitle: "Profesyonel saç analizi için kendi fotoğrafınızı yükleyin ve yeni stilleri üzerinizde görün! 4K çözünürlüğe kadar destekler.",
      uploadTitle: "1. Fotoğrafınızı Yükleyin (İsteğe bağlı)",
      uploadBtn: "Fotoğraf Seç",
      analyzeBtn: "Saçımı Analiz Et",
      analyzing: "Saç Analiz Ediliyor...",
      promptLabel: "2. Nasıl bir stil veya renk istersiniz?",
      promptPlaceholder: "örn., Yanlar kısa üstler dağınık, saçlarımı sarıya boya...",
      sizeLabel: "Görüntü Boyutu",
      generateBtn: "Yeni Stili Görselleştir",
      generating: "Oluşturuluyor...",
      editTitle: "3. Sonucu İyileştir",
      editLabel: "Neresini değiştirelim?",
      editPlaceholder: "örn., Saçları biraz daha koyu yap, kıvırcık olsun...",
      editBtn: "Düzenlemeyi Uygula",
      editing: "Düzenleniyor..."
    }
  }[language];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 md:p-8 transition-colors duration-300">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{t.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 transition-colors duration-300">{t.subtitle}</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN - CONTROLS */}
          <div className="flex-1 space-y-8">
            
            {/* UPLOAD & ANALYSIS SECTION */}
            <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-600 transition-colors duration-300">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t.uploadTitle}</h3>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />
                
                {uploadedImage ? (
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border-2 border-accent dark:border-blue-400 transition-colors duration-300">
                    <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-slate-200 dark:bg-slate-600 flex items-center justify-center shrink-0 transition-colors duration-300">
                    <svg className="w-8 h-8 text-slate-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-lg font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
                    >
                    {uploadedImage ? (language === 'tr' ? 'Fotoğrafı Değiştir' : 'Change Photo') : t.uploadBtn}
                    </button>
                    
                    {uploadedImage && (
                        <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="px-4 py-2 rounded-lg font-medium text-white bg-slate-800 dark:bg-blue-600 hover:bg-slate-900 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                        >
                        {isAnalyzing ? t.analyzing : t.analyzeBtn}
                        </button>
                    )}
                </div>
              </div>

              {analysisResult && (
                  <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 text-sm prose prose-slate dark:prose-invert transition-colors duration-300">
                      <ReactMarkdown>{analysisResult}</ReactMarkdown>
                  </div>
              )}
            </div>

            {/* GENERATE SECTION */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300">{t.promptLabel}</label>
              <textarea
                className="w-full rounded-xl border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white shadow-sm focus:border-accent focus:ring-accent p-3 border transition-colors duration-300"
                rows={3}
                placeholder={t.promptPlaceholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">{t.sizeLabel}</label>
                <div className="flex flex-wrap gap-3">
                  {(['1K', '2K', '4K'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        size === s ? 'bg-accent text-white border-accent dark:bg-blue-600 dark:border-blue-600 shadow-sm' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border-gray-200 dark:border-slate-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="w-full py-4 mt-4 rounded-xl font-bold text-white bg-accent hover:bg-blue-600 shadow-lg shadow-accent/20 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                {isGenerating ? t.generating : t.generateBtn}
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN - PREVIEW */}
          <div className="w-full lg:w-1/2 flex flex-col shrink-0">
            {generatedImage ? (
              <div className="space-y-6">
                <div className="w-full overflow-hidden rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 transition-colors duration-300">
                  <img src={generatedImage} alt="AI Generated Hairstyle" className="w-full h-auto rounded-xl object-cover" />
                </div>
                
                {/* EDIT SECTION */}
                <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-600 transition-colors duration-300">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">{t.editTitle}</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      className="w-full rounded-xl border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white shadow-sm focus:border-accent focus:ring-accent p-3 border transition-colors duration-300"
                      placeholder={t.editPlaceholder}
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                    />
                    <button
                      onClick={handleEdit}
                      disabled={isEditing || !editPrompt}
                      className="w-full py-3 rounded-xl font-bold text-slate-700 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm disabled:opacity-50 transition-colors"
                    >
                      {isEditing ? t.editing : t.editBtn}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full min-h-[400px] bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-3xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 text-center transition-colors duration-300">
                <svg className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <p className="font-medium text-slate-500 dark:text-slate-400 transition-colors duration-300">
                    {language === 'tr' ? 'Sehpanız boş duruyor.' : 'Your canvas is empty.'}
                </p>
                <p className="text-sm mt-2 max-w-xs text-slate-400 dark:text-slate-500 transition-colors duration-300">
                    {language === 'tr' 
                    ? 'Yeni bir görünüm oluşturmak için fotoğrafınızı yükleyin ve detayları girin.' 
                    : 'Upload your photo and provide details to generate a new look.'}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AIVisualizerPage;
