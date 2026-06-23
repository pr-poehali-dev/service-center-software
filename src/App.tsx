import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Login from "./pages/Login";
import { User, getMe, getSessionId } from "@/lib/auth";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!getSessionId()) { setChecking(false); return; }
    getMe().then(res => {
      if ('user' in res) setUser(res.user);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {user
          ? <Index user={user} onLogout={() => setUser(null)} />
          : <Login onLogin={setUser} />
        }
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;