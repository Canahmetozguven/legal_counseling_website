import { createSitemap } from 'sitemap';
import fs from 'fs';
import path from 'path';

/**
 * Generate a sitemap for the website
 * This should be run during the build process
 */
const generateSitemap = async () => {
  try {
    // Get site domain from environment variable or use default
    const siteDomain = process.env.SITE_DOMAIN || 'https://mustiattorneys.com';

    // Define static routes - these should match your React Router routes
    const staticRoutes = [
      { url: '/', changefreq: 'weekly', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      { url: '/contact', changefreq: 'monthly', priority: 0.8 },
      { url: '/practice-areas', changefreq: 'monthly', priority: 0.9 },
      { url: '/blog', changefreq: 'weekly', priority: 0.8 },
    ];

    // Create sitemap object
    const sitemap = createSitemap({
      hostname: siteDomain,
      urls: staticRoutes,
    });

    // Write sitemap to file
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap.toString());

    console.log(`Sitemap generated at ${sitemapPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

// You can export this function to be used in build scripts
export default generateSitemap;

// If this script is run directly (e.g., with Node.js)
if (require.main === module) {
  generateSitemap().catch(console.error);
}
