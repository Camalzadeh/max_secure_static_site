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

## Detailed Documentation

An exhaustive architectural manual is available inside the `docs/` folder:
- **[Security & Architecture Manual](file:///g:/My%20Drive/Codes/max_secure_static_site/docs/README.md)**: Features detail breakdowns of the threat model, the steganography carrier bit layouts, closed Shadow DOM structures, self-defending checksum mechanics, and complete operational explanations of each of the 12 mandatory security checklist items.

---

## License & Author
Created by **Antigravity AI** as a premium hardened frontend demonstration. Released under the MIT License.
