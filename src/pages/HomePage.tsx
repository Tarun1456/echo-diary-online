
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DiaryAvatar from "@/components/DiaryAvatar";
import { toast } from "sonner";

const HomePage = () => {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  const welcomeMessages = [
    "Hello! I'm Echo, your personal diary assistant. Ready to start documenting your day?",
    "I can help you transform your daily experiences into meaningful journal entries. Would you like to create a new entry or view your timeline?"
  ];
  
  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    // Type out welcome message
    let messageIndex = 0;
    let charIndex = 0;
    
    const typeMessage = () => {
      if (messageIndex < welcomeMessages.length) {
        if (charIndex < welcomeMessages[messageIndex].length) {
          setCurrentMessage(prev => prev + welcomeMessages[messageIndex][charIndex]);
          charIndex++;
          setTimeout(typeMessage, 30); // Typing speed
        } else {
          // Finished typing this message
          if (messageIndex < welcomeMessages.length - 1) {
            setTimeout(() => {
              setCurrentMessage("");
              messageIndex++;
              charIndex = 0;
              typeMessage();
            }, 2000); // Wait before typing next message
          } else {
            setIsTyping(false);
            // Speak the welcome message when typing is done
            speakText(welcomeMessages.join(" "));
          }
        }
      }
    };
    
    // Start typing
    setTimeout(typeMessage, 500);
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);
  
  const speakText = (text: string) => {
    if (!synthRef.current) {
      return;
    }
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    // Ensure we use a pleasant voice if available
    let voices = synthRef.current.getVoices();
    let preferredVoice = voices.find(voice => voice.name.includes('Google') || voice.name.includes('Samantha'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      toast.info("Click 'Create New Entry' to start journaling!");
    };
    
    synthRef.current.speak(utterance);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full flex flex-col items-center space-y-10">
        <h1 className="text-4xl md:text-6xl font-bold text-center">
          <span className="bg-gradient-to-r from-diary-primary to-diary-accent text-transparent bg-clip-text">
            Echo Diary
          </span>
        </h1>
        
        <div className="text-xl text-center text-foreground/70 max-w-2xl">
          <p className="mb-4">Your AI-powered journal companion that helps you reflect, record, and remember your daily experiences.</p>
          <p>Speak or type your thoughts, and let Echo transform them into meaningful diary entries.</p>
        </div>
        
        <div className="flex flex-col items-center">
          <DiaryAvatar isSpeaking={isSpeaking} />
          <div className="mt-4 p-4 bg-diary-secondary/20 rounded-lg max-w-md min-h-[80px] flex items-center justify-center">
            <p className={isTyping ? "typing-animation" : ""}>
              {currentMessage || (isTyping ? "" : welcomeMessages[welcomeMessages.length - 1])}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            onClick={() => navigate('/diary')}
            className="bg-diary-primary hover:bg-diary-primary/90 text-white px-8 py-6 text-lg"
          >
            Create New Entry
          </Button>
          <Button
            onClick={() => navigate('/timeline')}
            variant="outline"
            className="border-diary-primary text-diary-primary hover:bg-diary-primary/10 px-8 py-6 text-lg"
          >
            View Timeline
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
          <div className="diary-card">
            <h3 className="text-xl font-medium mb-2 text-diary-primary">Record Daily Moments</h3>
            <p className="text-foreground/70">Capture your thoughts, feelings, and experiences with ease.</p>
          </div>
          <div className="diary-card">
            <h3 className="text-xl font-medium mb-2 text-diary-primary">AI-Enhanced Journaling</h3>
            <p className="text-foreground/70">Echo helps organize your thoughts into meaningful entries.</p>
          </div>
          <div className="diary-card">
            <h3 className="text-xl font-medium mb-2 text-diary-primary">Track Your Journey</h3>
            <p className="text-foreground/70">Review past entries and see how you've grown over time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
