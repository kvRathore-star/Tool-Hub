import { notFound } from "next/navigation";
import { toolsRegistry, getToolByCategoryAndSlug } from "@/registry/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { DynamicModuleWrapper } from "@/components/tools/modules/DynamicModuleWrapper";
import { ToolErrorBoundary } from "@/components/ToolErrorBoundary";
import { MemoryWatchdog } from "@/hooks/useMemoryWatchdog";

export async function generateStaticParams() {
  return toolsRegistry.map((tool) => ({
    category: tool.category.toLowerCase().replace(/\s+/g, '-'),
    tool: tool.slug,
  }));
}

export async function generateMetadata(props: { params: Promise<{ category: string; tool: string }> }) {
  const params = await props.params;
  const toolMetadata = getToolByCategoryAndSlug(params.category, params.tool);
  
  if (!toolMetadata) return { title: 'Not Found' };

  return {
    title: `${toolMetadata.name} - Free Online Tool | ToolHub`,
    description: `Use the free online ${toolMetadata.name} tool. ${toolMetadata.description}. 100% secure, fast, and processed entirely on your device.`,
    keywords: `${toolMetadata.name.toLowerCase()}, free online ${toolMetadata.name.toLowerCase()}, ${toolMetadata.category.toLowerCase()} tool`,
    openGraph: {
      title: `${toolMetadata.name} - Free Online Tool`,
      description: toolMetadata.description,
      type: 'website',
    }
  };
}

export default async function ToolPage(props: { params: Promise<{ category: string; tool: string }> }) {
  const params = await props.params;
  const toolMetadata = getToolByCategoryAndSlug(params.category, params.tool);

  if (!toolMetadata) {
    notFound();
  }

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    "name": toolMetadata.name,
    "description": toolMetadata.description,
    "applicationCategory": "BrowserApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <ToolLayout
        title={toolMetadata.name}
        description={toolMetadata.description}
        category={params.category}
        slug={toolMetadata.slug}
      >
        <MemoryWatchdog />
        <ToolErrorBoundary>
          <DynamicModuleWrapper slug={toolMetadata.slug} category={toolMetadata.category} />
        </ToolErrorBoundary>
      </ToolLayout>
    </>
  );
}
