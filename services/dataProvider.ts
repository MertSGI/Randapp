import { mockProvider } from './mockDataProvider';
import { supabaseProvider } from './supabaseDataProvider';

export interface DataProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  getList<T>(key: string): Promise<T[]>;
  remove(key: string): Promise<void>;
}

export const getDataProvider = (): DataProvider => {
  const mode = import.meta.env.VITE_DATA_MODE || 'mock';
  if (mode === 'supabase') {
    return supabaseProvider;
  }
  return mockProvider;
};

export const dataProvider = getDataProvider();
