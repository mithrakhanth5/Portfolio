/**
 * 3D High-Level Cyber Defense & Threat Matrix Scene
 * Built with Three.js (r128)
 * Features:
 * - Holographic Cyber Defense Globe with Geo Coordinates
 * - Dynamic Global Attack Arcs with traveling packet pulses
 * - Concentric Orbiting Defensive Shields
 * - Undulating Matrix Horizon Grid
 * - Sweeping Tactical 360° Radar
 * - Floating Hex / Cryptographic Particle Stream
 * - Scroll-Linked Dynamic Camera Choreography
 * - Interactive EMP Shockwave & Mouse Parallax
 * - Multi-DEFCON Color Matrix Shifts
 */

class CyberScene {
  constructor() {
    this.container = document.getElementById('webgl-canvas-container');
    if (!this.container) return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.defconLevel = 5; // 5: Secure (Cyan), 3: Elevated (Amber), 1: Critical (Red)

    // Palette configurations
    this.palettes = {
      5: {
        primary: 0x00f0ff,   // Cyber Cyan
        secondary: 0x3b82f6, // Electric Blue
        accent: 0x00ff88,    // Matrix Emerald
        glow: 0x0ea5e9,
        bgFog: 0x030712
      },
      3: {
        primary: 0xffb703,   // Warning Amber
        secondary: 0xfb8500, // Warning Orange
        accent: 0xffd166,
        glow: 0xf59e0b,
        bgFog: 0x120a03
      },
      1: {
        primary: 0xff0055,   // Breach Crimson
        secondary: 0xff3366, // Laser Red
        accent: 0xff00aa,    // Threat Magenta
        glow: 0xe11d48,
        bgFog: 0x140307
      }
    };

    this.activePalette = this.palettes[5];

    this.init();
    this.createObjects();
    this.bindEvents();
    this.animate();
  }

  init() {
    // Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(this.activePalette.bgFog, 0.022);

    // Camera
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 1.5, 16);
    this.cameraTarget = new THREE.Vector3(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.container.appendChild(this.renderer.domElement);

    // Ambient & Directional Lights
    this.ambientLight = new THREE.AmbientLight(0x0a192f, 1.5);
    this.scene.add(this.ambientLight);

    this.pointLight = new THREE.PointLight(this.activePalette.primary, 3, 40);
    this.pointLight.position.set(0, 5, 10);
    this.scene.add(this.pointLight);

    this.coreLight = new THREE.PointLight(this.activePalette.accent, 2, 20);
    this.coreLight.position.set(0, 0, 0);
    this.scene.add(this.coreLight);

    this.clock = new THREE.Clock();
  }

  createObjects() {
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    // 1. Central Cyber Globe (Point Cloud + Wireframe Lattice)
    this.buildCyberGlobe();

    // 2. Concentric Orbiting Defensive Shields
    this.buildDefensiveShields();

    // 3. Cyber Threat Attack Arcs with traveling pulses
    this.buildThreatArcs();

    // 4. Undulating Matrix Grid Floor
    this.buildMatrixGrid();

    // 5. Tactical Radar Sweep Fan
    this.buildRadarSweep();

    // 6. Floating Cryptographic Particles
    this.buildCryptoParticles();

    // 7. EMP Shockwave Ring (interactive)
    this.buildShockwave();
  }

