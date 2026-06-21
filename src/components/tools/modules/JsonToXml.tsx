"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Code, ArrowRight } from 'lucide-react';
import { Builder } from 'xml2js';

export default function JsonToXml() {
  const [jsonInput, setJsonInput] = useState('{\n  "root": {\n    "item": "value"\n  }\n}');
  const [xmlOutput, setXmlOutput] = useState('');

  const convert = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const builder = new Builder();
      const xml = builder.buildObject(parsed);
      setXmlOutput(xml);
      toast.success('Converted successfully!');
    } catch (e) {
      toast.error('Invalid JSON input');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Code className="w-8 h-8 text-blue-500" />
          JSON to XML Converter
        </h2>
        <p className="text-zinc-500">Instantly convert JSON objects to XML format.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full h-96 p-4 font-mono text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl resize-none outline-none focus:border-blue-500 transition-colors"
          placeholder="Paste JSON here..."
        />
        
        <button 
          onClick={convert}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="Convert"
        >
          <ArrowRight className="w-6 h-6 md:rotate-0 rotate-90" />
        </button>

        <textarea
          value={xmlOutput}
          readOnly
          className="w-full h-96 p-4 font-mono text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl resize-none outline-none"
          placeholder="XML Output will appear here..."
        />
      </div>
    </div>
  );
}
