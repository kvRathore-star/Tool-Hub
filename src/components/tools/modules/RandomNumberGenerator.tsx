"use client";
import React, { useState } from 'react';
import AiSettings from '../AiSettings';
export default function RandomNumberGenerator() {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <AiSettings />
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold">Random Number Generator</h2>
        <p className="text-zinc-500">Generate random numbers in range</p>
      </div>
    </div>
  );
}