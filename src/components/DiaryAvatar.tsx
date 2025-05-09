
import { useEffect, useState } from 'react';

interface DiaryAvatarProps {
  isThinking?: boolean;
  isSpeaking?: boolean;
}

const DiaryAvatar = ({ isThinking = false, isSpeaking = false }: DiaryAvatarProps) => {
  const [blinkState, setBlinkState] = useState(false);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 200);
    }, Math.random() * 4000 + 2000); // Random blink between 2-6 seconds
    
    return () => clearInterval(blinkInterval);
  }, []);
  
  // Determine mouth style based on state
  const getMouthStyle = () => {
    if (isSpeaking) {
      return "h-3 animate-pulse-gentle";
    } else if (isThinking) {
      return "w-6 h-1 rounded-full";
    } else {
      return "h-2";
    }
  };

  return (
    <div className="avatar-container">
      <div className={`avatar-face ${isThinking ? 'animate-pulse-gentle' : ''}`}>
        {/* Left eye */}
        <div className="avatar-eye" style={{ top: '35%', left: '30%' }}>
          {!blinkState && <div className="avatar-pupil" />}
        </div>
        
        {/* Right eye */}
        <div className="avatar-eye" style={{ top: '35%', right: '30%' }}>
          {!blinkState && <div className="avatar-pupil" />}
        </div>
        
        {/* Mouth */}
        <div 
          className={`avatar-mouth ${getMouthStyle()}`} 
          style={{ bottom: '25%', left: '50%', transform: 'translateX(-50%)' }}
        >
          {isSpeaking && (
            <div className="w-full h-full flex justify-center items-center">
              <div className="w-2 h-full bg-diary-dark mx-0.5 animate-bounce-subtle" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-full bg-diary-dark mx-0.5 animate-bounce-subtle" style={{ animationDelay: '200ms' }}></div>
              <div className="w-2 h-full bg-diary-dark mx-0.5 animate-bounce-subtle" style={{ animationDelay: '400ms' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryAvatar;
