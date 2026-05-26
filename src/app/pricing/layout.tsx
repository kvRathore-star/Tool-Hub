import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "ToolHub Pro — ₹299/month (or $14.99/mo) for unlimited access to 200+ browser-based tools. PDF, image, AI, video, audio tools. Free tier available.",
  openGraph: {
    title: "ToolHub Pricing — Simple & Transparent",
    description: "ToolHub Pro — ₹299/month (or $14.99/mo) for unlimited access to 200+ browser-based tools. PDF, image, AI, video, audio tools. Free tier available.",
  }
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
