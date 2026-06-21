"use client";

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function MultiModelAiChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, model?: string }[]>([
    { role: 'ai', content: 'Hello! I am your AI assistant. You can chat with me using Claude 3.5 Sonnet, GPT-4o, or Gemini 1.5 Pro. How can I help you today?', model: 'System' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-3-5-sonnet');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);
    
    // Simulate API delay for stub
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `(Backend not connected). This is a stubbed response from ${selectedModel}. Please configure your API keys in the dashboard to enable live chat.`,
        model: selectedModel
      }]);
      setIsTyping(false);
      toast.error(`API Key for ${selectedModel} is missing.`);
    }, 1500);
  };

  const models = [
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'gemini-1-5-pro', name: 'Gemini 1.5 Pro', provider: 'Google' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto h-[800px] flex flex-col">
      <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl flex justify-between items-center shrink-0">
        <div className="text-purple-400 text-sm">
          <strong>Premium AI Chat:</strong> Switch models seamlessly mid-conversation.
        </div>
        <select 
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-white dark:bg-black border border-purple-500/30 text-purple-300 text-sm rounded-lg px-3 py-1.5 outline-none font-bold"
        >
          {models.map(m => (
            <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
          ))}
        </select>
      </div>

      <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 text-zinc-800 dark:text-zinc-200 rounded-bl-sm shadow-lg'
              }`}>
                {msg.role === 'ai' && (
                  <div className="text-xs text-purple-400 font-bold mb-1 opacity-80 uppercase tracking-wider">
                    {msg.model}
                  </div>
                )}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 text-zinc-800 dark:text-zinc-200 rounded-2xl rounded-bl-sm p-4 shadow-lg flex items-center space-x-2">
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/40 border-t border-zinc-200 dark:border-white/5">
          <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-inner focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Message ${models.find(m => m.id === selectedModel)?.name}...`}
              className="flex-1 bg-transparent p-4 outline-none text-zinc-800 dark:text-zinc-200 resize-none max-h-32 min-h-[56px] leading-relaxed"
              rows={1}
            />
            <div className="pr-4 shrink-0">
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-purple-600 hover:bg-purple-500 text-white p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-purple-600 shadow-lg active:scale-95"
                aria-label="Send"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="text-xs text-zinc-600">AI can make mistakes. Verify important information.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
