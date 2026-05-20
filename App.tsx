import React from 'react';

console.log('[BOOT] App module loaded');

const App: React.FC = () => {
  console.log('[BOOT] App rendered');

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', background: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      <h1>REACT BOOT OK</h1>
      <p>If you see this, React mounted successfully.</p>
    </div>
  );
};

export default App;