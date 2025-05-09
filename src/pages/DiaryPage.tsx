
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DiaryAvatar from "@/components/DiaryAvatar";
import { Mic, MicOff } from "lucide-react";
import { generateDiaryEntry, saveDiaryEntry, detectMood } from "@/services/diaryService";

const DiaryPage = () => {
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedEntry, setGeneratedEntry] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition and synthesis
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setUserInput(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Speech recognition error. Please try again.');
      };
    }
    
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in your browser.');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.success('Listening... Speak now.');
    }
  };
  
  const speakText = (text: string) => {
    if (!synthRef.current) {
      toast.error('Speech synthesis is not supported in your browser.');
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
    };
    
    synthRef.current.speak(utterance);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const processEntry = async () => {
    if (userInput.trim().length === 0) {
      toast.error("Please enter some text to create a diary entry");
      return;
    }

    setIsProcessing(true);
    try {
      const entry = await generateDiaryEntry(userInput);
      setGeneratedEntry(entry);
      toast.success("Entry generated successfully!");
      
      // Generate a welcome response to speak
      const speakResponse = "I've created an entry based on what you shared. Would you like to save it or make any changes?";
      speakText(speakResponse);
    } catch (error) {
      console.error("Error generating entry:", error);
      toast.error("Failed to generate entry. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const saveEntry = () => {
    if (generatedEntry.trim().length === 0) {
      toast.error("Please generate an entry before saving");
      return;
    }

    const entry = {
      id: uuidv4(),
      date: new Date().toISOString(),
      content: generatedEntry,
      mood: detectMood(userInput + " " + generatedEntry),
    };

    saveDiaryEntry(entry);
    toast.success("Entry saved to your diary!");
    
    // Speak confirmation
    speakText("Your diary entry has been saved successfully!");
    
    // Clear the form
    setUserInput("");
    setGeneratedEntry("");
  };

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Create New <span className="bg-gradient-to-r from-diary-primary to-diary-accent text-transparent bg-clip-text">Diary Entry</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <DiaryAvatar isThinking={isProcessing} isSpeaking={isSpeaking || (!isProcessing && generatedEntry.length > 0)} />
          
          <div className="mt-6 w-full">
            <h2 className="text-xl font-medium mb-2">Tell me about your day</h2>
            <div className="relative">
              <Textarea
                value={userInput}
                onChange={handleInputChange}
                placeholder="Type your thoughts here or click the microphone to speak..."
                className="h-40 resize-none mb-4 pr-12"
                disabled={isProcessing}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`absolute right-2 bottom-6 ${isListening ? 'text-red-500' : 'text-diary-primary'}`}
                onClick={toggleListening}
                disabled={isProcessing}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            </div>
            <Button 
              onClick={processEntry}
              className="w-full bg-diary-primary hover:bg-diary-primary/90"
              disabled={isProcessing || userInput.trim().length === 0}
            >
              {isProcessing ? 'Processing...' : 'Generate Entry'}
            </Button>
          </div>
        </div>

        <div className="diary-card h-full flex flex-col">
          <h2 className="text-xl font-medium mb-2">Your Echo Diary Entry</h2>
          
          {isProcessing ? (
            <div className="flex-1 flex items-center justify-center text-foreground/70">
              <div className="flex flex-col items-center">
                <div className="flex gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-diary-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-diary-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-diary-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p>Creating your entry...</p>
              </div>
            </div>
          ) : generatedEntry ? (
            <>
              <div className="flex-1 p-4 bg-diary-secondary/10 rounded-lg mb-4 overflow-y-auto">
                <p className="whitespace-pre-wrap">{generatedEntry}</p>
              </div>
              <Button 
                onClick={saveEntry} 
                className="bg-diary-primary hover:bg-diary-primary/90"
              >
                Save Entry
              </Button>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-foreground/70">
              <p>Your entry will appear here after generation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;
