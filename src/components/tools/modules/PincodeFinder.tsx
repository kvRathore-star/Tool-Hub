"use client";

import React, { useState } from 'react';
import { Search, MapPin, Loader2, AlertCircle, Eye, Info, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PincodeFinder() {
  const [searchMode, setSearchMode] = useState<'pincode' | 'postoffice'>('pincode');
  const [pincode, setPincode] = useState('');
  const [officeName, setOfficeName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[] | null>(null);

  const handleSearch = async () => {
    setError(null);
    setResults(null);

    if (searchMode === 'pincode') {
      const cleanPincode = pincode.trim();
      if (!cleanPincode) {
        toast.error('Please enter a Pincode');
        return;
      }
      if (!/^\d{6}$/.test(cleanPincode)) {
        setError('Pincode must be exactly 6 digits (e.g. 110001).');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPincode}`);
        if (!response.ok) throw new Error('API server returned an error.');
        const json = (await response.json()) as any;
        const postOffices = json[0]?.PostOffice;
        const status = json[0]?.Status;

        if (status === 'Success' && postOffices) {
          setResults(postOffices);
          toast.success(`Found ${postOffices.length} branches!`);
        } else {
          setError(json[0]?.Message || 'No post offices found for this pincode.');
        }
      } catch (err) {
        setError('Failed to fetch pincode details. Please verify your connection and try again.');
      } finally {
        setLoading(false);
      }
    } else {
      const cleanName = officeName.trim();
      if (!cleanName || cleanName.length < 3) {
        toast.error('Please enter at least 3 characters of the Post Office name');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(cleanName)}`);
        if (!response.ok) throw new Error('API server returned an error.');
        const json = (await response.json()) as any;
        const postOffices = json[0]?.PostOffice;
        const status = json[0]?.Status;

        if (status === 'Success' && postOffices) {
          setResults(postOffices);
          toast.success(`Found ${postOffices.length} matching branches!`);
        } else {
          setError(json[0]?.Message || 'No post offices found matching this name.');
        }
      } catch (err) {
        setError('Failed to fetch post office details. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getPincodeBreakdown = (pinStr: string) => {
    if (pinStr.length !== 6) return null;
    const region = pinStr[0];
    const subRegion = pinStr[1];
    const sortingDistrict = pinStr[2];
    const office = pinStr.substring(3);
    return { region, subRegion, sortingDistrict, office };
  };

  const currentPincode = searchMode === 'pincode' ? pincode : results?.[0]?.Pincode || '';
  const breakdown = currentPincode.length === 6 ? getPincodeBreakdown(currentPincode) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 border border-zinc-200 dark:border-white/5 rounded-2xl">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-indigo-500" />
          India Pincode & Branch Finder
        </h2>
        <p className="text-sm text-zinc-650 dark:text-zinc-400 mt-1">
          Search details by pincode or lookup pincodes by Post Office/Branch name across India. Free official postal API integration.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl max-w-sm">
        <button
          onClick={() => {
            setSearchMode('pincode');
            setError(null);
            setResults(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            searchMode === 'pincode'
              ? 'bg-indigo-650 text-white shadow-sm'
              : 'text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Search by Pincode
        </button>
        <button
          onClick={() => {
            setSearchMode('postoffice');
            setError(null);
            setResults(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            searchMode === 'postoffice'
              ? 'bg-indigo-650 text-white shadow-sm'
              : 'text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Search by Branch Name
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
        <div className="space-y-2">
          {searchMode === 'pincode' ? (
            <>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Enter 6-Digit Pincode
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 110001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 bg-zinc-50 dark:bg-black border-2 border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-lg font-mono tracking-widest text-zinc-900 dark:text-white outline-none"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-indigo-650 hover:bg-indigo-600 disabled:bg-indigo-800/50 text-white font-bold px-6 rounded-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  Search
                </button>
              </div>
            </>
          ) : (
            <>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Enter Post Office / City Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Connaught Place"
                  value={officeName}
                  onChange={(e) => setOfficeName(e.target.value)}
                  className="flex-1 bg-zinc-50 dark:bg-black border-2 border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-indigo-650 hover:bg-indigo-600 disabled:bg-indigo-800/50 text-white font-bold px-6 rounded-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  Search
                </button>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 animate-in fade-in duration-300">
            <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-rose-400">Search Error</h4>
              <p className="text-sm text-zinc-650 dark:text-zinc-400 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* PIN Code Structure Breakdown */}
        {breakdown && (
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-xl space-y-4">
            <div className="flex items-center gap-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <Info className="w-4 h-4 text-indigo-500" />
              Pincode Structure Analysis ({currentPincode})
            </div>
            
            <div className="flex justify-center text-center gap-1 font-mono text-xl font-bold p-3 bg-white dark:bg-black/50 rounded-lg border border-zinc-200 dark:border-white/5">
              <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded">
                <span className="text-indigo-400 block">{breakdown.region}</span>
                <span className="text-[8px] text-zinc-500 uppercase block mt-1">Region</span>
              </div>
              <div className="px-2 py-1 bg-rose-500/10 border border-rose-500/20 rounded">
                <span className="text-rose-400 block">{breakdown.subRegion}</span>
                <span className="text-[8px] text-zinc-500 uppercase block mt-1">Sub-Reg</span>
              </div>
              <div className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded">
                <span className="text-amber-400 block">{breakdown.sortingDistrict}</span>
                <span className="text-[8px] text-zinc-500 uppercase block mt-1">Sorting</span>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded flex-1">
                <span className="text-emerald-400 block tracking-widest">{breakdown.office}</span>
                <span className="text-[8px] text-zinc-500 uppercase block mt-1">Post Office Route</span>
              </div>
            </div>
          </div>
        )}

        {/* Results grid */}
        {results && results.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              Branches Found ({results.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
              {results.map((office: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-150 text-sm block">
                        {office.Name}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${office.DeliveryStatus === 'Delivery' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {office.DeliveryStatus}
                      </span>
                    </div>
                    <span className="text-zinc-500 block">Type: {office.BranchType}</span>
                  </div>

                  <div className="space-y-1 text-zinc-650 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-2">
                    <span className="block">Pincode: <strong className="font-mono text-indigo-400">{office.Pincode}</strong></span>
                    <span className="block">District: {office.District}</span>
                    <span className="block">Circle: {office.Circle}</span>
                    <span className="block">State: {office.State}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
