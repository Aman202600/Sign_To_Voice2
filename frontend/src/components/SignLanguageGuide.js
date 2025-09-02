import React, { useState } from 'react';
import './SignLanguageGuide.css';

const SignLanguageGuide = () => {
  const [selectedCategory, setSelectedCategory] = useState('alphabet');

  const signCategories = {
    alphabet: {
      title: 'Alphabet Signs',
      signs: [
        { sign: 'A', description: 'Fist with thumb on side', gesture: '👊' },
        { sign: 'B', description: 'Flat hand with fingers together', gesture: '✋' },
        { sign: 'C', description: 'Curved hand like letter C', gesture: '🤏' },
        { sign: 'D', description: 'Index finger pointing up', gesture: '☝️' },
        { sign: 'E', description: 'Fist with fingers curled', gesture: '✊' },
        { sign: 'F', description: 'Index and thumb touching, other fingers up', gesture: '🤌' },
        { sign: 'G', description: 'Index finger pointing to side', gesture: '👉' },
        { sign: 'H', description: 'Index and middle finger pointing up', gesture: '✌️' },
        { sign: 'I', description: 'Pinky finger pointing up', gesture: '🤙' },
        { sign: 'J', description: 'Pinky finger making J motion', gesture: '🤙' },
        { sign: 'K', description: 'Index and middle finger pointing up, thumb between', gesture: '🤞' },
        { sign: 'L', description: 'Thumb and index finger making L shape', gesture: '🤟' },
        { sign: 'M', description: 'Three fingers pointing down', gesture: '🤟' },
        { sign: 'N', description: 'Two fingers pointing down', gesture: '✌️' },
        { sign: 'O', description: 'Fingers curled into circle', gesture: '👌' },
        { sign: 'P', description: 'Index finger pointing down', gesture: '👇' },
        { sign: 'Q', description: 'Index finger pointing down and to side', gesture: '👉' },
        { sign: 'R', description: 'Index and middle finger crossed', gesture: '🤞' },
        { sign: 'S', description: 'Fist', gesture: '✊' },
        { sign: 'T', description: 'Index finger pointing up between other fingers', gesture: '🤟' },
        { sign: 'U', description: 'Index and middle finger pointing up', gesture: '✌️' },
        { sign: 'V', description: 'Index and middle finger pointing up', gesture: '✌️' },
        { sign: 'W', description: 'Three fingers pointing up', gesture: '🤟' },
        { sign: 'X', description: 'Index finger bent', gesture: '🤟' },
        { sign: 'Y', description: 'Thumb and pinky pointing up', gesture: '🤙' },
        { sign: 'Z', description: 'Index finger making Z motion', gesture: '👉' }
      ]
    },
    common: {
      title: 'Common Words',
      signs: [
        { sign: 'HELLO', description: 'Wave hand', gesture: '👋' },
        { sign: 'THANK YOU', description: 'Hand from chin forward', gesture: '🤲' },
        { sign: 'YES', description: 'Fist nodding up and down', gesture: '👍' },
        { sign: 'NO', description: 'Index and middle finger tapping thumb', gesture: '👎' },
        { sign: 'PLEASE', description: 'Flat hand rubbing in circular motion', gesture: '🤲' },
        { sign: 'SORRY', description: 'Fist making circular motion over heart', gesture: '💝' },
        { sign: 'HELP', description: 'One hand on top of other, both moving up', gesture: '🤝' },
        { sign: 'GOOD', description: 'Flat hand touching chin then moving forward', gesture: '👍' },
        { sign: 'BAD', description: 'Flat hand touching chin then moving down', gesture: '👎' },
        { sign: 'WANT', description: 'Both hands pulling toward body', gesture: '🤲' },
        { sign: 'NEED', description: 'Index finger pointing to chest', gesture: '👆' },
        { sign: 'UNDERSTAND', description: 'Index finger pointing to forehead', gesture: '🤔' },
        { sign: 'DON\'T UNDERSTAND', description: 'Index finger pointing to forehead then shaking', gesture: '🤷' },
        { sign: 'NAME', description: 'Index and middle finger tapping', gesture: '✌️' },
        { sign: 'WHAT', description: 'Both hands palms up', gesture: '🤲' },
        { sign: 'WHERE', description: 'Index finger pointing around', gesture: '👉' },
        { sign: 'WHEN', description: 'Index finger pointing to wrist', gesture: '⌚' },
        { sign: 'WHO', description: 'Index finger pointing to person', gesture: '👆' },
        { sign: 'WHY', description: 'Index finger pointing to forehead', gesture: '🤔' },
        { sign: 'HOW', description: 'Both hands palms up moving up and down', gesture: '🤲' }
      ]
    },
    numbers: {
      title: 'Number Signs',
      signs: [
        { sign: '1', description: 'Index finger pointing up', gesture: '☝️' },
        { sign: '2', description: 'Index and middle finger pointing up', gesture: '✌️' },
        { sign: '3', description: 'Three fingers pointing up', gesture: '🤟' },
        { sign: '4', description: 'Four fingers pointing up', gesture: '🤟' },
        { sign: '5', description: 'All five fingers pointing up', gesture: '✋' },
        { sign: '6', description: 'Thumb and pinky pointing up', gesture: '🤙' },
        { sign: '7', description: 'Thumb and index finger pointing up', gesture: '🤟' },
        { sign: '8', description: 'Thumb and three fingers pointing up', gesture: '🤟' },
        { sign: '9', description: 'Index finger bent', gesture: '🤟' },
        { sign: '10', description: 'Fist with thumb pointing up', gesture: '👍' }
      ]
    }
  };

  return (
    <div className="sign-guide">
      <h2>Sign Language Guide</h2>
      <p>Learn how to perform different signs for better recognition</p>
      
      <div className="category-tabs">
        {Object.keys(signCategories).map(category => (
          <button
            key={category}
            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {signCategories[category].title}
          </button>
        ))}
      </div>

      <div className="signs-grid">
        {signCategories[selectedCategory].signs.map((sign, index) => (
          <div key={index} className="sign-card">
            <div className="sign-gesture">{sign.gesture}</div>
            <div className="sign-letter">{sign.sign}</div>
            <div className="sign-description">{sign.description}</div>
          </div>
        ))}
      </div>

      <div className="guide-tips">
        <h3>Tips for Better Recognition:</h3>
        <ul>
          <li>Ensure good lighting on your hands</li>
          <li>Keep your hands clearly visible in the camera</li>
          <li>Hold each sign steady for 2-3 seconds</li>
          <li>Position your hands at chest level</li>
          <li>Use a plain background for better contrast</li>
        </ul>
      </div>
    </div>
  );
};

export default SignLanguageGuide;

