import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Moon, Sun, Languages, Bot, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@ai-sdk/react';

export function FloatingActions() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [chatOpen, setChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'initial',
        role: 'assistant',
        content: '¡Hola! Soy el asistente virtual oficial del CEAC. Conozco todo sobre nuestras admisiones, costos, historia y más. ¿En qué te puedo ayudar hoy?',
      }
    ]
  });

  // Handle Theme
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved as 'light' | 'dark');
    if (saved === 'dark') document.documentElement.classList.add('dark');
  }, []);

  // Handle Initial Lang
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/googtrans=\/es\/([a-z]{2})/);
      if (match && match[1] === 'en') {
        setLang('en');
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'es' ? 'en' : 'es';
    setLang(nextLang);
    if (typeof document !== 'undefined') {
      // Usar Google Translate estableciendo la cookie
      const domain = window.location.hostname;
      const cookieStr = nextLang === 'en' ? "googtrans=/es/en" : "googtrans=/es/es";
      document.cookie = `${cookieStr}; path=/;`;
      document.cookie = `${cookieStr}; domain=${domain}; path=/;`;
      if (domain.includes('.')) {
        document.cookie = `${cookieStr}; domain=.${domain}; path=/;`;
      }
      window.location.reload();
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
        <div className="flex flex-col gap-3 items-center">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-100 transition-transform hover:scale-110 border border-slate-200 dark:border-slate-700"
            title="Alternar Modo Oscuro"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <button 
            onClick={toggleLanguage}
            className="w-10 h-10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-100 transition-transform hover:scale-110 border border-slate-200 dark:border-slate-700 font-bold text-xs"
            title="Translate / Traducir"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
        </div>

        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-transform hover:scale-110 animate-bounce"
          title="Asistente Virtual IA"
        >
          <Bot size={32} />
        </button>
      </div>

      {/* AI Chatbot Modal */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-[400px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 h-[500px]">
          <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <h3 className="font-bold">IA del CEAC</h3>
            </div>
            <button onClick={() => setChatOpen(false)} className="hover:bg-blue-700 p-1 rounded-md transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'assistant' ? 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200' : 'bg-blue-600 text-white'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Pregúntame algo sobre el colegio..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-full bg-blue-600 hover:bg-blue-700">
              <Send size={16} />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
