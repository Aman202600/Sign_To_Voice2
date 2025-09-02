import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    voiceRate: 0.8,
    voicePitch: 1,
    voiceVolume: 1,
    voiceLanguage: 'en-US',
    cameraQuality: 'medium',
    autoSpeak: true,
    confidenceThreshold: 70,
    saveHistory: true
  });

  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('signToVoiceSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Get available voices
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('signToVoiceSettings', JSON.stringify(newSettings));
  };

  const testVoice = () => {
    const utterance = new SpeechSynthesisUtterance("Hello, this is a test of the voice settings.");
    utterance.rate = settings.voiceRate;
    utterance.pitch = settings.voicePitch;
    utterance.volume = settings.voiceVolume;
    utterance.lang = settings.voiceLanguage;
    speechSynthesis.speak(utterance);
  };

  const resetSettings = () => {
    const defaultSettings = {
      voiceRate: 0.8,
      voicePitch: 1,
      voiceVolume: 1,
      voiceLanguage: 'en-US',
      cameraQuality: 'medium',
      autoSpeak: true,
      confidenceThreshold: 70,
      saveHistory: true
    };
    setSettings(defaultSettings);
    localStorage.setItem('signToVoiceSettings', JSON.stringify(defaultSettings));
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>🎤 Voice Settings</h3>
            
            <div className="setting-item">
              <label>Voice Rate:</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.voiceRate}
                  onChange={(e) => handleSettingChange('voiceRate', parseFloat(e.target.value))}
                />
                <span>{settings.voiceRate}</span>
              </div>
            </div>

            <div className="setting-item">
              <label>Voice Pitch:</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.voicePitch}
                  onChange={(e) => handleSettingChange('voicePitch', parseFloat(e.target.value))}
                />
                <span>{settings.voicePitch}</span>
              </div>
            </div>

            <div className="setting-item">
              <label>Voice Volume:</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.voiceVolume}
                  onChange={(e) => handleSettingChange('voiceVolume', parseFloat(e.target.value))}
                />
                <span>{Math.round(settings.voiceVolume * 100)}%</span>
              </div>
            </div>

            <div className="setting-item">
              <label>Voice Language:</label>
              <select
                value={settings.voiceLanguage}
                onChange={(e) => handleSettingChange('voiceLanguage', e.target.value)}
              >
                {availableVoices.map((voice, index) => (
                  <option key={index} value={voice.lang}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <button className="test-voice-btn" onClick={testVoice}>
              🔊 Test Voice
            </button>
          </div>

          <div className="settings-section">
            <h3>📷 Camera Settings</h3>
            
            <div className="setting-item">
              <label>Camera Quality:</label>
              <select
                value={settings.cameraQuality}
                onChange={(e) => handleSettingChange('cameraQuality', e.target.value)}
              >
                <option value="low">Low (Faster)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (Better Quality)</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h3>🎯 Recognition Settings</h3>
            
            <div className="setting-item">
              <label>Confidence Threshold:</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={settings.confidenceThreshold}
                  onChange={(e) => handleSettingChange('confidenceThreshold', parseInt(e.target.value))}
                />
                <span>{settings.confidenceThreshold}%</span>
              </div>
            </div>

            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.autoSpeak}
                  onChange={(e) => handleSettingChange('autoSpeak', e.target.checked)}
                />
                Auto-speak when confidence is high
              </label>
            </div>

            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.saveHistory}
                  onChange={(e) => handleSettingChange('saveHistory', e.target.checked)}
                />
                Save translation history
              </label>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="reset-btn" onClick={resetSettings}>
            🔄 Reset to Default
          </button>
          <button className="save-btn" onClick={onClose}>
            ✅ Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

