/**
 * Interactive Cyber SOC Terminal Engine
 * Supports realistic command parsing, tab completion, history buffer,
 * simulated network/vulnerability scans, matrix rain, and 3D theme sync.
 */

class CyberTerminal {
  constructor() {
    this.modal = document.getElementById('terminal-modal');
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.closeBtn = document.getElementById('terminal-close-btn');
    this.openBtns = document.querySelectorAll('.trigger-terminal');

    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: 'List all available operational commands',
      whoami: 'Display security analyst profile & credentials',
      skills: 'List security toolchain, attack vectors & penetration testing skills',
      projects: 'List security & automation projects (use `project <id>`)',
      experience: 'Display enterprise and training professional experience',
      certs: 'Show industry cybersecurity certifications',
      scan: 'Simulate vulnerability & port scan on target (e.g., `scan target.corp`)',
      qualys: 'Run simulated Qualys VMDR automated asset vulnerability audit',
      matrix: 'Toggle full-screen digital phosphor matrix rain',
      defcon: 'Set system alert level (`defcon 1`, `defcon 3`, `defcon 5`)',
      contact: 'Display direct communication channels & coordinates',
      clear: 'Clear terminal screen buffer'
    };

    this.init();
  }

  init() {
    if (!this.input || !this.output) return;

    // Open/Close bindings
    this.openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Keyboard shortcut: Backquote (`) or Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Input handlers
    this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Welcome banner
    this.printBanner();
  }

  isOpen() {
    return this.modal && this.modal.classList.contains('active');
  }

  open() {
    if (!this.modal) return;
    this.modal.classList.add('active');
    setTimeout(() => this.input.focus(), 100);
    if (window.cyberAudio) window.cyberAudio.playClick();
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    if (window.cyberAudio) window.cyberAudio.playClick();
  }

  toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  }

  printBanner() {
    const banner = `
<span class="term-cyan">========================================================================</span>
<span class="term-green">MITHRA KHANTH S // SECURITY ANALYST & PENETRATION TESTER COMMAND CONSOLE</span>
<span class="term-muted">SYSTEM STATUS: [ONLINE] | DEFCON: 5 [SECURE] | ENCRYPTION: TLS 1.3 / AES-256</span>
<span class="term-cyan">========================================================================</span>
Type <span class="term-highlight">'help'</span> to view security commands or try <span class="term-highlight">'scan enterprise-target'</span>.
`;
    this.appendRaw(banner);
  }

  appendRaw(html) {
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = html;
    this.output.appendChild(div);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.output.scrollTop = this.output.scrollHeight;
  }

  handleKeyDown(e) {
    if (window.cyberAudio) window.cyberAudio.playKeystroke();

    if (e.key === 'Enter') {
      const cmd = this.input.value.trim();
      this.input.value = '';
      if (cmd) {
        this.history.push(cmd);
        this.historyIndex = this.history.length;
        this.appendRaw(`<span class="term-prompt">guest@mithrakhanth-sec:~$</span> <span class="term-cmd">${this.escape(cmd)}</span>`);
        this.executeCommand(cmd);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.history.length > 0 && this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.handleTabComplete();
    }
  }

  handleTabComplete() {
    const val = this.input.value.toLowerCase().trim();
    if (!val) return;
    const matches = Object.keys(this.commands).filter(c => c.startsWith(val));
    if (matches.length === 1) {
      this.input.value = matches[0];
    } else if (matches.length > 1) {
      this.appendRaw(`<span class="term-muted">Suggestions: ${matches.join(', ')}</span>`);
    }
  }

  escape(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  executeCommand(raw) {
    const parts = raw.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    switch (cmd) {
      case 'help':
      case '?':
        let helpText = `<div class="term-grid">`;
        Object.entries(this.commands).forEach(([c, desc]) => {
          helpText += `<div><span class="term-highlight">${c.padEnd(12)}</span> <span class="term-muted">- ${desc}</span></div>`;
        });
        helpText += `</div>`;
        this.appendRaw(helpText);
        break;

      case 'whoami':
        this.appendRaw(`
<div class="term-box">
  <span class="term-green font-bold">MITHRA KHANTH S</span>
  <div class="term-muted">Security Analyst | Web Application Penetration Testing | Application Security</div>
  <div style="margin-top:6px;">
    Cyber Security engineering student with hands-on experience in vulnerability assessment, vulnerability management, and web & app security.
    Skilled in finding and remediating SQLi, XSS, CSRF, IDOR, SSRF, and Broken Access Control aligned with OWASP Top 10.
    Dual background in penetration testing and 4 years of web development (HTML, CSS, JS, REST APIs) enabling rapid root-cause analysis.
  </div>
  <div style="margin-top:6px;" class="term-cyan">Location: Coimbatore, Tamil Nadu, India | Open to relocate within Kerala</div>
</div>
`);
        break;

      case 'skills':
        this.appendRaw(`
<div class="term-box">
  <span class="term-cyan font-bold">[PENETRATION TESTING & ASSESSMENT]</span>
  <div>• Web App Pentesting, Manual & Automated Vulnerability Assessment, Risk Assessment, Web Architecture Analysis, Threat Posture Assessment</div>
  <br/>
  <span class="term-green font-bold">[VULNERABILITY RESEARCH & OWASP]</span>
  <div>• OWASP Top 10, SQL Injection (SQLi), Cross-Site Scripting (XSS), CSRF, IDOR, Broken Authentication & Session Mgmt, Broken Access Control, SSRF, File Upload Flaws, API Security Testing</div>
  <br/>
  <span class="term-accent font-bold">[SECURITY TOOLCHAIN & ARSENAL]</span>
  <div>• Burp Suite, OWASP ZAP, Nikto, Nmap, Wireshark, SQLMap, Postman, Kali Linux, Qualys VMDR</div>
  <br/>
  <span class="term-highlight font-bold">[PROGRAMMING & AUTOMATION]</span>
  <div>• Python, Java, JavaScript (ES6+), Node.js, React & Angular exposure, n8n Workflow Automation, AI Prompt Engineering, REST APIs</div>
</div>
`);
        break;

      case 'projects':
        if (arg) {
          this.showProjectDetail(arg);
        } else {
          this.appendRaw(`
<div class="term-box">
  <span class="term-green font-bold">[MITHRA KHANTH'S SECURITY REPOSITORY]</span>
  <div class="term-muted">Type <span class="term-cyan">'projects &lt;id&gt;'</span> (e.g. 'projects 1') for architecture & payload breakdown:</div>
  <br/>
  <div><span class="term-highlight">[1] APK Analysis Project</span> - Android security auditing, decompilation & vulnerability analysis</div>
  <div><span class="term-highlight">[2] Vulnerability-Aware Chat App</span> - Real-time malicious URL and payload scanning engine</div>
  <div><span class="term-highlight">[3] Secure Hospital Web Portal</span> - 2-step MFA verification portal with Twilio Segment integration</div>
  <div><span class="term-highlight">[4] File Integrity Monitoring (FIM)</span> - Real-time automated system file change & hash auditor</div>
  <div><span class="term-highlight">[5] Hybrid Cryptography System</span> - Dual-layer encryption framework (AES-256 + RSA-4096) for data transit</div>
  <div><span class="term-highlight">[6] Automated Business Workflows</span> - n8n incident alerts, daily telemetry, and WhatsApp/Email pipeline</div>
</div>
`);
        }
        break;

      case 'project':
        this.showProjectDetail(arg);
        break;

      case 'certs':
      case 'certifications':
        this.appendRaw(`
<div class="term-box">
  <span class="term-cyan font-bold">[OFFICIAL CYBERSECURITY CREDENTIALS]</span>
  <br/>
  <div><span class="term-green font-bold">1. ISC2 - Certified in Cybersecurity (CC)</span> <span class="term-muted">| Globally recognized infosec foundational mastery</span></div>
  <div><span class="term-green font-bold">2. Cisco - Ethical Hacker</span> <span class="term-muted">| Penetration testing, reconnaissance & network defense</span></div>
  <div><span class="term-green font-bold">3. Qualys - Certified Specialist (VMDR)</span> <span class="term-muted">| Vulnerability Management, Detection, & Response</span></div>
  <div><span class="term-green font-bold">4. Twilio Segment - Certified</span> <span class="term-muted">| Secure customer data infrastructure & event telemetry</span></div>
  <br/>
  <div class="term-muted font-bold">[ACADEMIC CREDENTIAL]</div>
  <div>• B.E. - Cyber Security | Park College of Engineering & Technology, Coimbatore (2023 - 2027)</div>
</div>
`);
        break;

      case 'experience':
      case 'exp':
        this.appendRaw(`
<div class="term-box">
  <span class="term-cyan font-bold">[1] DATADRONE INC. | Automation and Qualys Implementation Engineer</span>
  <span class="term-muted">(March 2026 - Present)</span>
  <div>• Deploy and configure Qualys VMDR across enterprise assets for real-time visibility.</div>
  <div>• Perform vulnerability assessments, prioritizing CVEs by CVSS score & business risk.</div>
  <div>• Coordinate remediation guidance with engineering squads to beat SLA milestones.</div>
  <div>• Built automated n8n workflows for incident alerting, reporting, and AI prompt synthesis.</div>
  <br/>
  <span class="term-green font-bold">[2] PUPE (CYBER SECURITY INITIATIVES) | Web & App Developer / Cyber Security Trainer</span>
  <span class="term-muted">(January 2023 - March 2026)</span>
  <div>• Developed hardened web/mobile architectures with login defense, OTP/SMS, and secure session management.</div>
  <div>• Conducted source code review and behavioral analysis against OWASP Top 10 flaws.</div>
  <div>• Trained staff and students on phishing detection, threat hunting, and social engineering counter-measures.</div>
</div>
`);
        break;

      case 'scan':
        this.simulatePortScan(arg || 'target.local');
        break;

      case 'qualys':
        this.simulateQualysScan();
        break;

      case 'matrix':
        this.toggleMatrixEffect();
        break;

      case 'defcon':
        const lvl = parseInt(arg, 10);
        if ([1, 3, 5].includes(lvl)) {
          if (window.cyberScene) window.cyberScene.setDefcon(lvl);
          if (window.cyberAudio) {
            lvl === 1 ? window.cyberAudio.playAlert() : window.cyberAudio.playScan();
          }
          this.appendRaw(`<span class="term-${lvl === 1 ? 'red' : (lvl === 3 ? 'accent' : 'cyan')} font-bold">[DEFCON MODE CHANGED TO ${lvl}] Global lighting and threat posture synchronized.</span>`);
        } else {
          this.appendRaw(`<span class="term-red">Usage: defcon &lt;1 | 3 | 5&gt; (1: Critical, 3: Warning, 5: Secure)</span>`);
        }
        break;

      case 'contact':
        this.appendRaw(`
<div class="term-box">
  <span class="term-cyan font-bold">[DIRECT COMMUNICATION CHANNELS]</span>
  <div>• Email: <a href="mailto:s.mithrakhanth@gmail.com" class="term-green">s.mithrakhanth@gmail.com</a></div>
  <div>• Phone: <a href="tel:+919342915874" class="term-green">+91 93429 15874</a></div>
  <div>• LinkedIn: <a href="https://linkedin.com/in/mithrakhanth-s" target="_blank" class="term-cyan">linkedin.com/in/mithrakhanth-s</a></div>
  <div>• Base: Coimbatore, Tamil Nadu, India (Relocating to Kerala)</div>
</div>
`);
        break;

      case 'clear':
        this.output.innerHTML = '';
        break;

      case 'sudo':
        this.appendRaw(`<span class="term-red">[-] Access Denied: User guest is not in sudoers file. Incident logged to Qualys VMDR console.</span>`);
        if (window.cyberAudio) window.cyberAudio.playAlert();
        break;

      default:
        this.appendRaw(`<span class="term-red">Command not recognized: '${this.escape(cmd)}'. Type 'help' for command list.</span>`);
        break;
    }
  }

  showProjectDetail(id) {
    const projects = {
      '1': {
        name: 'APK Analysis Project',
        tech: 'Kali Linux, Jadx, ADB, MobSF, Python',
        desc: 'Static and dynamic binary assessment of Android applications. Identified hardcoded cryptographic keys, insecure data storage, excessive permissions, and exported broadcast receivers.',
        result: 'Hardened application manifest, mitigated sensitive data leakage via SharedPreferences encryption.'
      },
      '2': {
        name: 'Vulnerability-Aware Chat Application',
        tech: 'Node.js, WebSockets, Python, OWASP ZAP API',
        desc: 'Real-time conversational platform equipped with inline heuristic scanning for phishing links, malicious payloads, and XSS vectors injected into the chat stream.',
        result: '99.4% detection rate of dangerous URLs with sub-100ms real-time sanitization.'
      },
      '3': {
        name: 'Secure Hospital Web Portal',
        tech: 'React, Node.js, Twilio Segment, 2FA/MFA, RBAC',
        desc: 'HIPAA-conscious healthcare management portal featuring role-based access control, encrypted medical record transit, and Twilio 2-step verification.',
        result: 'Zero broken access control flaws across test cycles; robust session integrity.'
      },
      '4': {
        name: 'File Integrity Monitoring (FIM) Tool',
        tech: 'Python, SHA-256 Hashing, SQLite, System Daemon',
        desc: 'Automated real-time background auditor monitoring critical OS binaries and configurations. Detects unauthorized file edits, deletions, or permission alterations.',
        result: 'Instant cryptographic hash mismatch notifications and auto-isolation triggers.'
      },
      '5': {
        name: 'Hybrid Cryptography System',
        tech: 'Python, AES-256 (GCM), RSA-4096, PBKDF2',
        desc: 'High-assurance data encryption architecture leveraging symmetric speed for high-volume payloads and asymmetric key encapsulation for bulletproof key exchanges.',
        result: 'Guaranteed confidentiality, non-repudiation, and forward secrecy.'
      },
      '6': {
        name: 'Automated Business Workflows (n8n)',
        tech: 'n8n, Webhooks, AI Prompt Engineering, WhatsApp API, REST',
        desc: 'Autonomous enterprise pipeline connecting security telemetry, order dispatch, daily executive sales/stock reports, and automated incident escalations.',
        result: 'Eliminated manual report overhead by 85% with AI-synthesized daily intelligence.'
      }
    };

    const cleanId = id.trim().replace(/^0+/, '');
    const p = projects[cleanId];
    if (p) {
      this.appendRaw(`
<div class="term-box">
  <span class="term-green font-bold">[PROJECT ${cleanId}: ${p.name}]</span>
  <div class="term-muted">Stack: ${p.tech}</div>
  <div style="margin:6px 0;">${p.desc}</div>
  <div class="term-cyan">Outcome: ${p.result}</div>
</div>
`);
    } else {
      this.appendRaw(`<span class="term-red">Project '${this.escape(id)}' not found. Enter 1 through 6.</span>`);
    }
  }

  simulatePortScan(target) {
    if (window.cyberAudio) window.cyberAudio.playScan();
    this.appendRaw(`<span class="term-cyan font-bold">[*] Initiating SYN Stealth Recon Scan on [${this.escape(target)}]...</span>`);
    this.appendRaw(`<span class="term-muted">[*] Resolving DNS and dispatching probe packets...</span>`);

    const ports = [
      { port: 22, svc: 'SSH (OpenSSH 8.9p1)', state: 'OPEN', risk: 'LOW' },
      { port: 80, svc: 'HTTP (nginx 1.18.0)', state: 'OPEN', risk: 'MEDIUM' },
      { port: 443, svc: 'HTTPS (TLS 1.3)', state: 'OPEN', risk: 'SECURE' },
      { port: 3306, svc: 'MySQL Database', state: 'FILTERED', risk: 'HIGH' },
      { port: 8080, svc: 'HTTP-Proxy / Dev Portal', state: 'OPEN', risk: 'CRITICAL (OWASP-A01)' }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < ports.length) {
        const p = ports[i];
        const color = p.risk.includes('CRITICAL') ? 'term-red' : (p.risk.includes('HIGH') ? 'term-accent' : 'term-green');
        this.appendRaw(`[+] PORT ${p.port}/tcp <span class="term-cyan">${p.state.padEnd(8)}</span> <span class="term-muted">${p.svc.padEnd(26)}</span> <span class="${color}">[${p.risk}]</span>`);
        if (window.cyberAudio) window.cyberAudio.playKeystroke();
        i++;
      } else {
        clearInterval(interval);
        this.appendRaw(`
<div class="term-box">
  <span class="term-red font-bold">[RECON SUMMARY]: 5 ports analyzed. 1 Critical Misconfiguration identified on Port 8080.</span>
  <div class="term-muted">Recommendation: Enforce strict IP whitelisting & patch endpoint aligned with WSTG guidelines.</div>
</div>
`);
        if (window.cyberScene) {
          window.cyberScene.triggerEMP();
        }
      }
    }, 280);
  }

  simulateQualysScan() {
    if (window.cyberAudio) window.cyberAudio.playScan();
    this.appendRaw(`<span class="term-green font-bold">[*] Triggering Qualys VMDR Enterprise Scanner v10.4...</span>`);
    this.appendRaw(`<span class="term-muted">[*] Querying asset registry across Cloud & On-Prem network...</span>`);

    setTimeout(() => {
      this.appendRaw(`<span class="term-cyan">[1/3] Asset Discovery Completed: 1,420 Hosts Indexed</span>`);
      if (window.cyberAudio) window.cyberAudio.playKeystroke();
    }, 400);

    setTimeout(() => {
      this.appendRaw(`<span class="term-cyan">[2/3] Vulnerability Signatures Evaluated: 84,200 CVE definitions matched</span>`);
      if (window.cyberAudio) window.cyberAudio.playKeystroke();
    }, 900);

    setTimeout(() => {
      this.appendRaw(`
<div class="term-box">
  <span class="term-green font-bold">[QUALYS VMDR AUDIT SUMMARY]</span>
  <div>• Total Assessed Assets: 1,420</div>
  <div>• Priority 1 (Urgent CVEs): <span class="term-green">0 Unremediated</span></div>
  <div>• Priority 2 (High Risk): <span class="term-accent">3 Assets (Patches scheduled under SLA)</span></div>
  <div>• Mean Time to Remediate (MTTR): <span class="term-cyan">4.2 Days (48% faster than industry standard)</span></div>
  <div>• Qualys TruRisk Score: <span class="term-green">872 / 1000 [EXCELLENT POSTURE]</span></div>
</div>
`);
      if (window.cyberAudio) window.cyberAudio.playClick();
    }, 1500);
  }

  toggleMatrixEffect() {
    let canvas = document.getElementById('matrix-rain-canvas');
    if (canvas) {
      canvas.remove();
      this.appendRaw(`<span class="term-muted">Matrix digital rain disabled.</span>`);
      return;
    }

    canvas = document.createElement('canvas');
    canvas.id = 'matrix-rain-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99998';
    canvas.style.opacity = '0.35';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '0123456789ABCDEF01XSS_SQLI_CVSS_OWASP_ISC2';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff88';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    canvas._interval = interval;
    this.appendRaw(`<span class="term-green">[+] Matrix digital rain initiated. Run 'matrix' again to dismiss.</span>`);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.cyberTerminal = new CyberTerminal();
});
