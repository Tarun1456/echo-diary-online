
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-9rem)] flex items-center justify-center bg-gradient-to-b from-background to-diary-secondary/10 p-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-diary-primary">404</h1>
        <p className="text-xl text-foreground/70 mb-8">
          Oops! It seems this page has disappeared from your diary.
        </p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-diary-primary hover:bg-diary-primary/90"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
