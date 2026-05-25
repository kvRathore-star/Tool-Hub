"use client";
import React, { useState } from 'react';
export default function PhotoRetoucher() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold">Photo Retoucher</h2>
        <p className="text-zinc-500">Retouch photos automatically</p>
      </div>
    </div>
  );
}