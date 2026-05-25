"use client";

import React, { useState } from 'react';
import { ClipboardList, ExternalLink, HelpCircle, FileText, CheckSquare, Printer, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FormGuide {
  title: string;
  formNumber: string;
  description: string;
  eligibility: string[];
  documents: {
    category: string;
    options: string[];
  }[];
  nvspLink: string;
}

const FORM_GUIDES: Record<string, FormGuide> = {
  form6: {
    title: 'Form 6 — New Voter Registration',
    formNumber: 'Form 6',
    description: 'Use this form if you are a first-time voter or want to transfer your vote from one constituency to another within India.',
    eligibility: [
      'Must be an Indian Citizen.',
      'Must have attained the age of 18 years on the qualifying date (January 1st, April 1st, July 1st, or October 1st).',
      'Must be an ordinary resident of the polling area where registration is sought.',
    ],
    documents: [
      {
        category: 'Age Proof (Any One)',
        options: [
          'Birth Certificate issued by Municipal Authority',
          'Aadhaar Card showing Date of Birth',
          'PAN Card',
          'Driving License',
          'CBSE/ICSE Class 10/12 Board Marksheet containing Date of Birth',
          'Indian Passport',
        ]
      },
      {
        category: 'Address Proof / Ordinary Residence (Any One)',
        options: [
          'Water/Electricity/Gas connection bill (min 1 year old)',
          'Aadhaar Card showing current address',
          'Current passbook of Nationalized/Scheduled Bank/Post Office',
          'Indian Passport',
          'Revenue Department Land-owning record / Registered Rent Deed',
        ]
      },
      {
        category: 'Photograph',
        options: [
          'Recent passport size color photograph (white background, sizing 3.5cm x 4.5cm)',
        ]
      }
    ],
    nvspLink: 'https://voters.eci.gov.in/',
  },
  form7: {
    title: 'Form 7 — Objection / Deletion of Voter Name',
    formNumber: 'Form 7',
    description: 'Use this form to object to the inclusion of a name in the electoral roll or seek deletion of an existing name (due to death, shifting, or double entry).',
    eligibility: [
      'Any person whose name is already on the electoral roll of that constituency.',
      'Can be submitted for self-deletion or objecting to someone else\'s invalid voter entry in the same polling area.',
    ],
    documents: [
      {
        category: 'Supporting Details (Any One)',
        options: [
          'Death Certificate (in case of seeking deletion of a deceased voter)',
          'Electoral Photo ID Card (EPIC) number of the voter to be deleted',
          'Proof of shifting (if objecting due to voter shifting out)',
        ]
      }
    ],
    nvspLink: 'https://voters.eci.gov.in/',
  },
  form8: {
    title: 'Form 8 — Correction / Shifting / Replacement EPIC',
    formNumber: 'Form 8',
    description: 'Use this form for correction of entries in the existing electoral roll (Name, Age, Photo, Relative Name etc.), shifting of residence (within or outside assembly constituency), or requesting a replacement voter card without corrections.',
    eligibility: [
      'Must already be registered on the electoral roll.',
      'Can be used for: (1) Shifting of Residence, (2) Correction of Entries, (3) Replacement of EPIC without correction, (4) Marking of Person with Disability (PwD).',
    ],
    documents: [
      {
        category: 'Proof for Correction (Depending on selection)',
        options: [
          'For Name/Surname change: Official gazette notification or marriage registration certificate',
          'For Date of Birth change: Aadhaar, Birth Certificate, or Class 10 Marksheet',
          'For Photo correction: Recent color passport photograph',
          'For Address correction: Electricity bill, gas bill, Aadhaar, or Bank Passbook showing new address',
        ]
      },
      {
        category: 'Identity Proof',
        options: [
          'Aadhaar Card (Optional but recommended for linking)',
          'Copy of existing Voter ID Card (EPIC) if available',
        ]
      }
    ],
    nvspLink: 'https://voters.eci.gov.in/',
  }
};

export default function VoterIdHelper() {
  const [selectedForm, setSelectedForm] = useState<'form6' | 'form7' | 'form8'>('form6');
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const currentGuide = FORM_GUIDES[selectedForm];

  const handleToggleChecklist = (item: string) => {
    if (checklistItems.includes(item)) {
      setChecklistItems(checklistItems.filter(i => i !== item));
    } else {
      setChecklistItems([...checklistItems, item]);
      toast.success('Document added to checklist!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 print:bg-white print:text-black">
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 border border-zinc-200 dark:border-white/5 rounded-2xl print:border-none print:bg-transparent">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-indigo-500" />
          Voter ID Registration Helper (ECI)
        </h2>
        <p className="text-sm text-zinc-650 dark:text-zinc-400 mt-1">
          Interactive guide and checklist builder for Election Commission of India (ECI) Forms 6, 7, and 8. Select a form to get started.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl max-w-lg print:hidden">
        {(Object.keys(FORM_GUIDES) as Array<'form6' | 'form7' | 'form8'>).map((key) => (
          <button
            key={key}
            onClick={() => {
              setSelectedForm(key);
              setChecklistItems([]);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              selectedForm === key
                ? 'bg-indigo-650 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            {FORM_GUIDES[key].formNumber}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Information */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl">
          <div className="space-y-2">
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-block">
              {currentGuide.formNumber} Overview
            </span>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{currentGuide.title}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {currentGuide.description}
            </p>
          </div>

          {/* Eligibility checklist */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">
              Eligibility Criteria
            </h4>
            <ul className="space-y-2.5">
              {currentGuide.eligibility.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm text-zinc-650 dark:text-zinc-400">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 print:hidden">
            <a
              href={currentGuide.nvspLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl text-center transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Apply Online via Voter Portal
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={handlePrint}
              className="px-5 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-250 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Checklist
            </button>
          </div>
        </div>

        {/* Right Side: Documents List and Checklists */}
        <div className="space-y-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 p-6 rounded-2xl">
          <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            Required Documents
          </h4>
          
          <p className="text-xs text-zinc-500">
            Check the documents you have ready to compile your checklist.
          </p>

          <div className="space-y-6">
            {currentGuide.documents.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-2">
                <span className="text-xs font-bold text-zinc-650 dark:text-zinc-400 block">
                  {cat.category}
                </span>
                <div className="space-y-2">
                  {cat.options.map((opt, optIdx) => {
                    const isChecked = checklistItems.includes(opt);
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleToggleChecklist(opt)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-start gap-2.5 cursor-pointer ${
                          isChecked
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                            : 'bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <CheckSquare className={`w-4 h-4 mt-0.5 shrink-0 ${isChecked ? 'text-indigo-400 fill-indigo-400/20' : 'text-zinc-400'}`} />
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {checklistItems.length > 0 && (
            <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl space-y-2">
              <span className="text-xs font-bold text-indigo-400 block">Your Checklist Progress</span>
              <div className="text-xs text-zinc-500">
                You have marked <strong>{checklistItems.length}</strong> documents as ready.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl space-y-3 print:hidden">
        <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
          <Info className="w-4 h-4 text-indigo-500" />
          General Submission Flow
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-650 dark:text-zinc-400">
          <div className="p-4 bg-zinc-50 dark:bg-black/35 rounded-xl border border-zinc-200 dark:border-white/5 space-y-1">
            <span className="font-bold text-zinc-800 dark:text-zinc-200 block">1. Form Submission</span>
            <span>Fill and submit the online application on voters.eci.gov.in or Voter Helpline Mobile App.</span>
          </div>
          <div className="p-4 bg-zinc-50 dark:bg-black/35 rounded-xl border border-zinc-200 dark:border-white/5 space-y-1">
            <span className="font-bold text-zinc-800 dark:text-zinc-200 block">2. Field Verification</span>
            <span>A Booth Level Officer (BLO) will visit your residence to verify the submitted details and address proof.</span>
          </div>
          <div className="p-4 bg-zinc-50 dark:bg-black/35 rounded-xl border border-zinc-200 dark:border-white/5 space-y-1">
            <span className="font-bold text-zinc-800 dark:text-zinc-200 block">3. EPIC Card Dispatch</span>
            <span>Once approved, you will receive an SMS and your physical EPIC Voter ID card will be posted to your address.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
