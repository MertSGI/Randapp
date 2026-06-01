import { BusinessProfileRepository } from './types';
import { SalonBusinessProfile } from '../../types';
import { fetchSupabase } from './supabaseClient';

export class SupabaseBusinessProfileRepository implements BusinessProfileRepository {
  async getProfile(tenantId: string): Promise<SalonBusinessProfile | null> {
    try {
      const res = await fetchSupabase(`/rest/v1/tenant_business_profiles?tenant_id=eq.${tenantId}&select=*`);
      if (!res.ok) {
        console.warn('Supabase fetch failed for getProfile. Fallback mock data structure may be required if tables are unprovisioned.');
        return null;
      }
      const data = await res.json();
      return data[0] || null;
    } catch (err) {
      console.error('Error fetching business profile from Supabase:', err);
      // Fail gracefully so frontend doesn't crash if unprovisioned
      return null;
    }
  }

  async updateProfile(tenantId: string, patch: Partial<SalonBusinessProfile>): Promise<SalonBusinessProfile | null> {
    try {
      const existing = await this.getProfile(tenantId);
      
      let res;
      if (existing) {
        res = await fetchSupabase(`/rest/v1/tenant_business_profiles?tenant_id=eq.${tenantId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() })
        });
      } else {
        res = await fetchSupabase(`/rest/v1/tenant_business_profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ ...patch, tenant_id: tenantId })
        });
      }

      if (!res.ok) throw new Error("Failed to save business profile to Supabase");
      const data = await res.json();
      return data[0];
    } catch(err) {
      console.error("Error updating business profile:", err);
      throw err;
    }
  }

  async submitForReview(tenantId: string): Promise<void> {
    // Expected to invoke Edge Function or update tenant status
    throw new Error('Supabase submitForReview not fully implemented in adapter stub.');
  }

  async updatePublicSiteStatus(tenantId: string, status: string): Promise<void> {
    // Expected to invoke Edge Function or update tenant status
    throw new Error('Supabase updatePublicSiteStatus not fully implemented in adapter stub.');
  }
}
