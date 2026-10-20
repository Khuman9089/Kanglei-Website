import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register or clear Service Worker
if ('serviceWorker' in navigator) {
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '192.168.1.9';

  if (isLocalhost) {
    // In local development, purge service worker & caches so changes reflect immediately
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
  } else {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        // Automatically reload and apply the newest cache
        updateSW(true);
      },
      onOfflineReady() {
        console.log('KangleiAstro is ready for offline use.');
      },
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
