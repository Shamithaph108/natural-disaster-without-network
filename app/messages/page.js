'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { messagesStorage, simulatedUsers } from '../../lib/storage';
import { translations, languageNames } from '../../lib/translations';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app_language') || 'en';
    }
    return 'en';
  });
  const [formData, setFormData] = useState({
    recipient: '',
    message: '',
  });

  const t = translations[language] || translations.en;

  useEffect(() => {
    localStorage.setItem('app_language', language);
    loadMessages();
    // Simulate receiving messages periodically
    const interval = setInterval(() => {
      simulateIncomingMessage();
    }, 15000); // Every 15 seconds
    return () => clearInterval(interval);
  }, [language]);

  const loadMessages = () => {
    setMessages(messagesStorage.getAll());
  };

  const simulateIncomingMessage = () => {
    if (Math.random() > 0.7) {
      const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
      const sampleMessages = [
        'Are you safe?',
        'Need help here!',
        'Evacuation route is clear',
        'Stay indoors',
        'Water supply available at main square',
      ];
      const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      
      messagesStorage.save({
        from: randomUser.name,
        to: 'You',
        message: randomMessage,
        isReceived: true,
      });
      loadMessages();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.message.trim() && formData.recipient) {
      messagesStorage.save({
        from: 'You',
        to: formData.recipient,
        message: formData.message,
        isReceived: false,
      });
      setMessages(messagesStorage.getAll());
      setFormData({ recipient: '', message: '' });
      setShowForm(false);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Delete this message?')) {
      messagesStorage.delete(id);
      setMessages(messagesStorage.getAll());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-3xl font-bold hover:text-blue-200 transition-colors">←</Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">💬 {t.messages}</h1>
                <p className="text-sm text-blue-100 mt-1">{t.messagesDesc}</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white text-blue-700 text-base px-4 py-2 rounded-full border-2 border-blue-300 font-semibold shadow-md"
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all text-lg w-full md:w-auto transform hover:scale-105"
          >
            {showForm ? t.cancel : `+ ${t.sendMessage}`}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{t.sendMessage}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-3 text-lg">
                  {t.selectUser}
                </label>
                <select
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg font-semibold"
                  style={{ fontSize: '18px' }}
                  required
                >
                  <option value="">{t.selectUser}</option>
                  {simulatedUsers.map((user) => (
                    <option key={user.id} value={user.name}>
                      {user.name} ({user.distance} away)
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-3 text-lg">
                  {t.message} *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg"
                  style={{ fontSize: '18px', minHeight: '120px' }}
                  rows="4"
                  placeholder={t.message}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all text-lg transform hover:scale-105"
              >
                {t.sendMessage}
              </button>
            </form>
          </div>
        )}

        {/* Nearby Users Info */}
        <div className="bg-blue-100 border-l-4 border-blue-600 p-5 rounded-xl mb-6">
          <p className="text-blue-900 text-base font-semibold">
            <strong>{t.nearbyUsers}:</strong> {simulatedUsers.map(u => u.name).join(', ')}
            <br />
            <span className="text-sm">{t.messagesDesc}</span>
          </p>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t.allMessages} ({messages.length})
          </h2>
          {messages.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-200">
              <p className="text-gray-700 text-xl font-medium">{t.noMessages}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${
                  msg.isReceived ? 'border-green-500' : 'border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                        msg.isReceived ? 'bg-green-100 text-green-900' : 'bg-blue-100 text-blue-900'
                      }`}>
                        {msg.isReceived ? '📥 Received' : '📤 Sent'}
                      </span>
                      <span className="text-gray-600 text-base font-medium">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-2 text-lg font-semibold">
                      <strong>{msg.from}</strong> → <strong>{msg.to}</strong>
                    </p>
                    <p className="text-gray-800 text-lg leading-relaxed">{msg.message}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="text-gray-400 hover:text-red-600 ml-4 text-2xl font-bold hover:scale-110 transition-transform"
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
