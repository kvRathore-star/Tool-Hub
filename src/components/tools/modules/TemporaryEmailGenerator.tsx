"use client";

import React, { useState, useEffect } from 'react';
import { Eye, Copy, RefreshCw, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface InboxMail {
  id: string;
  from: string;
  subject: string;
  body: string;
  time: string;
}

export default function TemporaryEmailGenerator() {
  const [emailAddress, setEmailAddress] = useState('');
  const [inbox, setInbox] = useState<InboxMail[]>([]);
  const [selectedMail, setSelectedMail] = useState<InboxMail | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const generateEmail = () => {
    const randomHex = Math.random().toString(36).slice(-8);
    setEmailAddress(`${randomHex}@toolhub.sh`);
    // Insert mock welcome mail
    setInbox([
      {
        id: 'welcome',
        from: 'system@toolhub.sh',
        subject: 'Welcome to your temporary secure inbox',
        body: 'Hello! This is a secure transient inbox simulation. Any mail notifications dispatched to this address will be displayed right here. Ready for API sandboxes, signup verification bypasses, and temporary testing.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setSelectedMail(null);
    toast.success('New temporary address generated!');
  };

  useEffect(() => {
    generateEmail();
  }, []);

  const simulateIncomingMail = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const mockMails = [
        {
          id: 'git-code',
          from: 'noreply@github.com',
          subject: '[GitHub] Verification Code: 994821',
          body: 'Here is your OTP code validation sequence: 994821. It expires in 10 minutes. Do not share this code.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'stripe-confirm',
          from: 'support@stripe.com',
          subject: 'Stripe onboarding setup instructions',
          body: 'Verify your platform link configuration settings. Click here to confirm registration: https://dashboard.stripe.mock/verify?token=ab2931s9',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];

      // Pick one randomly
      const nextMail = mockMails[Math.floor(Math.random() * mockMails.length)];
      if (!inbox.some(m => m.id === nextMail.id)) {
        setInbox(prev => [nextMail, ...prev]);
        toast.success('New message received in inbox!');
      } else {
        toast('No new messages found.', { icon: 'ℹ️' });
      }
      setIsRefreshing(false);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(emailAddress);
    toast.success('Email copied to clipboard!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 border border-zinc-200 dark:border-white/5 rounded-2xl">
        <h2 className="text-xl font-bold text-zinc-955 dark:text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-500" />
          Secure Transient Temp-Mail Simulator
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Generate a temporary testing email address and monitor inbox verification sequences entirely client-side.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
        {/* Inbox List Column */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Active Temp Email Address</span>
            <div className="flex gap-2">
              <input readOnly type="text" value={emailAddress} className="flex-1 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 font-mono text-[11px] text-indigo-400 outline-none" />
              <button onClick={handleCopy} className="bg-zinc-800 px-3 py-2.5 rounded-xl text-white cursor-pointer"><Copy className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-2">
              <button onClick={generateEmail} className="flex-1 bg-zinc-150 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-850 dark:text-zinc-200 font-bold py-2 rounded-xl text-[10px] cursor-pointer flex justify-center items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Reset Mail</button>
              <button onClick={simulateIncomingMail} disabled={isRefreshing} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-[10px] cursor-pointer flex justify-center items-center gap-1.5"><RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> Check Mail</button>
            </div>
          </div>

          <div className="border-t border-zinc-850 pt-3 space-y-2">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Inbox Directory</span>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {inbox.map(mail => (
                <div 
                  key={mail.id} 
                  onClick={() => setSelectedMail(mail)}
                  className={`p-3 border rounded-xl cursor-pointer hover:border-zinc-750 transition-colors ${
                    selectedMail?.id === mail.id 
                      ? 'bg-indigo-500/10 border-indigo-500' 
                      : 'bg-zinc-50 dark:bg-black/10 border-zinc-850'
                  }`}
                >
                  <div className="flex justify-between font-bold text-zinc-300">
                    <span className="truncate">{mail.from}</span>
                    <span>{mail.time}</span>
                  </div>
                  <p className="text-zinc-500 mt-1 truncate">{mail.subject}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message View Column */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl shadow-xl flex flex-col justify-center min-h-[350px]">
          {selectedMail ? (
            <div className="space-y-4 animate-in zoom-in-95 flex-1 flex flex-col justify-between">
              <div className="border-b border-zinc-800 pb-3">
                <p className="font-bold text-zinc-300">From: <span className="font-normal text-zinc-450">{selectedMail.from}</span></p>
                <p className="font-bold text-zinc-300 mt-1">Subject: <span className="font-normal text-zinc-450">{selectedMail.subject}</span></p>
              </div>
              <div className="flex-1 bg-zinc-50 dark:bg-black/50 border border-zinc-850 rounded-xl p-4 font-sans text-zinc-200 leading-relaxed overflow-y-auto h-52">
                {selectedMail.body}
              </div>
            </div>
          ) : (
            <div className="text-center text-zinc-500 m-auto space-y-2">
              <Mail className="w-12 h-12 mx-auto mb-2 text-zinc-700 animate-pulse" />
              <p className="text-xs">Select any mail record from the inbox to read contents details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}