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
    const mode = import.meta.env.VITE_DATA_MODE || 'mock';
    if (mode === 'supabase') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: passwordHash,
      });
      if (error || !data.user) {
        console.error('Supabase login error', error);
        return null;
      }
      
      // We would ideally fetch the users_profile table here to get the full User object
      // For scaffold, we return a hybrid object 
      return {
        id: data.user.id,
        tenantId: 'tenant_demo', // Fetch from users_profile in real impl
        name: data.user.email || 'User',
        email: data.user.email || email,
        role: 'salon_owner', // Fetch from users_profile in real impl
        active: true,
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
    const mode = import.meta.env.VITE_DATA_MODE || 'mock';
    if (mode === 'supabase') {
      await supabase.auth.signOut();
      return;
    }
    
    localStorage.removeItem('nexus_admin_auth');
  },

  async getCurrentUser(): Promise<User | null> {
    const mode = import.meta.env.VITE_DATA_MODE || 'mock';
    if (mode === 'supabase') {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return null;
      // Real impl would join with users_profile
      return {
        id: data.user.id,
        tenantId: 'tenant_demo', 
        name: data.user.email || 'User',
        email: data.user.email || '',
        role: 'salon_owner',
        active: true,
      };
    }
    
    const isAuth = localStorage.getItem('nexus_admin_auth');
    if (isAuth === 'true') {
      return MOCK_ADMIN_USER;
    }
    return null;
  }
};
