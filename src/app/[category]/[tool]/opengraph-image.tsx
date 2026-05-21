import { ImageResponse } from 'next/og';
import { getToolByCategoryAndSlug, toolsRegistry } from "@/registry/tools";

export async function generateStaticParams() {
  return toolsRegistry.map((tool) => ({
    category: tool.category.toLowerCase().replace(/\s+/g, '-'),
    tool: tool.slug,
  }));
}

export const alt = 'ToolHub - Privacy-First Web Utilities';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image(props: { params: Promise<{ category: string; tool: string }> }) {
  const params = await props.params;
  const toolMetadata = getToolByCategoryAndSlug(params.category, params.tool);

  if (!toolMetadata) {
    return new Response('Not Found', { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#020617', // Tailwinds zinc-950
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '64px',
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            backgroundImage: 'linear-gradient(to right, #38bdf8, #818cf8)',
            backgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            marginBottom: '32px'
          }}
        >
          {toolMetadata.name}
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#cbd5e1', // zinc-300
            textAlign: 'center',
            maxWidth: '85%',
            lineHeight: 1.4
          }}
        >
          {toolMetadata.description}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 64,
            display: 'flex',
            alignItems: 'center',
            fontSize: 28,
            color: '#64748b' // zinc-500
          }}
        >
          <span style={{ fontWeight: 'bold', color: '#f8fafc' }}>ToolHub</span>
          <span style={{ margin: '0 24px' }}>|</span>
          <span style={{ color: '#38bdf8' }}>{toolMetadata.category}</span>
          <span style={{ margin: '0 24px' }}>|</span>
          <span>Zero-Knowledge Processing</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
