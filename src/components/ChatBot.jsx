import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'model', text: '¡Hola! Soy el Profesor Oak AI.' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!apiKey) throw new Error("API_KEY_NOT_FOUND");

      const genAI = new GoogleGenerativeAI(apiKey);
      // Using Gemini 2.5 Flash (stable) - or try "gemini-3-flash" for newest
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(userMessage);
      const response = await result.response;
      
      setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
    } catch (error) {
      console.error("Error crítico:", error);
      let errorMsg = "Error al conectar con el servidor.";
      
      if (error.message.includes("API_KEY")) {
        errorMsg = "Error: La clave API no es válida.";
      } else if (error.message.includes("404")) {
        errorMsg = "Error: Modelo no disponible. Verifica tu clave API.";
      }
      
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[70] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border">
          <div className="bg-red-600 p-4 text-white font-bold flex justify-between items-center">
            <span>Oak AI</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-red-700 rounded px-2"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-lg text-sm max-w-[85%] ${msg.role === 'user' ? 'bg-red-600 text-white' : 'bg-white border text-gray-700'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-2 rounded-lg text-sm bg-white border text-gray-700">
                  <span className="animate-pulse">Escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 border-t flex gap-2">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()} 
              className="flex-1 border rounded-full px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Escribe un mensaje..."
              disabled={isLoading}
            />
            <button 
              onClick={handleSend} 
              className="bg-red-600 text-white px-3 py-1 rounded-full text-sm hover:bg-red-700 disabled:opacity-50"
              disabled={isLoading}
            >
              ➤
            </button>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="bg-red-600 text-white w-14 h-14 rounded-full shadow-lg text-2xl hover:bg-red-700 transition-all"
      >
        ✨
      </button>
    </div>
  );
}