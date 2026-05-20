import React from 'react';
import HealthCheckPage from './pages/HealthCheckPage';

console.log('[BOOT] App loaded in module scope');

const App: React.FC = () => {
  console.log('[BOOT] App rendered');
  
  const dataMode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
  const routerMode = (import.meta as any).env.VITE_ROUTER_MODE || 'hash';
  console.log('[ENV]', { dataMode, routerMode });

  return <HealthCheckPage />;
};

export default App;