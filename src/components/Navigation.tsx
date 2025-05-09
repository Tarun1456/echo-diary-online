
import { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-diary-primary to-diary-accent text-transparent bg-clip-text">
              Echo Diary
            </span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="text-foreground/70 hover:text-diary-primary transition-colors">
            Home
          </Link>
          <Link to="/diary" className="text-foreground/70 hover:text-diary-primary transition-colors">
            New Entry
          </Link>
          <Link to="/timeline" className="text-foreground/70 hover:text-diary-primary transition-colors">
            Timeline
          </Link>
        </nav>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg animate-fade-in">
          <div className="container py-4 flex flex-col gap-4">
            <Link to="/" className="text-foreground/70 hover:text-diary-primary transition-colors" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/diary" className="text-foreground/70 hover:text-diary-primary transition-colors" onClick={toggleMenu}>
              New Entry
            </Link>
            <Link to="/timeline" className="text-foreground/70 hover:text-diary-primary transition-colors" onClick={toggleMenu}>
              Timeline
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
