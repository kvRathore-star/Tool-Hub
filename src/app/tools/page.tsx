import { Suspense } from "react";
import { ToolsDirectoryClient } from "@/components/tools/ToolsDirectoryClient";

export const metadata = {
  title: "Browse 200+ Free Online Tools | ToolHub",
  description: "Explore ToolHub's extensive ecosystem of 200+ offline-first web utilities. Compress images, modify PDFs, format code, and convert files safely in your browser.",
  keywords: "free online tools, utilities, image compress, pdf tools, developer tools, local tools, privacy-first tools",
};

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)]" />}>
      <ToolsDirectoryClient />
    </Suspense>
  );
}
