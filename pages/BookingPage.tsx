import React, { useState, useEffect } from 'react';
import { SERVICES, Service, BUSINESS_HOURS } from '../types';
import * as Storage from '../services/storage';
import * as GeminiService from '../services/geminiService';

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
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ subject: string; body: string } | null>(null);

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
      serviceId: selectedService.id,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
      syncedToGoogle: true, // Simulated
    };

    Storage.saveAppointment(newAppointment);

    // Generate AI Confirmation
    try {
      const aiResponse = await GeminiService.generateBookingConfirmation(newAppointment, selectedService.name);
      setConfirmation(aiResponse);
    } catch (err) {
      console.error("AI generation failed", err);
    }

    setIsSubmitting(false);
    setStep(4);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${step >= s ? 'bg-accent text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
              {s}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Service</span>
          <span>Time</span>
          <span>Details</span>
          <span>Done</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        
        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Select a Service</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="flex flex-col items-start p-4 rounded-xl border-2 border-transparent bg-slate-50 hover:border-accent/30 hover:bg-accent/5 transition-all duration-200 group"
                >
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-accent">{service.name}</span>
                  <div className="mt-2 flex items-center justify-between w-full text-sm text-gray-500">
                    <span>{service.duration} mins</span>
                    <span className="font-medium text-gray-900">${service.price}</span>
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
              <h2 className="text-2xl font-bold text-gray-900">Select Time</h2>
              <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-900">Change Service</button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border"
                />
              </div>

              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Slots ({selectedDate})</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {timeSlots.map((time) => {
                    const isBooked = bookedSlots.includes(time);
                    return (
                      <button
                        key={time}
                        disabled={isBooked}
                        onClick={() => handleTimeSelect(time)}
                        className={`
                          py-2 px-1 rounded-md text-sm font-medium transition-all
                          ${isBooked 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed decoration-slice' 
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-accent hover:text-accent hover:shadow-sm active:bg-accent active:text-white'
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
              <h2 className="text-2xl font-bold text-gray-900">Your Details</h2>
              <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-gray-900">Change Time</button>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg text-sm text-gray-600 mb-4 flex justify-between items-center">
              <span>{selectedService?.name}</span>
              <span className="font-semibold">{selectedDate} @ {selectedTime}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  required
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-3 border"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  required
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-3 border"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                <input
                  type="tel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-3 border"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-8">We've synced this to our Google Calendar.</p>

            {confirmation && (
              <div className="text-left bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
                <h4 className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-2 flex items-center gap-2">
                   <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                   AI Generated Confirmation (Simulated Email)
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold text-gray-900">Subject:</span> {confirmation.subject}</p>
                    <hr className="border-gray-200"/>
                    <p className="whitespace-pre-line leading-relaxed">{confirmation.body}</p>
                </div>
              </div>
            )}

            <button onClick={() => window.location.reload()} className="text-accent font-medium hover:text-blue-700">
              Book Another Appointment
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingPage;