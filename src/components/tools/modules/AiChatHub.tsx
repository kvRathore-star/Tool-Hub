"use client";
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAiProvider, AiMessage } from '@/hooks/useAiProvider';
import AiSettings from '../AiSettings';
import { Clipboard, Download, Sparkles, Send, Trash2, User, Bot } from 'lucide-react';
import { downloadOrShare } from '@/utils/nativeShare';

export default function AiChatHub() {
  const { isConfigured, generateCompletion } = useAiProvider();
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [persona, setPersona] = useState('General Assistant');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful, smart, and friendly AI assistant.');
  const [isProcessing, setIsProcessing] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const personas: Record<string, string> = {
    'General Assistant': 'You are a helpful, smart, and friendly AI assistant.',
    'Senior Developer': 'You are a world-class senior software engineer. Answer questions with clean, commented, and optimal code snippets.',
    'Marketing Expert': 'You are an expert copywriter, digital marketer, and brand growth advisor. Provide creative ideas and compelling copy.',
    'Career Coach': 'You are a professional executive career coach. Provide guidance on job interviews, salary negotiation, and resume writing.',
    'Socratic Teacher': 'You are an educational tutor who uses the Socratic method. Guide users to find answers themselves by asking helpful leading questions.'
  };

  useEffect(() => {
    if (personas[persona]) {
      setSystemPrompt(personas[persona]);
    }
  }, [persona]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    if (!isConfigured) return toast.error('Please configure your AI Provider API key at the top first!');

    const userMessage: AiMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      // Assemble full payload (System prompt + Message history)
      const payload: AiMessage[] = [
        { role: 'system', content: systemPrompt },
        ...messages,
        userMessage
      ];

      const response = await generateCompletion(payload, 0.7);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (e: any) {
      toast.error(e.message || "Failed to fetch AI reply");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    toast.success("Chat history cleared.");
  };

  const handleDownload = () => {
    const formattedChat = messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}\n\n`)
      .join('---\n\n');
    
    const blob = new Blob([formattedChat], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    downloadOrShare(url, `chat_${Date.now()}.txt`);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 space-y-6">
      <AiSettings />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Persona Config */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Bot className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">AI Chat Hub</h3>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Assistant Persona</label>
              <select
                value={persona}
                onChange={e => setPersona(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm"
              >
                {Object.keys(personas).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">System Instructions</label>
              <textarea
                value={systemPrompt}
                onChange={e => setSystemPrompt(e.target.value)}
                placeholder="Instruct the AI how to behave..."
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white h-44 outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={handleClear}
              disabled={messages.length === 0}
              className="py-3.5 rounded-xl font-bold border border-zinc-200 dark:border-zinc-800 text-[var(--text-secondary)] dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-[var(--bg-surface)] flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Chat</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={messages.length === 0}
              className="py-3.5 rounded-xl font-bold border border-zinc-200 dark:border-zinc-800 text-[var(--text-secondary)] dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-[var(--bg-surface)] flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Save Chat</span>
            </button>
          </div>
        </div>

        {/* Right Chat Thread */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl flex flex-col h-[550px]">
          {/* Chat Headers */}
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-zinc-900 dark:text-white">{persona}</span>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-black/10">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 p-8">
                <Bot className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700 animate-bounce" />
                <p className="text-sm font-bold">Start a conversation with {persona}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Ask questions, request code, edit text, and get responses in real time.</p>
              </div>
            ) : (
              messages.map((m, idx) => {
                const isUser = m.role === 'user';
                return (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-3 max-w-[85%] ${
                      isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    } animate-in slide-in-from-bottom-2 duration-200`}
                  >
                    <div className={`p-2 rounded-xl border ${
                      isUser 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-white dark:bg-zinc-900 border-[var(--border-subtle)] dark:border-zinc-800 text-zinc-800 dark:text-zinc-200'
                    }`}>
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    
                    <div className={`rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                      isUser 
                        ? 'bg-[var(--accent)] text-white rounded-tr-none' 
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-tl-none text-[var(--text-secondary)] dark:text-[var(--text-primary)]'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                );
              })
            )}

            {isProcessing && (
              <div className="flex items-start gap-3 mr-auto max-w-[85%] animate-pulse">
                <div className="p-2 rounded-xl border bg-white dark:bg-zinc-900 border-[var(--border-subtle)] dark:border-zinc-800 text-zinc-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="rounded-2xl p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-tl-none text-zinc-400 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-[var(--bg-surface)] dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[var(--bg-surface)] dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[var(--bg-surface)] dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Chat Inputs */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={`Ask ${persona}...`}
              className="flex-1 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none text-sm focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={isProcessing || !inputValue.trim()}
              className="p-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-all active:scale-[0.95] disabled:opacity-50 flex items-center justify-center cursor-pointer"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
