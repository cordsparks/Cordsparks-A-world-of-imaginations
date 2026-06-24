/* ============================================
   CORDSPARKS — script.js
   Three.js 3D scenes + UI logic
   ============================================ */

'use strict';

/* ─── WAIT FOR THREE.JS ─── */
(function init() {
  if (typeof THREE === 'undefined') {
    setTimeout(init, 50);
    return;
  }
  boot();
})();

function boot() {

  /* ─── NAV ─── */
  const navbar     = document.getElementById('navbar');
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });

  /* ─── SMOOTH NAV ACTIVE STATE ─── */
  const sections = document.querySelectorAll('section[id]');
  const navItems = navLinks.querySelectorAll('a');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navItems.forEach(a => a.classList.remove('active'));
        const active = navLinks.querySelector(`a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => observer.observe(s));

  /* ─── SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll(
    '.service-card, .project-card, .skill-chip, .pillar, .about-text, .contact-item, .founder-card'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ─── SKILLS BAR ANIMATION ─── */
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animated');
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.skill-chip').forEach(c => skillObs.observe(c));

  /* ─── CONTACT FORM ─── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Message Sent ✓';
      btn.style.background = 'var(--green)';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    });
  }

  /* ─── THREE.JS HERO SCENE ─── */
  initHeroScene();

  /* ─── THREE.JS ABOUT SCENE ─── */
  initAboutScene();

  /* ─── SKILLS CANVAS ─── */
  initSkillsCanvas();
}

/* ═══════════════════════════════════════════
   HERO — Particle field + floating logo ring
   ═══════════════════════════════════════════ */
function initHeroScene() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.set(0, 0, 28);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ── PARTICLE FIELD ── */
  const PARTICLE_COUNT = 1200;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);
  const sizes     = new Float32Array(PARTICLE_COUNT);

  const colorsArr = [
    new THREE.Color('#00d4ff'),
    new THREE.Color('#7c3aed'),
    new THREE.Color('#00ff88'),
    new THREE.Color('#ffffff'),
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const spread = 60;
    positions[i * 3 + 0] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
    const c = colorsArr[Math.floor(Math.random() * colorsArr.length)];
    colors[i * 3 + 0] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
    sizes[i] = Math.random() * 1.6 + 0.3;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  pGeo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const pMat = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ── FLOATING TORUS RINGS ── */
  const ringGroup = new THREE.Group();
  scene.add(ringGroup);

  const ringData = [
    { r: 6,   tube: 0.04, color: 0x00d4ff, opacity: 0.5, rx: 0.3, ry: 0,   rz: 0 },
    { r: 8.5, tube: 0.03, color: 0x7c3aed, opacity: 0.35, rx: Math.PI/2, ry: 0.4, rz: 0 },
    { r: 11,  tube: 0.025, color: 0x00ff88, opacity: 0.25, rx: 0.8, ry: 0.8, rz: 0 },
  ];

  const rings = ringData.map(d => {
    const geo = new THREE.TorusGeometry(d.r, d.tube, 16, 120);
    const mat = new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: d.opacity, blending: THREE.AdditiveBlending });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.set(d.rx, d.ry, d.rz);
    ringGroup.add(mesh);
    return mesh;
  });

  /* ── ICOSAHEDRON ── */
  const icoGeo  = new THREE.IcosahedronGeometry(3.8, 1);
  const wireGeo = new THREE.WireframeGeometry(icoGeo);
  const wireMat = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
  const ico     = new THREE.LineSegments(wireGeo, wireMat);
  scene.add(ico);

  /* ── MOUSE PARALLAX ── */
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ── ANIMATE ── */
  let frame;
  let t = 0;
  function animate() {
    frame = requestAnimationFrame(animate);
    t += 0.005;

    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.015;

    ringGroup.rotation.y = t * 0.12 + mx * 0.08;
    ringGroup.rotation.x = t * 0.06 + my * 0.05;
    rings[0].rotation.z  = t * 0.3;
    rings[1].rotation.x  = t * 0.2;
    rings[2].rotation.y  = t * 0.15;

    ico.rotation.y = t * 0.18 + mx * 0.1;
    ico.rotation.x = t * 0.09 + my * 0.06;
    ico.position.y = Math.sin(t * 0.6) * 0.6;

    camera.position.x += (mx * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (-my * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  /* ── PAUSE WHEN OFF SCREEN ── */
  const heroEl = document.getElementById('hero');
  const pauseObs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!frame) animate(); }
    else { cancelAnimationFrame(frame); frame = null; }
  }, { threshold: 0 });
  if (heroEl) pauseObs.observe(heroEl);
}

/* ═══════════════════════════════════════════
   ABOUT — Rotating DNA / helix visual
   ═══════════════════════════════════════════ */
function initAboutScene() {
  const canvas = document.getElementById('aboutCanvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  function resize() {
    const w = canvas.clientWidth  || canvas.parentElement.clientWidth;
    const h = canvas.clientHeight || canvas.parentElement.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ── FLOATING CUBES ── */
  const group  = new THREE.Group();
  scene.add(group);

  const cubeData = [
    { s: 1.4,  x:  0,   y:  0,   z:  0,   c: 0x00d4ff },
    { s: 0.8,  x:  3.5, y:  1.5, z: -1,   c: 0x7c3aed },
    { s: 0.6,  x: -3,   y: -1.5, z:  1,   c: 0x00ff88 },
    { s: 0.5,  x:  2,   y: -3,   z:  0.5, c: 0x00d4ff },
    { s: 0.45, x: -2.5, y:  2.5, z: -0.5, c: 0x7c3aed },
    { s: 0.35, x:  0.5, y:  3.5, z:  1,   c: 0x00ff88 },
  ];

  const cubes = cubeData.map(d => {
    const geo   = new THREE.BoxGeometry(d.s, d.s, d.s);
    const edges = new THREE.EdgesGeometry(geo);
    const mat   = new THREE.LineBasicMaterial({ color: d.c, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const mesh  = new THREE.LineSegments(edges, mat);
    mesh.position.set(d.x, d.y, d.z);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(mesh);

    // inner glow fill
    const fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: d.c, transparent: true, opacity: 0.04 }));
    fill.position.set(d.x, d.y, d.z);
    group.add(fill);
    return { mesh, fill, speed: 0.003 + Math.random() * 0.006, floatOffset: Math.random() * Math.PI * 2 };
  });

  /* ── CENTRAL SPHERE GLOW ── */
  const sphereGeo = new THREE.SphereGeometry(1.8, 32, 32);
  const sphereMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending });
  const sphere    = new THREE.Mesh(sphereGeo, sphereMat);
  group.add(sphere);

  /* ── ORBIT RING ── */
  const orbitGeo  = new THREE.TorusGeometry(3.5, 0.03, 8, 80);
  const orbitMat  = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending });
  const orbit     = new THREE.Mesh(orbitGeo, orbitMat);
  orbit.rotation.x = 0.6;
  group.add(orbit);

  /* ── ANIMATE ── */
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    group.rotation.y = t * 0.3;
    orbit.rotation.z = t * 0.5;

    cubes.forEach(({ mesh, fill, speed, floatOffset }) => {
      mesh.rotation.x += speed;
      mesh.rotation.y += speed * 0.7;
      const floatY = Math.sin(t + floatOffset) * 0.12;
      mesh.position.y += floatY * 0.05;
      fill.rotation.copy(mesh.rotation);
      fill.position.copy(mesh.position);
    });

    sphere.material.opacity = 0.04 + Math.sin(t * 2) * 0.02;

    renderer.render(scene, camera);
  }
  animate();
}

/* ═══════════════════════════════════════════
   SKILLS CANVAS — Subtle grid + dot pattern
   ═══════════════════════════════════════════ */
function initSkillsCanvas() {
  const canvas = document.getElementById('skillsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, dots;

  function setup() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width  = rect.width;
    H = canvas.height = rect.height || 400;

    dots = [];
    const spacing = 32;
    for (let x = 0; x < W; x += spacing) {
      for (let y = 0; y < H; y += spacing) {
        dots.push({ x, y, a: Math.random() * Math.PI * 2, r: 1 + Math.random() * 1.5 });
      }
    }
  }

  setup();
  window.addEventListener('resize', setup, { passive: true });

  let t = 0;
  function draw() {
    requestAnimationFrame(draw);
    t += 0.012;
    ctx.clearRect(0, 0, W, H);

    dots.forEach(d => {
      const pulse = 0.15 + 0.1 * Math.sin(d.a + t);
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${pulse})`;
      ctx.fill();
    });
  }
  draw();
}
