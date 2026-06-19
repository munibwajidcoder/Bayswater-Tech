'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // --- CLIENT SIDE SCRIPT ---
    
        // --- SMOOTH SCROLLING (LENIS) ---
        const lenis = new Lenis();
        
        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', () => {
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
        });
        
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // --- THREE.JS ENGINE ---
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0B1120, 0.035); // Volumetric cyber-fog

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);

// Parent Shield Group
        const shieldGroup = new THREE.Group();
        scene.add(shieldGroup);

        // Inner group to handle idle float & spin, avoiding conflicts with GSAP timeline
        const shieldIdleGroup = new THREE.Group();
        shieldGroup.add(shieldIdleGroup);

        // Base group to handle static straightening correction
        const shieldBaseGroup = new THREE.Group();
        shieldIdleGroup.add(shieldBaseGroup);

        // Correct the inherent tilt/rotation of shield.png so it faces forward and stands upright
        shieldBaseGroup.rotation.y = 0.45;  // Rotates to face the camera directly
        shieldBaseGroup.rotation.z = -0.12; // Straightens the left-hand tilt

        // --- SHIELD SHAPE WITH TEXTURE ---
        const textureLoader = new THREE.TextureLoader();
        const shieldTexture = textureLoader.load('images/shield.png');
        shieldTexture.minFilter = THREE.LinearFilter;

        // Square Aspect Ratio plane for the shield symbol
        const shieldGeo = new THREE.PlaneGeometry(4.0, 4.0); 

        const shieldMat = new THREE.MeshBasicMaterial({
            map: shieldTexture,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        shieldBaseGroup.add(shieldMesh);

        // 4. Glowing Neon Circuit Lines on Shield Surface (slightly offset on Z)
        const circuitMat = new THREE.LineBasicMaterial({
            color: 0x1A8FFF, // Secondary Accent - Blue
            transparent: true,
            opacity: 0.75
        });

        const linePaths = [
            // Top Right Branch
            [new THREE.Vector3(0, 0, 0.02), new THREE.Vector3(0.4, 0.4, 0.02), new THREE.Vector3(0.4, 1.0, 0.02), new THREE.Vector3(0.8, 1.2, 0.02)],
            // Top Left Branch
            [new THREE.Vector3(0, 0, 0.02), new THREE.Vector3(-0.4, 0.4, 0.02), new THREE.Vector3(-0.4, 1.0, 0.02), new THREE.Vector3(-0.8, 1.2, 0.02)],
            // Bottom Right Branch
            [new THREE.Vector3(0, -0.3, 0.02), new THREE.Vector3(0.5, -0.3, 0.02), new THREE.Vector3(0.8, -0.7, 0.02), new THREE.Vector3(0.6, -1.2, 0.02)],
            // Bottom Left Branch
            [new THREE.Vector3(0, -0.3, 0.02), new THREE.Vector3(-0.5, -0.3, 0.02), new THREE.Vector3(-0.8, -0.7, 0.02), new THREE.Vector3(-0.6, -1.2, 0.02)]
        ];

        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = [];
        linePaths.forEach(path => {
            for(let i=0; i < path.length - 1; i++) {
                linePositions.push(path[i].x, path[i].y, path[i].z);
                linePositions.push(path[i+1].x, path[i+1].y, path[i+1].z);
            }
        });
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const circuitLines = new THREE.LineSegments(lineGeometry, circuitMat);
        shieldBaseGroup.add(circuitLines);

        // 5. Pulsing Data Packets moving along circuit lines
        const pulseGroup = new THREE.Group();
        shieldBaseGroup.add(pulseGroup);
        const pulseGeo = new THREE.SphereGeometry(0.035, 8, 8);
        const pulseMat = new THREE.MeshBasicMaterial({ color: 0x00CFA8 });
        const pulses = [];
        
        linePaths.forEach(path => {
            const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
            pulseGroup.add(pulseMesh);
            pulses.push({ mesh: pulseMesh, path: path });
        });

        // 6. Holographic Orbit Rings rotating around the shield
        const ringGroup = new THREE.Group();
        shieldBaseGroup.add(ringGroup);

        const ringMat1 = new THREE.LineBasicMaterial({
            color: 0x00CFA8, // Cyan
            transparent: true,
            opacity: 0.35
        });
        const ringMat2 = new THREE.LineBasicMaterial({
            color: 0x1A8FFF, // Blue
            transparent: true,
            opacity: 0.25
        });

        // Ring 1 (Inner)
        const ringGeo1 = new THREE.RingGeometry(2.1, 2.12, 64);
        const ringEdges1 = new THREE.EdgesGeometry(ringGeo1);
        const ring1 = new THREE.LineSegments(ringEdges1, ringMat1);
        ringGroup.add(ring1);

        // Ring 2 (Outer, tilted)
        const ringGeo2 = new THREE.RingGeometry(2.4, 2.42, 64);
        const ringEdges2 = new THREE.EdgesGeometry(ringGeo2);
        const ring2 = new THREE.LineSegments(ringEdges2, ringMat2);
        ring2.rotation.x = Math.PI / 4;
        ring2.rotation.y = Math.PI / 6;
        ringGroup.add(ring2);

        // --- ENVIRONMENT SETUP ---
        
        // 1. Digital Grid Floor
        const gridGeo = new THREE.PlaneGeometry(80, 80, 40, 40);
        const gridMaterial = new THREE.MeshBasicMaterial({
            color: 0x00CFA8,
            wireframe: true,
            transparent: true,
            opacity: 0.04
        });
        const gridFloor = new THREE.Mesh(gridGeo, gridMaterial);
        gridFloor.rotation.x = -Math.PI / 2;
        gridFloor.position.y = -4.5;
        scene.add(gridFloor);

        // 2. Data Towers / Server Pillars in Background
        const serverGroup = new THREE.Group();
        scene.add(serverGroup);
        const pGeo = new THREE.BoxGeometry(0.6, 6, 0.6);
        const pEdgeGeo = new THREE.EdgesGeometry(pGeo);
        const pEdgeMat = new THREE.LineBasicMaterial({ color: 0x1A8FFF, transparent: true, opacity: 0.14 });
        
        for (let i = 0; i < 16; i++) {
            const pillar = new THREE.LineSegments(pEdgeGeo, pEdgeMat);
            pillar.position.x = (Math.random() - 0.5) * 35;
            pillar.position.z = -Math.random() * 25 - 5;
            pillar.position.y = -1.5;
            serverGroup.add(pillar);
        }

        // 3. Volumetric Floating Particles (Canvas Glowing Radial Gradient Texture)
        function createParticleTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            const ctx = canvas.getContext('2d');
            const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
            grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
            grad.addColorStop(0.3, 'rgba(0, 207, 168, 0.8)');
            grad.addColorStop(1, 'rgba(0, 207, 168, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 16, 16);
            return new THREE.CanvasTexture(canvas);
        }

        const partGeo = new THREE.BufferGeometry();
        const partCount = 1200;
        const posArr = new Float32Array(partCount * 3);
        for(let i=0; i < partCount * 3; i++) {
            posArr[i] = (Math.random() - 0.5) * 25;
        }
        partGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
        
        const partMat = new THREE.PointsMaterial({
            size: 0.08,
            map: createParticleTexture(),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.55
        });
        const particles = new THREE.Points(partGeo, partMat);
        scene.add(particles);

        // --- CINEMATIC LIGHTING ---
        const ambient = new THREE.AmbientLight(0xffffff, 0.15);
        scene.add(ambient);

        // Orbiting cyan key light
        const keyLight = new THREE.SpotLight(0x00CFA8, 4.5, 30, Math.PI / 6, 0.5, 1);
        keyLight.position.set(5, 8, 6);
        scene.add(keyLight);

        // Static blue rim light
        const rimLight = new THREE.DirectionalLight(0x1A8FFF, 3.0);
        rimLight.position.set(-6, -2, -3);
        scene.add(rimLight);

        // Interactive mouse pointer tracking light (creates realistic metallic highlights)
        const mouseLight = new THREE.PointLight(0x00CFA8, 2.5, 12);
        mouseLight.position.set(0, 0, 3);
        scene.add(mouseLight);

        camera.position.z = 8.0;

        // --- RESPONSIVE LAYOUT MATRIX ---
        const updateLayoutMatrix = () => {
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                // Shift slightly to the right on mobile
                shieldGroup.position.set(0.4, -0.6, 0);
                shieldGroup.scale.set(1.2, 1.2, 1.2);
            } else {
                // Shift to the right on desktop so it doesn't overlap text
                shieldGroup.position.set(1.4, -0.4, 0);
                shieldGroup.scale.set(1.8, 1.8, 1.8);
            }
        };
        window.addEventListener('resize', updateLayoutMatrix);
        updateLayoutMatrix();

        // --- GSAP SCROLL STORYTELLING ---
        gsap.registerPlugin(ScrollTrigger);

        // Section Fade-In Reveals
        gsap.utils.toArray('.section-reveal').forEach((el, i) => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: i * 0.08,
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%"
                }
            });
        });

        // Stats Number Counter Animation
        gsap.utils.toArray('.stat-number').forEach(el => {
            let target = parseFloat(el.getAttribute('data-target'));
            let suffix = el.getAttribute('data-suffix');
            let isFloat = target % 1 !== 0;

            gsap.to({ val: 0 }, {
                val: target,
                duration: 2.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%"
                },
                onUpdate: function() {
                    let currentVal = isFloat ? this.targets()[0].val.toFixed(1) : Math.floor(this.targets()[0].val);
                    el.innerText = currentVal + suffix;
                }
            });
        });

        // Quantum Section Pinned Image Scroll Sequence
        const quantumImages = gsap.utils.toArray('.quantum-slide-img');
        if(quantumImages.length > 0) {
            const quantumTl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#quantum-section",
                    start: "center center",
                    end: "+=2500", // The longer the end, the slower and smoother the scroll stack
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1
                }
            });

            quantumImages.forEach((img, i) => {
                // We add a tiny pause between images by animating to the same value for a short duration, or just sequence them.
                quantumTl.to(img, {
                    y: "0%",
                    duration: 1,
                    ease: "none"
                });
            });
        }

        // 3D Morph Scroll Timeline
        const shieldTl = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5
            }
        });

        const isMobile = window.innerWidth < 768;
        
        shieldTl
            // Step 1: Scroll to Services (moves to left side, subtle tilt perspective)
            .to(shieldGroup.position, { 
                x: isMobile ? 0 : -2.8, 
                y: isMobile ? -0.8 : 0.4, 
                z: isMobile ? 0.5 : 1.2, 
                duration: 1 
            }, 0)
            
            // Step 2: Scroll to Ecosystem (center background behind cards, fade opacity)
            .to(shieldGroup.position, { 
                x: 0, 
                y: isMobile ? -0.4 : -0.6, 
                z: 3.8, 
                duration: 1 
            }, 1)
            .to(shieldMat, { opacity: 0.12, duration: 1 }, 1)
            
            // Step 3: Scroll to CTA (huge background sphere glow under final text)
            .to(shieldGroup.position, { 
                x: 0, 
                y: 0.2, 
                z: -1, 
                duration: 1 
            }, 2)
            .to(shieldGroup.scale, { 
                x: isMobile ? 1.5 : 2.2, 
                y: isMobile ? 1.5 : 2.2, 
                z: isMobile ? 1.5 : 2.2, 
                duration: 1 
            }, 2)
            .to(shieldMat, { opacity: 0.35, duration: 1 }, 2);

        // --- INTERACTIVES & MOUSE LISTENERS ---
        
        // Spotlight hover tracking for glassmorphic cards
        document.querySelectorAll('.glass-panel').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });

        // Magnetic controls
        document.querySelectorAll('.magnetic-wrap').forEach(wrap => {
            let bounds;
            wrap.addEventListener('mouseenter', () => {
                bounds = wrap.getBoundingClientRect();
            });
            wrap.addEventListener('mousemove', (e) => {
                if (!bounds) bounds = wrap.getBoundingClientRect();
                const strength = wrap.dataset.strength || 30;
                const centerX = bounds.left + bounds.width / 2;
                const centerY = bounds.top + bounds.height / 2;
                const x = e.clientX - centerX;
                const y = e.clientY - centerY;
                gsap.to(wrap, { x: x * (strength/100), y: y * (strength/100), duration: 0.3 });
            });
            wrap.addEventListener('mouseleave', () => {
                bounds = null;
                gsap.to(wrap, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            });
        });

        let targetRotX = 0;
        let targetRotY = 0;

        // Mouse light tracker (updates Three.js light dynamically) & 3D tilt tracking
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            // project mouse coords to 3D space
            mouseLight.position.x = x * 6;
            mouseLight.position.y = y * 6;

            // Target rotations for interactive 3D tilt
            targetRotY = x * 0.35;
            targetRotX = -y * 0.35;
        });

        // --- ANIMATION LOOP ---
        const clock = new THREE.Clock();

        function animate() {
            const elapsedTime = clock.getElapsedTime();
            
            // 1. Smooth 3D tilt (lerped) + auto gentle oscillation for organic 3D float
            const oscY = Math.sin(elapsedTime * 0.8) * 0.1;
            const oscX = Math.cos(elapsedTime * 0.8) * 0.05;
            
            shieldIdleGroup.rotation.y += (targetRotY + oscY - shieldIdleGroup.rotation.y) * 0.08;
            shieldIdleGroup.rotation.x += (targetRotX + oscX - shieldIdleGroup.rotation.x) * 0.08;
            
            shieldIdleGroup.position.y = Math.sin(elapsedTime * 0.6) * 0.15; // Gentle float only

            // Rotate holographic rings
            ring1.rotation.z = elapsedTime * 0.3;
            ring2.rotation.z = -elapsedTime * 0.2;
            ring2.rotation.x = Math.PI / 4 + Math.sin(elapsedTime * 0.4) * 0.1;
            
            // 2. Slow particle cosmic float
            particles.rotation.y = elapsedTime * 0.012;
            particles.position.y = Math.sin(elapsedTime * 0.3) * 0.2;
            
            // 3. Animate glowing data packets along circuit traces
            pulses.forEach(pulse => {
                const path = pulse.path;
                const segmentCount = path.length - 1;
                // calculate progress based on time
                const progress = (elapsedTime * 0.4) % 1.0;
                const index = Math.floor(progress * segmentCount);
                const subProgress = (progress * segmentCount) % 1.0;
                
                if (index < segmentCount) {
                    const startPoint = path[index];
                    const endPoint = path[index + 1];
                    pulse.mesh.position.copy(startPoint).lerp(endPoint, subProgress);
                }
            });

            // 4. Slow orbit for main cinematic Key Light
            keyLight.position.x = Math.sin(elapsedTime * 0.2) * 8;
            keyLight.position.z = Math.cos(elapsedTime * 0.2) * 8 + 4;

            // 5. Grid helper breathing opacity pulse
            gridMaterial.opacity = 0.04 + Math.sin(elapsedTime * 0.5) * 0.015;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // --- CUSTOM CURSOR LOGIC ---
        const cursorDot = document.querySelector('.custom-cursor-dot');
        const cursorRing = document.querySelector('.custom-cursor-ring');

        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;
        let isHovering = false;

        // Keep cursor offscreen initially
        gsap.set([cursorDot, cursorRing], { x: -100, y: -100 });

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move dot immediately
            gsap.set(cursorDot, { x: mouseX, y: mouseY });
        });

        // Smooth trailing lag using GSAP ticker (lerp)
        gsap.ticker.add(() => {
            if (!isHovering) {
                ringX += (mouseX - ringX) * 0.15;
                ringY += (mouseY - ringY) * 0.15;
            } else {
                ringX += (mouseX - ringX) * 0.25; // Faster tracking when hovering to keep it centered
                ringY += (mouseY - ringY) * 0.25;
            }
            gsap.set(cursorRing, { x: ringX, y: ringY });
        });

        // Attach hover animations to links, buttons, glass cards, and other interactive items
        const attachCursorHovers = () => {
            document.querySelectorAll('a, button, [role="button"], .glass-panel, .magnetic-wrap').forEach(el => {
                // Ensure we don't attach multiple times
                if (el.dataset.cursorAttached) return;
                el.dataset.cursorAttached = "true";

                el.addEventListener('mouseenter', () => {
                    isHovering = true;
                    gsap.to(cursorRing, {
                        width: 52,
                        height: 52,
                        backgroundColor: 'rgba(0, 207, 168, 0.12)',
                        borderColor: '#00CFA8',
                        boxShadow: '0 0 20px rgba(0, 207, 168, 0.3)',
                        duration: 0.3,
                        overwrite: "auto"
                    });
                    gsap.to(cursorDot, {
                        scale: 0.5,
                        backgroundColor: '#1A8FFF',
                        boxShadow: '0 0 8px #1A8FFF',
                        duration: 0.3,
                        overwrite: "auto"
                    });
                });

                el.addEventListener('mouseleave', () => {
                    isHovering = false;
                    gsap.to(cursorRing, {
                        width: 36,
                        height: 36,
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(0, 207, 168, 0.5)',
                        boxShadow: '0 0 15px rgba(26, 143, 255, 0.1)',
                        duration: 0.3,
                        overwrite: "auto"
                    });
                    gsap.to(cursorDot, {
                        scale: 1.0,
                        backgroundColor: '#00CFA8',
                        boxShadow: '0 0 10px rgba(0, 207, 168, 0.8)',
                        duration: 0.3,
                        overwrite: "auto"
                    });
                });
            });
        };

        attachCursorHovers();

        // Re-attach hovers if DOM changes dynamically
        const observer = new MutationObserver(attachCursorHovers);
        observer.observe(document.body, { childList: true, subtree: true });

        // Mousedown / Click compression animation
        window.addEventListener('mousedown', () => {
            gsap.to(cursorDot, { scale: 0.6, duration: 0.1, overwrite: "auto" });
            gsap.to(cursorRing, { scale: 0.8, duration: 0.1, overwrite: "auto" });
        });

        window.addEventListener('mouseup', () => {
            gsap.to(cursorDot, { scale: 1.0, duration: 0.15, overwrite: "auto" });
            gsap.to(cursorRing, { scale: 1.0, duration: 0.2, overwrite: "auto" });
        });

        // Hide custom cursor elements if mouse leaves the window
        document.addEventListener('mouseleave', () => {
            gsap.to([cursorDot, cursorRing], { opacity: 0, duration: 0.2 });
        });
        document.addEventListener('mouseenter', () => {
            gsap.to([cursorDot, cursorRing], { opacity: 1, duration: 0.2 });
        });

        animate();

        // ===== MOBILE MENU TOGGLE =====
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuClose = document.getElementById('mobile-menu-close');

        function openMobileMenu() {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
            const header = document.getElementById('main-header');
            if (header) header.style.opacity = '0';
            if (header) header.style.pointerEvents = 'none';
        }
        window.closeMobileMenu = closeMobileMenu;
        function closeMobileMenu() {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
            const header = document.getElementById('main-header');
            if (header) header.style.opacity = '1';
            if (header) header.style.pointerEvents = 'auto';
        }

        if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileMenu);
        if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileMenu();
        });

        // Disable magnetic effect on touch devices
        if ('ontouchstart' in window) {
            document.querySelectorAll('.magnetic-wrap').forEach(el => {
                el.style.transform = 'none';
            });
        }
    
  }, []);

  return (
    <>
      
<div id="canvas-container"></div>
<div className="cyber-grid absolute top-0 left-0 w-full h-[150vh] pointer-events-none z-0"></div>

{/*  Pill-shaped Floating Navigation Header  */}
<header id="main-header" className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 px-8 py-3.5 flex justify-between items-center rounded-full glass-panel border border-border-subtle shadow-[0_8px_32px_rgba(11,17,32,0.5)]">
    <a className='flex items-center gap-2 hover:opacity-80 transition-opacity' href='/'>
        <img src="logo.png" alt="Bayswater Tech Logo" className="h-14 md:h-16 object-contain" />
    </a>
    <nav className="hidden md:flex items-center gap-8">
        <a className='text-xs font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors' href='/'>Services</a>
        <a className="text-xs font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors" href="#">About</a>
        <a className="text-xs font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors" href="#">Infrastructure</a>
        <a className="text-xs font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors" href="#">contact</a>
        <a className="px-5 py-2 bg-gradient-to-r from-secondary to-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:scale-105 hover:shadow-[0_0_20px_rgba(0,207,168,0.35)] transition-all" href="#">Get in Touch</a>
    </nav>
    <button id="hamburger-btn" className="md:hidden text-text-main hover:text-primary" aria-label="Open menu"><span className="material-symbols-outlined text-2xl">menu</span></button>
</header>

{/*  Mobile Navigation Overlay  */}
<div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation">
    <button id="mobile-menu-close" aria-label="Close menu"><span className="material-symbols-outlined">close</span></button>
    <a href="#" onClick={() => window.closeMobileMenu()}>Services</a>
    <a href="#" onClick={() => window.closeMobileMenu()}>About</a>
    <a href="#" onClick={() => window.closeMobileMenu()}>Infrastructure</a>
    <a href="#" onClick={() => window.closeMobileMenu()}>Contact</a>
    <a href="#" onClick={() => window.closeMobileMenu()} className="px-8 py-3 rounded-xl text-white font-bold text-sm uppercase tracking-widest" style={{"background":"linear-gradient(to right, #1A8FFF, #00CFA8)"}}>Get in Touch</a>
</div>

<main className="relative z-10">
{/*  Hero Section  */}
<section className="min-h-screen flex items-center justify-center px-8 md:px-24 relative overflow-hidden">
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center pt-28">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-8 section-reveal shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] bg-background/40 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{"background":"#D6B06A","boxShadow":"0 0 8px #D6B06A"}}></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Manage IT and Cyber Security</span>
        </div>
        <h1 className="font-syne text-5xl md:text-[68px] font-extrabold mb-8 section-reveal leading-[1.2] tracking-tight">
            <span className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">WE MANAGE, SECURE,</span> <br/>
            <span className="text-white-stroke">AND SCALE YOUR</span> <br/>
            <span className="text-3d-gold drop-shadow-[0_0_15px_rgba(214,176,106,0.35)]">TECHNOLOGY STACK.</span>
        </h1>
        <p className="text-base md:text-lg text-text-muted mb-10 leading-relaxed section-reveal max-w-2xl magnetic-wrap" data-strength="15">
            Sovereign Australian managed infrastructure and defense-grade cybersecurity for enterprises that demand uncompromising uptime.
        </p>
        <div className="flex flex-wrap justify-center gap-4 section-reveal">
            <button className="px-8 py-4 bg-gradient-to-r from-secondary to-primary text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:scale-105 hover:shadow-[0_0_30px_rgba(0,207,168,0.35)] transition-all">Get In Touch</button>
            <button className="px-8 py-4 rounded-xl text-white font-bold uppercase tracking-widest text-xs border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all">Explore Services</button>
        </div>
    </div>
</section>
{/*  Features Banner Marquee  */}
<section className="py-6 border-y border-white/5 bg-surface/30 backdrop-blur-md overflow-hidden relative">
    {/*  Fade masks on edges  */}
    <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none" style={{"background":"linear-gradient(to right, rgba(7,11,22,0.9), transparent)"}}></div>
    <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none" style={{"background":"linear-gradient(to left, rgba(7,11,22,0.9), transparent)"}}></div>

    <div className="features-marquee-track flex items-center gap-16 w-max">
        {/*  Set 1  */}
        <div className="flex items-center gap-3 flex-shrink-0 px-8">
            <span className="material-symbols-outlined text-primary text-xl">domain</span>
            <span className="text-[11px] text-text-muted font-bold uppercase tracking-[0.2em] whitespace-nowrap">100+ Businesses Supported</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-white/10 flex-shrink-0"></div>
        <div className="flex items-center gap-3 flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">handshake</span>
            <span className="text-[11px] text-text-muted font-bold uppercase tracking-[0.2em] whitespace-nowrap">Microsoft Partner</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-white/10 flex-shrink-0"></div>
        <div className="flex items-center gap-3 flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">support_agent</span>
            <span className="text-[11px] text-text-muted font-bold uppercase tracking-[0.2em] whitespace-nowrap">24/7 Support Available</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-white/10 flex-shrink-0"></div>
        <div className="flex items-center gap-3 flex-shrink-0 px-8">
            <span className="material-symbols-outlined text-primary text-xl">public</span>
            <span className="text-[11px] text-text-muted font-bold uppercase tracking-[0.2em] whitespace-nowrap">Australian Owned &amp; Operated</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-white/10 flex-shrink-0"></div>
        {/*  Set 2 (duplicate for seamless loop)  */}
        <div className="flex items-center gap-3 flex-shrink-0 px-8">
            <span className="material-symbols-outlined text-primary text-xl">domain</span>
            <span className="text-[11px] text-text-muted font-bold uppercase tracking-[0.2em] whitespace-nowrap">100+ Businesses Supported</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-white/10 flex-shrink-0"></div>
        <div className="flex items-center gap-3 flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">handshake</span>
            <span className="text-[11px] text-text-muted font-bold uppercase tracking-[0.2em] whitespace-nowrap">Microsoft Partner</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-white/10 flex-shrink-0"></div>
        <div className="flex items-center gap-3 flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">support_agent</span>
            <span className="text-[11px] text-text-muted font-bold uppercase tracking-[0.2em] whitespace-nowrap">24/7 Support Available</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-white/10 flex-shrink-0"></div>
        <div className="flex items-center gap-3 flex-shrink-0 px-8">
            <span className="material-symbols-outlined text-primary text-xl">public</span>
            <span className="text-[11px] text-text-muted font-bold uppercase tracking-[0.2em] whitespace-nowrap">Australian Owned &amp; Operated</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-white/10 flex-shrink-0"></div>
    </div>
</section>
{/*  Services / Evolution Anchor  */}
<section className="py-40 px-8 md:px-24" id="services-trigger">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
<div className="relative order-2 lg:order-1">
<div className="glass-panel p-10 rounded-3xl relative z-10 border-l-4 border-l-primary hover:translate-x-2 transition-transform duration-500">
<span className="material-symbols-outlined text-4xl text-primary mb-6">terminal</span>
<h3 className="font-syne text-3xl font-bold mb-6">Managed Security Operations</h3>
<p className="text-text-muted leading-relaxed mb-8">24/7 proactive monitoring powered by AI-driven threat intelligence. We don't just alert; we neutralize threats within the perimeter.</p>
<a className="group inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest" href="#">
                            Deep Dive <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
</a>
</div>
<div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
</div>
<div className="order-1 lg:order-2">
<h2 className="font-syne text-5xl md:text-7xl font-bold mb-8 leading-tight">Elite <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Infrastructure</span> <br/>Management.</h2>
<p className="text-xl text-text-muted mb-10 leading-relaxed">Transition from reactive IT to a predictive, self-healing digital environment that supports scale without friction.</p>
</div>
</div>
</section>
{/*  Ecosystem Grid  */}
<section className="py-40 px-8 md:px-24 bg-surface/20" id="ecosystem-trigger">
<div className="text-center max-w-3xl mx-auto mb-24">
<h2 className="font-syne text-5xl font-bold mb-6">The Technology <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Ecosystem</span></h2>
<div className="w-20 h-1 mx-auto mb-8" style={{"background":"linear-gradient(90deg, #D6B06A, #00CFA8)"}}></div>
<p className="text-text-muted">High-density architecture designed for the sovereign Australian landscape.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="glass-panel p-8 rounded-3xl transition-all cursor-pointer group">
<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined">cloud_done</span>
</div>
<h4 className="font-syne text-xl font-bold mb-4">Cloud Native</h4>
<p className="text-sm text-text-muted leading-relaxed">Secure, scalable AWS and Azure migrations with local compliance anchoring.</p>
</div>
<div className="glass-panel p-8 rounded-3xl transition-all cursor-pointer group">
<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined">hub</span>
</div>
<h4 className="font-syne text-xl font-bold mb-4">SD-WAN Mesh</h4>
<p className="text-sm text-text-muted leading-relaxed">Redundant, high-speed network fabrics connecting global branches seamlessly.</p>
</div>
<div className="glass-panel p-8 rounded-3xl transition-all cursor-pointer group">
<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined">psychology</span>
</div>
<h4 className="font-syne text-xl font-bold mb-4">AIOps Core</h4>
<p className="text-sm text-text-muted leading-relaxed">Autonomous resolution of system anomalies before performance degradation.</p>
</div>
</div>
</section>
{/*  End-to-end Services Grid Section  */}
<section className="py-40 px-8 md:px-24 bg-surface/10">
    <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="font-syne text-4xl md:text-5xl font-bold mb-6 leading-tight">
            End-to-end technology management<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">for Australian businesses</span>
        </h2>
        <div className="w-16 h-1 mx-auto mt-6" style={{"background":"linear-gradient(90deg, #D6B06A, #00CFA8)"}}></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/*  Card 1  */}
        <div className="glass-panel p-8 rounded-3xl group cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{"background":"linear-gradient(135deg, rgba(26,143,255,0.15), rgba(0,207,168,0.15))"}}>
                <span className="material-symbols-outlined" style={{"color":"#00CFA8"}}>devices</span>
            </div>
            <h4 className="font-syne text-lg font-bold mb-3">Managed IT Services</h4>
            <p className="text-sm text-text-muted leading-relaxed mb-6">Proactive maintenance, rapid remote support, and strategic roadmap planning to keep your operations flawless.</p>
            <a href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors" style={{"color":"#00CFA8"}}>
                Learn More <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
        </div>
        {/*  Card 2  */}
        <div className="glass-panel p-8 rounded-3xl group cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{"background":"linear-gradient(135deg, rgba(26,143,255,0.15), rgba(0,207,168,0.15))"}}>
                <span className="material-symbols-outlined" style={{"color":"#00CFA8"}}>security</span>
            </div>
            <h4 className="font-syne text-lg font-bold mb-3">Cybersecurity &amp; Compliance</h4>
            <p className="text-sm text-text-muted leading-relaxed mb-6">Military-grade threat detection, Essential Eight alignment, and continuous vulnerability assessments.</p>
            <a href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors" style={{"color":"#00CFA8"}}>
                Learn More <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
        </div>
        {/*  Card 3  */}
        <div className="glass-panel p-8 rounded-3xl group cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{"background":"linear-gradient(135deg, rgba(26,143,255,0.15), rgba(0,207,168,0.15))"}}>
                <span className="material-symbols-outlined" style={{"color":"#00CFA8"}}>cloud_sync</span>
            </div>
            <h4 className="font-syne text-lg font-bold mb-3">Cloud &amp; Infrastructure</h4>
            <p className="text-sm text-text-muted leading-relaxed mb-6">Secure, scalable cloud migrations and hybrid environment management optimized for performance.</p>
            <a href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors" style={{"color":"#00CFA8"}}>
                Learn More <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
        </div>
        {/*  Card 4  */}
        <div className="glass-panel p-8 rounded-3xl group cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{"background":"linear-gradient(135deg, rgba(26,143,255,0.15), rgba(0,207,168,0.15))"}}>
                <span className="material-symbols-outlined" style={{"color":"#00CFA8"}}>code_blocks</span>
            </div>
            <h4 className="font-syne text-lg font-bold mb-3">Software Development</h4>
            <p className="text-sm text-text-muted leading-relaxed mb-6">Custom enterprise applications built for sovereign resilience and long-term operational excellence.</p>
            <a href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors" style={{"color":"#00CFA8"}}>
                Learn More <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
        </div>
        {/*  Card 5  */}
        <div className="glass-panel p-8 rounded-3xl group cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{"background":"linear-gradient(135deg, rgba(26,143,255,0.15), rgba(0,207,168,0.15))"}}>
                <span className="material-symbols-outlined" style={{"color":"#00CFA8"}}>account_tree</span>
            </div>
            <h4 className="font-syne text-lg font-bold mb-3">Systems Integration</h4>
            <p className="text-sm text-text-muted leading-relaxed mb-6">Seamless automated workflows connecting disparate enterprise tools and platforms.</p>
            <a href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors" style={{"color":"#00CFA8"}}>
                Learn More <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
        </div>
        {/*  Card 6  */}
        <div className="glass-panel p-8 rounded-3xl group cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{"background":"linear-gradient(135deg, rgba(26,143,255,0.15), rgba(0,207,168,0.15))"}}>
                <span className="material-symbols-outlined" style={{"color":"#00CFA8"}}>bar_chart_4_bars</span>
            </div>
            <h4 className="font-syne text-lg font-bold mb-3">Data &amp; Analytics</h4>
            <p className="text-sm text-text-muted leading-relaxed mb-6">Actionable business intelligence secured within Australian borders and sovereignty frameworks.</p>
            <a href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors" style={{"color":"#00CFA8"}}>
                Learn More <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
        </div>
    </div>
