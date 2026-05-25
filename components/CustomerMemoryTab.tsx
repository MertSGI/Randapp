import React, { useState, useEffect, useRef } from 'react';
import { CustomerProfile, Appointment, Staff, Service, CustomerMemoryNote, CustomerMemoryPhoto } from '../types';
import { adminCustomerService } from '../services/adminCustomerService';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenant } from '../contexts/TenantContext';

interface CustomerMemoryTabProps {
  appointments: Appointment[];
  staffList: Staff[];
  servicesList: Service[];
}

const CustomerMemoryTab: React.FC<CustomerMemoryTabProps> = ({ appointments, staffList, servicesList }) => {
  const { t } = useLanguage();
  const { tenant } = useTenant();
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
    if (tenant) {
      const loaded = adminCustomerService.getCustomers(tenant.id, appointments);
      setCustomers(loaded);
    }
  }, [tenant, appointments]);

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

  const handleSavePrefs = () => {
    if (!tenant || !selectedCustomer) return;
    const updated = adminCustomerService.updateCustomer(tenant.id, selectedCustomer.id, prefForm);
    if (updated) {
      setSelectedCustomer(updated);
      setEditingPrefs(false);
      
      const loaded = adminCustomerService.getCustomers(tenant.id, appointments);
      setCustomers(loaded);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant || !selectedCustomer || !newNote.trim()) return;
    
    adminCustomerService.addNote(tenant.id, selectedCustomer.id, newNote);
    setNewNote('');
    
    const loaded = adminCustomerService.getCustomers(tenant.id, appointments);
    setCustomers(loaded);
    const updatedCust = loaded.find(c => c.id === selectedCustomer.id);
    if(updatedCust) setSelectedCustomer(updatedCust);
  };

  const handleDeleteNote = (noteId: string) => {
    if (!tenant || !selectedCustomer) return;
    adminCustomerService.deleteNote(tenant.id, selectedCustomer.id, noteId);
    
    const loaded = adminCustomerService.getCustomers(tenant.id, appointments);
    setCustomers(loaded);
    const updatedCust = loaded.find(c => c.id === selectedCustomer.id);
    if(updatedCust) setSelectedCustomer(updatedCust);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tenant || !selectedCustomer) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      adminCustomerService.addPhoto(tenant.id, selectedCustomer.id, base64);
      
      const loaded = adminCustomerService.getCustomers(tenant.id, appointments);
      setCustomers(loaded);
      const updatedCust = loaded.find(c => c.id === selectedCustomer.id);
      if(updatedCust) setSelectedCustomer(updatedCust);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeletePhoto = (photoId: string) => {
    if (!tenant || !selectedCustomer) return;
    adminCustomerService.deletePhoto(tenant.id, selectedCustomer.id, photoId);
    
    const loaded = adminCustomerService.getCustomers(tenant.id, appointments);
    setCustomers(loaded);
    const updatedCust = loaded.find(c => c.id === selectedCustomer.id);
    if(updatedCust) setSelectedCustomer(updatedCust);
  };

  if (!selectedCustomer) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.admin.customers_title || 'Customers'}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.admin.customers_subtitle || 'View and manage customer profiles.'}</p>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
            {customers.length === 0 ? (
              <li className="p-8 text-center text-gray-500">{t.admin.no_customer_history || 'No customer history yet.'}</li>
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
                          <span>{t.admin.last_visit || 'Last Visit'}: {customer.lastAppointmentAt || '-'}</span>
                          <span>•</span>
                          <span>{t.admin.total_appointments || 'Total'}: {customer.totalAppointments || 1}</span>
                          {staff && (
                            <>
                              <span>•</span>
                              <span>{t.admin.preferred_staff || 'Staff'}: {staff.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button className="text-accent hover:text-blue-700 text-sm font-medium">
                          {t.admin.view_profile || 'View Profile'}
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
        &larr; Back to Customers
      </button>

      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-start mb-6 border-b border-gray-200 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCustomer.fullName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedCustomer.phone} • {selectedCustomer.email}</p>
          </div>
          <div className="text-right text-sm text-gray-500 dark:text-gray-400 object-right">
            <p>{t.admin.first_visit || 'First Visit'}: {selectedCustomer.firstVisitAt || '-'}</p>
            <p>{t.admin.total_appointments || 'Appointments'}: {selectedCustomer.totalAppointments}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Preferences & Notes */}
          <div className="space-y-8">
            {/* Style Preferences */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.admin.style_preferences || 'Style Preferences'}</h3>
                {!editingPrefs && (
                  <button onClick={() => setEditingPrefs(true)} className="text-sm text-accent hover:underline">Edit</button>
                )}
              </div>
              
              {editingPrefs ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">{t.admin.hair_style_pref || 'Hair/style preference'}</label>
                    <input type="text" value={prefForm.stylePreference} onChange={e => setPrefForm({...prefForm, stylePreference: e.target.value})} className="w-full border-gray-300 dark:border-slate-600 rounded-md p-2 bg-transparent dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">{t.admin.color_formula_pref || 'Color/formula preference'}</label>
                    <input type="text" value={prefForm.colorFormula} onChange={e => setPrefForm({...prefForm, colorFormula: e.target.value})} className="w-full border-gray-300 dark:border-slate-600 rounded-md p-2 bg-transparent dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">{t.admin.avoid_dislike_notes || 'Avoid/dislike notes'}</label>
                    <input type="text" value={prefForm.avoidNotes} onChange={e => setPrefForm({...prefForm, avoidNotes: e.target.value})} className="w-full border-gray-300 dark:border-slate-600 rounded-md p-2 bg-transparent dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">{t.admin.special_care_notes || 'Special care notes'}</label>
                    <input type="text" value={prefForm.careNotes} onChange={e => setPrefForm({...prefForm, careNotes: e.target.value})} className="w-full border-gray-300 dark:border-slate-600 rounded-md p-2 bg-transparent dark:text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSavePrefs} className="px-3 py-1 bg-accent text-white rounded text-sm hover:bg-blue-600">Save</button>
                    <button onClick={() => setEditingPrefs(false)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">{t.admin.hair_style_pref || 'Hair/style preference'}</p>
                    <p className="text-sm font-medium dark:text-white">{selectedCustomer.stylePreference || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">{t.admin.color_formula_pref || 'Color/formula preference'}</p>
                    <p className="text-sm font-medium dark:text-white">{selectedCustomer.colorFormula || '-'}</p>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 uppercase">{t.admin.avoid_dislike_notes || 'Avoid/dislike notes'}</p>
                     <p className="text-sm font-medium dark:text-white text-red-500">{selectedCustomer.avoidNotes || '-'}</p>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 uppercase">{t.admin.special_care_notes || 'Special care notes'}</p>
                     <p className="text-sm font-medium dark:text-white">{selectedCustomer.careNotes || '-'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Internal Notes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t.admin.internal_notes || 'Internal Notes'}</h3>
              <div className="space-y-3 mb-4">
                {(!selectedCustomer.internalNotes || selectedCustomer.internalNotes.length === 0) ? (
                  <p className="text-sm text-gray-500">{t.admin.no_notes_yet || 'No notes yet.'}</p>
                ) : (
                  selectedCustomer.internalNotes.map(note => (
                    <div key={note.id} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 p-3 rounded-lg relative group">
                      <p className="text-sm text-gray-800 dark:text-gray-200">{note.text}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleDateString()} by {note.createdBy}</span>
                        <button onClick={() => handleDeleteNote(note.id)} className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
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
                  placeholder={t.admin.add_note || 'Add a quick note...'}
                  className="flex-1 border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm bg-transparent dark:text-white"
                />
                <button type="submit" className="px-3 py-1 bg-accent text-white rounded-md text-sm whitespace-nowrap hover:bg-blue-600">
                  {t.admin.add_note || 'Add'}
                </button>
              </form>
            </div>
            
            {/* Reference Photos */}
             <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.admin.reference_photos || 'Reference Photos'}</h3>
                <div>
                   <input 
                     type="file" 
                     accept="image/*" 
                     className="hidden" 
                     ref={fileInputRef}
                     onChange={handleFileUpload}
                   />
                   <button onClick={() => fileInputRef.current?.click()} className="text-sm text-accent hover:underline">
                     + Upload
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
              <p className="mt-2 text-xs text-gray-400">{t.admin.reference_photos_notice || 'These images are stored only for salon service history style reference.'}</p>
            </div>
          </div>

          {/* RIGHT COLUMN: Appointment History */}
          <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4 border border-gray-100 dark:border-slate-700 h-fit">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t.admin.appointment_history || 'Appointment History'}</h3>
            <div className="space-y-4">
              {customerApps.length === 0 ? (
                <p className="text-sm text-gray-500">No appointments found.</p>
              ) : (
                customerApps.map(apt => {
                  const staff = staffList.find(s => s.id === apt.staffId);
                  const service = servicesList.find(s => s.id === apt.serviceId);
                  return (
                    <div key={apt.id} className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm border border-gray-100 dark:border-slate-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium dark:text-white">{apt.date} {apt.time}</p>
                          <p className="text-xs text-gray-500">{service?.name_tr || service?.name || 'Unknown Service'} - {staff?.name || 'Unknown Staff'}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
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
