import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, FileText, Bot, User, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/chat`, {
                message: input
            });

            const botMessage = {
                role: 'assistant',
                content: response.data.answer,
                sources: response.data.sources
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error answering your question. Make sure the backend is running and the database is configured.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        setIsUploading(true);

        try {
            await axios.post(`${API_URL}/api/documents/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessages(prev => [...prev, {
                role: 'system',
                content: `Successfully uploaded and started processing document: ${file.name}`
            }]);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload document.');
        } finally {
            setIsUploading(false);
            event.target.value = null; // reset input
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">

            {/* Sidebar for Document Management */}
            <div className="w-80 border-r border-slate-200 bg-white flex flex-col hidden md:flex">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                        <Bot className="w-5 h-5 mr-2 text-indigo-600" />
                        Pharma AI Coach
                    </h2>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Knowledge Base</h3>

                    <div className="mb-4">
                        <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                            {isUploading ? (
                                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                            ) : (
                                <>
                                    <Upload className="w-5 h-5 text-slate-400 mr-2" />
                                    <span className="text-sm font-medium text-slate-600">Upload SOP (PDF)</span>
                                </>
                            )}
                            <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={isUploading} />
                        </label>
                        <p className="text-xs text-slate-500 mt-2 text-center">Docs are parsed automatically in the background.</p>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50">

                {/* Mobile Header */}
                <div className="md:hidden p-4 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between z-10">
                    <h2 className="font-semibold text-slate-800 flex items-center">
                        <Bot className="w-5 h-5 mr-2 text-indigo-600" /> Pharma Job Coach
                    </h2>
                    <label className="cursor-pointer text-indigo-600">
                        <Upload className="w-5 h-5" />
                        <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={isUploading} />
                    </label>
                </div>

                {/* Message Feed */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto px-4">
                            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <Bot className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Pharma RAG</h1>
                            <p className="text-slate-600 leading-relaxed">
                                Upload Standard Operating Procedure (SOP) PDFs using the sidebar, then ask me anything about compliance rules, steps, or definitions.
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-6">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role !== 'user' && (
                                        <div className="flex-shrink-0 w-8 h-8 mr-3 mt-1 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                            {msg.role === 'system' ? <FileText className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                                        </div>
                                    )}

                                    <div className={`max-w-[85%] rounded-2xl p-4 sm:px-6 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : msg.role === 'system' ? 'bg-slate-200 text-slate-800 italic rounded-tl-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                                        {/* Render Citations */}
                                        {msg.sources && msg.sources.length > 0 && (
                                            <div className="mt-4 pt-3 border-t border-slate-100">
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sources:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {msg.sources.map((s, i) => (
                                                        <div key={i} className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 cursor-help" title={s.text_snippet}>
                                                            <FileText className="w-3 h-3 mr-1.5 text-indigo-500" />
                                                            {s.source} (Page {s.page})
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="flex-shrink-0 w-8 h-8 ml-3 mt-1 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                                            <User className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full bg-indigo-600 flex items-center justify-center text-white p-1.5">
                                        <Loader2 className="w-full h-full animate-spin" />
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-6 py-4 flex items-center space-x-2 shadow-sm">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Form */}
                <div className="absolute flex justify-center bottom-0 w-full bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-6 pb-6 px-4 md:px-0 pointer-events-none">
                    <div className="max-w-4xl w-full mx-auto md:pl-0 pointer-events-auto">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="relative bg-white border border-slate-300 rounded-full shadow-lg overflow-hidden flex items-center focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                                placeholder="Ask about compliance standard procedures..."
                                className="flex-1 w-full bg-transparent border-0 px-6 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 text-[15px]"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="p-2 mr-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                        <p className="text-center text-xs text-slate-400 mt-2 font-medium">AI can make mistakes. Consider verifying important information.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
