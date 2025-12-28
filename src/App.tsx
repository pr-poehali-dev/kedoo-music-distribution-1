import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import AddRelease from "./pages/AddRelease";
import MyReleases from "./pages/MyReleases";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Tickets from "./pages/Tickets";
import ModeratorPanel from "./pages/ModeratorPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export interface User {
  email: string;
  password: string;
  isModerator?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string) => boolean;
  logout: () => void;
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedUser = localStorage.getItem('kedoo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedTheme = localStorage.getItem('kedoo_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('kedoo_users') || '[]');
    
    if (email === 'moder@olprod.ru' && password === 'zzzz-2014') {
      const moderator = { email, password, isModerator: true };
      setUser(moderator);
      localStorage.setItem('kedoo_user', JSON.stringify(moderator));
      return true;
    }

    const foundUser = users.find((u: User) => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('kedoo_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('kedoo_users') || '[]');
    
    if (users.find((u: User) => u.email === email)) {
      return false;
    }

    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem('kedoo_users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('kedoo_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kedoo_user');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('kedoo_theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const authContext: AuthContextType = { user, login, register, logout };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={!user ? <AuthPage authContext={authContext} /> : <Navigate to="/" replace />} />
            <Route path="/" element={user ? <Dashboard authContext={authContext} toggleTheme={toggleTheme} theme={theme} /> : <Navigate to="/auth" replace />} />
            <Route path="/add-release" element={user ? <AddRelease authContext={authContext} toggleTheme={toggleTheme} theme={theme} /> : <Navigate to="/auth" replace />} />
            <Route path="/my-releases" element={user ? <MyReleases authContext={authContext} toggleTheme={toggleTheme} theme={theme} /> : <Navigate to="/auth" replace />} />
            <Route path="/analytics" element={user ? <Analytics authContext={authContext} toggleTheme={toggleTheme} theme={theme} /> : <Navigate to="/auth" replace />} />
            <Route path="/profile" element={user ? <Profile authContext={authContext} toggleTheme={toggleTheme} theme={theme} /> : <Navigate to="/auth" replace />} />
            <Route path="/tickets" element={user ? <Tickets authContext={authContext} toggleTheme={toggleTheme} theme={theme} /> : <Navigate to="/auth" replace />} />
            <Route path="/moderator" element={user?.isModerator ? <ModeratorPanel authContext={authContext} toggleTheme={toggleTheme} theme={theme} /> : <Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
