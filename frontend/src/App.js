import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import AuthWrapper from "./components/AuthWrapper";
import "./App.css";

const API_BASE = 'http://localhost:5000';

const App = () => {
  const webcamRef = useRef(null);
  const [prediction, setPrediction] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [translationHistory, setTranslationHistory] = useState([]);
  const [webcamError, setWebcamError] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [user, setUser] = useState(null);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        // Load user's translation history
        loadTranslationHistory();
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const loadTranslationHistory = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await axios.get(`${API_BASE}/translations/${user.id}`);
      setTranslationHistory(response.data.translations || []);
    } catch (error) {
      console.error('Error loading translation history:', error);
    }
  };

  const signLanguageData = {
    "A": "Letter A - Fist with thumb on side",
    "B": "Letter B - Flat hand with fingers together",
    "C": "Letter C - Curved hand like letter C",
    "HELLO": "Hello - Wave hand",
    "THANK YOU": "Thank you - Hand from chin forward",
    "YES": "Yes - Fist nodding up and down",
    "NO": "No - Index and middle finger tapping thumb",
    "PLEASE": "Please - Flat hand rubbing in circular motion",
    "SORRY": "Sorry - Fist making circular motion over heart",
    "HELP": "Help - One hand on top of other, both moving up"
  };

  const handleWebcamError = (error) => {
    setWebcamError("Unable to access webcam. Please check permissions.");
    console.error("Webcam error:", error);
  };

  const startRecording = () => {
    setIsRecording(true);
    setPrediction("");
    setConfidence(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const capture = async () => {
    if (!webcamRef.current) return;

    setIsLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API

      const predictions = Object.keys(signLanguageData);
      const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
      const randomConfidence = Math.floor(Math.random() * 40) + 60;

      setPrediction(randomPrediction);
      setConfidence(randomConfidence);

      const newEntry = {
        id: Date.now(),
        prediction: randomPrediction,
        confidence: randomConfidence,
        timestamp: new Date().toLocaleTimeString(),
        description: signLanguageData[randomPrediction]
      };

      // Save to backend
      await saveTranslationToBackend(randomPrediction, randomConfidence, signLanguageData[randomPrediction]);

      setTranslationHistory(prev => [newEntry, ...prev.slice(0, 9)]);

      if (randomConfidence > 70) {
        const utterance = new SpeechSynthesisUtterance(randomPrediction);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error("Prediction error:", error);
      setPrediction("Error processing image");
    } finally {
      setIsLoading(false);
    }
  };

  const saveTranslationToBackend = async (prediction, confidence, description) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || !user) return;

      await axios.post(`${API_BASE}/translations`, {
        userId: user.id,
        prediction,
        confidence,
        description
      });

      console.log('Translation saved to backend successfully');
    } catch (error) {
      console.error('Error saving translation:', error);
    }
  };

  const clearHistory = async () => {
    try {
      // For now, just clear locally since we don't have a clear endpoint
      // You can add this endpoint to the backend if needed
      setTranslationHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    // Translation history will be loaded in useEffect
  };

  const handleSignOut = () => {
    setUser(null);
    setTranslationHistory([]);
    setPrediction("");
    setConfidence(0);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  // If user is not authenticated, show auth wrapper
  if (!user) {
    return <AuthWrapper onAuthSuccess={handleAuthSuccess} />;
  }

  // Main app content for authenticated users
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Sign Language to Voice Converter</h1>
            <p>Real-time sign language recognition and voice conversion</p>
          </div>
          <div className="user-section">
            <span className="user-email">{user.email}</span>
            <button onClick={handleSignOut} className="signout-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="webcam-section">
          <div className="webcam-container">
            {webcamError ? (
              <div className="webcam-error">
                <p>{webcamError}</p>
                <button onClick={() => setWebcamError(null)}>Retry</button>
              </div>
            ) : (
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="webcam"
                onUserMediaError={handleWebcamError}
              />
            )}
          </div>

          <div className="webcam-controls">
            <button
              onClick={startRecording}
              disabled={isRecording || isLoading}
              className="header-btn"
            >
              🎥 Start Recording
            </button>
            <button
              onClick={stopRecording}
              disabled={!isRecording || isLoading}
              className="header-btn"
            >
              ⏹️ Stop Recording
            </button>
            <button
              onClick={capture}
              disabled={isLoading}
              className="header-btn"
            >
              📸 Capture & Analyze
            </button>
          </div>
        </div>

        <div className="results-section">
          <div className="prediction-display">
            <h2>Prediction Result</h2>
            {isLoading ? (
              <div className="loading">Processing image...</div>
            ) : prediction ? (
              <div className="prediction-result">
                <div className="prediction-text">{prediction}</div>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${confidence}%` }}
                  ></div>
                </div>
                <div className="confidence-text">Confidence: {confidence}%</div>
                <p className="prediction-description">
                  {signLanguageData[prediction] || 'No description available'}
                </p>
              </div>
            ) : (
              <p>No prediction yet. Start recording and capture an image.</p>
            )}
          </div>

          <div className="history-section">
            <div className="history-header">
              <h3>Translation History</h3>
              <button onClick={clearHistory} className="clear-btn">
                Clear History
              </button>
            </div>
            <div className="history-list">
              {translationHistory.length === 0 ? (
                <p className="no-history">No translations yet</p>
              ) : (
                translationHistory.map((entry) => (
                  <div key={entry.id} className="history-item">
                    <div className="history-content">
                      <span className="history-prediction">{entry.prediction}</span>
                      <span className="history-confidence">{entry.confidence}%</span>
                      <span className="history-time">{entry.timestamp}</span>
                    </div>
                    <button
                      onClick={() => speakText(entry.prediction)}
                      className="speak-btn"
                    >
                      🔊
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
