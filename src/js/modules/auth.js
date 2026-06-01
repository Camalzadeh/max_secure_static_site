export function rc4(key, str) {
  const s = [];
  let j = 0;
  let x;
  let res = '';
  for (let i = 0; i < 256; i++) {
    s[i] = i;
  }
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
  }
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

export function loadSteganographicAsset(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (err) => {
      reject(new Error(`Failed to load steganographic carrier asset. URL: ${url}`));
    };
    img.src = url;
  });
}

export function extractSteganography(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imgData.data;
  let bitIndex = 0;
  const readBit = () => {
    if (bitIndex >= data.length) return 0;
    if ((bitIndex + 1) % 4 === 0) {
      bitIndex++;
    }
    const bit = data[bitIndex] & 1;
    bitIndex++;
    return bit;
  };
  let messageLength = 0;
  for (let i = 0; i < 32; i++) {
    const bit = readBit();
    messageLength = (messageLength << 1) | bit;
  }
  if (messageLength <= 0 || messageLength > data.length / 8) {
    throw new Error("Invalid steganographic payload signature.");
  }
  const bytes = new Uint8Array(messageLength);
  for (let i = 0; i < messageLength; i++) {
    let byteVal = 0;
    for (let bit = 0; bit < 8; bit++) {
      const bitVal = readBit();
      byteVal = (byteVal << 1) | bitVal;
    }
    bytes[i] = byteVal;
  }
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(bytes);
}

const SESSION_STORAGE_KEY = 'msss_enc_session_token';
const SESSION_STORAGE_SALT = 'HumbatStaticSecurityShield_2026';

export function saveSession(passcode) {
  try {
    const encPasscode = base64Encode(rc4(SESSION_STORAGE_SALT, passcode));
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

export async function authenticateUser(passcode) {
  try {
    const img = await loadSteganographicAsset('assets/carrier.png');
    const base64EncryptedPayload = extractSteganography(img);
    const rawCiphertext = base64Decode(base64EncryptedPayload);
    const decryptedJSON = rc4(passcode, rawCiphertext);
    const authPackage = JSON.parse(decryptedJSON);
    if (authPackage.signature === 'MSSS_SECURE_AUTH' && authPackage.dashboard) {
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
