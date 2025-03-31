// This script generates a sitemap.xml file for the website
const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function fetchDynamicRoutes() {
  try {
    // Replace with your API endpoints that return dynamic content
    // You can comment these out and use empty arrays until your API is ready
    const blogResponse = await axios.get('http://localhost:5000/api/blog/published');
    const blogs = blogResponse.data.data || [];
    
    const practiceAreasResponse = await axios.get('http://localhost:5000/api/practice-areas');
    const practiceAreas = practiceAreasResponse.data.data.practiceAreas || [];
    
    return {
      blogs,
      practiceAreas
    };
  } catch (error) {
    console.warn('Warning: Could not fetch dynamic routes. Using empty arrays instead.', error.message);
    return {
      blogs: [],
      practiceAreas: []
    };
  }
}

async function generateSitemap() {
  try {
    // Base URL from environment or default
    const hostname = process.env.SITE_URL || 'https://mustiattorneys.com';
    
    // Static routes
    const staticRoutes = [
      { url: '/', changefreq: 'weekly', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      { url: '/practice-areas', changefreq: 'monthly', priority: 0.9 },
      { url: '/blog', changefreq: 'weekly', priority: 0.8 },
      { url: '/contact', changefreq: 'monthly', priority: 0.8 },
    ];
    
    // Create a sitemap stream
    const smStream = new SitemapStream({ hostname });
    
    // Add static routes to sitemap
    staticRoutes.forEach(route => {
      smStream.write(route);
    });
    
    try {
      // Try to fetch dynamic routes from API
      const { blogs, practiceAreas } = await fetchDynamicRoutes();
      
      // Add blog post routes
      blogs.forEach(blog => {
        smStream.write({
          url: `/blog/${blog._id || blog.id}`,
          changefreq: 'monthly',
          priority: 0.7,
          lastmod: blog.updatedAt || blog.publishedAt
        });
      });
      
      // Add practice areas routes
      practiceAreas.forEach(area => {
        smStream.write({
          url: `/practice-areas/${area._id || area.id}`,
          changefreq: 'monthly',
          priority: 0.7,
          lastmod: area.updatedAt
        });
      });
    } catch (error) {
      console.warn('Error adding dynamic routes, proceeding with static routes only', error);
    }
    
    // End the stream
    smStream.end();
    
    // Generate sitemap and save to public directory
    const sitemap = await streamToPromise(smStream);
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap.toString());
    
    console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

// Run the sitemap generator
generateSitemap();