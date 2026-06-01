/**
 * Maximum Secure Static Site - Client Auth & Steganography Engine
 * 
 * Securely extracts encrypted payloads from pixel assets using HTML5 canvas,
 * performs stream decryption using the user's password, and manages obfuscated
 * storage session states.
 */

// Symmetrical RC4 Stream Cipher for light-weight in-memory client decryption
export function rc4(key, str) {
  const s = [];
  let j = 0;
  let x;
  let res = '';
  
  // Key Scheduling Algorithm (KSA)
  for (let i = 0; i < 256; i++) {
    s[i] = i;
  }
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
  }
  
  // Pseudo-Random Generation Algorithm (PRGA) & XOR
  let i = 0;
  j = 0;
  for (let y = 0; y < str.length; y++) {
    i = (i + 1) % 256;
    j = (j + s[i]) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
    res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
  }
  return res;
}

// Nested Base64 encoding/decoding helper
export function base64Encode(str) {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch (e) {
    return btoa(str);
  }
}

export function base64Decode(str) {
  try {
    return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    return atob(str);
  }
}

// 1. Promise-based Steganographic Image Loader
export function loadSteganographicAsset(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Prevent CORS issues in sandbox environments
    
    img.onload = () => {
      resolve(img);
    };
    
    img.onerror = (err) => {
      reject(new Error(`Failed to load steganographic carrier asset. URL: ${url}`));
    };
    
    // Trigger image load
    img.src = url;
  });
}

// 2. Extract Hidden Message using LSB Steganography
export function extractSteganography(img) {
  // Create an off-screen canvas to extract pixel data
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  
  // Draw the image
  ctx.drawImage(img, 0, 0);
  
  // Get raw RGBA pixel data
  const imgData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imgData.data;
  
  // A helper to read bit sequence
  let bitIndex = 0;
  
  const readBit = () => {
    if (bitIndex >= data.length) return 0;
    
    // Read the LSB (Least Significant Bit) of the current color channel
    // Skip reading Alpha channel to avoid browser transparency anomalies
    if ((bitIndex + 1) % 4 === 0) {
      bitIndex++; // Skip alpha
    }
    
    const bit = data[bitIndex] & 1;
    bitIndex++;
    return bit;
  };
  
  // Extract the 32-bit length header (4 bytes)
  let messageLength = 0;
  for (let i = 0; i < 32; i++) {
    const bit = readBit();
    messageLength = (messageLength << 1) | bit;
  }

  // Sanity check to avoid memory crash
  if (messageLength <= 0 || messageLength > data.length / 8) {
    throw new Error("Invalid steganographic payload signature.");
  }
  
  // Extract message bytes
  const bytes = new Uint8Array(messageLength);
  for (let i = 0; i < messageLength; i++) {
    let byteVal = 0;
    for (let bit = 0; bit < 8; bit++) {
      const bitVal = readBit();
      byteVal = (byteVal << 1) | bitVal;
    }
    bytes[i] = byteVal;
  }
  
  // Convert byte array to string
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(bytes);
}

// 3. Obfuscate / Secure Session Storage
const SESSION_STORAGE_KEY = 'msss_enc_session_token';
const SESSION_STORAGE_SALT = 'HumbatStaticSecurityShield_2026';

export function saveSession(passcode) {
  try {
    // Encrypt the session passcode using our helper salt
    const encPasscode = base64Encode(rc4(SESSION_STORAGE_SALT, passcode));
    // Nested encoding with timestamp to prevent static inspection
    const payload = {
      token: encPasscode,
      created: Date.now(),
      entropy: Math.random().toString(36).substring(2)
    };
    sessionStorage.setItem(SESSION_STORAGE_KEY, base64Encode(JSON.stringify(payload)));
  } catch (e) {}
}

export function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    
    const parsedPayload = JSON.parse(base64Decode(raw));
    
    // Session expiration check (e.g., 2 hours session)
    if (Date.now() - parsedPayload.created > 2 * 60 * 60 * 1000) {
      clearSession();
      return null;
    }
    
    const encPasscode = parsedPayload.token;
    return rc4(SESSION_STORAGE_SALT, base64Decode(encPasscode));
  } catch (e) {
    return null;
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {}
}

// 4. Authenticate user, extract assets, and decrypt the Dashboard payload
export async function authenticateUser(passcode) {
  try {
    // Load carrier PNG (using relative path which will be valid in dist/)
    const img = await loadSteganographicAsset('assets/carrier.png');
    
    // Extract stego content
    const base64EncryptedPayload = extractSteganography(img);
    
    // Base64 decode to get raw RC4 ciphertext
    const rawCiphertext = base64Decode(base64EncryptedPayload);
    
    // Decrypt the payload using the user's passcode as the RC4 key
    const decryptedJSON = rc4(passcode, rawCiphertext);
    
    // Parse the JSON. If passcode is wrong, decryption yields garbled data, throwing JSON error
    const authPackage = JSON.parse(decryptedJSON);
    
    if (authPackage.signature === 'MSSS_SECURE_AUTH' && authPackage.dashboard) {
      // Save session
      saveSession(passcode);
      return {
        success: true,
        dashboardData: authPackage.dashboard
      };
    } else {
      return { success: false, error: "Incorrect passphrase." };
    }
  } catch (e) {
    return { 
      success: false, 
      error: "Authentication failed. Decryption was unsuccessful or the carrier was modified." 
    };
  }
}
