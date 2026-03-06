import React, { useState, useEffect } from 'react';
import Auth from './pages/Auth.jsx';
import Chat from './pages/Chat.jsx';

function App() {
  const [authData, setAuthData] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('pharma_theme') || 'light');

  useEffect(() => {
    const token = localStorage.getItem('pharma_rag_token');
    const role  = localStorage.getItem('pharma_rag_role');
    const email = localStorage.getItem('pharma_rag_email');
    if (token) setAuthData({ token, role, email });
  }, []);

  const handleAuth = (data) => setAuthData(data);

  const handleLogout = () => {
    localStorage.removeItem('pharma_rag_token');
    localStorage.removeItem('pharma_rag_role');
    localStorage.removeItem('pharma_rag_email');
    setAuthData(null);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('pharma_theme', next);
  };

  if (!authData) {
    return <Auth onAuth={handleAuth} theme={theme} onToggleTheme={toggleTheme} />;
  }

  return <Chat authData={authData} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />;
}

export default App;
