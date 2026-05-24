import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | ToolHub",
  description: "Simple, transparent pricing for individuals and teams.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
