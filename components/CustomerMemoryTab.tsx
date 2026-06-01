import React, { useState, useEffect, useRef } from 'react';
import { CustomerProfile, Appointment, Staff, Service, CustomerMemoryNote, CustomerMemoryPhoto } from '../types';
import { adminCustomerService } from '../services/adminCustomerService';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenant } from '../contexts/TenantContext';
import { useDialog } from '../contexts/DialogContext';

interface CustomerMemoryTabProps {
  appointments: Appointment[];
  staffList: Staff[];
  servicesList: Service[];
  targetAppointmentId?: string | null;
  onClearTarget?: () => void;
}

const CustomerMemoryTab: React.FC<CustomerMemoryTabProps> = ({ appointments, staffList, servicesList, targetAppointmentId, onClearTarget }) => {
  const { t, language } = useLanguage();
  const { tenant } = useTenant();
  const { confirm: showConfirm, alert: showAlert } = useDialog();
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  // Note form
  const [newNote, setNewNote] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preference form
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [prefForm, setPrefForm] = useState({
    stylePreference: '',
    colorFormula: '',
    avoidNotes: '',
    careNotes: ''
  });

  useEffect(() => {
    const loadCustomers = async () => {
      if (tenant) {
        const loaded = await adminCustomerService.getCustomers(tenant.id, appointments);
        setCustomers(loaded);
  
        // Handle deep link from appointment
        if (targetAppointmentId && onClearTarget) {
          const matchingCustomer = loaded.find(c => c.appointmentIds?.includes(targetAppointmentId));
          if (matchingCustomer) {
            handleSelectCustomer(matchingCustomer);
          }
          onClearTarget();
        }
      }
    };
    loadCustomers();
  }, [tenant, appointments, targetAppointmentId, onClearTarget]);

  const handleSelectCustomer = (customer: CustomerProfile) => {
    setSelectedCustomer(customer);
    setPrefForm({
      stylePreference: customer.stylePreference || '',
      colorFormula: customer.colorFormula || '',
      avoidNotes: customer.avoidNotes || '',
      careNotes: customer.careNotes || ''
    });
    setEditingPrefs(false);
  };

  const handleSavePrefs = async () => {
    if (!tenant || !selectedCustomer) return;
    const updated = await adminCustomerService.updateCustomer(tenant.id, selectedCustomer.id, prefForm);
    if (updated) {
      setSelectedCustomer(updated);
      setEditingPrefs(false);
      
      const loaded = await adminCustomerService.getCustomers(tenant.id, appointments);
      setCustomers(loaded);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant || !selectedCustomer || !newNote.trim()) return;
    
    await adminCustomerService.addNote(tenant.id, selectedCustomer.id, newNote);
    setNewNote('');
    
    const loaded = await adminCustomerService.getCustomers(tenant.id, appointments);
    setCustomers(loaded);
    const updatedCust = loaded.find(c => c.id === selectedCustomer.id);
    if(updatedCust) setSelectedCustomer(updatedCust);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!tenant || !selectedCustomer) return;
    const confirmed = await showConfirm({ message: (t.admin as any).confirm_delete_note || 'Notu silmek istediğinize emin misiniz?' });
    if (!confirmed) return;
    
    await adminCustomerService.deleteNote(tenant.id, selectedCustomer.id, noteId);
    
    const loaded = await adminCustomerService.getCustomers(tenant.id, appointments);
    setCustomers([...loaded]);
    const updatedCust = loaded.find(c => c.id === selectedCustomer.id);
    if(updatedCust) {
      setSelectedCustomer({...updatedCust});
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tenant || !selectedCustomer) return;
    
    // File size guard (3MB)
    if (file.size > 3 * 1024 * 1024) {
      alert(language === 'tr' ? 'Dosya boyutu 3MB\'dan küçük olmalıdır.' : 'File size must be less than 3MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      await adminCustomerService.addPhoto(tenant.id, selectedCustomer.id, base64);
      
      const loaded = await adminCustomerService.getCustomers(tenant.id, appointments);
      setCustomers(loaded);
      const updatedCust = loaded.find(c => c.id === selectedCustomer.id);
      if(updatedCust) setSelectedCustomer(updatedCust);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!tenant || !selectedCustomer) return;
    const confirmed = await showConfirm({ message: 'Fotoğrafı silmek istediğinize emin misiniz?' });
    if (!confirmed) return;

    await adminCustomerService.deletePhoto(tenant.id, selectedCustomer.id, photoId);
    
    const loaded = await adminCustomerService.getCustomers(tenant.id, appointments);
    setCustomers([...loaded]);
    const updatedCust = loaded.find(c => c.id === selectedCustomer.id);
    if(updatedCust) {
      setSelectedCustomer({...updatedCust});
    }
  };

  if (!selectedCustomer) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.admin.customers_title}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.admin.customers_subtitle}</p>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
            {customers.length === 0 ? (
              <li className="p-8 text-center text-gray-500">{t.admin.no_customer_history}</li>
            ) : (
              customers.map(customer => {
                const staff = staffList.find(s => s.id === customer.preferredStaffId);
                const service = servicesList.find(s => s.id === customer.lastServiceId);
                
                return (
                  <li 
                    key={customer.id} 
                    className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors duration-300"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-accent dark:text-blue-400 truncate">{customer.fullName}</p>
                        <p className="text-sm text-gray-500">
                          {customer.phone || customer.email}
                        </p>
                        <div className="mt-1 flex items-center text-xs text-gray-400 gap-2">
                          <span>{t.admin.last_visit}: {customer.lastAppointmentAt || '-'}</span>
                          <span>•</span>
                          <span>{t.admin.total_appointments}: {customer.totalAppointments || 1}</span>
                          {staff && (
                            <>
                              <span>•</span>
                              <span>{t.admin.preferred_staff}: {staff.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button className="text-accent hover:text-blue-700 text-sm font-medium">
                          {t.admin.view_profile}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    );
  }

  // Details View
  const customerApps = appointments.filter(a => selectedCustomer.appointmentIds?.includes(a.id)).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <button 
        onClick={() => setSelectedCustomer(null)}
        className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center"
      >
        &larr; {t.admin.back_to_customers}
      </button>

      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-start mb-6 border-b border-gray-200 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
               {selectedCustomer.fullName}
               <span className="text-xs bg-accent text-white px-2 py-1 rounded-full font-normal hidden sm:inline-block">
                 {t.admin.total_appointments}: {selectedCustomer.totalAppointments}
               </span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedCustomer.phone} • {selectedCustomer.email}</p>
          </div>
          <div className="text-right text-sm text-gray-500 dark:text-gray-400 object-right">
            <p className="mb-1"><span className="text-gray-400 text-xs uppercase mr-1">{t.admin.first_visit}:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{selectedCustomer.firstVisitAt || '-'}</span></p>
            <p><span className="text-gray-400 text-xs uppercase mr-1">{t.admin.last_visit}:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{selectedCustomer.lastAppointmentAt || '-'}</span></p>
          </div>
        </div>

        {/* Top metrics block for quick info answers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
           <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50">
             <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-semibold mb-1">{t.admin.last_service}</p>
             <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
               {servicesList.find(s => s.id === selectedCustomer.lastServiceId)?.name_tr || servicesList.find(s => s.id === selectedCustomer.lastServiceId)?.name || t.admin.unknown_service}
             </p>
           </div>
           <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800/50">
             <p className="text-xs text-purple-600 dark:text-purple-400 uppercase font-semibold mb-1">{t.admin.preferred_staff}</p>
             <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
               {staffList.find(s => s.id === selectedCustomer.preferredStaffId)?.name || t.admin.unknown_staff}
             </p>
           </div>
           <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/50">
             <p className="text-xs text-green-600 dark:text-green-400 uppercase font-semibold mb-1">{t.admin.hair_style_pref}</p>
             <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={selectedCustomer.stylePreference || '-'}>
               {selectedCustomer.stylePreference || '-'}
             </p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Preferences & Notes */}
          <div className="space-y-8">
            {/* Style Preferences */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.admin.style_preferences}</h3>
                {!editingPrefs && (
                  <button onClick={() => setEditingPrefs(true)} className="text-sm text-accent hover:underline">{t.admin.edit}</button>
                )}
              </div>
              
              {editingPrefs ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">{t.admin.hair_style_pref}</label>
                    <input type="text" value={prefForm.stylePreference} onChange={e => setPrefForm({...prefForm, stylePreference: e.target.value})} className="w-full border-gray-300 dark:border-slate-600 rounded-md p-2 bg-transparent dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">{t.admin.color_formula_pref}</label>
                    <input type="text" value={prefForm.colorFormula} onChange={e => setPrefForm({...prefForm, colorFormula: e.target.value})} className="w-full border-gray-300 dark:border-slate-600 rounded-md p-2 bg-transparent dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">{t.admin.avoid_dislike_notes}</label>
                    <input type="text" value={prefForm.avoidNotes} onChange={e => setPrefForm({...prefForm, avoidNotes: e.target.value})} className="w-full border-gray-300 dark:border-slate-600 rounded-md p-2 bg-transparent dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">{t.admin.special_care_notes}</label>
                    <input type="text" value={prefForm.careNotes} onChange={e => setPrefForm({...prefForm, careNotes: e.target.value})} className="w-full border-gray-300 dark:border-slate-600 rounded-md p-2 bg-transparent dark:text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSavePrefs} className="px-3 py-1 bg-accent text-white rounded text-sm hover:bg-blue-600">{t.admin.save}</button>
                    <button onClick={() => setEditingPrefs(false)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">{t.admin.cancel_btn}</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">{t.admin.hair_style_pref}</p>
                    <p className="text-sm font-medium dark:text-white">{selectedCustomer.stylePreference || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">{t.admin.color_formula_pref}</p>
                    <p className="text-sm font-medium dark:text-white">{selectedCustomer.colorFormula || '-'}</p>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 uppercase">{t.admin.avoid_dislike_notes}</p>
                     <p className="text-sm font-medium dark:text-white text-red-500">{selectedCustomer.avoidNotes || '-'}</p>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 uppercase">{t.admin.special_care_notes}</p>
                     <p className="text-sm font-medium dark:text-white">{selectedCustomer.careNotes || '-'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Internal Notes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t.admin.internal_notes}</h3>
              <div className="space-y-3 mb-4">
                {(!selectedCustomer.internalNotes || selectedCustomer.internalNotes.length === 0) ? (
                  <p className="text-sm text-gray-500">{t.admin.no_notes_yet}</p>
                ) : (
                  selectedCustomer.internalNotes.map(note => (
                    <div key={note.id} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 p-3 rounded-lg relative group">
                      <p className="text-sm text-gray-800 dark:text-gray-200">{note.text}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleDateString()} by {note.createdBy}</span>
                        <button onClick={() => handleDeleteNote(note.id)} className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">{t.admin.delete}</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input 
                  type="text" 
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder={t.admin.add_quick_note}
                  className="flex-1 border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm bg-transparent dark:text-white"
                />
                <button type="submit" className="px-3 py-1 bg-accent text-white rounded-md text-sm whitespace-nowrap hover:bg-blue-600">
                  {t.admin.add_note}
                </button>
              </form>
            </div>
            
            {/* Reference Photos */}
             <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.admin.reference_photos}</h3>
                <div>
                   <input 
                     type="file" 
                     accept="image/*" 
                     className="hidden" 
                     ref={fileInputRef}
                     onChange={handleFileUpload}
                   />
                   <button onClick={() => fileInputRef.current?.click()} className="text-sm text-accent hover:underline">
                     + {t.admin.upload}
                   </button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {selectedCustomer.referencePhotos?.map(photo => (
                  <div key={photo.id} className="relative group rounded-md overflow-hidden aspect-square border border-gray-200 dark:border-slate-700">
                    <img src={photo.url} alt="Reference" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-400">{t.admin.reference_photos_notice}</p>
            </div>
          </div>

          {/* RIGHT COLUMN: Appointment History */}
          <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4 border border-gray-100 dark:border-slate-700 h-fit">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t.admin.appointment_history}</h3>
            <div className="space-y-4">
              {customerApps.length === 0 ? (
                <p className="text-sm text-gray-500">{t.admin.no_appointments_found}</p>
              ) : (
                customerApps.map(apt => {
                  const staff = staffList.find(s => s.id === apt.staffId);
                  const service = servicesList.find(s => s.id === apt.serviceId);
                  const serviceName = language === 'tr' ? (service?.name_tr || service?.name) : service?.name;
                  return (
                    <div key={apt.id} className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm border border-gray-100 dark:border-slate-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium dark:text-white">{apt.date} {apt.time}</p>
                          <p className="text-xs text-gray-500">{serviceName || t.admin.unknown_service} - {staff?.name || t.admin.unknown_staff}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          apt.status.includes('cancel') ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {t.customer_portal?.[`status_${apt.status}`] || t.admin[apt.status] || apt.status}
                        </span>
                      </div>
                      {apt.status.includes('cancel') && apt.cancelReason && (
                        <div className="mt-2 text-[11px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-1.5 rounded">
                           <span className="font-semibold">{language === 'tr' ? 'İptal Nedeni:' : 'Cancel Reason:'}</span> {apt.cancelReason}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerMemoryTab;
