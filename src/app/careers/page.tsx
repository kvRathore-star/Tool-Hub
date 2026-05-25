"use client";

import React, { useState } from "react";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  X, 
  ChevronRight, 
  Send,
  Sparkles,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobRole {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
}

const ROLES: JobRole[] = [
  {
    id: "frontend-wasm",
    title: "Senior Frontend & WebAssembly Engineer",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "$120k – $160k",
    description: "Lead the compilation and architecture of ToolHub's next-generation client-side tool modules. You will build and optimize Rust/C++ tools exported to WebAssembly and integrate them into Next.js.",
    requirements: [
      "5+ years developer experience with TypeScript, React, and Next.js.",
      "Hands-on experience compiling C/C++ or Rust to WebAssembly (Emscripten / wasm-bindgen).",
      "Deep understanding of browser performance profiling, memory profiling, and Worker threads.",
      "Passionate about privacy-first and local-first software concepts."
    ]
  },
  {
    id: "product-designer",
    title: "Lead Product Designer (Web Apps)",
    department: "Design",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "$90k – $120k",
    description: "Own the UI/UX architecture of all 224+ tools. You will create highly aesthetic dark/light interface palettes, design custom SVG vectors, and build elegant layout paradigms that make complex utilities feel simple.",
    requirements: [
      "4+ years designing high-fidelity dashboards and responsive interfaces.",
      "Expert knowledge of Figma, component libraries, and custom styling systems.",
      "Ability to translate functional requirements (e.g. video trimmer, audio converter) into intuitive canvases.",
      "Strong coding foundation in HTML, CSS, and basic JavaScript layouts is a major plus."
    ]
  },
  {
    id: "dev-advocate",
    title: "Developer Relations Advocate",
    department: "Marketing / Advocacy",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "$80k – $110k",
    description: "Help engineers globally understand the capabilities of browser-based processing. You will author articles, build demo guides, maintain Github code repos, and communicate ToolHub's privacy philosophy.",
    requirements: [
      "3+ years technical writing, blogging, or software developer advocacy experience.",
      "Proficiency with JavaScript and modern frontend frameworks.",
      "Active presence in tech communities (GitHub, Twitter, Reddit).",
      "Excellent written and verbal communication skills."
    ]
  }
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<JobRole | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    portfolio: "",
    resume: "",
    cover: ""
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.resume) {
      alert("Please fill in all required fields.");
      return;
    }

    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 1500);
  };

  const handleClose = () => {
    setSelectedJob(null);
    setFormSubmitted(false);
    setFormData({
      name: "",
      email: "",
      portfolio: "",
      resume: "",
      cover: ""
    });
  };

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
            <Briefcase className="w-3.5 h-3.5" /> Work With Us
          </div>
          <h1 className="font-[family-name:var(--font-serif)] text-5xl sm:text-7xl mb-6 tracking-tight leading-tight">
            Build the local web.
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)]">
            We are building a future where developer, image, and text operations compile directly inside user clients. Join our fully remote open source advocacy and design engine.
          </p>
        </div>

        {/* Culture highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-5xl mx-auto">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-6">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base mb-2">100% Remote First</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Work from anywhere in the world. Set your own hours and coordinate asynchronously.</p>
          </div>

          <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base mb-2">Work-Life Harmony</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">No arbitrary deadlines or grind culture. We value mental clarity and consistent, high-quality output.</p>
          </div>

          <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base mb-2">Open Source Focus</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">We contribute deeply to open WebAssembly compilers, leaving a legacy of free utilities for all.</p>
          </div>
        </div>

        {/* Roles List */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold border-b border-[var(--border-subtle)] pb-4 mb-8">Open Roles</h2>
          
          {ROLES.map((job) => (
            <div 
              key={job.id} 
              className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 rounded-[var(--radius-2xl)] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group transition-all duration-300"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded text-[var(--text-secondary)]">
                    {job.department}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400">
                    {job.type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {job.title}
                </h3>
                <div className="flex gap-4 text-xs text-[var(--text-muted)] mt-2 font-mono">
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                </div>
              </div>

              <Button onClick={() => setSelectedJob(job)} className="gap-1 shrink-0 text-xs py-2 px-4 h-auto">
                View & Apply <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Job Details Application Modal/Sidebar Overlay */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-[var(--bg-elevated)] border-l border-[var(--border-subtle)] h-full overflow-y-auto p-6 sm:p-10 shadow-2xl flex flex-col justify-between">
              
              <div>
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold">Job Specification</span>
                  <button 
                    onClick={handleClose} 
                    className="p-1 rounded bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Job Info */}
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-semibold mb-2">{selectedJob.title}</h2>
                  <div className="flex flex-wrap gap-4 text-xs text-[var(--text-secondary)] font-mono">
                    <span>Dept: {selectedJob.department}</span>
                    <span>Type: {selectedJob.type}</span>
                    <span>Range: {selectedJob.salary}</span>
                  </div>
                  
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-6">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Job Requirements */}
                <div className="mb-10">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-4">Requirements</h4>
                  <ul className="space-y-3">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-2" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Application Form */}
                <div className="border-t border-[var(--border-subtle)] pt-8">
                  <h3 className="text-lg font-semibold mb-6">Apply for this role</h3>
                  
                  {formSubmitted ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[var(--radius-xl)] p-6 text-center text-emerald-400">
                      <Sparkles className="w-10 h-10 mx-auto mb-4" />
                      <h4 className="font-semibold text-base">Application Received!</h4>
                      <p className="text-xs mt-1 text-emerald-400/80">
                        Thank you for applying for the {selectedJob.title} role. We will review your links and get back to you shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-4">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider mb-1.5">Full Name *</label>
                          <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="John Doe"
                            className="w-full bg-[var(--bg-base)] text-xs border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider mb-1.5">Email Address *</label>
                          <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="john@example.com"
                            className="w-full bg-[var(--bg-base)] text-xs border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider mb-1.5">Portfolio or GitHub URL</label>
                        <input 
                          type="url" 
                          value={formData.portfolio}
                          onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                          placeholder="https://github.com/username"
                          className="w-full bg-[var(--bg-base)] text-xs border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider mb-1.5">Paste Resume Text / Link *</label>
                        <textarea 
                          required
                          rows={4}
                          value={formData.resume}
                          onChange={(e) => setFormData({...formData, resume: e.target.value})}
                          placeholder="Paste resume content or link to Google Drive/PDF file..."
                          className="w-full bg-[var(--bg-base)] text-xs border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-sans" 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider mb-1.5">Cover Letter Note</label>
                        <textarea 
                          rows={3}
                          value={formData.cover}
                          onChange={(e) => setFormData({...formData, cover: e.target.value})}
                          placeholder="Tell us why you want to work on client-side sandboxing..."
                          className="w-full bg-[var(--bg-base)] text-xs border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-sans" 
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={formLoading}
                        className="w-full gap-2 text-xs py-2 h-auto"
                      >
                        {formLoading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting application...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" /> Submit Application
                          </>
                        )}
                      </Button>

                    </form>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-[var(--text-muted)] text-center border-t border-[var(--border-subtle)] pt-4 mt-6">
                ToolHub is an Equal Opportunity Employer. Remote telemetry processed client-side.
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
