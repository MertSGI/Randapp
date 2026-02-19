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

            Please provide a brief 2-sentence summary of the day's workload and suggest the best time for a lunch break (a gap of at least 30 mins, preferably around 12:00-14:00).
            Answer in ${langName}.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text || (language === 'tr' ? "Analiz oluşturulamadı." : "No analysis generated.");
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return language === 'tr' ? "Şu anda program analiz edilemiyor." : "Could not analyze schedule at this time.";
    }
}