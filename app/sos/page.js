'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { sosStorage } from '../../lib/storage';
import { translations, languageNames, getSpeechLang } from '../../lib/translations';

export default function SOSPage() {
  const [messages, setMessages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app_language') || 'en';
    }
    return 'en';
  });
  const [formData, setFormData] = useState({
    message: '',
    location: '',
    priority: 'high',
  });

  const t = translations[language] || translations.en;

  useEffect(() => {
    localStorage.setItem('app_language', language);
    loadMessages();
  }, [language]);

  const loadMessages = () => {
    setMessages(sosStorage.getAll());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.message.trim()) {
      sosStorage.save(formData);
      setMessages(sosStorage.getAll());
      setFormData({ message: '', location: '', priority: 'high' });
      setShowForm(false);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Delete this SOS message?')) {
      sosStorage.delete(id);
      setMessages(sosStorage.getAll());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-3xl font-bold hover:text-red-200 transition-colors">←</Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">🆘 {t.sos}</h1>
                <p className="text-sm text-red-100 mt-1">{t.sosDesc}</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white text-red-700 text-base px-4 py-2 rounded-full border-2 border-red-300 font-semibold shadow-md"
              style={{ fontSize: '16px' }}
            >
              {Object.entries(languageNames).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Create Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all text-lg w-full md:w-auto transform hover:scale-105"
          >
            {showForm ? t.cancel : `+ ${t.createSOS}`}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-red-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{t.createSOS}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-3 text-lg">
                  {t.emergencyMessage} *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black text-lg"
                  style={{ fontSize: '18px', minHeight: '120px' }}
                  rows="4"
                  placeholder={t.emergencyMessage}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-3 text-lg">
                  {t.locationOptional}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black text-lg"
                  style={{ fontSize: '18px' }}
                  placeholder={t.locationOptional}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-3 text-lg">
                  {t.priority}
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black text-lg font-semibold"
                  style={{ fontSize: '18px' }}
                >
                  <option value="high">{t.high}</option>
                  <option value="medium">{t.medium}</option>
                  <option value="low">{t.low}</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all text-lg transform hover:scale-105"
              >
                {t.sendSOS}
              </button>
            </form>
          </div>
        )}

        {/* Messages List */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t.sosMessages} ({messages.length})
          </h2>
          {messages.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-200">
              <p className="text-gray-700 text-xl font-medium">{t.noSOSMessages}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${
                  msg.priority === 'high' ? 'border-red-500' :
                  msg.priority === 'medium' ? 'border-orange-500' : 'border-yellow-500'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                        msg.priority === 'high' ? 'bg-red-100 text-red-900' :
                        msg.priority === 'medium' ? 'bg-orange-100 text-orange-900' :
                        'bg-yellow-100 text-yellow-900'
                      }`}>
                        {msg.priority === 'high' ? t.high : msg.priority === 'medium' ? t.medium : t.low}
                      </span>
                      <span className="text-gray-600 text-base font-medium">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-3 text-lg font-semibold leading-relaxed">{msg.message}</p>
                    {msg.location && (
                      <p className="text-gray-700 text-base font-medium">📍 {msg.location}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="text-red-600 hover:text-red-800 ml-4 text-2xl font-bold hover:scale-110 transition-transform"
                    title={t.delete}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
