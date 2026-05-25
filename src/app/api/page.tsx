"use client";

import React, { useState } from "react";
import { 
  Code2, 
  Terminal, 
  Key, 
  Copy, 
  Check, 
  Play, 
  ArrowRight,
  Database,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ENDPOINTS = {
  pdfCompress: {
    name: "Compress PDF",
    path: "/v1/pdf/compress",
    method: "POST",
    params: { ratio: "0.6" },
    curl: `curl -X POST "https://api.toolhub.com/v1/pdf/compress" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@/path/to/doc.pdf" \\
  -F "compression_ratio=0.6"`,
    node: `const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const data = new FormData();
data.append('file', fs.createReadStream('/path/to/doc.pdf'));
data.append('compression_ratio', '0.6');

axios.post('https://api.toolhub.com/v1/pdf/compress', data, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    ...data.getHeaders()
  }
}).then(res => console.log(res.data));`,
    python: `import requests

files = {'file': open('/path/to/doc.pdf', 'rb')}
data = {'compression_ratio': '0.6'}
headers = {'Authorization': 'Bearer YOUR_API_KEY'}

response = requests.post(
    'https://api.toolhub.com/v1/pdf/compress', 
    headers=headers, 
    files=files, 
    data=data
)
print(response.json())`,
    response: `{
  "status": "success",
  "task_id": "task_pdf_81829a8f",
  "original_size_bytes": 1048576,
  "compressed_size_bytes": 419430,
  "ratio": "0.40",
  "download_url": "https://api.toolhub.com/downloads/compressed_81829a8f.pdf"
}`
  },
  removeBg: {
    name: "Remove Background",
    path: "/v1/image/remove-bg",
    method: "POST",
    params: { format: "png" },
    curl: `curl -X POST "https://api.toolhub.com/v1/image/remove-bg" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@/path/to/photo.jpg" \\
  -F "output_format=png"`,
    node: `const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const data = new FormData();
data.append('image', fs.createReadStream('/path/to/photo.jpg'));
data.append('output_format', 'png');

axios.post('https://api.toolhub.com/v1/image/remove-bg', data, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    ...data.getHeaders()
  }
}).then(res => console.log(res.data));`,
    python: `import requests

files = {'image': open('/path/to/photo.jpg', 'rb')}
data = {'output_format': 'png'}
headers = {'Authorization': 'Bearer YOUR_API_KEY'}

response = requests.post(
    'https://api.toolhub.com/v1/image/remove-bg', 
    headers=headers, 
    files=files, 
    data=data
)
print(response.json())`,
    response: `{
  "status": "success",
  "task_id": "task_bg_9281ba82",
  "output_format": "png",
  "dimensions": { "width": 1920, "height": 1080 },
  "download_url": "https://api.toolhub.com/downloads/nobg_9281ba82.png"
}`
  },
  humanizeText: {
    name: "Humanize Text",
    path: "/v1/text/humanize",
    method: "POST",
    params: { complexity: "medium" },
    curl: `curl -X POST "https://api.toolhub.com/v1/text/humanize" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Artificial intelligence content here", "complexity": "medium"}'`,
    node: `const axios = require('axios');

axios.post('https://api.toolhub.com/v1/text/humanize', {
  text: "Artificial intelligence content here",
  complexity: "medium"
}, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
}).then(res => console.log(res.data));`,
    python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}
json_data = {
    'text': 'Artificial intelligence content here',
    'complexity': 'medium'
}

response = requests.post(
    'https://api.toolhub.com/v1/text/humanize', 
    headers=headers, 
    json=json_data
)
print(response.json())`,
    response: `{
  "status": "success",
  "original_length": 37,
  "humanized_length": 42,
  "humanized_text": "Here is a simplified and natural rendering of your text.",
  "ai_score_probability": 0.04
}`
  }
};

type EndpointKey = keyof typeof ENDPOINTS;

export default function ApiDocsPage() {
  const [apiKey, setApiKey] = useState("th_live_click_generate_below");
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeLang, setActiveLang] = useState<"curl" | "node" | "python">("curl");
  const [activeEndpoint, setActiveEndpoint] = useState<EndpointKey>("pdfCompress");
  const [sandboxApiKey, setSandboxApiKey] = useState("");
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxOutput, setSandboxOutput] = useState<string>("// Sandbox terminal idle. Press Run Sandbox Request above.");
  const [copiedCode, setCopiedCode] = useState(false);

  const handleGenerateKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let keyString = "th_live_";
    for (let i = 0; i < 32; i++) {
      keyString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setApiKey(keyString);
    setSandboxApiKey(keyString);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRunSandbox = () => {
    if (!sandboxApiKey || sandboxApiKey === "th_live_click_generate_below") {
      setSandboxOutput("❌ Error: Invalid API key. Please generate/insert your th_live_ key.");
      return;
    }
    setSandboxLoading(true);
    setSandboxOutput(`$ Connecting to API Gateway...\n$ Authorizing credentials: ${sandboxApiKey.substring(0, 12)}...\n$ Resolving endpoint: ${ENDPOINTS[activeEndpoint].path}`);
    
    setTimeout(() => {
      setSandboxOutput((prev) => 
        prev + `\n$ Sending payload options: ${JSON.stringify(ENDPOINTS[activeEndpoint].params)}\n$ Receiving packet stream...\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n` + ENDPOINTS[activeEndpoint].response
      );
      setSandboxLoading(false);
    }, 1500);
  };

  const currentCode = ENDPOINTS[activeEndpoint][activeLang].replace("YOUR_API_KEY", apiKey);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      
      {/* Background Grids */}
      <div className="absolute inset-0 z-0 flex justify-center pointer-events-none opacity-[0.03]">
        <div className="w-full max-w-[1280px] h-full" style={{ backgroundImage: "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--accent)] mb-6">
            <Code2 className="w-3.5 h-3.5" /> ToolHub API Platform
          </div>
          <h1 className="font-[family-name:var(--font-serif)] text-5xl sm:text-7xl mb-6 tracking-tight leading-tight">
            Developer Documentation
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)]">
            Integrate our high-performance client-side media and PDF transformations into your own local pipelines and servers with simple endpoints.
          </p>
        </div>

        {/* API Credentials Manager */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-2xl)] p-6 sm:p-10 mb-16 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Key className="w-5 h-5 text-[var(--accent)]" /> Your Developer Sandbox Credentials
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Generate a simulated token to test sandbox requests right from your browser.
              </p>
            </div>
            <Button onClick={handleGenerateKey} className="shrink-0 gap-2">
              <Sparkles className="w-4 h-4" /> Generate API Key
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-3 bg-[var(--bg-overlay)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] px-4 py-3 font-mono text-sm overflow-hidden select-all">
            <span className="text-[var(--text-muted)] shrink-0">API_KEY:</span>
            <span className="text-[var(--text-primary)] truncate flex-1">{apiKey}</span>
            <button 
              onClick={handleCopyKey} 
              className="p-1.5 rounded bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white transition-colors"
            >
              {copiedKey ? <Check className="w-4 h-4 text-[var(--success)]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Interactive Shell & Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
          
          {/* Endpoint selector and code viewer */}
          <div className="lg:col-span-7 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-2xl)] p-6 sm:p-8 flex flex-col min-h-[580px]">
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 mb-6">
              <div className="flex gap-2">
                {Object.keys(ENDPOINTS).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveEndpoint(key as EndpointKey)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      activeEndpoint === key 
                      ? "bg-[var(--accent)] text-white" 
                      : "bg-[var(--bg-overlay)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {ENDPOINTS[key as EndpointKey].name}
                  </button>
                ))}
              </div>

              {/* Language Selector */}
              <div className="flex bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-0.5 text-[11px] font-mono">
                <button onClick={() => setActiveLang("curl")} className={`px-2.5 py-1 rounded transition-colors ${activeLang === "curl" ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:text-white"}`}>cURL</button>
                <button onClick={() => setActiveLang("node")} className={`px-2.5 py-1 rounded transition-colors ${activeLang === "node" ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:text-white"}`}>Node.js</button>
                <button onClick={() => setActiveLang("python")} className={`px-2.5 py-1 rounded transition-colors ${activeLang === "python" ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:text-white"}`}>Python</button>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-sm border border-emerald-500/20 font-bold">
                    {ENDPOINTS[activeEndpoint].method}
                  </span>
                  <code className="text-sm font-mono text-[var(--text-primary)]">{ENDPOINTS[activeEndpoint].path}</code>
                </div>
                <button 
                  onClick={() => handleCopyCode(currentCode)}
                  className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-[var(--success)]" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Code
                </button>
              </div>

              <div className="bg-[var(--bg-overlay)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-5 font-mono text-xs text-[var(--text-secondary)] overflow-x-auto whitespace-pre leading-relaxed flex-1">
                {currentCode}
              </div>
            </div>

          </div>

          {/* Simulated API Sandbox Terminal */}
          <div className="lg:col-span-5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-2xl)] p-6 sm:p-8 flex flex-col min-h-[580px] justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-5 h-5 text-[var(--accent)]" />
                <h3 className="text-lg font-semibold">API Sandbox Terminal</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mb-6">
                Input your generated API token below and execute simulated client requests.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[var(--text-muted)] tracking-wider mb-1.5">Sandbox Token</label>
                  <input
                    type="password"
                    value={sandboxApiKey}
                    onChange={(e) => setSandboxApiKey(e.target.value)}
                    placeholder="th_live_..."
                    className="w-full bg-[var(--bg-base)] text-xs border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-mono"
                  />
                </div>

                <Button 
                  onClick={handleRunSandbox} 
                  disabled={sandboxLoading}
                  className="w-full gap-2 text-xs py-2 h-auto"
                >
                  {sandboxLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Executing Pipeline...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Run Sandbox Request
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Console Output Screen */}
            <div className="flex-1 bg-[var(--bg-overlay)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-4 font-mono text-[10px] text-[var(--text-muted)] overflow-y-auto leading-relaxed h-[280px] whitespace-pre-wrap select-all">
              {sandboxOutput}
            </div>

          </div>

        </div>

        {/* Global Infrastructure Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-6">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm mb-1">Global Scale CDN</h4>
            <p className="text-xs text-[var(--text-secondary)]">Edge network response caching routing pipelines instantly near you.</p>
          </div>

          <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Key className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm mb-1">Encrypted Payload Gate</h4>
            <p className="text-xs text-[var(--text-secondary)]">Zero retention of parameters. SSL-secured data processing tunnels.</p>
          </div>

          <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm mb-1">Local Sandboxing SDK</h4>
            <p className="text-xs text-[var(--text-secondary)]">Optionally pack compiler into Docker to run api offline inside local VPS.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
