const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://toolhub.com';
const OUT_DIR = path.join(__dirname, '../out');
const PUBLIC_DIR = path.join(__dirname, '../public');

function walkDir(dir, relativePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const urls = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    if (entry.name === '_next') continue;

    const fullPath = path.join(dir, entry.name);
    const entryRelative = relativePath ? `${relativePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      urls.push(...walkDir(fullPath, entryRelative));
    } else if (entry.name === 'index.html') {
      urls.push(relativePath || '');
    } else if (entry.name.endsWith('.html') && entry.name !== '404.html') {
      const name = entry.name.replace(/\.html$/, '');
      urls.push(relativePath ? `${relativePath}/${name}` : name);
    }
  }

  return urls;
}

function generateSitemap() {
  console.log('Generating sitemap...');

  if (!fs.existsSync(OUT_DIR)) {
    console.warn('No out/ directory found. Skipping sitemap generation.');
    return;
  }

  const urls = walkDir(OUT_DIR);
  const staticPages = [
    '', 'about', 'ai-hub', 'api', 'blog', 'careers', 'changelog',
    'contact', 'dashboard', 'extension', 'pricing', 'privacy',
    'product', 'roadmap', 'status', 'terms', 'tools',
  ];

  const allUrls = [...new Set([...staticPages, ...urls])].sort();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  xml += `  <url>\n    <loc>${BASE_URL}</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  for (const url of allUrls) {
    if (!url) continue;
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/${url}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  [PUBLIC_DIR, OUT_DIR].forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.writeFileSync(path.join(dir, 'sitemap.xml'), xml, 'utf-8');
    }
  });

  console.log(`Sitemap generated with ${allUrls.length + 1} URLs`);
}

generateSitemap();
