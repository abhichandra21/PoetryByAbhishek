import { writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read poems data
const poemsData = readFileSync(join(__dirname, '..', 'src', 'data', 'poems.json'), 'utf8')
const poems = JSON.parse(poemsData)

const baseUrl = 'https://poetrybyabhishek.netlify.app'

// Generate sitemap XML
const generateSitemap = () => {
  const now = new Date().toISOString()
  
  // Static pages
  const staticPages = [
    { url: '', changefreq: 'weekly', priority: '1.0' },
    { url: '/poems', changefreq: 'weekly', priority: '0.9' },
    { url: '/about', changefreq: 'monthly', priority: '0.7' },
    { url: '/contact', changefreq: 'monthly', priority: '0.6' },
    { url: '/subscribe', changefreq: 'monthly', priority: '0.6' }
  ]
  
  // Dynamic poem pages
  const poemPages = poems.map(poem => ({
    url: `/poem/${poem.id}`,
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: poem.dateWritten || now
  }))
  
  const allPages = [...staticPages, ...poemPages]
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  // Write to public directory
  const publicDir = join(__dirname, '..', 'public')
  writeFileSync(join(publicDir, 'sitemap.xml'), sitemap)
  
  console.log(`✅ Sitemap generated with ${allPages.length} URLs`)
  console.log(`📍 Location: public/sitemap.xml`)
}

generateSitemap()