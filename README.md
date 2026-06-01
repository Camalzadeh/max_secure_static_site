# Maximum Secure Static Site (MSSS)

MSSS is a highly secured client-side static access portal built from scratch using HTML, Vanilla JavaScript, and Tailwind CSS. It features a high-end minimalist dark design, client-side encryption, and an advanced automated packaging pipeline that applies extensive obfuscation and security shielding techniques.

> [!NOTE]
> During development (running on `localhost` or `127.0.0.1`), active debugger freezing loops are bypassed to allow standard source editing. All security blocks (F12 intercept, contextmenu disabling, Shadow DOM isolation, self-defending JS, steganographic LSB decryptions) are fully compiled and live in the production build (`dist/`).

---

## Quick Start Setup

### 1. Prerequisites
- **Node.js**: Version 18.x or 20.x installed.
- **npm**: Standard Node package manager.

### 2. Installation
Install project dependencies (pure-JS packages, fully compatible with Windows, macOS, and Linux):
```bash
npm install --no-bin-links
```

### 3. Running Development Environment
To launch the live-reloaded server pointing to the readable source folder (`src/`):
```bash
npm run dev
```
*Navigate to `http://localhost:3000` to inspect.*

### 4. Compiling & Packaging the Hardened Build
To trigger the security pipeline compiler (compiles Tailwind CSS, generates the steganographic PNG carrier asset, minifies HTML, and obfuscates JS modules with active anti-tamper shielding):
```bash
npm run build
```
*Outputs the secured, standalone static application inside the `dist/` folder.*

### 5. Running Production Preview Locally
To launch a live server pointing to the protected production folder (`dist/`):
```bash
npm run prod
```
*Open in your browser, and try inspecting the page or viewing the source!*

---

## Recent Hardening Updates & Diagnostics Log (v1.0.4)

A major diagnostic and security review was performed to optimize local execution and solve standard static compilation bottlenecks under Windows and Google Drive stream systems. The following features and fixes were integrated:

### 1. Stripped Code Comments
Removed all verbose development inline comments and structural footnotes from both raw templates (`index.html`) and modular JavaScript scripts (`main.js`, `security.js`, modules) to ensure maximum production compression, eliminate developer footnotes, and present a pristine clean static codebase.

### 2. Resolved DOMContentLoaded Race Condition
Fixed a race condition where modular scripts loaded asynchronously after the browser had already parsed the HTML structure and fired the native `DOMContentLoaded` event. Wrapped the main access coordinator in a robust checking block:
```javascript
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
```

### 3. Resolved Console Neutralization strict-mode Collision
Fixed a strict-mode `TypeError: Cannot assign to read-only property 'log'` crash. In previous iterations, setting the overridden console properties to `writable: false` crashed strict-mode third-party scripts that attempted to assign variables to console methods. These properties are now successfully isolated or compiled with matching parameters in `build.js`.

### 4. Global Prototype Freeze Bypass
Standard browser JS engines threw fatal `TypeError` crashes during the dynamic initialization of third-party string decoders and obfuscator helper variables when freezing the global `Object.prototype`. We resolved this by keeping system prototype interfaces editable, while strictly freezing custom namespaces (like `window.SecurityShield` using `Object.freeze()`).

### 5. Configured Stable Obfuscation Options
Bypassed the extremely buggy `javascript-obfuscator` native `selfDefending` and `debugProtection` options which trigger false-positive infinite debugger loops on normal desktop environments. They have been replaced with a custom, highly stable active hotkey shield, context menu lock, and mouse-dragging blocker.

### 6. Hybrid Local SSD Build Pipeline
Developed a reliable Windows/Google Drive file sync-lock bypass. To prevent sync-write conflicts (`EPERM` / `EBADF` / `Access is denied`) in cloud-mounted virtual directories during heavy compilation steps, a custom PowerShell build script (`build.ps1`) automates operations:
1. Copies the working directory to a local SSD temp workspace (`C:\Users\Humbat\AppData\Local\Temp\msss-temp`).
2. Installs dependencies and runs clean obfuscation scripts on SSD.
3. Automatically overwrites the compiled production assets back into the workspace directory without deleting folder structures, bypassing file sync locks cleanly.

---

## Detailed Documentation

An exhaustive architectural manual is available inside the `docs/` folder:
- **[Security & Architecture Manual](file:///g:/My%20Drive/Codes/max_secure_static_site/docs/README.md)**: Features detailed breakdowns of the threat model, the steganography carrier bit layouts, closed Shadow DOM structures, self-defending checksum mechanics, and complete operational explanations of each of the 12 mandatory security checklist items.

---

## License
Released under the MIT License.
