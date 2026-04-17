import React, { useState, useEffect } from 'react';
import { SERVICES, Service, BUSINESS_HOURS } from '../types';
import * as Storage from '../services/storage';
import * as GeminiService from '../services/geminiService';
import * as NotificationService from '../services/notificationService';
import * as CalendarService from '../services/calendarService';
import { useLanguage } from '../contexts/LanguageContext';

const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  let current = BUSINESS_HOURS.start * 60; // Convert to minutes
  const end = BUSINESS_HOURS.end * 60;

  while (current < end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    slots.push(timeString);
    current += BUSINESS_HOURS.interval;
  }
  return slots;
};

const BookingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ subject: string; body: string } | null>(null);
  const [calendarLink, setCalendarLink] = useState<string>('');
  const [whatsappLink, setWhatsappLink] = useState<string>('');

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (selectedDate) {
      setBookedSlots(Storage.getBookedSlots(selectedDate));
    }
  }, [selectedDate]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedTime) return;

    setIsSubmitting(true);

    const newAppointment = {
      id: `apt_${Date.now()}`,
      userId: `guest_${Date.now()}`,
      user_name: formData.name,
      user_email: formData.email,
      phone: formData.phone,
      serviceId: selectedService.id,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
      syncedToGoogle: false, // Will be updated after sync
    };

    // 1. Save locally
    Storage.saveAppointment(newAppointment);

    // 2. Generate AI Confirmation Text
    let aiResponse = { subject: 'Confirmation', body: 'Your appointment is booked.' };
    try {
      const serviceName = language === 'tr' ? selectedService.name_tr : selectedService.name;
      const generated = await GeminiService.generateBookingConfirmation(newAppointment, serviceName, language);
      if (generated) aiResponse = generated;
      setConfirmation(aiResponse);
    } catch (err) {
      console.error("AI generation failed", err);
    }

    // 3. Send Email & SMS (Async/Parallel)
    const serviceName = language === 'tr' ? selectedService.name_tr : selectedService.name;
    try {
        await Promise.all([
            NotificationService.sendBookingEmail(newAppointment, serviceName, aiResponse),
            NotificationService.sendBookingSms(newAppointment, serviceName),
            CalendarService.syncToBusinessCalendar(newAppointment)
        ]);
        
        // Update sync status locally after "mock" success
        newAppointment.syncedToGoogle = true;
        Storage.updateAppointmentStatus(newAppointment.id, 'confirmed'); // Just triggering a save update basically
    } catch (error) {
        console.error("Notification/Sync infrastructure error:", error);
    }

    // 4. Generate User Calendar Link
    const link = CalendarService.generateGoogleCalendarLink(newAppointment, selectedService, language);
    setCalendarLink(link);

    // 5. Generate WhatsApp Link
    const waLink = NotificationService.generateWhatsAppLink(newAppointment, serviceName, link, language);
    setWhatsappLink(waLink);

    setIsSubmitting(false);
    setStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${step >= s ? 'bg-accent text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
              {s}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {t.booking.steps.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        
        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{t.booking.step1_title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-accent/50 transition-all duration-300 overflow-hidden text-left"
                >
                  {/* Image Container */}
                  <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
                    {service.image ? (
                        <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <span className="text-sm">No Image</span>
                        </div>
                    )}
                    {/* Price Tag */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm border border-gray-100">
                        ${service.price}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 w-full">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-accent transition-colors">
                      {language === 'tr' ? service.name_tr : service.name}
                    </h3>
                    <div className="mt-3 flex items-center text-sm text-gray-500 gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{service.duration} {language === 'tr' ? 'dk' : 'mins'}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{t.booking.step2_title}</h2>
              <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-900 underline">{t.booking.step2_change}</button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0 w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.booking.step2_date}</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-3 border bg-gray-50"
                />
              </div>

              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.booking.step2_slots} ({selectedDate})</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {timeSlots.map((time) => {
                    const isBooked = bookedSlots.includes(time);
                    return (
                      <button
                        key={time}
                        disabled={isBooked}
                        onClick={() => handleTimeSelect(time)}
                        className={`
                          py-3 px-2 rounded-xl text-sm font-medium transition-all text-center
                          ${isBooked 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed decoration-slice' 
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-accent hover:text-accent hover:shadow-md active:bg-accent active:text-white'
                          }
                        `}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: User Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{t.booking.step3_title}</h2>
              <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-gray-900 underline">{t.booking.step3_change}</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm text-gray-600 mb-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                  {selectedService?.image && (
                      <img src={selectedService.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                  )}
                  <span className="font-medium text-gray-900">{language === 'tr' ? selectedService?.name_tr : selectedService?.name}</span>
              </div>
              <span className="font-semibold bg-white px-3 py-1 rounded-md border border-gray-200">{selectedDate} @ {selectedTime}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.booking.form.name}</label>
                <input
                  required
                  type="text"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-3 border"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.booking.form.email}</label>
                <input
                  required
                  type="email"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-3 border"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.booking.form.phone}</label>
                <input
                  required
                  type="tel"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-3 border"
                  placeholder="0XXX XXX XX XX"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-accent hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? t.booking.form.processing : t.booking.form.submit}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t.booking.step4_title}</h2>
            <p className="text-gray-500 mb-6">{t.booking.step4_subtitle}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              {/* Calendar Link Button */}
              {calendarLink && (
                <a 
                  href={calendarLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-100 text-blue-700 px-6 py-3 rounded-xl font-bold transition hover:bg-blue-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {t.booking.add_to_calendar}
                </a>
              )}

              {/* WhatsApp Share Button */}
              {whatsappLink && (
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold transition hover:bg-green-600 shadow-lg shadow-green-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  {t.booking.step4_whatsapp_share}
                </a>
              )}
            </div>

            {confirmation && (
              <div className="text-left bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
                <h4 className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-3 flex items-center gap-2">
                   <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                   {t.booking.step4_ai_title}
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold text-gray-900">{t.booking.step4_subject}</span> {confirmation.subject}</p>
                    <hr className="border-gray-200 my-2"/>
                    <p className="whitespace-pre-line leading-relaxed">{confirmation.body}</p>
                </div>
              </div>
            )}

            <button onClick={() => window.location.reload()} className="text-accent font-medium hover:text-blue-700">
              {t.booking.book_another}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingPage;