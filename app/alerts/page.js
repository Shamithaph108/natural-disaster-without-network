'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { alertsStorage } from '../../lib/storage';
import { translations, languageNames } from '../../lib/translations';

const disasterTypes = [
  { value: 'earthquake', label: '🌍 Earthquake', color: 'red' },
  { value: 'flood', label: '🌊 Flood', color: 'blue' },
  { value: 'wildfire', label: '🔥 Wildfire', color: 'orange' },
  { value: 'hurricane', label: '🌀 Hurricane', color: 'purple' },
  { value: 'tornado', label: '🌪️ Tornado', color: 'gray' },
  { value: 'tsunami', label: '🌊 Tsunami', color: 'cyan' },
  { value: 'landslide', label: '⛰️ Landslide', color: 'brown' },
  { value: 'other', label: '⚠️ Other', color: 'yellow' },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app_language') || 'en';
    }
    return 'en';
  });
  const [formData, setFormData] = useState({
    type: 'earthquake',
    title: '',
    description: '',
    location: '',
    severity: 'high',
  });

  const t = translations[language] || translations.en;

  useEffect(() => {
    localStorage.setItem('app_language', language);
    loadAlerts();
  }, [language]);

  const loadAlerts = () => {
    setAlerts(alertsStorage.getAll());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      alertsStorage.save(formData);
      setAlerts(alertsStorage.getAll());
      setFormData({
        type: 'earthquake',
        title: '',
        description: '',
        location: '',
        severity: 'high',
      });
      setShowForm(false);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Delete this alert?')) {
      alertsStorage.delete(id);
      setAlerts(alertsStorage.getAll());
    }
  };

  const getDisasterIcon = (type) => {
    const disaster = disasterTypes.find(d => d.value === type);
    return disaster ? disaster.label.split(' ')[0] : '⚠️';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-900 border-red-500';
      case 'medium': return 'bg-orange-100 text-orange-900 border-orange-500';
      case 'low': return 'bg-yellow-100 text-yellow-900 border-yellow-500';
      default: return 'bg-gray-100 text-gray-900 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-3xl font-bold hover:text-orange-200 transition-colors">←</Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">⚠️ {t.alerts}</h1>
                <p className="text-sm text-orange-100 mt-1">{t.alertsDesc}</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white text-orange-700 text-base px-4 py-2 rounded-full border-2 border-orange-300 font-semibold shadow-md"
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
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all text-lg w-full md:w-auto transform hover:scale-105"
          >
            {showForm ? t.cancel : `+ ${t.createAlert}`}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-orange-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{t.createAlert}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-3 text-lg">
                  {t.disasterType}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black text-lg font-semibold"
                  style={{ fontSize: '18px' }}
                >
                  {disasterTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-3 text-lg">
                  {t.alertTitle} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black text-lg"
                  style={{ fontSize: '18px' }}
                  placeholder={t.alertTitle}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-3 text-lg">
                  {t.description}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black text-lg"
                  style={{ fontSize: '18px', minHeight: '100px' }}
                  rows="3"
                  placeholder={t.description}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-3 text-lg">
                  {t.affectedLocation}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black text-lg"
                  style={{ fontSize: '18px' }}
                  placeholder={t.affectedLocation}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-3 text-lg">
                  {t.severity}
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black text-lg font-semibold"
                  style={{ fontSize: '18px' }}
                >
                  <option value="high">{t.high}</option>
                  <option value="medium">{t.medium}</option>
                  <option value="low">{t.low}</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-xl transition-all text-lg transform hover:scale-105"
              >
                {t.createAlert}
              </button>
            </form>
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t.activeAlerts} ({alerts.length})
          </h2>
          {alerts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-200">
              <p className="text-gray-700 text-xl font-medium">{t.noAlerts}</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-3xl">{getDisasterIcon(alert.type)}</span>
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold ${getSeverityColor(alert.severity)}`}>
                        {alert.severity === 'high' ? t.high : alert.severity === 'medium' ? t.medium : t.low}
                      </span>
                      <span className="text-gray-600 text-base font-medium">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{alert.title}</h3>
                    {alert.description && (
                      <p className="text-gray-800 mb-3 text-lg leading-relaxed">{alert.description}</p>
                    )}
                    {alert.location && (
                      <p className="text-gray-700 text-base font-medium">📍 {alert.location}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(alert.id)}
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
