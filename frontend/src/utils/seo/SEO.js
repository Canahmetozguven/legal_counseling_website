import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component for managing all meta tags, including Open Graph and Twitter Cards
 *
 * @param {Object} props Component props
 * @param {string} props.title Page title
 * @param {string} props.description Meta description
 * @param {string} [props.canonical] Canonical URL
 * @param {string} [props.image] Image URL for social sharing
 * @param {string[]} [props.keywords] Array of keywords
 * @param {Object} [props.schema] JSON-LD schema markup
 * @param {string} [props.type] Content type (e.g., 'website', 'article')
 * @param {string} [props.publishedAt] Publish date for articles
 * @param {string} [props.updatedAt] Last update date for articles
 * @param {string} [props.author] Author name for articles
 */
const SEO = ({
  title,
  description,
  canonical,
  image,
  keywords,
  schema,
  type = 'website',
  publishedAt,
  updatedAt,
  author,
}) => {
  // Base URL for constructing full URLs
  const siteUrl = window.location.origin;
  const currentUrl = window.location.href;

  // Default image for social sharing
  const defaultImage = `${siteUrl}/logo512.png`;

  // Default site name
  const siteName = 'Musti Attorneys';

  // Construct full image URL if relative path
  const imageUrl = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage;

  return (
    <Helmet>
      {/* Standard meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={canonical || currentUrl} />

      {/* Open Graph meta tags for Facebook */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={canonical || currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Article specific meta tags */}
      {type === 'article' && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {type === 'article' && updatedAt && (
        <meta property="article:modified_time" content={updatedAt} />
      )}
      {type === 'article' && author && <meta property="article:author" content={author} />}

      {/* JSON-LD structured data */}
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  );
};

export default SEO;
