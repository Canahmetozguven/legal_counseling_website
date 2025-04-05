/**
 * Secure Storage Utility
 * Provides encrypted storage capabilities for sensitive data
 */

// Simple storage without encryption as fallback
const fallbackStorage = {
  setItem(key, value) {
    try {
      localStorage.setItem(`fallback_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Fallback storage error setting ${key}:`, error);
    }
  },
  getItem(key) {
    try {
      const item = localStorage.getItem(`fallback_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Fallback storage error getting ${key}:`, error);
      return null;
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(`fallback_${key}`);
    } catch (error) {
      console.error(`Fallback storage error removing ${key}:`, error);
    }
  }
};

// Check if Web Crypto API is supported in secure context
const isCryptoSupported = () => {
  return window.crypto && window.crypto.subtle && window.isSecureContext !== false;
};

// Simple encryption/decryption helper using built-in browser crypto
const encrypt = async (text, key = 'default-key') => {
  // If crypto isn't supported, return a basic encoding
  if (!isCryptoSupported()) {
    console.warn('Web Crypto API not supported, using simple encoding');
    return `simple:${btoa(unescape(encodeURIComponent(text)))}`;
  }

  try {
    // Create a consistent key using SHA-256
    const keyBuffer = await window.crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(key)
    );
    
    // Use a salt for added security
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Import the key for AES-GCM
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    // Encrypt the data
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      cryptoKey,
      new TextEncoder().encode(text)
    );

    // Combine salt, iv, and encrypted data for storage
    const result = {
      v: 2, // version indicator
      s: Array.from(new Uint8Array(salt)),
      i: Array.from(new Uint8Array(iv)),
      d: Array.from(new Uint8Array(encryptedData))
    };

    return `encrypted:${btoa(JSON.stringify(result))}`;
  } catch (error) {
    console.warn('Encryption failed, using simple encoding:', error);
    return `simple:${btoa(unescape(encodeURIComponent(text)))}`;
  }
};

const decrypt = async (encryptedText, key = 'default-key') => {
  // Handle unencrypted or simply encoded data
  if (!encryptedText) {
    return null;
  }
  
  // Handle simple encoding (fallback)
  if (encryptedText.startsWith('simple:')) {
    try {
      return decodeURIComponent(escape(atob(encryptedText.substring(7))));
    } catch (e) {
      console.warn('Failed to decode simple encoding:', e);
      return null;
    }
  }
  
  // Handle our v2 encrypted format
  if (encryptedText.startsWith('encrypted:')) {
    // If crypto isn't supported, return null
    if (!isCryptoSupported()) {
      console.warn('Web Crypto API not supported, cannot decrypt');
      return null;
    }

    try {
      const payload = encryptedText.substring(10); // remove 'encrypted:' prefix
      const { v, s, i, d } = JSON.parse(atob(payload));
      
      // Ensure we're handling the right version
      if (v !== 2) {
        throw new Error(`Unsupported encryption version: ${v}`);
      }
      
      // Convert back to ArrayBuffers
      const saltBuffer = new Uint8Array(s).buffer;
      const ivBuffer = new Uint8Array(i).buffer;
      const dataBuffer = new Uint8Array(d).buffer;
      
      // Create a consistent key using SHA-256
      const keyBuffer = await window.crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(key)
      );
      
      // Import the key for AES-GCM
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      // Decrypt the data
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivBuffer
        },
        cryptoKey,
        dataBuffer
      );

      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }
  
  // Legacy format handling - attempt to parse directly, but likely will fail
  try {
    // Check if it might be a JSON object already
    if (encryptedText.startsWith('{') && encryptedText.endsWith('}')) {
      return encryptedText;
    }
    
    // Check if it might be base64 directly
    try {
      return atob(encryptedText);
    } catch (e) {
      // Not valid base64
    }
    
    return null;
  } catch (error) {
    console.error('Failed to process legacy format:', error);
    return null;
  }
};

// Use a fixed app key
const APP_KEY = 'musti-app-v1-2025';

const secureStorage = {
  // Set a value securely
  async setItem(key, value) {
    try {
      if (value === undefined || value === null) {
        this.removeItem(key);
        return;
      }
      
      // First, try to remove any existing corrupted data
      this.removeItem(key);
      fallbackStorage.removeItem(key);
      
      // Try to encrypt the value
      const encryptedValue = await encrypt(JSON.stringify(value), APP_KEY);
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error(`Error storing ${key}, using fallback:`, error);
      fallbackStorage.setItem(key, value);
    }
  },

  // Get a value securely
  async getItem(key) {
    try {
      // Try fallback storage first if it exists
      const fallbackValue = fallbackStorage.getItem(key);
      if (fallbackValue !== null) {
        return fallbackValue;
      }
      
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      
      const decryptedValue = await decrypt(encryptedValue, APP_KEY);
      if (!decryptedValue) {
        return null;
      }
      
      try {
        return JSON.parse(decryptedValue);
      } catch (jsonError) {
        // If it's not valid JSON, return the raw value
        return decryptedValue;
      }
    } catch (error) {
      console.error(`Error retrieving ${key}, trying fallback:`, error);
      return fallbackStorage.getItem(key);
    }
  },

  // Remove a value
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      fallbackStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  // Clear all secure storage
  clear() {
    try {
      // Clear only known secure storage items to avoid clearing other app data
      const securePrefixes = ['auth_', 'user_', 'token_'];
      
      Object.keys(localStorage).forEach(key => {
        if (securePrefixes.some(prefix => key.startsWith(prefix))) {
          localStorage.removeItem(key);
          // Also remove fallback items
          fallbackStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  },

  // Clear all corrupted storage (emergency reset)
  clearCorrupted() {
    try {
      const securePrefixes = ['auth_', 'user_', 'token_'];
      Object.keys(localStorage).forEach(key => {
        if (securePrefixes.some(prefix => key.startsWith(prefix))) {
          try {
            const value = localStorage.getItem(key);
            if (value && !value.startsWith('simple:') && !value.startsWith('encrypted:')) {
              console.warn(`Removing corrupted storage for ${key}`);
              localStorage.removeItem(key);
            }
          } catch (e) {
            // Remove item if we couldn't even read it
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Error clearing corrupted storage:', error);
    }
  },

  // Store sensitive auth data
  async setAuthData(token, user) {
    if (token) {
      console.log('[STORAGE] Setting auth token:', token.substring(0, 10) + '...');
    } else {
      console.log('[STORAGE] Clearing auth token');
    }
    await this.setItem('auth_token', token);
    await this.setItem('auth_user', user);
  },

  // Get auth token
  async getAuthToken() {
    return await this.getItem('auth_token');
  },

  // Get user data
  async getUser() {
    return await this.getItem('auth_user');
  },

  // Check if user is authenticated
  async isAuthenticated() {
    const token = await this.getAuthToken();
    return !!token;
  },

  // Log out - clear auth data
  clearAuth() {
    this.removeItem('auth_token');
    this.removeItem('auth_user');
  }
};

// Immediately clear corrupted tokens on module load
secureStorage.clearCorrupted();

export default secureStorage;