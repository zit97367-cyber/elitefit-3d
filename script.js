/* =============================================
   IRON & OAK GYM — PREMIUM JAVASCRIPT
   ============================================= */

"use strict";

// ===== PRELOADER =====
(function initPreloader() {
  const preloader = document.getElementById("preloader");
  const fill = document.getElementById("preloaderFill");
  const text = document.getElementById("preloaderText");
  const messages = [
    "FORGING YOUR EXPERIENCE...",
    "LOADING THE ARSENAL...",
    "PRIMING THE IRON...",
  ];
  let msgIdx = 0;

  setTimeout(() => { fill.style.width = "60%"; }, 100);
  setTimeout(() => {
    text.textContent = messages[++msgIdx];
    fill.style.width = "90%";
  }, 800);
  setTimeout(() => {
    text.textContent = messages[++msgIdx];
    fill.style.width = "100%";
  }, 1500);
  setTimeout(() => {
    preloader.classList.add("hidden");
    initHeroAnimations();
  }, 2200);
})();

// ===== CUSTOM CURSOR =====
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let ringX = mouseX, ringY = mouseY;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorDot.style.left = mouseX + "px";
  cursorDot.style.top = mouseY + "px";
  cursorRing.style.left = ringX + "px";
  cursorRing.style.top = ringY + "px";
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ===== NAV SCROLL =====
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 60);
});

