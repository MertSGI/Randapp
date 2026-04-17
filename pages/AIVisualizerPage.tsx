import React, { useState } from 'react';
import * as GeminiService from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const AIVisualizerPage: React.FC = () => {
  const { language } = useLanguage();
  const [prompt, setPrompt] = useState<string>('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    const result = await GeminiService.generateHaircutImage(prompt, size);
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
      title: "AI Hairstyle Visualizer",
      subtitle: "Describe your dream haircut and let AI generate it. (Size up to 4K)",
      promptLabel: "What kind of haircut?",
      promptPlaceholder: "e.g., Short messy fringe, fade on the sides...",
      sizeLabel: "Image Size",
      generateBtn: "Generate High-Quality Image",
      generating: "Generating...",
      editTitle: "Edit this image",
      editLabel: "How should we change it?",
      editPlaceholder: "e.g., Make the hair blonde, add a beard...",
      editBtn: "Apply Edit",
      editing: "Editing..."
    },
    tr: {
      title: "Yapay Zeka Saç Stili Vizyoneri",
      subtitle: "Hayalinizdeki saç kesimini tarif edin, yapay zeka oluştursun. (4K'ya kadar)",
      promptLabel: "Nasıl bir saç kesimi?",
      promptPlaceholder: "örn., Yanlar kısa, üstler dağınık perçem...",
      sizeLabel: "Görüntü Boyutu",
      generateBtn: "Yüksek Kaliteli Görsel Oluştur",
      generating: "Oluşturuluyor...",
      editTitle: "Resmi Düzenle",
      editLabel: "Nasıl değiştirelim?",
      editPlaceholder: "örn., Saçları sarı yap, sakal ekle...",
      editBtn: "Düzenlemeyi Uygula",
      editing: "Düzenleniyor..."
    }
  }[language];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-500 mb-8">{t.subtitle}</p>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.promptLabel}</label>
              <textarea
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-accent focus:ring-accent p-3 border"
                rows={3}
                placeholder={t.promptPlaceholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.sizeLabel}</label>
              <div className="flex gap-4">
                {(['1K', '2K', '4K'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-6 py-2 rounded-lg font-medium border transition-colors ${
                      size === s ? 'bg-accent text-white border-accent' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
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
              className="w-full py-4 rounded-xl font-bold text-white bg-accent hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? t.generating : t.generateBtn}
            </button>

            {generatedImage && (
              <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-900">{t.editTitle}</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.editLabel}</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-accent focus:ring-accent p-3 border"
                    placeholder={t.editPlaceholder}
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleEdit}
                  disabled={isEditing || !editPrompt}
                  className="w-full py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  {isEditing ? t.editing : t.editBtn}
                </button>
              </div>
            )}
          </div>

          <div className="w-full md:w-96 flex shrink-0">
            {generatedImage ? (
              <div className="w-full overflow-hidden rounded-2xl shadow-md border border-gray-100">
                <img src={generatedImage} alt="AI Generated Hairstyle" className="w-full h-auto object-cover" />
              </div>
            ) : (
              <div className="w-full h-96 bg-slate-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 p-8 text-center">
                <svg className="w-12 h-12 mb-4 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVisualizerPage;
