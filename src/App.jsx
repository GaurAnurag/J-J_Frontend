import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Chat from './pages/Chat.jsx';

function App() {
    return (
        <div className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen">
            <Routes>
                <Route path="/" element={<Navigate to="/chat" replace />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </div>
    );
}

export default App;
