import { useState, useEffect } from 'react';

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [installed, setInstalled] = useState('install');

  useEffect(() => {
    // @ts-ignore
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setIsInstallable(true);
    });

    window.addEventListener('appinstalled', () => {
      setInstalled('installed');
    });
  }, []);

  const install = async () => {
    // @ts-ignore
    if (window.deferredPrompt) {
      // @ts-ignore
      window.deferredPrompt.prompt();
      // @ts-ignore
      const { outcome } = await window.deferredPrompt.userChoice;
      if (outcome === 'installed') {
        setInstalled('installed');
      }
      // @ts-ignore
      window.deferredPrompt = null;
      setIsInstallable(false);
    }
  };

  return { isInstallable, installed, install };
}
