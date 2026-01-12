'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { translations, languageNames, getSpeechLang } from '../lib/translations';

export default function Home() {
  const [isOnline, setIsOnline] = useState(true);
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app_language') || 'en';
    }
    return 'en';
  });

  const t = translations[language] || translations.en;

  const speakHelp = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Voice help is not supported in this browser.');
      return;
    }

    const message = new SpeechSynthesisUtterance(t.voiceHelpIntro);
    message.lang = getSpeechLang(language);
    message.rate = 0.9;
    message.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(message);
  };

  useEffect(() => {
    // Save language preference
    localStorage.setItem('app_language', language);
    
    // Check online status
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">🚨 {t.title.split(' ')[0]}</h1>
              <p className="text-sm md:text-base text-red-100">{t.subtitle}</p>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="flex items-center gap-2 bg-red-800 px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                <span>{isOnline ? t.online : t.offlineMode}</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white text-red-700 text-sm md:text-base px-4 py-2 rounded-full border-2 border-red-300 font-semibold shadow-md cursor-pointer hover:bg-red-50 transition-colors"
                style={{ fontSize: '16px', minWidth: '140px' }}
              >
                {Object.entries(languageNames).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
              <button
                onClick={speakHelp}
                className="bg-white text-red-700 text-sm md:text-base px-4 py-2 rounded-full border-2 border-red-300 font-semibold shadow-md flex items-center gap-2 hover:bg-red-50 transition-colors"
              >
                🔊 {t.voiceHelp}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(24px, 5vw, 36px)' }}>
            {t.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-10">
          {/* SOS Emergency */}
          <Link href="/sos" className="block transform transition-transform hover:scale-105">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all cursor-pointer border-3 border-red-300 hover:border-red-500 h-full">
              <div className="text-5xl mb-5 text-center">🆘</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center" style={{ fontSize: 'clamp(20px, 4vw, 24px)' }}>{t.sos}</h3>
              <p className="text-gray-800 text-base md:text-lg text-center font-medium leading-relaxed">{t.sosDesc}</p>
            </div>
          </Link>

          {/* Messages */}
          <Link href="/messages" className="block transform transition-transform hover:scale-105">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all cursor-pointer border-3 border-blue-300 hover:border-blue-500 h-full">
              <div className="text-5xl mb-5 text-center">💬</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center" style={{ fontSize: 'clamp(20px, 4vw, 24px)' }}>{t.messages}</h3>
              <p className="text-gray-800 text-base md:text-lg text-center font-medium leading-relaxed">{t.messagesDesc}</p>
            </div>
          </Link>

          {/* Disaster Alerts */}
          <Link href="/alerts" className="block transform transition-transform hover:scale-105">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all cursor-pointer border-3 border-orange-300 hover:border-orange-500 h-full">
              <div className="text-5xl mb-5 text-center">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center" style={{ fontSize: 'clamp(20px, 4vw, 24px)' }}>{t.alerts}</h3>
              <p className="text-gray-800 text-base md:text-lg text-center font-medium leading-relaxed">{t.alertsDesc}</p>
            </div>
          </Link>

          {/* Location */}
          <Link href="/location" className="block transform transition-transform hover:scale-105">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all cursor-pointer border-3 border-green-300 hover:border-green-500 h-full">
              <div className="text-5xl mb-5 text-center">📍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center" style={{ fontSize: 'clamp(20px, 4vw, 24px)' }}>{t.location}</h3>
              <p className="text-gray-800 text-base md:text-lg text-center font-medium leading-relaxed">{t.locationDesc}</p>
            </div>
          </Link>
        </div>

        {/* Info Banner */}
        <div className="mt-10 bg-gradient-to-r from-blue-100 to-cyan-100 border-l-4 border-blue-600 p-6 rounded-xl max-w-4xl mx-auto shadow-lg">
          <p className="text-blue-900 text-base md:text-lg font-semibold leading-relaxed">
            {t.offlineInfo}
          </p>
        </div>
      </main>
    </div>
  );
}