// ===== THREE.JS 3D HERO SCENE =====
function initThreeJS() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;

  // === LIGHTING ===
  const ambientLight = new THREE.AmbientLight(0xc9a84c, 0.15);
  scene.add(ambientLight);

  const goldLight1 = new THREE.PointLight(0xc9a84c, 2, 20);
  goldLight1.position.set(3, 3, 3);
  scene.add(goldLight1);

  const goldLight2 = new THREE.PointLight(0xe8c96d, 1.2, 15);
  goldLight2.position.set(-3, -2, 2);
  scene.add(goldLight2);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
  rimLight.position.set(0, 5, -5);
  scene.add(rimLight);

  // === BACKGROUND: Dark void with depth grid ===
  // Grid helper — subtle gold grid on black
  const gridHelper = new THREE.GridHelper(40, 40, 0x1a1a17, 0x0f0f0d);
  gridHelper.position.y = -3;
  gridHelper.rotation.x = 0;
  scene.add(gridHelper);

  // ===  MAIN 3D DUMBBELL / BARBELL SHAPE ===
  // Bar
  const barGeo = new THREE.CylinderGeometry(0.06, 0.06, 4.5, 16);
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x888880,
    metalness: 0.98,
    roughness: 0.08,
    envMapIntensity: 1.2,
  });
  const bar = new THREE.Mesh(barGeo, metalMat);
  bar.rotation.z = Math.PI / 2;
  bar.castShadow = true;
  scene.add(bar);

  // Weight plates
  function createPlate(x, radiusOuter, thick, colorHex) {
    const group = new THREE.Group();
    // Outer ring
    const outerGeo = new THREE.CylinderGeometry(radiusOuter, radiusOuter, thick, 32);
    const outerMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      metalness: 0.85,
      roughness: 0.25,
    });
    const outer = new THREE.Mesh(outerGeo, outerMat);
    outer.rotation.z = Math.PI / 2;
    // Inner hub
    const hubGeo = new THREE.CylinderGeometry(0.2, 0.2, thick + 0.05, 16);
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      metalness: 0.95,
      roughness: 0.06,
    });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.rotation.z = Math.PI / 2;
    group.add(outer, hub);
    group.position.x = x;
    return group;
  }

  // Large outer plates
  const plate1L = createPlate(-2.0, 0.85, 0.22, 0x1a1a18);
  const plate1R = createPlate(2.0, 0.85, 0.22, 0x1a1a18);
  // Medium plates
  const plate2L = createPlate(-1.6, 0.8, 0.18, 0x111110);
  const plate2R = createPlate(1.6, 0.8, 0.18, 0x111110);
  // Gold accent plates
  const plate3L = createPlate(-1.2, 0.75, 0.12, 0x8b6914);
  const plate3R = createPlate(1.2, 0.75, 0.12, 0x8b6914);

  const barbell = new THREE.Group();
  barbell.add(bar, plate1L, plate1R, plate2L, plate2R, plate3L, plate3R);
  barbell.position.set(0, 0.5, 0);
  scene.add(barbell);

  // ===  FLOATING GEOMETRIC SHAPES ===
  const floaters = [];

  function createFloater(geo, matOpts, pos) {
    const mat = new THREE.MeshStandardMaterial({ ...matOpts });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    mesh.userData.rotSpeed = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.015,
      z: (Math.random() - 0.5) * 0.008,
    };
    mesh.userData.floatAmp = 0.1 + Math.random() * 0.15;
    mesh.userData.floatFreq = 0.3 + Math.random() * 0.4;
    mesh.userData.floatOffset = Math.random() * Math.PI * 2;
    mesh.userData.origY = pos[1];
    scene.add(mesh);
    floaters.push(mesh);
    return mesh;
  }

  // Octahedron gems
  createFloater(
    new THREE.OctahedronGeometry(0.25, 0),
    { color: 0xc9a84c, metalness: 0.9, roughness: 0.05 },
    [-3.5, 1.5, -1]
  );
  createFloater(
    new THREE.OctahedronGeometry(0.15, 0),
    { color: 0xe8c96d, metalness: 0.95, roughness: 0.03 },
    [3.8, -0.5, -0.5]
  );
  createFloater(
    new THREE.OctahedronGeometry(0.18, 0),
    { color: 0x8b6914, metalness: 0.88, roughness: 0.1 },
    [-4, -1.5, -1.5]
  );

  // Tetrahedra
  createFloater(
    new THREE.TetrahedronGeometry(0.2, 0),
    { color: 0xc9a84c, metalness: 0.85, roughness: 0.08, wireframe: false },
    [4.5, 1.8, -2]
  );
  createFloater(
    new THREE.TetrahedronGeometry(0.12, 0),
    { color: 0xe8c96d, metalness: 0.9, roughness: 0.05 },
    [-2.5, -2, -1]
  );

  // Torus ring (representing weight ring)
  const torusGeo = new THREE.TorusGeometry(0.4, 0.04, 8, 32);
  const torusMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c, metalness: 0.95, roughness: 0.05
  });
  const torus1 = new THREE.Mesh(torusGeo, torusMat);
  torus1.position.set(3, 2, -1);
  torus1.userData.rotSpeed = { x: 0.008, y: 0.015, z: 0.005 };
  torus1.userData.floatAmp = 0.12;
  torus1.userData.floatFreq = 0.25;
  torus1.userData.floatOffset = 1.5;
  torus1.userData.origY = 2;
  scene.add(torus1);
  floaters.push(torus1);

  const torus2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.25, 0.025, 6, 24),
    new THREE.MeshStandardMaterial({ color: 0x8b6914, metalness: 0.9, roughness: 0.08 })
  );
  torus2.position.set(-3, 2.5, -2);
  torus2.userData.rotSpeed = { x: 0.012, y: 0.008, z: 0.01 };
  torus2.userData.floatAmp = 0.08;
  torus2.userData.floatFreq = 0.5;
  torus2.userData.floatOffset = 3;
  torus2.userData.origY = 2.5;
  scene.add(torus2);
  floaters.push(torus2);

  // === PARTICLE SYSTEM (gold dust) ===
  const particleCount = 200;
  const pPositions = new Float32Array(particleCount * 3);
  const pSizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 14;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    pSizes[i] = Math.random() * 2 + 0.5;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
  pGeo.setAttribute("size", new THREE.BufferAttribute(pSizes, 1));

  const pMat = new THREE.PointsMaterial({
    color: 0xc9a84c,
    size: 0.04,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // === MOUSE PARALLAX ===
  let targetRotX = 0, targetRotY = 0;
  let currentRotX = 0, currentRotY = 0;

  document.addEventListener("mousemove", (e) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    targetRotX = ny * 0.15;
    targetRotY = nx * 0.2;
  });

  // === ANIMATION LOOP ===
  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.012;

    // Smooth mouse parallax
    currentRotX += (targetRotX - currentRotX) * 0.05;
    currentRotY += (targetRotY - currentRotY) * 0.05;

    // Barbell rotation & float
    barbell.rotation.x = currentRotX * 0.5;
    barbell.rotation.y = time * 0.2 + currentRotY;
    barbell.position.y = 0.5 + Math.sin(time * 0.4) * 0.12;

    // Float the grid
    gridHelper.position.y = -3 + Math.sin(time * 0.15) * 0.1;

    // Animate floaters
    floaters.forEach((f) => {
      f.rotation.x += f.userData.rotSpeed.x;
      f.rotation.y += f.userData.rotSpeed.y;
      f.rotation.z += f.userData.rotSpeed.z;
      f.position.y =
        f.userData.origY +
        Math.sin(time * f.userData.floatFreq + f.userData.floatOffset) * f.userData.floatAmp;
    });

    // Animate particles (slow drift)
    const pos = pGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 1] += 0.003;
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5;
    }
    pGeo.attributes.position.needsUpdate = true;
    particles.rotation.y += 0.0005;

    // Pulsing gold lights
    goldLight1.intensity = 2 + Math.sin(time * 1.5) * 0.4;
    goldLight2.intensity = 1.2 + Math.cos(time * 1.2) * 0.3;
    goldLight1.position.x = 3 + Math.sin(time * 0.5) * 1.5;
    goldLight1.position.z = 3 + Math.cos(time * 0.4) * 1;

    // Camera gentle sway
    camera.position.x = currentRotY * 0.3;
    camera.position.y = -currentRotX * 0.2;
    camera.lookAt(0, 0.5, 0);

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener("resize", () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// ===== HERO ANIMATIONS =====
function initHeroAnimations() {
  // Init Three.js
  initThreeJS();

  // Create floating DOM particles
  const particleContainer = document.getElementById("heroParticles");
  for (let i = 0; i < 35; i++) {
    const p = document.createElement("div");
    p.classList.add("hero-particle");
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      --dur: ${6 + Math.random() * 8}s;
      --delay: ${Math.random() * 6}s;
      --drift: ${(Math.random() - 0.5) * 60}px;
      --op: ${0.3 + Math.random() * 0.5};
      width: ${1 + Math.random() * 2}px;
      height: ${1 + Math.random() * 2}px;
    `;
    particleContainer.appendChild(p);
  }

  // Staggered text reveal
  const titleLines = document.querySelectorAll(".hero-title-line");
  const delays = [0.1, 0.35, 0.6];
  titleLines.forEach((line, i) => {
    setTimeout(() => line.classList.add("visible"), delays[i] * 1000);
  });

  const eyebrow = document.querySelector(".hero-eyebrow");
  setTimeout(() => eyebrow.classList.add("visible"), 0);

  const heroSub = document.querySelector(".hero-sub");
  setTimeout(() => heroSub.classList.add("visible"), 900);

  const heroActions = document.querySelector(".hero-actions");
  setTimeout(() => heroActions.classList.add("visible"), 1100);

  // HUD elements
  const huds = document.querySelectorAll(".hud");
  setTimeout(() => huds.forEach(h => h.classList.add("visible")), 1400);

  // Animate HUD numbers
  animateHUD();
}

// ===== HUD NUMBER ANIMATION =====
function animateHUD() {
  const heartEl = document.getElementById("heartRate");
  const caloriesEl = document.getElementById("calories");

  let heartBase = 165, calBase = 12;
  setInterval(() => {
    heartBase = 155 + Math.floor(Math.random() * 25);
    calBase = 10 + Math.floor(Math.random() * 6);
    heartEl.textContent = heartBase;
    caloriesEl.textContent = calBase;
  }, 2500);
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const elements = document.querySelectorAll(
    ".section-header, .facility-card, .plan-card, .stat-item, .location-info, .location-map, .plans-footnote"
  );

  elements.forEach((el, i) => {
    el.classList.add("reveal");
    // Stagger children of grid
    if (el.parentElement && (el.parentElement.classList.contains("facilities-grid") || el.parentElement.classList.contains("plans-grid"))) {
      const siblings = [...el.parentElement.children];
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = (idx * 0.12) + "s";
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Start count-up if stat
          if (entry.target.classList.contains("stat-item")) {
            startCountUp(entry.target);
          }
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

// ===== COUNTER ANIMATION =====
function startCountUp(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = "true";
  const target = parseInt(el.dataset.target, 10);
  const countEl = el.querySelector(".stat-count");
  if (!countEl) return;

  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    countEl.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else countEl.textContent = target;
  };
  requestAnimationFrame(step);
}

// ===== APEX PLAN SPARKS =====
function initApexSparks() {
  const container = document.getElementById("apexParticles");
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const spark = document.createElement("div");
    spark.classList.add("apex-spark");
    spark.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${20 + Math.random() * 80}%;
      --dur: ${2 + Math.random() * 4}s;
      --delay: ${Math.random() * 3}s;
      width: ${1 + Math.random() * 2}px;
      height: ${1 + Math.random() * 2}px;
    `;
    container.appendChild(spark);
  }
}

// ===== MAGNETIC BUTTON EFFECT =====
function initMagneticButtons() {
  const buttons = document.querySelectorAll(".btn-primary, .nav-cta, .plan-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

// ===== PLAN CARD 3D TILT =====
function initCardTilt() {
  const cards = document.querySelectorAll(".facility-card, .plan-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      // Specular highlight
      const gradient = `radial-gradient(circle at ${x}px ${y}px, rgba(201,168,76,0.1) 0%, transparent 60%)`;
      card.style.backgroundImage = gradient;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.backgroundImage = "";
    });
  });
}

