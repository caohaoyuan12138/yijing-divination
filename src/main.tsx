import React from 'react';
import ReactDOM from 'react-dom/client';
import WebApp from './WebApp';
import MobileApp from './MobileApp';
import './index.css';

// 检测是否在 Capacitor 原生平台
function isNativePlatform(): boolean {
  return typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.();
}

const App = isNativePlatform() ? MobileApp : WebApp;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
