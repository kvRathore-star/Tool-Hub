import { ToolsDirectoryClient } from "@/components/tools/ToolsDirectoryClient";

export const metadata = {
  title: "Browse 200+ Free Online Tools",
  description: "Explore ToolHub's extensive ecosystem of 200+ offline-first web utilities. Compress images, modify PDFs, format code, and convert files safely in your browser.",
  keywords: "free online tools, utilities, image compress, pdf tools, developer tools, local tools, privacy-first tools",
};

export default async function ToolsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const categoryParam = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  
  return (
    <ToolsDirectoryClient initialCategory={categoryParam} />
  );
}
