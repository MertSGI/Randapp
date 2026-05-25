import { Appointment } from '../types';

const isMockMode = (import.meta as any).env.VITE_DATA_MODE === 'mock' || (import.meta as any).env.VITE_AI_MODE === 'mock';

const getAi = () => {
  if (isMockMode) return null;
  // TODO(Security): In a production environment with Supabase, calls to the Gemini API 
  // must be routed through a Supabase Edge Function to avoid exposing the API key on the client.
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn("Gemini API Key is missing. Falling back to mock behavior.");
    return null;
  }
  return null;
};

export const generateBookingConfirmation = async (
  appointment: Appointment,
  serviceName: string,
  language: 'en' | 'tr' = 'en'
): Promise<{ subject: string; body: string } | null> => {
  const ai = getAi();
  if (!ai) return null;

  try {
    const langName = language === 'tr' ? 'Turkish' : 'English';
    const prompt = `
      You are an automated assistant for a premium clinic called "Mustafa Ali Yılmaz Hair Design".
      A customer named ${appointment.user_name} has just booked a ${serviceName} on ${appointment.date} at ${appointment.time}.
      
      Please draft a polite, professional, and concise confirmation email in ${langName}. 
      Return the output as a JSON object with two keys: "subject" and "body".
      The body should be plain text, suitable for an email or SMS.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const analyzeSchedule = async (appointments: Appointment[], language: 'en' | 'tr' = 'en'): Promise<string> => {
    const ai = getAi();
    if (!ai) return language === 'tr' ? "Yapay Zeka Analizi kullanılamıyor." : "AI Analysis unavailable.";

    try {
        const today = new Date().toISOString().split('T')[0];
        const todaysAppointments = appointments.filter(a => a.date === today && a.status === 'confirmed');
        const langName = language === 'tr' ? 'Turkish' : 'English';

        const prompt = `
            You are a helpful office manager assistant.
            Here is the list of confirmed appointments for today (${today}):
            ${JSON.stringify(todaysAppointments.map(a => ({ time: a.time, name: a.user_name })))}

            Please provide a detailed deep analysis of the workload, suggest lunch breaks, and prepare a plan for potential delays.
            Answer in ${langName}.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt
        });

        return response.text || "No analysis generated.";
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return "Could not analyze schedule at this time.";
    }
}

export const generateFullConsultation = async (
    promptText: string,
    base64Image?: string,
    language: 'en' | 'tr' = 'en'
): Promise<{ text: string, image: string | null } | null> => {
    if (isMockMode) {
        return new Promise(resolve => setTimeout(() => resolve({
            text: language === 'tr' 
            ? `**Saç Analizi & Tavsiye:**\nHarika bir seçim! Yüklediğiniz fotoğrafa ve isteğinize göre size saçlarınızı canlandıracak bir stil öneriyoruz.\n\n**Önerilen Hizmetler:**\n- Saç Kesimi\n- Renklendirme\n- Saç Bakım Kürleri\n\n*Not: Bu bir yapay zeka önerisidir, uzmanımızla salonumuzda yapacağınız yüz yüze görüşme esastır.*` 
            : `**Hair Analysis & Recommendation:**\nGreat choice! Based on your photo and request, we recommend a style that brings life to your hair.\n\n**Recommended Services:**\n- Haircut\n- Coloring\n- Hair Treatment\n\n*Note: This is an AI recommendation. An in-person consultation with our stylist is recommended.*`,
            image: base64Image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=512&q=80'
        }), 1500));
    }

    const ai = getAi();
    if (!ai) return null;

    try {
        const langName = language === 'tr' ? 'Turkish' : 'English';
        
        // 1. Generate text recommendation
        const textParts: any[] = [];
        if (base64Image) {
            textParts.push({
                inlineData: {
                    data: base64Image.replace(/^data:image\/\w+;base64,/, ''),
                    mimeType: 'image/jpeg'
                }
            });
        }
        textParts.push({ text: `Analyze the photo and the user's request: "${promptText}". Provide a highly professional consultation, recommending haircut style, color (if applicable), and specific salon services. Write in Markdown format with clear headings. Language: ${langName}.` });

        const textResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: textParts }
        });
        
        // 2. We don't have true image gen natively mapped in code well, so let's mock the image or just skip.
        // To be safe in production without blowing costs, we just return the text.
        return {
            text: textResponse.text || "Could not generate recommendation text.",
            image: null
        };
    } catch (error) {
        console.error("Gemini Consultation Error:", error);
        return null;
    }
};