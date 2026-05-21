import { GoogleGenAI } from "@google/genai";
import { Appointment } from '../types';

const getAi = () => {
  // TODO(Security): In a production environment with Supabase, calls to the Gemini API 
  // must be routed through a Supabase Edge Function to avoid exposing the API key on the client.
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn("Gemini API Key is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey: key });
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

export const generateHaircutImage = async (promptText: string, size: '1K' | '2K' | '4K' = '1K', base64ExtractedImage?: string): Promise<string | null> => {
    const ai = getAi();
    if (!ai) return null;

    try {
        const parts: any[] = [];
        if (base64ExtractedImage) {
            parts.push({
                inlineData: {
                    data: base64ExtractedImage.replace(/^data:image\/\w+;base64,/, ''),
                    mimeType: 'image/jpeg'
                }
            });
            parts.push({
                text: `Professional photo simulating this specific request: ${promptText}. Cinematic lighting, highly detailed.`
            });
        } else {
            parts.push({
                text: `Professional barbershop/salon photo: ${promptText}. Cinematic lighting, highly detailed.`
            });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts }
        });
        
        const candidate = response.candidates?.[0];
        if (candidate && candidate.content && candidate.content.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
};

export const editHaircutImage = async (base64Image: string, instructions: string): Promise<string | null> => {
    const ai = getAi();
    if (!ai) return null;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image.replace(/^data:image\/\w+;base64,/, ''),
                            mimeType: 'image/jpeg'
                        }
                    },
                    {
                        text: instructions
                    }
                ]
            }
        });
        
        const candidate = response.candidates?.[0];
        if (candidate && candidate.content && candidate.content.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Error editing image:", error);
        return null;
    }
};

export const analyzeHairCondition = async (base64Image: string, language: 'en' | 'tr' = 'en'): Promise<string | null> => {
    const ai = getAi();
    if (!ai) return null;

    try {
        const langName = language === 'tr' ? 'Turkish' : 'English';
        const prompt = `Analyze this photo of hair. Describe its current condition, type, and structure. Then recommend 3 specific haircare treatments or procedures suitable for this hair type. Finally, give an assessment if a color change is recommended and what colors would fit well. Translate everything into ${langName}. Respond in Markdown format with clear headings.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image.replace(/^data:image\/\w+;base64,/, ''),
                            mimeType: 'image/jpeg'
                        }
                    },
                    { text: prompt }
                ]
            }
        });

        return response.text || null;
    } catch (error) {
        console.error("Error analyzing hair:", error);
        return null;
    }
};