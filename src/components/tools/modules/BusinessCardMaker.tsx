"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Download, CreditCard, Layout, Sliders, Layers, RefreshCw, FileText, Image as ImageIcon } from 'lucide-react';
import { downloadOrShare } from '@/utils/nativeShare';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';

interface CardTemplate {
  name: string;
  bgGrad1: string;
  bgGrad2: string;
  textColor: string;
  accentColor: string;
}

const TEMPLATES: CardTemplate[] = [
  { name: 'Modern Dark', bgGrad1: '#1e1b4b', bgGrad2: '#0f172a', textColor: '#ffffff', accentColor: '#6366f1' },
  { name: 'Clean White', bgGrad1: '#ffffff', bgGrad2: '#f4f4f5', textColor: '#18181b', accentColor: '#10b981' },
  { name: 'Royal Gold', bgGrad1: '#1c1917', bgGrad2: '#0c0a09', textColor: '#fef08a', accentColor: '#eab308' },
  { name: 'Creative Coral', bgGrad1: '#ffedd5', bgGrad2: '#ffddd2', textColor: '#27272a', accentColor: '#ea580c' }
];

export default function BusinessCardMaker() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(TEMPLATES[0]);
  
  // Fields
  const [name, setName] = useState('John Doe');
  const [title, setTitle] = useState('Senior Software Architect');
  const [company, setCompany] = useState('Apex Technologies');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [email, setEmail] = useState('john.doe@company.com');
  const [website, setWebsite] = useState('www.company.com');
  const [address, setAddress] = useState('123 Silicon Valley, CA');
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  useEffect(() => {
    drawCard();
  }, [activeSide, selectedTemplate, name, title, company, phone, email, website, address, logoBase64]);

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, selectedTemplate.bgGrad1);
    gradient.addColorStop(1, selectedTemplate.bgGrad2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative geometric accents
    ctx.fillStyle = selectedTemplate.accentColor;
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(canvas.width, 0, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();

    if (activeSide === 'front') {
      // FRONT SIDE: Logo and Company (Centered / Bold)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw Logo
      if (logoBase64) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, centerX - 40, centerY - 80, 80, 80);
        };
        img.src = logoBase64;
      } else {
        // Mock SVG Icon logo
        ctx.fillStyle = selectedTemplate.accentColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 40, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = selectedTemplate.textColor;
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("A", centerX, centerY - 40);
      }

      // Company Name
      ctx.fillStyle = selectedTemplate.textColor;
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(company, centerX, centerY + 50);

      // Muted tagline
      ctx.fillStyle = selectedTemplate.textColor === '#ffffff' ? '#a1a1aa' : '#71717a';
      ctx.font = 'tracking-widest uppercase 14px sans-serif';
      ctx.fillText("GLOBAL DIGITAL SOLUTIONS", centerX, centerY + 85);

    } else {
      // BACK SIDE: Details, Name, and Contact Grid
      // Left Panel: Name & Title
      ctx.fillStyle = selectedTemplate.textColor;
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(name, 60, 100);

      ctx.fillStyle = selectedTemplate.accentColor;
      ctx.font = 'italic 16px Arial, sans-serif';
      ctx.fillText(title, 60, 130);

      // Horizontal separator line
      ctx.strokeStyle = selectedTemplate.textColor === '#ffffff' ? '#3f3f46' : '#e4e4e7';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 160);
      ctx.lineTo(canvas.width - 60, 160);
      ctx.stroke();

      // Right/Bottom Panel: Contact Details Grid
      ctx.fillStyle = selectedTemplate.textColor;
      ctx.font = '14px sans-serif';
      
      const gridYStart = 200;
      const col1X = 60;
      const col2X = canvas.width / 2 + 20;

      // Column 1 Contacts
      ctx.fillText(`Phone: ${phone}`, col1X, gridYStart);
      ctx.fillText(`Email: ${email}`, col1X, gridYStart + 35);
      ctx.fillText(`Web: ${website}`, col1X, gridYStart + 70);

      // Column 2 Contacts
      ctx.fillText(`Address: ${address}`, col2X, gridYStart);
      ctx.fillText(`Firm: ${company}`, col2X, gridYStart + 35);

      // Small logo bottom right corner
      ctx.fillStyle = selectedTemplate.accentColor;
      ctx.beginPath();
      ctx.arc(canvas.width - 90, canvas.height - 70, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setLogoBase64(reader.result as string);
      toast.success("Logo uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    downloadOrShare(dataUrl, `business_card_${activeSide}.png`);
    toast.success(`Downloaded ${activeSide} side PNG!`);
  };

  const downloadPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a 2-page print PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: [3.5, 2.0] // Standard card size in inches
    });

    // Page 1: Front Side
    setActiveSide('front');
    setTimeout(() => {
      const frontData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(frontData, 'JPEG', 0, 0, 3.5, 2.0);
      
      // Page 2: Back Side
      pdf.addPage([3.5, 2.0], 'landscape');
      setActiveSide('back');
      
      setTimeout(() => {
        const backData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(backData, 'JPEG', 0, 0, 3.5, 2.0);
        
        pdf.save(`business_cards_print.pdf`);
        toast.success("Print-Ready Business Cards PDF downloaded!");
        
        // Restore active side to front
        setActiveSide('front');
      }, 200);
    }, 200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 border border-zinc-200 dark:border-white/5 rounded-2xl">
        <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-500" />
          Business Card Maker
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Design print-ready business cards. Custom layouts, details inputs, and PDF exports.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor controls */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 max-h-[680px] overflow-y-auto pr-2">
          
          {/* Side Toggle */}
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveSide('front')} 
              className={`flex-1 py-3 rounded-xl font-bold text-sm cursor-pointer ${activeSide === 'front' ? 'bg-indigo-650 text-white' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-100'}`}
            >
              Front Side
            </button>
            <button 
              onClick={() => setActiveSide('back')} 
              className={`flex-1 py-3 rounded-xl font-bold text-sm cursor-pointer ${activeSide === 'back' ? 'bg-indigo-650 text-white' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-100'}`}
            >
              Back Side (Details)
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5"><Layout className="w-3.5 h-3.5" /> Color Schemes</h4>
            <div className="flex gap-2 flex-wrap">
              {TEMPLATES.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border cursor-pointer hover:bg-zinc-105 transition-all ${selectedTemplate.name === tpl.name ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 font-bold' : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-500'}`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Details input form */}
          <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5" /> Details Fields</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white outline-none text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Job Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white outline-none text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Company Name</label>
                <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white outline-none text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Phone Number</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white outline-none text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white outline-none text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Website URL</label>
                <input type="text" value={website} onChange={e => setWebsite(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white outline-none text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Office Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-zinc-900 dark:text-white outline-none text-xs" />
            </div>

            {/* Logo upload */}
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5" /> Upload Custom Logo</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="w-full text-xs text-zinc-400 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 cursor-pointer focus:border-zinc-350" 
              />
            </div>
          </div>

        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-zinc-50 dark:bg-black/45 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl min-h-[450px]">
          <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
             <span className="text-xs font-bold text-zinc-400">BUSINESS CARD CANVAS (3.5&quot; x 2.0&quot; aspect ratio)</span>
             <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded uppercase">{activeSide} view</span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {/* Draw standard aspect ratio outline */}
            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-1 bg-white dark:bg-zinc-950">
              <canvas 
                ref={canvasRef} 
                width={700} // 3.5 aspect ratio multiplier
                height={400} // 2.0 aspect ratio multiplier
                className="w-[315px] h-[180px] sm:w-[525px] sm:h-[300px]"
              />
            </div>
          </div>

          {/* Export triggers */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
              onClick={downloadPNG}
              className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2 cursor-pointer text-xs"
            >
              <Download className="w-4 h-4" />
              Download Side PNG
            </button>
            
            <button 
              onClick={downloadPDF}
              className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2 cursor-pointer text-xs"
            >
              <FileText className="w-4 h-4" />
              Download Print PDF
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
