const fs = require('fs');
const path = require('path');

const CSV_FILE = path.join(__dirname, '../tools_list.csv');
const BASE_URL = 'https://toolhub.com';

function generateSitemap() {
  console.log('Generating sitemap...');
  
  const csvData = fs.readFileSync(CSV_FILE, 'utf-8');
  const lines = csvData.split('\n').filter(line => line.trim() !== '');
  
  // Skip header
  const rows = lines.slice(1);
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Add homepage
  xml += `  <url>\n`;
  xml += `    <loc>${BASE_URL}</loc>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  rows.forEach(row => {
    const columns = row.split(',');
    if (columns.length < 2) return;
    
    const name = columns[0].trim();
    const categoryRaw = columns[1].trim();
    
    const category = categoryRaw.toLowerCase().replace(/\s+/g, '-');
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/${category}/${slug}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  // Ensure directories exist
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const outDir = path.join(__dirname, '../out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Write to public for future dev/builds
  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), xml, 'utf-8');
  // Write to out for immediate deployment
  fs.writeFileSync(path.join(__dirname, '../out/sitemap.xml'), xml, 'utf-8');
  
  console.log(`Successfully generated sitemap with ${rows.length + 1} URLs at public/sitemap.xml and out/sitemap.xml`);
}

generateSitemap();
