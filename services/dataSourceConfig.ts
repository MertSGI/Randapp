export type DataSourceMode = 'local' | 'supabase';

export const getDataSourceMode = (): DataSourceMode => {
  // Use VITE_LARI_DATA_SOURCE from import.meta.env if available
  const meta = import.meta as any;
  const mode = (meta.env?.VITE_LARI_DATA_SOURCE as string) || 'local';
  
  if (mode === 'supabase') {
    // If Supabase config is missing, fallback to local
    const supabaseUrl = meta.env?.VITE_SUPABASE_URL;
    const supabaseAnonKey = meta.env?.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('VITE_LARI_DATA_SOURCE is set to supabase, but missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Falling back to local mode.');
      return 'local';
    }
    return 'supabase';
  }
  
  return 'local';
};

export const dataSourceConfig = {
  mode: getDataSourceMode()
};
