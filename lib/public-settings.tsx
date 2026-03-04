'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface PublicSettings {
  logo_url: string;
  primary_color: string;
  dial_in_india: string;
  dial_in_us: string;
  dial_in_uk: string;
  dial_in_pin: string;
  [key: string]: string;
}

const defaults: PublicSettings = {
  logo_url: 'https://jesusisthewayjebathottam.com/images/logo.png',
  primary_color: '#4f46e5',
  dial_in_india: '+91 22 4970 4059',
  dial_in_us: '+1 (605) 475-4000',
  dial_in_uk: '+44 330 001 0116',
  dial_in_pin: '',
  conference_web_url: 'https://join.freeconferencecall.com/jesusisthewayjebathottam',
};

const PublicSettingsContext = createContext<PublicSettings>(defaults);

export function PublicSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PublicSettings>(defaults);

  useEffect(() => {
    fetch('/api/settings?scope=public')
      .then((res) => (res.ok ? res.json() : { data: {} }))
      .then((data) => {
        if (data?.data && typeof data.data === 'object') {
          setSettings((prev) => ({ ...prev, ...data.data }));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const color = settings.primary_color?.trim();
    if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
      document.documentElement.style.setProperty('--primary-600', color);
      document.documentElement.style.setProperty('--primary-500', color);
    }
  }, [settings.primary_color]);

  return (
    <PublicSettingsContext.Provider value={settings}>
      {children}
    </PublicSettingsContext.Provider>
  );
}

export function usePublicSettings() {
  return useContext(PublicSettingsContext);
}
