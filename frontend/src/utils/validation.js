/**
 * Input Validation Utility
 *
 * This utility provides functions for validating and sanitizing input data
 * to protect against XSS and other injection attacks.
 */

import DOMPurify from 'dompurify';

/**
 * Regular expression patterns for common validations
 */
export const patterns = {
  // Email regex based on RFC 5322 official standard
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,

  // Phone number with optional country code
  phone: /^(\+?\d{1,3}[- ]?)?\(?(?:\d{3})\)?[- ]?\d{3}[- ]?\d{4}$/,

  // Password: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  // URL pattern
  url: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/,

  // Only alphanumeric characters, spaces, and common punctuation
  safeText: /^[a-zA-Z0-9\s.,!?;:'"-]*$/,

  // Postal/zip code (US format)
  zipCode: /^\d{5}(-\d{4})?$/,

  // Date in YYYY-MM-DD format
  isoDate: /^\d{4}-\d{2}-\d{2}$/,
};

/**
 * Validation rules for common fields
 */
export const validationRules = {
  email: {
    pattern: patterns.email,
    message: 'Please enter a valid email address',
  },
  password: {
    pattern: patterns.strongPassword,
    message:
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
  },
  name: {
    minLength: 2,
    maxLength: 50,
    message: 'Name must be between 2 and 50 characters',
  },
  phone: {
    pattern: patterns.phone,
    message: 'Please enter a valid phone number',
  },
  content: {
    maxLength: 5000,
    message: 'Content cannot exceed 5000 characters',
  },
  title: {
    minLength: 3,
    maxLength: 100,
    message: 'Title must be between 3 and 100 characters',
  },
};

/**
 * Validates a value against a specific validation rule
 *
 * @param {string} value - The value to validate
 * @param {object} rule - The validation rule to use
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateField = (value, rule) => {
  if (!value && rule.required) {
    return false;
  }

  if (value && rule.minLength && value.length < rule.minLength) {
    return false;
  }

  if (value && rule.maxLength && value.length > rule.maxLength) {
    return false;
  }

  if (value && rule.pattern && !rule.pattern.test(value)) {
    return false;
  }

  if (rule.validator && typeof rule.validator === 'function') {
    return rule.validator(value);
  }

  return true;
};

/**
 * Validates a form data object against a set of validation rules
 *
 * @param {object} formData - Form data object
 * @param {object} schema - Validation schema with field names and rules
 * @returns {object} - Object containing validation results
 */
export const validateForm = (formData, schema) => {
  const errors = {};
  let isValid = true;

  Object.keys(schema).forEach(field => {
    const value = formData[field];
    const rule = schema[field];

    if (!validateField(value, rule)) {
      errors[field] = rule.message || 'Invalid value';
      isValid = false;
    }
  });

  return { isValid, errors };
};

/**
 * Sanitizes a string to prevent XSS attacks
 *
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = input => {
  if (!input) return input;

  // Use DOMPurify to sanitize HTML
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input, { USE_PROFILES: { html: false } });
  }

  return input;
};

/**
 * Sanitizes all string values in an object to prevent XSS attacks
 *
 * @param {object} obj - Object to sanitize
 * @returns {object} - Sanitized object
 */
export const sanitizeObject = obj => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // Create a new object to avoid mutating the original
  const sanitized = Array.isArray(obj) ? [] : {};

  Object.keys(obj).forEach(key => {
    const value = obj[key];

    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
};

/**
 * Escapes HTML special characters in a string
 *
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
export const escapeHtml = str => {
  if (!str || typeof str !== 'string') {
    return str;
  }

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Validates that a string doesn't contain malicious patterns
 *
 * @param {string} input - String to check
 * @returns {boolean} - True if the string is safe
 */
export const isSafeString = input => {
  if (!input || typeof input !== 'string') {
    return true;
  }

  // Check for potential script injections
  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /onerror=/gi,
    /onload=/gi,
    /onclick=/gi,
    /oncl/gi,
  ];

  return !maliciousPatterns.some(pattern => pattern.test(input));
};

const validation = {
  patterns,
  validationRules,
  validateField,
  validateForm,
  sanitizeString,
  sanitizeObject,
  escapeHtml,
  isSafeString,
};

export default validation;
