/**
 * Secure Storage Utility
 * Provides encrypted storage capabilities for sensitive data
 */

// Simple encryption/decryption helper using built-in browser crypto
const encrypt = async (text, key = 'default-key') => {
  try {
    // Convert key to a consistent format
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(key),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    // Use a salt for added security
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Derive an actual key for encryption
    const cryptoKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
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
      salt: Array.from(new Uint8Array(salt)),
      iv: Array.from(new Uint8Array(iv)),
      data: Array.from(new Uint8Array(encryptedData))
    };

    return btoa(JSON.stringify(result));
  } catch (error) {
    console.error('Encryption failed:', error);
    return text; // Fallback to unencrypted on error
  }
};

const decrypt = async (encryptedText, key = 'default-key') => {
  try {
    // Parse the combined data
    const { salt, iv, data } = JSON.parse(atob(encryptedText));
    
    // Convert back to ArrayBuffers
    const saltBuffer = new Uint8Array(salt).buffer;
    const ivBuffer = new Uint8Array(iv).buffer;
    const dataBuffer = new Uint8Array(data).buffer;

    // Import the key material
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(key),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    // Derive the same key for decryption
    const cryptoKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
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
};

// Gets a cryptographically secure random key
const generateSessionKey = () => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Store the session key (generated once per session)
let sessionKey = window.sessionStorage.getItem('__sk') || generateSessionKey();
window.sessionStorage.setItem('__sk', sessionKey);

const secureStorage = {
  // Set a value securely
  async setItem(key, value) {
    try {
      // Encrypt the value with the session key
      const encryptedValue = await encrypt(JSON.stringify(value), sessionKey);
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
    }
  },

  // Get a value securely
  async getItem(key) {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      
      const decryptedValue = await decrypt(encryptedValue, sessionKey);
      if (!decryptedValue) return null;
      
      return JSON.parse(decryptedValue);
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  },

  // Remove a value
  removeItem(key) {
    try {
      localStorage.removeItem(key);
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
        }
      });
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  },

  // Store sensitive auth data
  async setAuthData(token, user) {
    console.log('[STORAGE DEBUG] Setting auth token:', token.substring(0, 10) + '...');
    console.log('[STORAGE DEBUG] Setting user data:', user);
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

export default secureStorage;