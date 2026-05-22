import { SalonBusinessProfile } from '../types';

export const businessProfileService = {
  async getBusinessProfile(tenantId: string): Promise<SalonBusinessProfile | null> {
    const dataMode = (import.meta as any).env.VITE_DATA_MODE || 'mock';

    if (dataMode !== 'mock') {
       try {
          const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
          const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
          
          if (!supabaseUrl || !supabaseKey) return null;
          
          const res = await fetch(`${supabaseUrl}/rest/v1/tenant_business_profiles?tenant_id=eq.${tenantId}&select=*`, {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${localStorage.getItem('sb-access-token') || supabaseKey}` // Ideally use actual auth session
            }
          });
          
          if (!res.ok) return null;
          const data = await res.json();
          return data[0] || null;
       } catch (err) {
         console.error('Error fetching business profile:', err);
         return null;
       }
    }

    // Mock Mode
    const localData = localStorage.getItem(`mock_business_profile_${tenantId}`);
    if (localData) {
      return JSON.parse(localData);
    }

    return this.getMockProfile(tenantId);
  },

  async updateBusinessProfile(tenantId: string, profileData: Partial<SalonBusinessProfile>): Promise<SalonBusinessProfile | null> {
    const dataMode = (import.meta as any).env.VITE_DATA_MODE || 'mock';

    if (dataMode !== 'mock') {
       try {
          const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
          const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
          if (!supabaseUrl || !supabaseKey) throw new Error("Missing credentials");

          const token = localStorage.getItem('sb-access-token'); // Replace with robust context token if available
          
          // Check if exists
          const existing = await this.getBusinessProfile(tenantId);
          
          let res;
          if (existing) {
             // Update
             res = await fetch(`${supabaseUrl}/rest/v1/tenant_business_profiles?tenant_id=eq.${tenantId}`, {
               method: 'PATCH',
               headers: {
                 'apikey': supabaseKey,
                 'Authorization': `Bearer ${token}`,
                 'Content-Type': 'application/json',
                 'Prefer': 'return=representation'
               },
               body: JSON.stringify({ ...profileData, updated_at: new Date().toISOString() })
             });
          } else {
             // Insert
             res = await fetch(`${supabaseUrl}/rest/v1/tenant_business_profiles`, {
               method: 'POST',
               headers: {
                 'apikey': supabaseKey,
                 'Authorization': `Bearer ${token}`,
                 'Content-Type': 'application/json',
                 'Prefer': 'return=representation'
               },
               body: JSON.stringify({ ...profileData, tenant_id: tenantId })
             });
          }
          if (!res.ok) throw new Error("Failed to save business profile");
          const data = await res.json();
          return data[0];
       } catch(err) {
         console.error("Error updating business profile:", err);
         throw err;
       }
    }

    // Mock mode
    const existing = await this.getBusinessProfile(tenantId) || this.getMockProfile(tenantId);
    const updated = { ...existing, ...profileData, tenant_id: tenantId, updated_at: new Date().toISOString() } as SalonBusinessProfile;
    localStorage.setItem(`mock_business_profile_${tenantId}`, JSON.stringify(updated));
    return updated;
  },

  async getPublicBusinessProfile(tenantId: string): Promise<SalonBusinessProfile | null> {
      // In a real app this would bypass some auth or use anon key specifically for public reads
      return this.getBusinessProfile(tenantId);
  },

  getMockProfile(tenantId: string): SalonBusinessProfile {
    return {
      id: 'mock-prof-1',
      tenant_id: tenantId,
      short_description: 'Şehrin en iyi saç tasarım stüdyosu.',
      about_text: 'Yılların verdiği tecrübe ve alanında uzman kadromuzla, size en iyi hizmeti sunmak için buradayız. Randapp teknolojisi ile güzelliğinize değer katıyoruz.',
      business_category: 'Hair Salon',
      address: 'Örnek Mah. Güzellik Sok. No: 12',
      city: 'İstanbul',
      district: 'Kadıköy',
      whatsapp_number: '+905551234567',
      instagram_url: 'https://instagram.com/sandboxtenant',
      opening_hours_summary: 'Pzt-Cmt: 09:00 - 20:00, Pzr: Kapalı',
      cover_image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200&h=400',
      gallery_images: [
         'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=600&h=400&q=80',
         'https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&w=600&h=400&q=80'
      ],
      is_public_profile_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
};
