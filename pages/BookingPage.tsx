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
    const link = CalendarService.generateGoogleCalendarLink(newAppointment, selectedService);
    setCalendarLink(link);

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
                  type="tel"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-3 border"
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

            {/* Calendar Link Button */}
            {calendarLink && (
               <a 
                 href={calendarLink} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium mb-8 hover:bg-blue-200 transition"
               >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 {t.booking.add_to_calendar}
               </a>
            )}

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