  buildCyberGlobe() {
    const radius = 3.6;

    // A. Dense Point Sphere (Simulating global geo telemetry nodes)
    const dotCount = 2200;
    const dotGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(dotCount * 3);
    const colors = new Float32Array(dotCount * 3);
    const pColor = new THREE.Color(this.activePalette.primary);
    const sColor = new THREE.Color(this.activePalette.secondary);

    for (let i = 0; i < dotCount; i++) {
      // Golden spiral distribution on sphere
      const phi = Math.acos(-1 + (2 * i) / dotCount);
      const theta = Math.sqrt(dotCount * Math.PI) * phi;

      const r = radius + (Math.random() * 0.08 - 0.04);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color variation between primary & secondary
      const mixRatio = Math.random();
      const mixed = pColor.clone().lerp(sColor, mixRatio);
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    dotGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dotGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circular point texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(0,240,255,0.85)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const dotTexture = new THREE.CanvasTexture(canvas);

    const dotMaterial = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      map: dotTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.globePoints = new THREE.Points(dotGeometry, dotMaterial);
    this.globeGroup.add(this.globePoints);

    // B. Inner Cryptographic Core (Icosahedron wireframe)
    const icoGeo = new THREE.IcosahedronGeometry(radius * 0.94, 2);
    this.icoMaterial = new THREE.MeshBasicMaterial({
      color: this.activePalette.secondary,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    });
    this.innerCore = new THREE.Mesh(icoGeo, this.icoMaterial);
    this.globeGroup.add(this.innerCore);

    // C. Glowing Center Energy Nucleus
    const nucleusGeo = new THREE.SphereGeometry(radius * 0.35, 16, 16);
    this.nucleusMaterial = new THREE.MeshBasicMaterial({
      color: this.activePalette.accent,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.nucleus = new THREE.Mesh(nucleusGeo, this.nucleusMaterial);
    this.globeGroup.add(this.nucleus);
  }

  buildDefensiveShields() {
    this.shieldRings = [];

    const ringDefs = [
      { radius: 4.5, tube: 0.015, color: this.activePalette.primary, rotX: 1.1, rotY: 0.4, speed: 0.006 },
      { radius: 5.1, tube: 0.02, color: this.activePalette.accent, rotX: -0.6, rotY: 1.2, speed: -0.004 },
      { radius: 5.8, tube: 0.012, color: this.activePalette.secondary, rotX: 0.3, rotY: -0.8, speed: 0.008 }
    ];

    ringDefs.forEach(def => {
      // Main ring
      const ringGeo = new THREE.TorusGeometry(def.radius, def.tube, 8, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = def.rotX;
      ringMesh.rotation.y = def.rotY;

      // Outer dashed/segmented border
      const segmentGeo = new THREE.BufferGeometry();
      const segPoints = [];
      const segCount = 48;
      for (let i = 0; i < segCount; i++) {
        if (i % 2 === 0) continue; // dash effect
        const angle1 = (i / segCount) * Math.PI * 2;
        const angle2 = ((i + 0.6) / segCount) * Math.PI * 2;
        segPoints.push(new THREE.Vector3(Math.cos(angle1) * def.radius * 1.03, Math.sin(angle1) * def.radius * 1.03, 0));
        segPoints.push(new THREE.Vector3(Math.cos(angle2) * def.radius * 1.03, Math.sin(angle2) * def.radius * 1.03, 0));
      }
      segmentGeo.setFromPoints(segPoints);
      const segmentMat = new THREE.LineBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });
      const segmentLines = new THREE.LineSegments(segmentGeo, segmentMat);
      ringMesh.add(segmentLines);

      this.globeGroup.add(ringMesh);
      this.shieldRings.push({ mesh: ringMesh, speed: def.speed });
    });
  }

  buildThreatArcs() {
    this.threatArcs = [];
    const arcCount = 10;
    const r = 3.6;

    // Helper to get random point on sphere
    const getSpherePoint = () => {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const sinPhi = Math.sin(phi);
      return new THREE.Vector3(
        r * sinPhi * Math.cos(theta),
        r * sinPhi * Math.sin(theta),
        r * Math.cos(phi)
      );
    };

    for (let i = 0; i < arcCount; i++) {
      const p1 = getSpherePoint();
      let p2 = getSpherePoint();
      while (p1.distanceTo(p2) < 2.0) {
        p2 = getSpherePoint();
      }

      // Midpoint elevated above surface
      const mid = p1.clone().lerp(p2, 0.5);
      const midLen = mid.length();
      const altitude = 1.3 + Math.random() * 0.9;
      mid.normalize().multiplyScalar(r * altitude);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const curvePoints = curve.getPoints(40);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);

      const curveMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? this.activePalette.primary : this.activePalette.accent,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      });
      const arcLine = new THREE.Line(curveGeo, curveMat);
      this.globeGroup.add(arcLine);

      // Pulse traveling packet head
      const pulseGeo = new THREE.SphereGeometry(0.07, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0xff0055 : this.activePalette.primary,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      this.globeGroup.add(pulseMesh);

      this.threatArcs.push({
        curve: curve,
        pulseMesh: pulseMesh,
        speed: 0.003 + Math.random() * 0.005,
        progress: Math.random(),
        line: arcLine
      });
    }
  }

