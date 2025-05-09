
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6">
        <div className="container flex justify-between items-center">
          <p className="text-sm text-foreground/60">© 2025 Echo Diary</p>
          <p className="text-sm text-foreground/60">Your AI Journaling Companion</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
