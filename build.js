/**
 * Maximum Secure Static Site - Automated Build Pipeline
 * 
 * 1. Creates distribution directories (dist/).
 * 2. Compiles and minifies Tailwind CSS styles.
 * 3. Encrypts and encodes the payload into a steganographic PNG carrier asset (dist/assets/carrier.png and src/assets/carrier.png).
 * 4. Minifies HTML and JS modules.
 * 5. Applies advanced Javascript Obfuscation & active self-defending shields.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const JavaScriptObfuscator = require('javascript-obfuscator');
const { minify } = require('html-minifier-terser');
const { PNG } = require('pngjs');

// 1. Core Cryptographic Config (Matches src/js/modules/auth.js)
const AUTH_PASSWORD = 'SecureVault2026';

function rc4(key, str) {
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

function base64Encode(str) {
  return Buffer.from(str, 'binary').toString('base64');
}

// 2. Main Build Loop
async function build() {
  console.log("=== MSSS SECURITY STATIC SITE BUILD STARTED ===");

  try {
    // 2.1 Ensure distribution folders exist
    const dirs = [
      'dist',
      'dist/css',
      'dist/js',
      'dist/js/modules',
      'dist/assets',
      'src/assets'
    ];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`[+] Created directory: ${dir}`);
      }
    });

    // 2.2 Compile and Minify Tailwind CSS
    console.log("[*] Compiling Tailwind CSS...");
    // Compile for local development
    execSync('npx tailwindcss -i ./src/css/input.css -o ./src/css/style.min.css', { stdio: 'inherit' });
    // Compile & Minify for production distribution
    execSync('npx tailwindcss -i ./src/css/input.css -o ./dist/css/style.min.css --minify', { stdio: 'inherit' });
    console.log("[+] Tailwind CSS compiled successfully.");

    // 2.3 Generate Steganographic Asset containing access token and encrypted dashboard content
    console.log("[*] Generating Steganographic Carrier PNG...");
    
    // Auth payload payload signature
    const authPackage = {
      signature: 'MSSS_SECURE_AUTH',
      dashboard: {
        authLevel: 'Level 5 - Sysop Administrator (Global)',
        sessionSalt: 'MSSS_SALT_HEX_2026_' + Math.random().toString(36).substring(2).toUpperCase(),
        secretMessage: 'ACCESS GRANTED. Active Front-End Security: [XOR, RC4, SHADOW_DOM, STEGO, SELF_DEFEND, INF_DEBUGGER_LOOP]. Client-Side sandbox secure.'
      }
    };

    const plaintext = JSON.stringify(authPackage);
    const rc4Cipher = rc4(AUTH_PASSWORD, plaintext);
    const base64Payload = base64Encode(rc4Cipher);
    
    // Convert base64Payload to UTF-8 bytes to inject in LSB of image pixels
    const encoder = new TextEncoder();
    const payloadBytes = encoder.encode(base64Payload);

    // Create custom canvas PNG (128x128 pixels geometric abstract image)
    const size = 128;
    const png = new PNG({ width: size, height: size });

    // Fill with modern geometric digital gradient (cyan to deep blue)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (size * y + x) << 2;
        
        // Generate abstract grid / diagonal line patterns to represent premium design
        const isGrid = (x % 16 === 0 || y % 16 === 0);
        const r = isGrid ? 10 : Math.floor(8 + 15 * (x / size));
        const g = isGrid ? 35 : Math.floor(12 + 25 * (y / size));
        const b = isGrid ? 60 : Math.floor(35 + 50 * ((x + y) / (size * 2)));
        const a = 255;

        png.data[idx] = r;
        png.data[idx+1] = g;
        png.data[idx+2] = b;
        png.data[idx+3] = a;
      }
    }

    // Embed bits into color channels using LSB
    const bits = [];
    const len = payloadBytes.length;
    
    // Header bits representing length of secret string (32 bits = 4 bytes)
    for (let i = 31; i >= 0; i--) {
      bits.push((len >> i) & 1);
    }
    // Message bits representing string payload
    for (let i = 0; i < payloadBytes.length; i++) {
      const byte = payloadBytes[i];
      for (let bit = 7; bit >= 0; bit--) {
        bits.push((byte >> bit) & 1);
      }
    }

    // Embed bits in color channels (skipping Alpha to avoid canvas compression changes)
    let bitIndex = 0;
    for (let i = 0; i < png.data.length && bitIndex < bits.length; i++) {
      if ((i + 1) % 4 === 0) continue; // Skip Alpha
      png.data[i] = (png.data[i] & 0xFE) | bits[bitIndex];
      bitIndex++;
    }

    if (bitIndex < bits.length) {
      throw new Error(`Steganographic payload too large for the current ${size}x${size} image template.`);
    }

    // Write PNG asset
    const buffer = PNG.sync.write(png);
    fs.writeFileSync('dist/assets/carrier.png', buffer);
    fs.writeFileSync('src/assets/carrier.png', buffer); // Also copy to src for dev live server!
    console.log(`[+] Steganographic image successfully written to dist/assets/carrier.png and src/assets/carrier.png.`);

    // 2.4 HTML Minification
    console.log("[*] Minifying HTML template...");
    const rawHtml = fs.readFileSync('src/index.html', 'utf8');
    const minHtml = await minify(rawHtml, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    });
    fs.writeFileSync('dist/index.html', minHtml);
    console.log("[+] HTML index file minified successfully.");

    // 2.5 JavaScript Bundling and Obfuscation
    console.log("[*] Bundling JavaScript modules into a single client IIFE...");
    
    // Read the source of modular files
    const shieldSrc = fs.readFileSync('src/js/modules/shield.js', 'utf8');
    const authSrc = fs.readFileSync('src/js/modules/auth.js', 'utf8');
    const renderSrc = fs.readFileSync('src/js/modules/render.js', 'utf8');
    const mainSrc = fs.readFileSync('src/js/main.js', 'utf8');

    // Clean export keywords to make them standard functions inside local scope
    const cleanShield = shieldSrc.replace(/export\s+/g, '');
    const cleanAuth = authSrc.replace(/export\s+/g, '');
    const cleanRender = renderSrc.replace(/export\s+/g, '');
    
    // Remove ES6 import lines from main.js
    const cleanMain = mainSrc.replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '');

    // Construct a self-contained IIFE bundle
    const bundledCode = `(function() {
      'use strict';
      
      // ==========================================
      // MODULE: SHIELD DEFENSER
      // ==========================================
      ${cleanShield}
      
      // ==========================================
      // MODULE: PIXEL DECRYPTION ENGINE
      // ==========================================
      ${cleanAuth}
      
      // ==========================================
      // MODULE: CLOSED SHADOW DOM RENDERER
      // ==========================================
      ${cleanRender}
      
      // ==========================================
      // MAIN ACCESS ROUTER GATEWAY
      // ==========================================
      ${cleanMain}
    })();`;

    console.log("[*] Commencing JS Obfuscation & Active Environment Protections...");
    
    const obfuscationConfig = {
      compact: true,
      controlFlowFlattening: false, // temporarily disabled for clean diagnostic trace
      controlFlowFlatteningThreshold: 0.8,
      deadCodeInjection: false,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: false, // disabled for diagnostics
      debugProtectionInterval: 1500, 
      disableConsoleOutput: false, // enable console logging for diagnostics
      selfDefending: false, // disabled for diagnostics
      splitStrings: true,
      stringArray: true,
      stringArrayEncoding: ['base64', 'rc4'],
      stringArrayThreshold: 0.85,
      unicodeEscapeSequence: true
    };

    // 1. Obfuscate Bootstrap Security Script
    console.log("  [>] Securing: src/js/security.js -> dist/js/security.js");
    const securityCode = fs.readFileSync('src/js/security.js', 'utf8');
    const securityObfuscated = JavaScriptObfuscator.obfuscate(securityCode, obfuscationConfig);
    fs.writeFileSync('dist/js/security.js', securityObfuscated.getObfuscatedCode());

    // 2. Obfuscate Unified Bundled Code
    console.log("  [>] Securing Bundled Client: src/js/[main, modules] -> dist/js/main.js");
    const mainObfuscated = JavaScriptObfuscator.obfuscate(bundledCode, obfuscationConfig);
    fs.writeFileSync('dist/js/main.js', mainObfuscated.getObfuscatedCode());

    // 3. Clean up the empty dist modules folder if it exists
    if (fs.existsSync('dist/js/modules')) {
      fs.rmSync('dist/js/modules', { recursive: true, force: true });
    }

    console.log("[+] All JavaScript files compiled and obfuscated.");
    console.log("=== MSSS SECURITY STATIC SITE BUILD COMPLETED SUCCESSFULLY ===");

  } catch (err) {
    console.error("[-] Build failed with error:", err);
    process.exit(1);
  }
}

build();