  buildMatrixGrid() {
    // 3D undulating grid plane floor
    const size = 120;
    const divisions = 60;
    this.gridGeo = new THREE.PlaneGeometry(size, size, divisions, divisions);
    this.gridGeo.rotateX(-Math.PI / 2);

    this.gridMat = new THREE.MeshBasicMaterial({
      color: this.activePalette.secondary,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending
    });

    this.matrixGrid = new THREE.Mesh(this.gridGeo, this.gridMat);
    this.matrixGrid.position.y = -8;
    this.matrixGrid.position.z = -15;
    this.scene.add(this.matrixGrid);

    // Store base vertex heights for wave animation
    this.gridPositions = this.gridGeo.attributes.position;
    this.gridInitialY = new Float32Array(this.gridPositions.count);
    for (let i = 0; i < this.gridPositions.count; i++) {
      this.gridInitialY[i] = this.gridPositions.getY(i);
    }
  }

  buildRadarSweep() {
    // Volumetric 360 radar sweep cone
    const radarGeo = new THREE.ConeGeometry(8, 0.05, 32, 1, true, 0, Math.PI / 3);
    radarGeo.rotateX(Math.PI / 2);
    radarGeo.translate(0, 0, 4);

    this.radarMat = new THREE.MeshBasicMaterial({
      color: this.activePalette.accent,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    this.radarSweep = new THREE.Mesh(radarGeo, this.radarMat);
    this.radarSweep.position.set(0, 0, 0);
    this.globeGroup.add(this.radarSweep);
  }

  buildCryptoParticles() {
    // Floating cyber dust & hex fragments
    const count = 700;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = Math.random() * 0.02 + 0.005; // upwards drift
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.cryptoVelocities = velocities;

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      color: this.activePalette.primary,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    this.cryptoParticles = new THREE.Points(geo, mat);
    this.scene.add(this.cryptoParticles);
  }

  buildShockwave() {
    // EMP shockwave ring triggered by clicks or scans
    const shockGeo = new THREE.RingGeometry(0.1, 0.4, 64);
    this.shockMat = new THREE.MeshBasicMaterial({
      color: this.activePalette.primary,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    this.shockwave = new THREE.Mesh(shockGeo, this.shockMat);
    this.shockwave.position.set(0, 0, 0);
    this.shockwave.visible = false;
    this.scene.add(this.shockwave);
    this.shockwaveState = { active: false, scale: 0.1, opacity: 1 };
  }

  triggerEMP(origin = { x: 0, y: 0, z: 0 }) {
    if (!this.shockwave) return;
    this.shockwave.position.set(origin.x, origin.y, origin.z);
    this.shockwave.lookAt(this.camera.position);
    this.shockwave.scale.set(1, 1, 1);
    this.shockwaveState = { active: true, scale: 0.2, opacity: 1.0 };
    this.shockwave.visible = true;

    if (window.cyberAudio) {
      window.cyberAudio.playShockwave();
    }
  }

  setDefcon(level) {
    if (!this.palettes[level]) return;
    this.defconLevel = level;
    this.activePalette = this.palettes[level];

    // Smoothly update light & material colors
    const targetPrimary = new THREE.Color(this.activePalette.primary);
    const targetSecondary = new THREE.Color(this.activePalette.secondary);
    const targetAccent = new THREE.Color(this.activePalette.accent);

    if (window.gsap) {
      gsap.to(this.pointLight.color, { r: targetPrimary.r, g: targetPrimary.g, b: targetPrimary.b, duration: 0.8 });
      gsap.to(this.coreLight.color, { r: targetAccent.r, g: targetAccent.g, b: targetAccent.b, duration: 0.8 });
      gsap.to(this.scene.fog.color, {
        r: new THREE.Color(this.activePalette.bgFog).r,
        g: new THREE.Color(this.activePalette.bgFog).g,
        b: new THREE.Color(this.activePalette.bgFog).b,
        duration: 0.8
      });
      gsap.to(this.icoMaterial.color, { r: targetSecondary.r, g: targetSecondary.g, b: targetSecondary.b, duration: 0.8 });
      gsap.to(this.gridMat.color, { r: targetSecondary.r, g: targetSecondary.g, b: targetSecondary.b, duration: 0.8 });
      gsap.to(this.radarMat.color, { r: targetAccent.r, g: targetAccent.g, b: targetAccent.b, duration: 0.8 });
    } else {
      this.pointLight.color.copy(targetPrimary);
      this.coreLight.color.copy(targetAccent);
      this.icoMaterial.color.copy(targetSecondary);
      this.gridMat.color.copy(targetSecondary);
      this.radarMat.color.copy(targetAccent);
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());

    // Mouse parallax
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / this.width) * 2 - 1;
      this.mouse.targetY = -(e.clientY / this.height) * 2 + 1;
    });

    // Click for interactive EMP
    window.addEventListener('click', (e) => {
      // Avoid triggering when clicking buttons or inputs
      if (['BUTTON', 'A', 'INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      this.triggerEMP({
        x: (this.mouse.targetX * 6),
        y: (this.mouse.targetY * 4),
        z: 0
      });
    });

    // Touch support for mobile parallax
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.targetX = (e.touches[0].clientX / this.width) * 2 - 1;
        this.mouse.targetY = -(e.touches[0].clientY / this.height) * 2 + 1;
      }
    }, { passive: true });

    // Scroll mapping
    window.addEventListener('scroll', () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }, { passive: true });
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // Camera choreography based on active section
  updateCameraChoreography(elapsed) {
    // Lerp mouse
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Define 6 key camera positions for each section based on scroll progress:
    // 0: Hero, 0.2: About/Summary, 0.4: Skills, 0.6: Experience, 0.8: Projects, 1.0: Certs/Terminal
    const sp = this.scrollProgress;

    let targetCamX = 0;
    let targetCamY = 1.2;
    let targetCamZ = 16;
    let globePosX = 0;
    let globePosY = 0;
    let globeScale = 1.0;

    if (sp < 0.18) {
      // HERO: Majestic center view
      targetCamX = this.mouse.x * 2.0;
      targetCamY = 1.5 + this.mouse.y * 1.5;
      targetCamZ = 16;
      globePosX = window.innerWidth > 960 ? 3.2 : 0;
      globePosY = window.innerWidth > 960 ? 0.2 : 1.5;
      globeScale = window.innerWidth > 960 ? 1.05 : 0.78;
    } else if (sp < 0.38) {
      // ABOUT / POSTURE: Globe moves left, zoomed in to show core vulnerability lattice
      targetCamX = -2.0 + this.mouse.x * 1.5;
      targetCamY = 0.5 + this.mouse.y * 1.2;
      targetCamZ = 13;
      globePosX = -3.8;
      globePosY = 0.2;
      globeScale = 1.25;
    } else if (sp < 0.58) {
      // SKILLS: Overhead tactical command angle
      targetCamX = this.mouse.x * 2.5;
      targetCamY = 5.0 + this.mouse.y * 1.5;
      targetCamZ = 17;
      globePosX = 0;
      globePosY = -2.0;
      globeScale = 1.35;
    } else if (sp < 0.78) {
      // EXPERIENCE: Side corridor telemetry tracking
      targetCamX = 3.5 + this.mouse.x * 1.5;
      targetCamY = 0.8 + this.mouse.y * 1.0;
      targetCamZ = 14;
      globePosX = 4.0;
      globePosY = 0;
      globeScale = 1.1;
    } else if (sp < 0.92) {
      // PROJECTS: Dynamic elevated matrix view
      targetCamX = -3.0 + this.mouse.x * 2.0;
      targetCamY = 2.0 + this.mouse.y * 1.2;
      targetCamZ = 15;
      globePosX = -4.2;
      globePosY = 0.5;
      globeScale = 1.15;
    } else {
      // CERTS & TERMINAL: Deep hacker command console mode
      targetCamX = this.mouse.x * 1.5;
      targetCamY = -1.0 + this.mouse.y * 1.0;
      targetCamZ = 14;
      globePosX = 0;
      globePosY = 1.8;
      globeScale = 0.95;
    }

    // Smooth lerping of camera & globe positions
    this.camera.position.x += (targetCamX - this.camera.position.x) * 0.05;
    this.camera.position.y += (targetCamY - this.camera.position.y) * 0.05;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.05;

    this.globeGroup.position.x += (globePosX - this.globeGroup.position.x) * 0.05;
    this.globeGroup.position.y += (globePosY - this.globeGroup.position.y) * 0.05;

    const currentScale = this.globeGroup.scale.x;
    const newScale = currentScale + (globeScale - currentScale) * 0.05;
    this.globeGroup.scale.set(newScale, newScale, newScale);

    this.camera.lookAt(this.cameraTarget);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // 1. Globe Rotations
    if (this.globeGroup) {
      this.globeGroup.rotation.y += 0.0035;
      this.innerCore.rotation.x -= 0.005;
      this.innerCore.rotation.z += 0.003;
      this.nucleus.rotation.y += 0.01;
    }

    // 2. Shield Rings Counter-Rotation
    if (this.shieldRings) {
      this.shieldRings.forEach(item => {
        item.mesh.rotation.z += item.speed;
        item.mesh.rotation.x += item.speed * 0.4;
      });
    }

    // 3. Threat Attack Arcs & Pulses
    if (this.threatArcs) {
      this.threatArcs.forEach(item => {
        item.progress += item.speed;
        if (item.progress > 1.0) item.progress = 0;
        const pos = item.curve.getPoint(item.progress);
        item.pulseMesh.position.copy(pos);
      });
    }

    // 4. Undulating Matrix Grid Wave
    if (this.matrixGrid && this.gridPositions) {
      for (let i = 0; i < this.gridPositions.count; i++) {
        const u = this.gridPositions.getX(i);
        const v = this.gridPositions.getZ(i);
        const wave = Math.sin(u * 0.15 + elapsed * 1.5) * Math.cos(v * 0.15 + elapsed * 1.2) * 0.6;
        this.gridPositions.setY(i, this.gridInitialY[i] + wave);
      }
      this.gridPositions.needsUpdate = true;
    }

    // 5. Radar Sweep
    if (this.radarSweep) {
      this.radarSweep.rotation.z -= 0.025;
    }

    // 6. Floating Crypto Particles
    if (this.cryptoParticles) {
      const pos = this.cryptoParticles.geometry.attributes.position;
      const count = pos.count;
      for (let i = 0; i < count; i++) {
        let y = pos.getY(i) + this.cryptoVelocities[i * 3 + 1];
        if (y > 15) y = -15;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
      this.cryptoParticles.rotation.y = elapsed * 0.02;
    }

    // 7. EMP Shockwave Expansion
    if (this.shockwaveState.active) {
      this.shockwaveState.scale += 0.4;
      this.shockwaveState.opacity -= 0.028;
      this.shockwave.scale.set(this.shockwaveState.scale, this.shockwaveState.scale, 1);
      this.shockMat.opacity = Math.max(0, this.shockwaveState.opacity);

      if (this.shockwaveState.opacity <= 0) {
        this.shockwaveState.active = false;
        this.shockwave.visible = false;
      }
    }

    // 8. Camera Choreography
    this.updateCameraChoreography(elapsed);

    // 9. Render
    this.renderer.render(this.scene, this.camera);
  }
}

// Global initialization helper
window.addEventListener('DOMContentLoaded', () => {
  window.cyberScene = new CyberScene();
});
