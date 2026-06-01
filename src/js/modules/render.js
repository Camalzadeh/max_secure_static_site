export function createSecureTextCanvas(text, fontSpec = 'bold 16px Outfit, sans-serif', color = '#06b6d4', height = 24) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = fontSpec;
  const metrics = ctx.measureText(text);
  const width = Math.ceil(metrics.width) + 4;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  ctx.font = fontSpec;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 2, height / 2);
  canvas.style.pointerEvents = 'none';
  canvas.style.userSelect = 'none';
  return canvas;
}

export function renderDashboard(dashboardData, logoutCallback) {
  const host = document.getElementById('dashboard-root');
  if (!host) return;
  const loginGate = document.getElementById('login-gate');
  if (loginGate) {
    loginGate.style.display = 'none';
  }
  host.style.display = 'block';
  host.innerHTML = '';
  const shadowRoot = host.attachShadow({ mode: 'closed' });
  const container = document.createElement('div');
  container.className = 'min-h-screen p-6 md:p-12 flex flex-col justify-between';
  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = 'css/style.min.css';
  shadowRoot.appendChild(styleLink);
  container.innerHTML = `
    <div class="max-w-7xl mx-auto w-full">
      <header class="flex justify-between items-center mb-12 border-b border-cyber-border pb-6">
        <div>
          <span class="text-xs uppercase tracking-widest text-cyber-muted">Operational Network</span>
          <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span class="inline-block w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
            Security Control Terminal
          </h1>
        </div>
        <button id="logout-btn" class="px-4 py-2 border border-cyber-accent/50 hover:bg-cyber-accent/10 text-cyber-accent text-sm font-semibold rounded-lg transition-all duration-300">
          Disconnect Node
        </button>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="cyber-glass p-6 rounded-2xl neon-glow-pulse flex flex-col order-2 lg:order-2">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-cyber-muted uppercase tracking-wider">Node System Health</h3>
            <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">OK</span>
          </div>
          <div class="space-y-4 flex-grow flex flex-col justify-center">
            <div class="flex justify-between items-center border-b border-cyber-border pb-3">
              <span class="text-sm text-cyber-muted">Primary Decryption Core</span>
              <span class="text-sm font-mono text-cyan-400">RC4-256 Stream</span>
            </div>
            <div class="flex justify-between items-center border-b border-cyber-border pb-3">
              <span class="text-sm text-cyber-muted">Active Sandbox Shield</span>
              <span class="text-sm font-mono text-green-400">Locked Prototypes</span>
            </div>
            <div class="flex justify-between items-center pb-3">
              <span class="text-sm text-cyber-muted">External DOM Isolation</span>
              <span class="text-sm font-mono text-purple-400">Shadow DOM (Closed)</span>
            </div>
          </div>
        </div>
        <div class="cyber-glass p-6 rounded-2xl lg:col-span-2 order-1 lg:order-1">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-sm font-bold text-cyber-muted uppercase tracking-wider">Protected Vault Payload</h3>
            <span class="text-xs font-semibold px-2 py-0.5 bg-green-950 border border-green-800 text-green-400 rounded-md">Decrypted State</span>
          </div>
          <div class="space-y-6">
            <p class="text-sm text-cyber-muted leading-relaxed">
              The metrics below are securely extracted from the LSB bits of the steganographic pixel array and rendered directly onto isolated Canvas units:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div class="border border-cyber-border/80 bg-cyber-bg/50 p-4 rounded-xl flex flex-col gap-2">
                <span class="text-xs font-semibold text-cyber-muted uppercase">Terminal Authorization Level</span>
                <div id="canvas-auth-level" class="h-6 flex items-center"></div>
              </div>
              <div class="border border-cyber-border/80 bg-cyber-bg/50 p-4 rounded-xl flex flex-col gap-2">
                <span class="text-xs font-semibold text-cyber-muted uppercase">Protected Session Salt</span>
                <div id="canvas-session-salt" class="h-6 flex items-center"></div>
              </div>
              <div class="border border-cyber-border/80 bg-cyber-bg/50 p-4 rounded-xl flex flex-col gap-2 md:col-span-2">
                <span class="text-xs font-semibold text-cyber-muted uppercase">Decrypted Secret Message</span>
                <div id="canvas-secret-message" class="h-6 flex items-center"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="cyber-glass p-6 rounded-2xl flex flex-col order-3 col-span-1 lg:col-span-3">
          <h3 class="text-sm font-bold text-cyber-muted uppercase tracking-wider mb-4">Static Decoy Diagnostics (Public Elements)</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-cyber-bg/20 p-3 rounded-lg border border-cyber-border">
              <span class="block text-xs text-cyber-muted">Network Load</span>
              <span class="text-lg font-bold font-mono text-white">0.02%</span>
            </div>
            <div class="bg-cyber-bg/20 p-3 rounded-lg border border-cyber-border">
              <span class="block text-xs text-cyber-muted">Ping Latency</span>
              <span class="text-lg font-bold font-mono text-white">12 ms</span>
            </div>
            <div class="bg-cyber-bg/20 p-3 rounded-lg border border-cyber-border">
              <span class="block text-xs text-cyber-muted">Decoy Requests</span>
              <span class="text-lg font-bold font-mono text-white">492,109</span>
            </div>
            <div class="bg-cyber-bg/20 p-3 rounded-lg border border-cyber-border">
              <span class="block text-xs text-cyber-muted">Threat Intercepts</span>
              <span class="text-lg font-bold font-mono text-red-400">9,214</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="mt-12 text-center text-xs text-cyber-muted border-t border-cyber-border/50 pt-6">
      &copy; 2026 Maximum Secure Static Site. Hardened Sandbox Environment Active.
    </footer>
  `;
  shadowRoot.appendChild(container);
  const drawSec = (id, text, font, color) => {
    const el = shadowRoot.getElementById(id);
    if (el) {
      const canvas = createSecureTextCanvas(text, font, color, 24);
      el.appendChild(canvas);
    }
  };
  drawSec('canvas-auth-level', dashboardData.authLevel, 'bold 16px Outfit, sans-serif', '#22d3ee');
  drawSec('canvas-session-salt', dashboardData.sessionSalt, '14px JetBrains Mono, Fira Code, monospace', '#a78bfa');
  drawSec('canvas-secret-message', dashboardData.secretMessage, 'bold 15px Outfit, sans-serif', '#4ade80');
  const logoutBtn = shadowRoot.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logoutCallback();
    });
  }
}
