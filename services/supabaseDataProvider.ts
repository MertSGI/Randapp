import { DataProvider } from './dataProvider';
import { supabase } from './supabaseClient';

// This is a scaffold for the Supabase data provider.
// Eventually it will query proper tables instead of simulating key-value storage.
// For now, it logs warnings that it's just a scaffold, or implement key/value mimicking if needed.
// Real implementation would translate `key` (e.g. 'nexus_appointments_tenant1') to a table query.

export const supabaseProvider: DataProvider = {
  async get<T>(key: string): Promise<T | null> {
    console.warn('Supabase data mode is running in scaffold state. Querying KV table or returning null.', key);
    // Future implementation: await supabase.from('kv_store').select('*').eq('key', key).single();
    return null;
  },

  async getList<T>(key: string): Promise<T[]> {
    console.warn('Supabase data mode is running in scaffold state. Querying table for list.', key);
    // Real implementation will query actual tables (e.g., appointments, staff) based on context
    return [];
  },

  async set<T>(key: string, value: T): Promise<void> {
    console.warn('Supabase data mode is running in scaffold state. Upserting KV or real table.', key);
    // Future implementation
  },

  async remove(key: string): Promise<void> {
    console.warn('Supabase data mode is running in scaffold state. Deleting row.', key);
    // Future implementation
  },
};
