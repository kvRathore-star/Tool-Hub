"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const SkeletonLoader = () => (
  <div className="w-full bg-zinc-900/50 rounded-2xl border border-white/5 p-8 animate-pulse flex flex-col items-center justify-center min-h-[400px]">
    <div className="w-16 h-16 rounded-full bg-zinc-800/80 mb-6"></div>
    <div className="h-6 bg-zinc-800/80 rounded-md w-1/3 mb-4"></div>
    <div className="h-4 bg-zinc-800/80 rounded-md w-1/2 mb-8"></div>
    <div className="w-full h-12 bg-zinc-800/80 rounded-xl mb-4"></div>
    <div className="w-full h-12 bg-zinc-800/80 rounded-xl"></div>
    <div className="mt-8 text-sm text-zinc-500 font-medium animate-bounce">
      Spinning up client-side modules...
    </div>
  </div>
);

const MODULE_REGISTRY: Record<string, any> = {
  'passport-photo-india': dynamic(() => import('@/components/tools/modules/PassportPhotoIndia'), { 
    ssr: false, 
    loading: () => <SkeletonLoader /> 
  }),
  'aadhaar-wallet-cropper': dynamic(() => import('@/components/tools/modules/AadhaarMasker'), { 
    ssr: false,
    loading: () => <SkeletonLoader /> 
  }),
  'kb-image-compressor': dynamic(() => import('@/components/tools/modules/KbImageCompressor'), { 
    ssr: false,
    loading: () => <SkeletonLoader /> 
  }),
};

const GenericImageProcessor = dynamic(() => import('@/components/tools/modules/GenericImageProcessor'), { ssr: false, loading: () => <SkeletonLoader /> });
const GenericPDFProcessor = dynamic(() => import('@/components/tools/modules/GenericPDFProcessor'), { ssr: false, loading: () => <SkeletonLoader /> });
const UniversalTransformer = dynamic(() => import('@/components/tools/modules/UniversalTransformer'), { ssr: false, loading: () => <SkeletonLoader /> });

export function DynamicModuleWrapper({ slug, category }: { slug: string, category: string }) {
  let DynamicModule = MODULE_REGISTRY[slug];
  
  if (!DynamicModule) {
    if (category === 'Image') {
      DynamicModule = GenericImageProcessor;
    } else if (category === 'PDF') {
      DynamicModule = GenericPDFProcessor;
    } else {
      DynamicModule = UniversalTransformer;
    }
  }

  return <DynamicModule />;
}
