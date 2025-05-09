
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getDiaryEntries, deleteDiaryEntry, DiaryEntry } from "@/services/diaryService";
import { Volume2, VolumeX } from "lucide-react";

const TimelinePage = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [speakingEntryId, setSpeakingEntryId] = useState<string | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    // Load diary entries from local storage
    const loadEntries = () => {
      setIsLoading(true);
      try {
        const loadedEntries = getDiaryEntries();
        // Sort entries by date (newest first)
        loadedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEntries(loadedEntries);
      } catch (error) {
        console.error("Failed to load entries:", error);
        toast.error("Failed to load your diary entries");
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleDeleteEntry = (id: string) => {
    try {
      deleteDiaryEntry(id);
      setEntries(entries.filter(entry => entry.id !== id));
      
      // Stop speaking if the deleted entry was being read aloud
      if (speakingEntryId === id && synthRef.current) {
        synthRef.current.cancel();
        setSpeakingEntryId(null);
      }
      
      toast.success("Entry deleted successfully");
    } catch (error) {
      console.error("Failed to delete entry:", error);
      toast.error("Failed to delete the entry");
    }
  };
  
  const toggleSpeakEntry = (entry: DiaryEntry) => {
    if (!synthRef.current) {
      toast.error("Speech synthesis is not supported in your browser");
      return;
    }
    
    // If already speaking this entry, stop it
    if (speakingEntryId === entry.id) {
      synthRef.current.cancel();
      setSpeakingEntryId(null);
      return;
    }
    
    // Stop any current speech
    synthRef.current.cancel();
    
    // Create and configure utterance
    const utterance = new SpeechSynthesisUtterance(entry.content);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    // Try to use a nice voice if available
    let voices = synthRef.current.getVoices();
    let preferredVoice = voices.find(voice => voice.name.includes('Google') || voice.name.includes('Samantha'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Set up event handlers
    utterance.onstart = () => {
      setSpeakingEntryId(entry.id);
    };
    
    utterance.onend = () => {
      setSpeakingEntryId(null);
    };
    
    utterance.onerror = (error) => {
      console.error("Speech synthesis error:", error);
      setSpeakingEntryId(null);
      toast.error("Failed to read the entry aloud");
    };
    
    // Start speaking
    synthRef.current.speak(utterance);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get mood emoji
  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'happy':
        return '😊';
      case 'sad':
        return '😢';
      case 'tired':
        return '😴';
      case 'nervous':
        return '😰';
      case 'relaxed':
        return '😌';
      default:
        return '😐';
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Your <span className="bg-gradient-to-r from-diary-primary to-diary-accent text-transparent bg-clip-text">Diary Timeline</span>
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="flex gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-diary-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 rounded-full bg-diary-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 rounded-full bg-diary-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-foreground/70">Loading your entries...</p>
          </div>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium text-foreground/70 mb-4">No entries yet</h2>
          <p className="mb-6">Start creating diary entries to see them here.</p>
          <Button 
            onClick={() => window.location.href = '/diary'}
            className="bg-diary-primary hover:bg-diary-primary/90"
          >
            Create Your First Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {entries.map((entry) => (
            <Card key={entry.id} className="diary-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" role="img" aria-label="mood">
                    {getMoodEmoji(entry.mood)}
                  </span>
                  <span className="font-medium text-diary-primary">
                    {formatDate(entry.date)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleSpeakEntry(entry)}
                    className={speakingEntryId === entry.id ? "text-diary-primary" : "text-foreground/70"}
                  >
                    {speakingEntryId === entry.id ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="hover:bg-red-100 hover:text-red-500"
                  >
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className={`whitespace-pre-wrap ${speakingEntryId === entry.id ? "bg-diary-secondary/10 p-2 rounded" : ""}`}>
                  {entry.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimelinePage;
