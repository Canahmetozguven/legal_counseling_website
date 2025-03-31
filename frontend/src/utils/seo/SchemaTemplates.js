/**
 * Schema.org JSON-LD templates for the law firm website
 * These templates provide structured data to improve search engine understanding
 */

/**
 * Generate a LegalService schema for the law firm
 * @param {Object} options - Schema options
 * @returns {Object} - JSON-LD schema object
 */
export const getLawFirmSchema = ({
  name = "Musti Attorneys",
  description = "Expert legal services for individuals and businesses",
  url = "https://mustiattorneys.com",
  logo = "https://mustiattorneys.com/logo512.png",
  address = {
    street: "123 Law Street",
    city: "Cityville",
    state: "ST",
    postalCode: "12345",
    country: "US"
  },
  telephone = "(555) 123-4567",
  email = "info@mustiattorneys.com",
  sameAs = [
    "https://www.facebook.com/mustiattorneys",
    "https://www.linkedin.com/company/mustiattorneys",
    "https://twitter.com/mustiattorneys",
    "https://instagram.com/mustiattorneys"
  ],
  priceRange = "$$$"
} = {}) => {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${url}#legalservice`,
    "name": name,
    "description": description,
    "url": url,
    "logo": logo,
    "telephone": telephone,
    "email": email,
    "priceRange": priceRange,
    "sameAs": sameAs,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.street,
      "addressLocality": address.city,
      "addressRegion": address.state,
      "postalCode": address.postalCode,
      "addressCountry": address.country
    }
  };
};

/**
 * Generate a Person schema for an attorney
 * @param {Object} options - Schema options
 * @returns {Object} - JSON-LD schema object
 */
export const getAttorneySchema = ({
  name,
  jobTitle,
  description,
  image,
  telephone,
  email,
  url,
  sameAs = []
} = {}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Attorney",
    "name": name,
    "jobTitle": jobTitle,
    "description": description,
    "image": image,
    "telephone": telephone,
    "email": email,
    "url": url,
    "sameAs": sameAs
  };
};

/**
 * Generate a FAQPage schema for FAQ sections
 * @param {Object[]} faqs - Array of question/answer pairs
 * @returns {Object} - JSON-LD schema object
 */
export const getFaqSchema = (faqs = []) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

/**
 * Generate an Article schema for blog posts
 * @param {Object} options - Schema options
 * @returns {Object} - JSON-LD schema object
 */
export const getBlogPostSchema = ({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  publisherName = "Musti Attorneys",
  publisherLogo = "https://mustiattorneys.com/logo512.png",
  url
} = {}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "image": image,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": publisherName,
      "logo": {
        "@type": "ImageObject",
        "url": publisherLogo
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };
};

/**
 * Generate a ProfessionalService schema for specific practice areas
 * @param {Object} options - Schema options
 * @returns {Object} - JSON-LD schema object
 */
export const getPracticeAreaSchema = ({
  name,
  description,
  url,
  image,
  areaServed = "Global",
  serviceType
} = {}) => {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": name,
    "description": description,
    "url": url,
    "image": image,
    "areaServed": areaServed,
    "serviceType": serviceType
  };
};