</section>
{/*  AI Transformation Cinematic  */}
<section className="py-60 relative overflow-hidden flex items-center justify-center">
<div className="absolute inset-0 data-stream-bg opacity-30 z-0"></div>
<div className="relative z-10 text-center px-8">
<h2 className="font-syne text-6xl md:text-8xl font-black mb-12 uppercase tracking-tighter mix-blend-overlay opacity-20">Transformative Intelligence</h2>
<div className="max-w-2xl mx-auto">
<h3 className="font-syne text-4xl font-bold mb-8">AI-Enabled <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Resilience</span></h3>
<p className="text-lg text-text-muted mb-12">We integrate Large Language Models and Machine Learning into your core infrastructure to automate compliance and identify zero-day vulnerabilities in real-time.</p>
<button className="group px-8 py-4 border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-background transition-all">
                        View AI Roadmap
                    </button>
</div>
</div>
</section>
{/*  What We Manage Section  */}
<section className="py-40 px-8 md:px-24">
    <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="font-syne text-4xl md:text-5xl font-bold mb-6 leading-tight">
            What we <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">manage for you</span>
        </h2>
        <p className="text-text-muted text-lg">Comprehensive, enterprise-grade solutions designed to keep your business running smoothly and securely.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/*  Card 1  */}
        <div className="glass-panel p-8 rounded-3xl group cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{"background":"linear-gradient(135deg, rgba(26,143,255,0.15), rgba(0,207,168,0.15))"}}>
                <span className="material-symbols-outlined" style={{"color":"#00CFA8"}}>dns</span>
            </div>
            <h4 className="font-syne text-lg font-bold mb-3">Cloud Infrastructure</h4>
            <p className="text-sm text-text-muted leading-relaxed">Scalable, secure cloud environments tailored to your workload and compliance needs.</p>
        </div>
        {/*  Card 2  */}
        <div className="glass-panel p-8 rounded-3xl group cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{"background":"linear-gradient(135deg, rgba(26,143,255,0.15), rgba(0,207,168,0.15))"}}>
                <span className="material-symbols-outlined" style={{"color":"#00CFA8"}}>shield_lock</span>
            </div>
            <h4 className="font-syne text-lg font-bold mb-3">Cybersecurity</h4>
            <p className="text-sm text-text-muted leading-relaxed">Proactive threat detection and continuous security monitoring around the clock.</p>
        </div>
        {/*  Card 3  */}
        <div className="glass-panel p-8 rounded-3xl group cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{"background":"linear-gradient(135deg, rgba(26,143,255,0.15), rgba(0,207,168,0.15))"}}>
                <span className="material-symbols-outlined" style={{"color":"#00CFA8"}}>support_agent</span>
            </div>
            <h4 className="font-syne text-lg font-bold mb-3">IT Helpdesk</h4>
            <p className="text-sm text-text-muted leading-relaxed">Rapid response support for your entire team, whenever and wherever needed.</p>
        </div>
        {/*  Card 4  */}
        <div className="glass-panel p-8 rounded-3xl group cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{"background":"linear-gradient(135deg, rgba(26,143,255,0.15), rgba(0,207,168,0.15))"}}>
                <span className="material-symbols-outlined" style={{"color":"#00CFA8"}}>cloud_upload</span>
            </div>
            <h4 className="font-syne text-lg font-bold mb-3">Data Backup</h4>
            <p className="text-sm text-text-muted leading-relaxed">Automated, encrypted backups ensuring business continuity and zero data loss.</p>
        </div>
        {/*  Card 5  */}
        <div className="glass-panel p-8 rounded-3xl group cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{"background":"linear-gradient(135deg, rgba(26,143,255,0.15), rgba(0,207,168,0.15))"}}>
                <span className="material-symbols-outlined" style={{"color":"#00CFA8"}}>router</span>
            </div>
            <h4 className="font-syne text-lg font-bold mb-3">Network Management</h4>
            <p className="text-sm text-text-muted leading-relaxed">Optimized network performance and robust access controls across your infrastructure.</p>
        </div>
        {/*  Card 6  */}
        <div className="glass-panel p-8 rounded-3xl group cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{"background":"linear-gradient(135deg, rgba(26,143,255,0.15), rgba(0,207,168,0.15))"}}>
                <span className="material-symbols-outlined" style={{"color":"#00CFA8"}}>devices_other</span>
            </div>
            <h4 className="font-syne text-lg font-bold mb-3">Device Management</h4>
            <p className="text-sm text-text-muted leading-relaxed">Centralized control and provisioning for all company hardware and endpoints.</p>
        </div>
    </div>
