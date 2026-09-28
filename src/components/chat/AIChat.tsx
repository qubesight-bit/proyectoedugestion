import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Send, User, X, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'initial',
        role: 'assistant',
        content: '¡Hola! Soy el asistente virtual del CEAC. ¿En qué te puedo ayudar hoy?',
      }
    ]
  });

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl z-50 flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-24 right-6 w-80 md:w-96 shadow-2xl z-50 border-blue-100 flex flex-col h-[500px]">
      <CardHeader className="bg-blue-600 text-white flex flex-row items-center justify-between p-4 rounded-t-xl">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="w-5 h-5" /> Asistente CEAC
        </CardTitle>
        <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700 h-8 w-8" onClick={() => setIsOpen(false)}>
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col h-full bg-slate-50 overflow-hidden rounded-b-xl">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-lg flex items-start gap-3 shadow-sm ${
                m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
              }`}>
                {m.role === 'user' ? null : <Bot className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                {m.role === 'user' ? <User className="w-4 h-4 shrink-0 mt-0.5 opacity-80" /> : null}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-tl-none flex gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex gap-2">
          <Input 
            value={input}
            onChange={handleInputChange}
            placeholder="Escribe tu mensaje..."
            className="flex-1 border-slate-200 focus-visible:ring-blue-600"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
