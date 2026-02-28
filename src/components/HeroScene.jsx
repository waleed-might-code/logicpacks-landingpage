import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';

export default function HeroScene({ centered = false }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (sceneRef.current) return; // prevent double-init in StrictMode
    sceneRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const config = { colors: { bg: 0x0a0a0a, primary: 0x22c55e, secondary: 0x86efac } };

    // ── Position config ──
    const groupX = centered ? 0 : 2.5;
    const groupY = centered ? 0 : -0.3;

    // ── Scene Setup ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.colors.bg);
    scene.fog = new THREE.FogExp2(config.colors.bg, 0.025);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const mainGroup = new THREE.Group();
    mainGroup.position.set(groupX, groupY, 0);
    scene.add(mainGroup);

    // ── Core Sphere ──
    const geoCore = new THREE.IcosahedronGeometry(2, 10);
    const matCore = new THREE.MeshPhysicalMaterial({
      color: 0x050505, metalness: 0.9, roughness: 0.15, clearcoat: 1.0, clearcoatRoughness: 0.08,
      emissive: config.colors.primary, emissiveIntensity: 0.06, transparent: true, opacity: 1,
    });
    const sphereCore = new THREE.Mesh(geoCore, matCore);
    mainGroup.add(sphereCore);

    // ── Wireframe Shell ──
    const geoWire = new THREE.IcosahedronGeometry(2.2, 2);
    const matWire = new THREE.MeshBasicMaterial({
      color: config.colors.primary, wireframe: true, transparent: true, opacity: 0.12, side: THREE.DoubleSide,
    });
    const sphereWire = new THREE.Mesh(geoWire, matWire);
    mainGroup.add(sphereWire);

    // ── Ambient Particles ──
    const pGeo = new THREE.BufferGeometry();
    const pCount = 200;
    const pArr = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pArr[i] = (Math.random() - 0.5) * 14;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.03, color: config.colors.primary, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
    const pMesh = new THREE.Points(pGeo, pMat);
    scene.add(pMesh);

    // ── Explosion Particle System ──
    const eCount = 5000;
    const eGeo = new THREE.BufferGeometry();
    const eInit = new Float32Array(eCount * 3);
    const eTarget = new Float32Array(eCount * 3);
    const eCurrent = new Float32Array(eCount * 3);
    const eVelocity = new Float32Array(eCount * 3);

    const sphereWorldX = groupX, sphereWorldY = groupY;

    for (let i = 0; i < eCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / eCount);
      const theta = Math.sqrt(eCount * Math.PI) * phi;
      const r = 2.0;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      eInit[i * 3] = x + sphereWorldX;
      eInit[i * 3 + 1] = y + sphereWorldY;
      eInit[i * 3 + 2] = z;
      eCurrent[i * 3] = eInit[i * 3];
      eCurrent[i * 3 + 1] = eInit[i * 3 + 1];
      eCurrent[i * 3 + 2] = eInit[i * 3 + 2];

      const dir = new THREE.Vector3(x, y, z).normalize();
      const dist = 4.0 + Math.random() * 8.0;
      eTarget[i * 3] = dir.x * dist;
      eTarget[i * 3 + 1] = dir.y * dist;
      eTarget[i * 3 + 2] = dir.z * dist * 0.5;
    }

    eGeo.setAttribute('position', new THREE.BufferAttribute(eCurrent, 3));
    const eMat = new THREE.PointsMaterial({
      size: 0.04, color: config.colors.primary, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const eSys = new THREE.Points(eGeo, eMat);
    eSys.visible = false;
    scene.add(eSys);

    // ── Lighting ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const l1 = new THREE.PointLight(config.colors.primary, 60);
    l1.position.set(4, 3, 4); l1.decay = 2; scene.add(l1);
    const l2 = new THREE.PointLight(config.colors.secondary, 40);
    l2.position.set(-4, -2, 3); l2.decay = 2; scene.add(l2);
    const l3 = new THREE.PointLight(0xffffff, 20);
    l3.position.set(0, 0, -5); l3.decay = 2; scene.add(l3);

    // ── Post Processing ──
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.6, 0.3, 0.5);
    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    // ── State ──
    let mouseX = 0, mouseY = 0;
    const mouse3D = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const animState = { progress: 0 };
    let scrollProgress = 0;
    let isExploded = false;
    let clickReassembling = false;
    let clickExploding = false;
    let clickExplodedLock = false; // keeps exploded state until user clicks to reassemble
    let hoverActive = false;
    let sphereHovered = false;

    const heroSection = canvas.closest('.relative');
    const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

    // ── Scroll ──
    function updateScrollProgress() {
      const scrollY = window.scrollY || window.pageYOffset;
      const raw = (scrollY - 10) / (heroHeight * 0.45 - 10);
      scrollProgress = Math.max(0, Math.min(1, raw));
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // ── Update Particles ──
    function updateExplosion(progress) {
      const pos = eGeo.attributes.position.array;
      for (let i = 0; i < eCount; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
        let bx = eInit[ix] + (eTarget[ix] - eInit[ix]) * progress;
        let by = eInit[iy] + (eTarget[iy] - eInit[iy]) * progress;
        let bz = eInit[iz] + (eTarget[iz] - eInit[iz]) * progress;
        if (progress > 0.01) {
          const a = progress * 0.4;
          const rx = bx * Math.cos(a) - bz * Math.sin(a);
          const rz = bx * Math.sin(a) + bz * Math.cos(a);
          bx = rx; bz = rz;
        }
        bx += eVelocity[ix]; by += eVelocity[iy]; bz += eVelocity[iz];
        pos[ix] = bx; pos[iy] = by; pos[iz] = bz;
      }
      eGeo.attributes.position.needsUpdate = true;
    }

    // ── Hover Attraction ──
    function applyHoverAttraction() {
      if (animState.progress < 0.15) return;
      const pos = eGeo.attributes.position.array;
      const attractRadius = 3.0, attractStrength = 0.015, damping = 0.92;
      for (let i = 0; i < eCount; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
        const dx = mouse3D.x - pos[ix], dy = mouse3D.y - pos[iy], dz = mouse3D.z - pos[iz];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < attractRadius && dist > 0.1) {
          const force = attractStrength * (1 - dist / attractRadius);
          eVelocity[ix] += dx * force; eVelocity[iy] += dy * force; eVelocity[iz] += dz * force;
        }
        eVelocity[ix] *= damping; eVelocity[iy] *= damping; eVelocity[iz] *= damping;
      }
    }

    // ── Mouse ──
    const onMouseMove = (e) => {
      mouseX = e.clientX - window.innerWidth / 2;
      mouseY = e.clientY - window.innerHeight / 2;

      const coords = document.getElementById('coords');
      if (coords) coords.innerText = `${(e.clientX / window.innerWidth).toFixed(2)}.${(e.clientY / window.innerHeight).toFixed(2)}.00`;

      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      raycaster.ray.intersectPlane(plane, mouse3D);

      if (animState.progress > 0.15 || clickExplodedLock) {
        const distFromCenter = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y);
        hoverActive = distFromCenter < 1.2;
        document.body.style.cursor = hoverActive ? 'crosshair' : 'pointer';
      } else {
        const hits = raycaster.intersectObject(sphereCore);
        if (hits.length > 0) {
          sphereHovered = true;
          document.body.style.cursor = 'pointer';
          gsap.to(matCore, { emissiveIntensity: 0.15, duration: 0.3, overwrite: true });
          gsap.to(sphereWire.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 0.4, overwrite: true });
        } else {
          sphereHovered = false;
          document.body.style.cursor = 'default';
          gsap.to(matCore, { emissiveIntensity: 0.06, duration: 0.3, overwrite: true });
          gsap.to(sphereWire.scale, { x: 1, y: 1, z: 1, duration: 0.4, overwrite: true });
        }
        hoverActive = false;
      }
    };
    document.addEventListener('mousemove', onMouseMove);

    // ── Click ──
    const onClick = () => {
      if (clickReassembling || clickExploding) return;
      const sl = document.getElementById('status-light');
      const st = document.getElementById('status-text');
      if (!sl || !st) return;

      if (animState.progress < 0.15 && sphereHovered) {
        clickExploding = true;
        clickExplodedLock = true; // lock so scroll doesn't collapse it back
        sl.className = 'flex h-2 w-2 rounded-full bg-white'; sl.style.boxShadow = '0 0 16px rgba(255,255,255,0.6)';
        st.innerText = 'Status: Deconstructing...'; st.className = 'text-xs uppercase tracking-[0.2em] text-white font-medium font-mono transition-colors';
        eSys.visible = true; isExploded = true;
        gsap.to(eMat, { opacity: 1, duration: 0.15 });
        gsap.to(matCore, { opacity: 0, duration: 0.2, onComplete: () => { sphereCore.visible = false; } });
        gsap.to(matWire, { opacity: 0, duration: 0.15, onComplete: () => { sphereWire.visible = false; } });
        gsap.to(animState, {
          progress: 1, duration: 1.6, ease: 'power3.out',
          onUpdate: () => updateExplosion(animState.progress),
          onComplete: () => { clickExploding = false; st.innerText = 'Status: Deconstructed'; },
        });
        return;
      }

      if (animState.progress > 0.15 || clickExplodedLock) {
        clickReassembling = true;
        clickExplodedLock = false; // release the lock so reassembly proceeds
        sl.className = 'flex h-2 w-2 rounded-full bg-white'; sl.style.boxShadow = '0 0 16px rgba(255,255,255,0.6)';
        st.innerText = 'Status: Re-assembling'; st.className = 'text-xs uppercase tracking-[0.2em] text-white font-medium font-mono transition-colors';
        eVelocity.fill(0);
        gsap.to(animState, {
          progress: 0, duration: 1.8, ease: 'elastic.out(1, 0.5)',
          onUpdate: () => updateExplosion(animState.progress),
          onComplete: () => {
            clickReassembling = false;
            sphereCore.visible = true; sphereWire.visible = true;
            gsap.to(matCore, { opacity: 1, duration: 0.4 });
            gsap.to(matWire, { opacity: 0.12, duration: 0.4 });
            gsap.to(eMat, { opacity: 0, duration: 0.3, onComplete: () => { eSys.visible = false; } });
            isExploded = false;
            sl.className = 'flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]';
            sl.style.boxShadow = '0 0 12px rgba(34,197,94,0.5)';
            st.innerText = 'Platform Status: Operational';
            st.className = 'text-xs uppercase tracking-[0.2em] text-green-500/80 font-medium font-mono transition-colors';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          },
        });
      }
    };
    window.addEventListener('click', onClick);

    // ── Animation Loop ──
    const clock = new THREE.Clock();
    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!clickReassembling && !clickExploding && !clickExplodedLock) {
        animState.progress += (scrollProgress - animState.progress) * 0.1;
        if (Math.abs(animState.progress) < 0.001) animState.progress = 0;
        if (Math.abs(animState.progress - 1) < 0.001) animState.progress = 1;
      }

      const prog = animState.progress;
      if (prog > 0.02 && !isExploded) {
        isExploded = true; eSys.visible = true;
        gsap.to(eMat, { opacity: 1, duration: 0.3, overwrite: true });
        gsap.to(matCore, { opacity: 0, duration: 0.3, overwrite: true, onComplete: () => { sphereCore.visible = false; } });
        gsap.to(matWire, { opacity: 0, duration: 0.2, overwrite: true, onComplete: () => { sphereWire.visible = false; } });
      } else if (prog <= 0.02 && isExploded && !clickReassembling && !clickExploding) {
        isExploded = false; sphereCore.visible = true; sphereWire.visible = true;
        gsap.to(matCore, { opacity: 1, duration: 0.4, overwrite: true });
        gsap.to(matWire, { opacity: 0.12, duration: 0.4, overwrite: true });
        gsap.to(eMat, { opacity: 0, duration: 0.3, overwrite: true, onComplete: () => { eSys.visible = false; } });
        eVelocity.fill(0);
      }

      if (isExploded || prog > 0.01) {
        if (hoverActive) applyHoverAttraction();
        updateExplosion(prog);
      }

      if (!isExploded) {
        mainGroup.rotation.y += 0.002; mainGroup.rotation.x += 0.001;
        const breathe = 1 + Math.sin(t * 2) * 0.015;
        sphereWire.scale.set(breathe, breathe, breathe);
      }

      mainGroup.rotation.y += 0.04 * (mouseX * 0.0008 - mainGroup.rotation.y * 0.3);
      mainGroup.rotation.x += 0.04 * (mouseY * 0.0008 - mainGroup.rotation.x * 0.3);
      l1.position.x = Math.sin(t * 0.5) * 4; l1.position.y = Math.cos(t * 0.35) * 3;
      l2.position.x = Math.cos(t * 0.25) * 5; l2.position.z = Math.sin(t * 0.4) * 4;
      pMesh.rotation.y = t * 0.04; pMesh.rotation.x = -mouseY * 0.00015;
      bloomPass.strength = 0.4 + prog * 0.6;
      composer.render();
    }

    // ── Resize ──
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Init ──
    animate();
    const sphereTl = gsap.timeline();
    sphereTl
      .from(sphereCore.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: 'elastic.out(1,0.7)' })
      .from(sphereWire.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: 'elastic.out(1,0.7)' }, '<');

    return () => {
      sphereTl.kill();
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', updateScrollProgress);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full outline-none cursor-grab active:cursor-grabbing" />;
}

