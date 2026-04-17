import { GoogleGenAI } from "@google/genai";
import { Appointment } from '../types';

const getAi = () => {
  // Ensure API Key is available
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
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
      You are an automated assistant for a premium clinic called "Nexus Health".
      A customer named ${appointment.user_name} has just booked a ${serviceName} on ${appointment.date} at ${appointment.time}.
      
      Please draft a polite, professional, and concise confirmation email in ${langName}. 
      Return the output as a JSON object with two keys: "subject" and "body".
      The body should be plain text, suitable for an email or SMS.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
    return {
      subject: language === 'tr' ? "Randevu Onaylandı" : "Booking Confirmed",
      body: language === 'tr' 
        ? `Sayın ${appointment.user_name}, ${serviceName} randevunuz ${appointment.date} tarihinde saat ${appointment.time} için onaylanmıştır.`
        : `Dear ${appointment.user_name}, your appointment for ${serviceName} is confirmed for ${appointment.date} at ${appointment.time}.`
    };
  }
};

export const analyzeSchedule = async (appointments: Appointment[], language: 'en' | 'tr' = 'en'): Promise<string> => {
    const ai = getAi();
    if (!ai) return language === 'tr' ? "Yapay Zeka Analizi kullanılamıyor (Eksik API Anahtarı)." : "AI Analysis unavailable (Missing API Key).";

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
            model: 'gemini-3.1-pro-preview',
            contents: prompt,
            config: {
                thinkingConfig: {
                    thinkingLevel: "HIGH"
                }
            }
        });

        return response.text || (language === 'tr' ? "Analiz oluşturulamadı." : "No analysis generated.");
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return language === 'tr' ? "Şu anda program analiz edilemiyor." : "Could not analyze schedule at this time.";
    }
}

export const generateHaircutImage = async (promptText: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string | null> => {
    const ai = getAi();
    if (!ai) return null;

    // Use gemini-3-pro-image-preview to generate high-quality images
    try {
        let sizeDetails = 'Standard resolution';
        if (size === '2K') sizeDetails = 'Intricately detailed 2K resolution';
        if (size === '4K') sizeDetails = 'Ultra HD 4K resolution, photorealistic';

        const response = await ai.models.generateImages({
            model: 'gemini-3-pro-image-preview',
            prompt: `Professional barbershop photo: ${promptText}. Cinematic lighting, highly detailed. ${sizeDetails}`,
            config: {
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1'
            }
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            // Note: depending on the SDK, image base64 might be located in `image.imageBytes` or `image.b64`
            return `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
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

    // Use gemini-3.1-flash-image-preview to edit images with text prompts
    try {
        const response = await ai.models.generateImages({
            model: 'gemini-3.1-flash-image-preview',
            prompt: instructions,
            config: {
                outputMimeType: 'image/jpeg',
                editConfig: {
                    referenceImages: [{
                        base64: base64Image.replace(/^data:image\/\w+;base64,/, ''),
                        mimeType: 'image/jpeg'
                    }]
                }
            } as any // Use 'any' in case the exact types differ slightly
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            return `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
        }
        return null;
    } catch (error) {
        console.error("Error editing image:", error);
        return null;
    }
};