// ===== HERO PARALLAX ON SCROLL =====
function initHeroParallax() {
  const heroContent = document.getElementById("heroContent");
  const heroCanvas = document.getElementById("heroCanvas");
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      if (heroContent) heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      if (heroCanvas) heroCanvas.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  });
}

// ===== SMOOTH NAV LINKS =====
function initNavLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// ===== HERO CTA HOVER GLOW =====
function initHeroCtaEffect() {
  const cta = document.getElementById("heroCta");
  if (!cta) return;
  cta.addEventListener("mousemove", (e) => {
    const rect = cta.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cta.style.setProperty("--gx", x + "px");
    cta.style.setProperty("--gy", y + "px");
  });
}

// ===== PLAN CARD SELECT EFFECT =====
function initPlanSelect() {
  const planBtns = document.querySelectorAll(".plan-btn");
  planBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".plan-card");
      // Ripple
      const ripple = document.createElement("div");
      const rect = btn.getBoundingClientRect();
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:0; height:0;
        background:rgba(201,168,76,0.4);
        top:50%; left:50%;
        transform:translate(-50%,-50%);
        animation: rippleEffect 0.6s ease-out forwards;
        pointer-events:none; z-index:10;
      `;
      btn.style.position = "relative";
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframe dynamically
  const style = document.createElement("style");
  style.textContent = `
    @keyframes rippleEffect {
      to { width: 200px; height: 200px; opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ===== SECTION TITLE CHAR ANIMATION =====
function initTitleGlitch() {
  const sectionTitles = document.querySelectorAll(".section-title");
  sectionTitles.forEach(title => {
    title.addEventListener("mouseenter", () => {
      title.classList.add("glitch-active");
      setTimeout(() => title.classList.remove("glitch-active"), 600);
    });
  });

  const style = document.createElement("style");
  style.textContent = `
    .glitch-active {
      animation: textGlitch 0.1s steps(2, end) 6 alternate;
    }
    @keyframes textGlitch {
      0% { text-shadow: 2px 0 rgba(201,168,76,0.7), -2px 0 rgba(255,255,255,0.2); }
      100% { text-shadow: -2px 0 rgba(201,168,76,0.7), 2px 0 rgba(255,255,255,0.2); }
    }
  `;
  document.head.appendChild(style);
}

// ===== FACILITIES PARALLAX =====
function initFacilityParallax() {
  const cards = document.querySelectorAll(".facility-bg");
  window.addEventListener("scroll", () => {
    cards.forEach(card => {
      const rect = card.closest(".facility-card").getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        card.style.transform = `scale(1.1) translateY(${(progress - 0.5) * 30}px)`;
      }
    });
  });
}

// ===== GOLD CURSOR TRAIL =====
const trailDots = [];
const TRAIL_LENGTH = 12;
for (let i = 0; i < TRAIL_LENGTH; i++) {
  const dot = document.createElement("div");
  dot.style.cssText = `
    position:fixed; width:${2 + i * 0.2}px; height:${2 + i * 0.2}px;
    background:rgba(201,168,76,${0.4 - i * 0.03});
    border-radius:50%; pointer-events:none; z-index:9996;
    transform:translate(-50%,-50%);
    transition: transform ${0.05 + i * 0.02}s ease;
  `;
  document.body.appendChild(dot);
  trailDots.push({ el: dot, x: 0, y: 0 });
}

let prevX = mouseX, prevY = mouseY;
function animateTrail() {
  trailDots[0].x += (mouseX - trailDots[0].x) * 0.4;
  trailDots[0].y += (mouseY - trailDots[0].y) * 0.4;
  trailDots[0].el.style.left = trailDots[0].x + "px";
  trailDots[0].el.style.top = trailDots[0].y + "px";

  for (let i = 1; i < TRAIL_LENGTH; i++) {
    trailDots[i].x += (trailDots[i - 1].x - trailDots[i].x) * 0.55;
    trailDots[i].y += (trailDots[i - 1].y - trailDots[i].y) * 0.55;
    trailDots[i].el.style.left = trailDots[i].x + "px";
    trailDots[i].el.style.top = trailDots[i].y + "px";
  }
  requestAnimationFrame(animateTrail);
}
animateTrail();

// ===== INIT ALL =====
document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initApexSparks();
  initMagneticButtons();
  initCardTilt();
  initHeroParallax();
  initNavLinks();
  initHeroCtaEffect();
  initPlanSelect();
  initTitleGlitch();
  initFacilityParallax();
});
