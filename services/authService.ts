import { User, Role } from '../types';
import { supabase } from './supabaseClient';

// Helper mock user for development
const MOCK_ADMIN_USER: User = {
  id: 'user_admin',
  tenantId: 'tenant_demo',
  name: 'Demo Admin',
  email: 'admin@randapp.com', // mock email
  role: 'salon_owner',
  active: true,
};

export const authService = {
  async login(email: string, passwordHash: string): Promise<User | null> {
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    if (mode === 'supabase') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: passwordHash, // In real impl, Supabase expects plain password here. We map it to password field.
      });
      if (error || !data.user) {
        console.error('Supabase login error', error);
        return null;
      }
      
      const { data: profile } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      return {
        id: data.user.id,
        tenantId: profile?.tenant_id || 'tenant_demo', // TODO: strictly derive from profile in prod
        name: profile?.name || data.user.email || 'User',
        email: data.user.email || email,
        role: (profile?.role as Role) || 'salon_owner', // TODO: strictly derive from profile in prod
        active: profile?.active ?? true,
      };
    }
    
    // Mock mode logic
    return new Promise(resolve => {
      setTimeout(() => {
        if (passwordHash === 'admin123') {
          localStorage.setItem('nexus_admin_auth', 'true');
          resolve(MOCK_ADMIN_USER);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  async logout(): Promise<void> {
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    if (mode === 'supabase') {
      await supabase.auth.signOut();
      return;
    }
    
    localStorage.removeItem('nexus_admin_auth');
  },

  async getCurrentUser(): Promise<User | null> {
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    if (mode === 'supabase') {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return null;
      
      const { data: profile } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return {
        id: data.user.id,
        tenantId: profile?.tenant_id || 'tenant_demo', // TODO: strictly derive from profile in prod
        name: profile?.name || data.user.email || 'User',
        email: data.user.email || '',
        role: (profile?.role as Role) || 'salon_owner', // TODO: strictly derive from profile in prod
        active: profile?.active ?? true,
      };
    }
    
    const isAuth = localStorage.getItem('nexus_admin_auth');
    if (isAuth === 'true') {
      return MOCK_ADMIN_USER;
    }
    return null;
  }
};
