
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DiaryAvatar from "@/components/DiaryAvatar";

const HomePage = () => {
  const navigate = useNavigate();

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
          <DiaryAvatar isSpeaking={true} />
          <div className="mt-4 p-4 bg-diary-secondary/20 rounded-lg max-w-md">
            <p className="typing-animation">
              Hello! I'm Echo, your personal diary assistant. Ready to start documenting your day?
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