</section>
{/*  Quantum-Resistant Encryption Section  */}

<section id="quantum-section" className="py-40 px-8 md:px-24 relative">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
    {/*  Left: Text Content  */}
    <div className="order-2 lg:order-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-8" style={{"borderColor":"rgba(214,176,106,0.3)","background":"rgba(214,176,106,0.06)"}}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{"background":"#D6B06A","boxShadow":"0 0 6px #D6B06A"}}></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{"color":"#D6B06A"}}>Military-Grade Security</span>
        </div>
        <h2 className="font-syne text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Quantum-Resistant<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Encryption</span>
        </h2>
        <p className="text-text-muted text-lg leading-relaxed mb-10">
            Future-proofing your data against next-generation cryptographic threats. Our proprietary lattice-based algorithms secure data at rest and in transit.
        </p>
        {/*  Feature Bullets  */}
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{"background":"linear-gradient(135deg, #1A8FFF, #00CFA8)"}}>
                    <span className="material-symbols-outlined text-white text-xs">check</span>
                </div>
                <p className="text-text-muted text-sm">AES-256 Military Grade</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{"background":"linear-gradient(135deg, #1A8FFF, #00CFA8)"}}>
                    <span className="material-symbols-outlined text-white text-xs">check</span>
                </div>
                <p className="text-text-muted text-sm">Post-Quantum Cryptography</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{"background":"linear-gradient(135deg, #1A8FFF, #00CFA8)"}}>
                    <span className="material-symbols-outlined text-white text-xs">check</span>
                </div>
                <p className="text-text-muted text-sm">Automated Key Rotation</p>
            </div>
        </div>
    </div>
    {/*  Right: Image Container for Stacking  */}
    <div className="order-1 lg:order-2 relative h-[400px] md:h-[500px] w-full">
        <div id="quantum-images" className="relative rounded-3xl overflow-hidden w-full h-full" style={{"boxShadow":"0 0 60px rgba(0, 207, 168, 0.15), 0 0 120px rgba(26, 143, 255, 0.08)"}}>
            {/*  Base Image  */}
            <img src="images/quantum_encryption.png" alt="Quantum Encryption Visualization" className="absolute inset-0 w-full h-full object-cover rounded-3xl" style={{"border":"1.5px solid transparent","background":"linear-gradient(135deg,rgba(26,143,255,0.3),rgba(0,207,168,0.2)) border-box"}}/>
            
            {/*  Slide up images  */}
            <img src="images/quantum_scroll_1.png" className="quantum-slide-img absolute inset-0 w-full h-full object-cover rounded-3xl translate-y-full" />
            <img src="images/quantum_scroll_2.png" className="quantum-slide-img absolute inset-0 w-full h-full object-cover rounded-3xl translate-y-full" />
            <img src="images/quantum_scroll_3.png" className="quantum-slide-img absolute inset-0 w-full h-full object-cover rounded-3xl translate-y-full" />

            {/*  Glow overlay  */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none z-10" style={{"background":"linear-gradient(135deg, rgba(26,143,255,0.08) 0%, transparent 50%, rgba(0,207,168,0.08) 100%)"}}></div>
        </div>
        {/*  Decorative glow blob  */}
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full pointer-events-none" style={{"background":"rgba(0, 207, 168, 0.08)","filter":"blur(80px)"}}></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full pointer-events-none" style={{"background":"rgba(26, 143, 255, 0.08)","filter":"blur(60px)"}}></div>
    </div>
</div>
</section>
{/*  Testimonials  */}
<section className="py-40 px-8 md:px-24">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
<div className="lg:col-span-4">
<h2 className="font-syne text-5xl font-bold mb-8">What our partners <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">say.</span></h2>
<p className="text-text-muted mb-12">Trusted by ASX-listed enterprises and government departments across Australia.</p>
</div>
<div className="lg:col-span-8 flex flex-col gap-6">
<div className="glass-panel p-10 rounded-3xl shadow-[20px_20px_60px_rgba(0,0,0,0.3)] hover:border-primary/40 transition-all border-l-2" style={{"borderLeftColor":"#D6B06A"}}>
<p className="text-xl italic font-dm-sans leading-relaxed mb-8 text-text-main">"Bayswater didn't just fix our IT; they redesigned our entire operational flow. Their cybersecurity posture is the gold standard for our industry."</p>
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center font-bold border" style={{"color":"#D6B06A","borderColor":"rgba(214,176,106,0.3)"}}>JS</div>
<div>
<p className="font-bold text-sm">James Sutherland</p>
<p className="text-xs text-text-muted uppercase tracking-widest">CTO, Global Logistics Corp</p>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  Stats Section  */}
<section className="py-20 px-8 md:px-24 border-y border-white/5 relative overflow-hidden" style={{"background":"#070b16"}}>
    {/*  Background shield image scrolling left infinitely  */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="stats-shield-float flex items-center h-full" style={{"width":"200%"}}>
            <img src="images/stats_bg.png" alt="" className="h-full object-cover opacity-25" style={{"width":"50%"}} />
            <img src="images/stats_bg.png" alt="" className="h-full object-cover opacity-25" style={{"width":"50%"}} />
        </div>
    </div>
    {/*  Dark gradient overlay for readability  */}
    <div className="absolute inset-0 z-0" style={{"background":"linear-gradient(to right, rgba(7,11,22,0.85) 0%, rgba(7,11,22,0.3) 50%, rgba(7,11,22,0.85) 100%)"}}></div>
    {/*  Stats Text Marquee (Right Scroll)  */}
    <div className="relative z-10 overflow-hidden">
        <div className="stats-text-track flex items-center gap-0">
            {/*  Set 1  */}
            <div className="text-center px-12 flex-shrink-0 border-r border-white/10">
                <h3 className="font-syne text-5xl md:text-6xl font-bold mb-3 text-primary" style={{"textShadow":"0 0 20px rgba(0,207,168,0.6)"}}>100+</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Active Clients</p>
            </div>
            <div className="text-center px-12 flex-shrink-0 border-r border-white/10">
                <h3 className="font-syne text-5xl md:text-6xl font-bold mb-3 text-primary" style={{"textShadow":"0 0 20px rgba(0,207,168,0.6)"}}>99.9%</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Uptime Guarantee</p>
            </div>
            <div className="text-center px-12 flex-shrink-0 border-r border-white/10">
                <h3 className="font-syne text-5xl md:text-6xl font-bold mb-3 text-primary" style={{"textShadow":"0 0 20px rgba(0,207,168,0.6)"}}>24/7</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Monitoring</p>
            </div>
            <div className="text-center px-12 flex-shrink-0 border-r border-white/10">
                <h3 className="font-syne text-5xl md:text-6xl font-bold mb-3 text-primary" style={{"textShadow":"0 0 20px rgba(0,207,168,0.6)"}}>8</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Data Centers</p>
            </div>
            {/*  Set 2 (duplicate for seamless loop)  */}
            <div className="text-center px-12 flex-shrink-0 border-r border-white/10">
                <h3 className="font-syne text-5xl md:text-6xl font-bold mb-3 text-primary" style={{"textShadow":"0 0 20px rgba(0,207,168,0.6)"}}>100+</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Active Clients</p>
            </div>
            <div className="text-center px-12 flex-shrink-0 border-r border-white/10">
                <h3 className="font-syne text-5xl md:text-6xl font-bold mb-3 text-primary" style={{"textShadow":"0 0 20px rgba(0,207,168,0.6)"}}>99.9%</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Uptime Guarantee</p>
            </div>
            <div className="text-center px-12 flex-shrink-0 border-r border-white/10">
                <h3 className="font-syne text-5xl md:text-6xl font-bold mb-3 text-primary" style={{"textShadow":"0 0 20px rgba(0,207,168,0.6)"}}>24/7</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Monitoring</p>
            </div>
            <div className="text-center px-12 flex-shrink-0">
                <h3 className="font-syne text-5xl md:text-6xl font-bold mb-3 text-primary" style={{"textShadow":"0 0 20px rgba(0,207,168,0.6)"}}>8</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Data Centers</p>
            </div>
        </div>
    </div>
</section>
{/*  CTA Section  */}
<section className="py-40 px-8 md:px-24" id="cta-trigger">
<div className="glass-panel p-20 rounded-[2rem] text-center relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
<div className="relative z-10">
<h2 className="font-syne text-5xl md:text-7xl font-extrabold mb-10">Ready for the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Next Era?</span></h2>
<p className="text-xl text-text-muted max-w-xl mx-auto mb-12 leading-relaxed">Secure your free infrastructure maturity audit and discover the gaps in your current defense strategy.</p>
<button className="px-12 py-6 bg-gradient-to-r from-secondary to-primary text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:scale-110 transition-transform shadow-[0_0_50px_rgba(0,207,168,0.3)]">Get Started Today</button>
</div>
</div>
</section>
{/*  Footer  */}
<footer className="py-20 px-8 md:px-24 bg-background border-t border-border-subtle">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
        {/*  Brand Column  */}
        <div className="md:col-span-12 lg:col-span-3">
            <div className="flex items-center mb-6 -mt-4">
                <img src="logo.png" alt="Bayswater Tech Logo" className="h-20 object-contain" />
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
                Sovereign Australian Cybersecurity &amp; Managed IT Services for the modern enterprise.
            </p>
            <div className="flex gap-4">
                <a href="#" aria-label="LinkedIn" className="text-text-muted hover:text-primary transition-colors">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" aria-label="Twitter" className="text-text-muted hover:text-primary transition-colors">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" aria-label="GitHub" className="text-text-muted hover:text-primary transition-colors">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
            </div>
        </div>
        
        {/*  Services Column  */}
        <div className="md:col-span-6 lg:col-span-3 flex flex-col gap-4">
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-text-main mb-2">SERVICES</h5>
            <a className="text-sm text-text-muted hover:text-white transition-colors" href="#">Managed IT Services</a>
            <a className="text-sm text-text-muted hover:text-white transition-colors" href="#">Cybersecurity &amp; Compliance</a>
            <a className="text-sm text-text-muted hover:text-white transition-colors" href="#">Cloud &amp; Infrastructure</a>
            <a className="text-sm text-text-muted hover:text-white transition-colors" href="#">Systems Integration</a>
            <a className="text-sm text-text-muted hover:text-white transition-colors" href="#">Data &amp; Analytics</a>
        </div>

        {/*  Company Column  */}
        <div className="md:col-span-6 lg:col-span-2 flex flex-col gap-4">
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-text-main mb-2">COMPANY</h5>
            <a className="text-sm text-text-muted hover:text-white transition-colors" href="#">About Us</a>
            <a className="text-sm text-text-muted hover:text-white transition-colors" href="#">Infrastructure</a>
            <a className="text-sm text-text-muted hover:text-white transition-colors" href="#">Partners</a>
            <a className="text-sm text-text-muted hover:text-white transition-colors" href="#">Careers</a>
        </div>

        {/*  Contact Column  */}
        <div className="md:col-span-6 lg:col-span-2 flex flex-col gap-4">
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-text-main mb-2">CONTACT</h5>
            <div className="flex items-center gap-3 text-sm text-text-muted">
                <span className="material-symbols-outlined text-primary text-base">call</span>
                <a href="tel:+611300000000" className="hover:text-white transition-colors whitespace-nowrap">+61 1300 000 000</a>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-muted">
                <span className="material-symbols-outlined text-primary text-base">mail</span>
                <a href="mailto:info@bayswater.tech" className="hover:text-white transition-colors">info@bayswater.tech</a>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-muted">
                <span className="material-symbols-outlined text-primary text-base">location_on</span>
                <span>Sydney, NSW, Australia</span>
            </div>
        </div>

        {/*  Legal Column  */}
        <div className="md:col-span-6 lg:col-span-2 flex flex-col gap-4">
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-text-main mb-2">LEGAL &amp; SECURITY</h5>
            <a className="text-sm text-text-muted hover:text-white transition-colors" href="#">Privacy Policy</a>
            <a className="text-sm text-text-muted hover:text-white transition-colors" href="#">Terms of Service</a>
            <a className="text-sm text-text-muted hover:text-white transition-colors" href="#">Security &amp; Sovereignty</a>
            <a className="text-sm text-text-muted hover:text-white transition-colors" href="#">System Status</a>
        </div>
    </div>
    
    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-text-muted text-center md:text-left">© 2026 Bayswater Tech Solutions. Sovereign Australian Cybersecurity. Designed by Mohammad Mohib.</p>
        <p className="text-xs text-text-muted text-center md:text-right">All rights reserved.</p>
    </div>
</footer>
</main>

{/*  Custom 3D-Animated Cursor Elements  */}
<div className="custom-cursor-dot"></div>
<div className="custom-cursor-ring"></div>



    </>
  );
}
