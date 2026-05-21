"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as jose from 'jose';

interface PremiumContextType {
  isPro: boolean;
  verifyLicense: (token: string) => Promise<boolean>;
}

const PremiumContext = createContext<PremiumContextType>({ 
  isPro: false, 
  verifyLicense: async () => false 
});

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('toolhub_pro_token');
    if (token) {
      verifyLicense(token).then(valid => setIsPro(valid));
    }
  }, []);

  const verifyLicense = async (token: string) => {
    try {
      const claims = jose.decodeJwt(token);
      
      if (claims && claims.tier === 'pro') {
        const isExpired = claims.exp && claims.exp < Date.now() / 1000;
        if (!isExpired) {
          localStorage.setItem('toolhub_pro_token', token);
          setIsPro(true);
          return true;
        }
      }
      return false;
    } catch (e) {
      console.error("Invalid License Signature");
      return false;
    }
  };

  return (
    <PremiumContext.Provider value={{ isPro, verifyLicense }}>
      {children}
    </PremiumContext.Provider>
  );
}

export const usePremium = () => useContext(PremiumContext);
