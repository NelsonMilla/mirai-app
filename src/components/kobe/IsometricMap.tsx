'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useIntersection } from '@/hooks/useIntersection';

interface BuildingData {
  title: string;
  subtitle: string;
  cat: string;
  text: string;
  s1v: string;
  s1l: string;
  s2v: string;
  s2l: string;
  s3v: string;
  s3l: string;
  [key: string]: string;
}

export default function IsometricMap() {
  const { ref: sectionRef, isIntersecting } = useIntersection({ threshold: 0.15, triggerOnce: true });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mapRevealed, setMapRevealed] = useState(false);

  // Initialize map interactions
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const wrapperEl = wrapper as HTMLDivElement;
    const canvasEl = canvas as HTMLDivElement;

    const buildings = canvas.querySelectorAll('.iso-building') as NodeListOf<HTMLElement>;
    let currentCard: HTMLElement | null = null;
    let isDraggingLocal = false;
    let hasDragged = false;
    let dragStartX = 0,
      dragStartY = 0;
    let offsetX = 0,
      offsetY = 0;
    let velocityX = 0,
      velocityY = 0;
    let lastMoveX = 0,
      lastMoveY = 0;

    function updateCanvasTransform() {
      canvasEl.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    function openBuilding(building: HTMLElement) {
      closeCard();
      const d = building.dataset as Record<string, string>;
      const cat = d.cat || 'Venue';
      const rect = building.getBoundingClientRect();
      const catColor: Record<
        string,
        { rgb: string; accent: string }
      > = {
        Venue: { rgb: '255,107,146', accent: '#FF6B92' },
        Stay: { rgb: '212,184,255', accent: '#D4B8FF' },
        Transit: { rgb: '184,227,255', accent: '#B8E3FF' },
        Lifestyle: { rgb: '232,201,125', accent: '#E8C97D' },
        Food: { rgb: '255,140,105', accent: '#FF8C69' },
        Active: { rgb: '130,220,190', accent: '#82DCBE' },
      };

      const colors = catColor[cat] || { rgb: '255,107,146', accent: '#FF6B92' };

      const card = document.createElement('div');
      card.className = 'iso-info-card';
      card.style.setProperty('--building-rgb', colors.rgb);
      card.style.setProperty('--building-accent', colors.accent);
      card.innerHTML = `
        <div class="iso-card-header">
          <div>
            <div class="iso-card-title">${d.title || ''}</div>
            <div class="iso-card-category">${cat}</div>
          </div>
          <button class="iso-card-close">&times;</button>
        </div>
        <div class="iso-card-text">${d.text || ''}</div>
        <div class="iso-card-stats">
          <div class="iso-card-stat">
            <div class="iso-card-stat-value">${d.s1v || ''}</div>
            <div class="iso-card-stat-label">${d.s1l || ''}</div>
          </div>
          <div class="iso-card-stat">
            <div class="iso-card-stat-value">${d.s2v || ''}</div>
            <div class="iso-card-stat-label">${d.s2l || ''}</div>
          </div>
          <div class="iso-card-stat">
            <div class="iso-card-stat-value">${d.s3v || ''}</div>
            <div class="iso-card-stat-label">${d.s3l || ''}</div>
          </div>
        </div>
      `;

      wrapperEl.appendChild(card);
      currentCard = card;

      // Add scan line
      const scanLine = document.createElement('div');
      scanLine.className = 'iso-card-scan';
      card.appendChild(scanLine);
      setTimeout(() => scanLine.remove(), 1200);

      card.querySelector('.iso-card-close')?.addEventListener('click', closeCard);

      requestAnimationFrame(() => {
        card.classList.add('active');
        // Position card next to building
        const wrapperRect = wrapperEl.getBoundingClientRect();
        let left = rect.left - wrapperRect.left + rect.width / 2 - 160;
        let top = rect.top - wrapperRect.top - (card as HTMLElement).offsetHeight - 20;

        if (left < 10) left = 10;
        if (left + 320 > wrapperRect.width - 10) left = wrapperRect.width - 330;
        if (top < 10) top = rect.top - wrapperRect.top + rect.height + 20;

        (card as HTMLElement).style.left = left + 'px';
        (card as HTMLElement).style.top = top + 'px';
      });

      building.classList.add('active');
    }

    function closeCard() {
      if (currentCard) {
        currentCard.classList.remove('active');
        const c = currentCard;
        setTimeout(() => {
          if (c.parentNode) c.remove();
        }, 300);
        currentCard = null;
      }
      buildings.forEach((b) => b.classList.remove('active'));
    }

    // Building click handlers
    buildings.forEach((building) => {
      building.addEventListener('click', (e) => {
        if (hasDragged) return;
        e.stopPropagation();
        openBuilding(building);
      });
    });

    // Dragging
    wrapper.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).closest('.iso-info-card')) return;
      isDraggingLocal = true;
      hasDragged = false;
      dragStartX = e.clientX - offsetX;
      dragStartY = e.clientY - offsetY;
      velocityX = 0;
      velocityY = 0;
      setIsDragging(true);
      wrapper.style.cursor = 'grabbing';
    });

    const handleDocumentMouseMove = (e: MouseEvent) => {
      if (!isDraggingLocal) return;
      const dx = e.clientX - dragStartX - offsetX;
      const dy = e.clientY - dragStartY - offsetY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;
      offsetX = e.clientX - dragStartX;
      offsetY = e.clientY - dragStartY;
      velocityX = e.movementX;
      velocityY = e.movementY;
      updateCanvasTransform();
    };

    const handleDocumentMouseUp = () => {
      if (!isDraggingLocal) return;
      isDraggingLocal = false;
      setIsDragging(false);
      wrapper.style.cursor = '';
      // Momentum
      function applyMomentum() {
        if (Math.abs(velocityX) < 0.3 && Math.abs(velocityY) < 0.3) return;
        offsetX += velocityX;
        offsetY += velocityY;
        velocityX *= 0.92;
        velocityY *= 0.92;
        updateCanvasTransform();
        requestAnimationFrame(applyMomentum);
      }
      applyMomentum();
    };

    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp);

    // Touch support
    let lastTouchX = 0,
      lastTouchY = 0;
    wrapper.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length === 1) {
          isDraggingLocal = true;
          hasDragged = false;
          dragStartX = e.touches[0].clientX - offsetX;
          dragStartY = e.touches[0].clientY - offsetY;
          lastTouchX = e.touches[0].clientX;
          lastTouchY = e.touches[0].clientY;
          velocityX = 0;
          velocityY = 0;
          setIsDragging(true);
        }
      },
      { passive: true }
    );

    const handleDocumentTouchMove = (e: TouchEvent) => {
      if (!isDraggingLocal || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - dragStartX - offsetX;
      const dy = e.touches[0].clientY - dragStartY - offsetY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;
      velocityX = e.touches[0].clientX - lastTouchX;
      velocityY = e.touches[0].clientY - lastTouchY;
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
      offsetX = e.touches[0].clientX - dragStartX;
      offsetY = e.touches[0].clientY - dragStartY;
      updateCanvasTransform();
    };

    const handleDocumentTouchEnd = () => {
      if (!isDraggingLocal) return;
      isDraggingLocal = false;
      setIsDragging(false);
      function applyMomentum() {
        if (Math.abs(velocityX) < 0.3 && Math.abs(velocityY) < 0.3) return;
        offsetX += velocityX;
        offsetY += velocityY;
        velocityX *= 0.92;
        velocityY *= 0.92;
        updateCanvasTransform();
        requestAnimationFrame(applyMomentum);
      }
      applyMomentum();
    };

    document.addEventListener('touchmove', handleDocumentTouchMove, { passive: true });
    document.addEventListener('touchend', handleDocumentTouchEnd);

    // Close on Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentCard) closeCard();
    };
    document.addEventListener('keydown', handleKeyDown);

    // Close on background click
    wrapper.addEventListener('click', (e) => {
      if (
        !hasDragged &&
        (e.target === wrapper ||
          e.target === canvas ||
          (e.target as HTMLElement).closest('.kobe-layer')) &&
        currentCard
      ) {
        closeCard();
      }
    });

    // Parallax depth on mouse move
    const layers = {
      water: wrapperEl.querySelector('.kobe-layer-water') as HTMLElement | null,
      mainland: wrapperEl.querySelector('.kobe-layer-mainland') as HTMLElement | null,
      island: wrapperEl.querySelector('.kobe-layer-island') as HTMLElement | null,
      glow: wrapperEl.querySelector('.kobe-layer-glow') as HTMLElement | null,
    };

    let parallaxEnabled = true;
    const mapVisObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        parallaxEnabled = e.isIntersecting;
      });
    }, { threshold: 0 });
    mapVisObs.observe(wrapper);

    let pTgtX = 0,
      pTgtY = 0,
      pCurX = 0,
      pCurY = 0;

    wrapper.addEventListener('mousemove', (e) => {
      if (isDraggingLocal) return;
      const rect = wrapper.getBoundingClientRect();
      pTgtX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pTgtY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    wrapper.addEventListener('mouseleave', () => {
      pTgtX = 0;
      pTgtY = 0;
    });

    function parallaxTick() {
      if (parallaxEnabled && !document.hidden && !isDraggingLocal) {
        pCurX += (pTgtX - pCurX) * 0.04;
        pCurY += (pTgtY - pCurY) * 0.04;
        if (layers.water)
          layers.water.style.transform = `translate(${pCurX * -3}px, ${pCurY * -2}px)`;
        if (layers.mainland)
          layers.mainland.style.transform = `translate(${pCurX * -5}px, ${pCurY * -3}px)`;
        if (layers.island)
          layers.island.style.transform = `translate(${pCurX * -2}px, ${pCurY * -1}px)`;
        if (layers.glow) layers.glow.style.transform = `translate(${pCurX * -2}px, ${pCurY * -1}px)`;
      }
      requestAnimationFrame(parallaxTick);
    }
    parallaxTick();

    // Entrance animation
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const visual = wrapper;
            visual.classList.add('map-revealed');
            setMapRevealed(true);
            // Stagger layer reveals
            const layerDelays = [
              ['.kobe-layer-water', 0],
              ['.kobe-layer-mainland', 200],
              ['.kobe-layer-island', 400],
              ['.kobe-layer-grid', 500],
              ['.kobe-layer-buildings', 600],
              ['.kobe-layer-glow', 700],
            ];
            layerDelays.forEach(([sel, delay]) => {
              const el = canvas.querySelector(sel as string);
              if (el) {
                (el as HTMLElement).style.transitionDelay = delay + 'ms';
              }
            });
            // Stagger ambient buildings
            canvas.querySelectorAll('.iso-ambient').forEach((b, i) => {
              (b as HTMLElement).style.transitionDelay = 800 + i * 20 + 'ms';
            });
            // Stagger interactive buildings
            buildings.forEach((b, i) => {
              (b as HTMLElement).style.transitionDelay = 1200 + i * 120 + 'ms';
            });
            revealObs.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    revealObs.observe(wrapper);

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
      document.removeEventListener('touchmove', handleDocumentTouchMove);
      document.removeEventListener('touchend', handleDocumentTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
      mapVisObs.disconnect();
      revealObs.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`section reveal ${isIntersecting ? 'in' : ''}`}
      id="playground"
      data-section="playground"
    >
      <div className="section-label stagger">Port Island</div>
      <h2 className="kobe-h2 stagger" style={{ marginBottom: '2rem' }}>
        Meet the playground.
      </h2>
      <div className="kobe-beat-2">
        <div className={`kobe-visual ${isDragging ? 'dragging' : ''}`} ref={wrapperRef}>
          <div className="iso-map-wrapper" id="isoMapWrapper">
            <div className="iso-map-canvas" id="isoMapCanvas" ref={canvasRef}>
              {/* Layer 1: Water */}
              <div className="kobe-layer kobe-layer-water">
                <svg viewBox="0 0 400 540" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="400" height="540" fill="#080c14" />
                  <g className="kobe-water-pattern" opacity="0.12">
                    <line x1="0" y1="50" x2="400" y2="48" stroke="#152030" strokeWidth="0.5" />
                    <line x1="0" y1="100" x2="400" y2="102" stroke="#152030" strokeWidth="0.5" />
                    <line x1="0" y1="150" x2="400" y2="148" stroke="#152030" strokeWidth="0.5" />
                    <line x1="0" y1="200" x2="400" y2="202" stroke="#152030" strokeWidth="0.5" />
                    <line x1="0" y1="250" x2="400" y2="248" stroke="#152030" strokeWidth="0.5" />
                    <line x1="0" y1="300" x2="400" y2="302" stroke="#152030" strokeWidth="0.5" />
                    <line x1="0" y1="350" x2="400" y2="348" stroke="#152030" strokeWidth="0.5" />
                    <line x1="0" y1="400" x2="400" y2="402" stroke="#152030" strokeWidth="0.5" />
                    <line x1="0" y1="450" x2="400" y2="448" stroke="#152030" strokeWidth="0.5" />
                    <line x1="0" y1="500" x2="400" y2="502" stroke="#152030" strokeWidth="0.5" />
                  </g>
                  <ellipse cx="90" cy="200" rx="50" ry="18" fill="url(#waterGlow1)" opacity="0.06" />
                  <ellipse cx="330" cy="380" rx="40" ry="14" fill="url(#waterGlow1)" opacity="0.04" />
                  <g className="caustics" opacity="0.05">
                    <ellipse cx="140" cy="180" rx="30" ry="12" fill="#B8E3FF" />
                    <ellipse cx="300" cy="120" rx="25" ry="10" fill="#B8E3FF" />
                    <ellipse cx="80" cy="350" rx="35" ry="14" fill="#D4B8FF" />
                    <ellipse cx="350" cy="280" rx="20" ry="8" fill="#B8E3FF" />
                    <ellipse cx="50" cy="480" rx="28" ry="11" fill="#D4B8FF" />
                    <ellipse cx="320" cy="450" rx="22" ry="9" fill="#B8E3FF" />
                  </g>
                  <defs>
                    <radialGradient id="waterGlow1">
                      <stop offset="0%" stopColor="#B8E3FF" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Layer 2: Mainland Kobe + Rokko Island */}
              <div className="kobe-layer kobe-layer-mainland">
                <svg viewBox="0 0 400 540" fill="none">
                  <path
                    d="M0,0 L220,0 L220,30 L200,40 L180,55 L165,62 C155,66 148,64 140,68 C130,73 125,70 118,75 L110,80 L100,78 L85,82 C70,85 60,80 50,85 L35,88 L20,82 L0,85 Z"
                    fill="#10111c"
                  />
                  <path
                    d="M220,30 L200,40 L180,55 L165,62 C155,66 148,64 140,68 C130,73 125,70 118,75 L110,80 L100,78 L85,82 C70,85 60,80 50,85 L35,88 L20,82 L0,85"
                    stroke="rgba(245,160,181,0.06)"
                    strokeWidth="0.6"
                    fill="none"
                  />
                  <path
                    d="M0,0 L0,30 C20,18 40,25 60,15 C80,8 100,18 120,10 C140,5 160,14 180,8 L200,12 L220,5 L220,0 Z"
                    fill="#0c0d16"
                    opacity="0.6"
                  />
                  <path
                    d="M290,55 L380,55 L380,120 L370,122 L360,120 L340,122 L320,120 L305,122 L290,118 Z"
                    fill="#0f1018"
                    stroke="rgba(245,160,181,0.05)"
                    strokeWidth="0.5"
                  />
                  <rect x="145" y="50" width="18" height="25" rx="1" fill="#0f1018" stroke="rgba(245,160,181,0.04)" strokeWidth="0.4" />
                </svg>
              </div>

              {/* Layer 3: Port Island + Airport Island */}
              <div className="kobe-layer kobe-layer-island">
                <svg viewBox="0 0 400 540" fill="none">
                  <defs>
                    <linearGradient id="islandGrad" x1="180" y1="80" x2="220" y2="420" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#1a1c2e" />
                      <stop offset="50%" stopColor="#1c1a2a" />
                      <stop offset="100%" stopColor="#201a2c" />
                    </linearGradient>
                    <linearGradient id="kbicGlow" x1="170" y1="260" x2="260" y2="400" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="rgba(245,160,181,0)" />
                      <stop offset="40%" stopColor="rgba(245,160,181,0.04)" />
                      <stop offset="100%" stopColor="rgba(245,160,181,0.02)" />
                    </linearGradient>
                    <filter id="islandShadow">
                      <feDropShadow dx="0" dy="2" stdDeviation="8" floodColor="#000" floodOpacity="0.6" />
                    </filter>
                  </defs>
                  <path
                    className="kobe-island-fill"
                    filter="url(#islandShadow)"
                    d="
              M120,95 L125,93 L170,93 L172,90 L195,90
              L195,88 L210,88 L210,93 L235,93 L238,95
              L238,125 L240,125 L240,145
              L242,148 L242,170
              L240,172 L240,192
              L235,192 L235,200
              L238,200 L242,204
              L242,230 L244,232
              L244,260
              L246,262 L248,265
              L250,265 L260,268
              L275,268 L278,270
              L280,275 L280,320
              L282,322 L282,348
              L280,360 L278,370
              L275,380 L268,388
              L260,394 L248,400
              L230,405 L200,408
              L178,408 L158,405
              L148,400 L140,394
              L135,388 L132,380
              L130,370 L128,355
              L128,330 L130,315
              L130,290 L128,270
              L128,250 L126,232
              L126,204 L128,200
              L128,192 L125,192
              L122,188 L120,172
              L118,170 L118,148
              L120,145 L120,125
              L118,125 L118,95
              Z
            "
                    fill="url(#islandGrad)"
                    stroke="rgba(245,160,181,0.1)"
                    strokeWidth="0.7"
                  />
                  <path
                    d="M135,280 L244,262 L282,322 L280,360 L275,380 L260,394 L200,408 L158,405 L140,394 L132,380 L128,355 L128,330 L130,290 Z"
                    fill="url(#kbicGlow)"
                    opacity="0.8"
                  />
                  <rect x="115" y="100" width="8" height="20" fill="#080c14" opacity="0.5" rx="1" />
                  <rect x="115" y="128" width="7" height="16" fill="#080c14" opacity="0.4" rx="1" />
                  <rect x="190" y="86" width="18" height="5" fill="#080c14" opacity="0.35" rx="0.5" />
                  <path
                    d="M252,130 L285,125 L292,128 L295,140 L292,168 L288,175 L270,178 L255,176 L250,170 L248,155 L250,138 Z"
                    fill="#12131f"
                    stroke="rgba(245,160,181,0.06)"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M155,62 C160,70 168,78 175,85 L180,90"
                    stroke="rgba(245,160,181,0.25)"
                    strokeWidth="1"
                    strokeDasharray="3 2"
                    fill="none"
                  />
                  <path
                    d="M180,93 L180,160 L200,180 L200,250 L210,280"
                    stroke="rgba(245,160,181,0.12)"
                    strokeWidth="0.6"
                    strokeDasharray="2 2"
                    fill="none"
                  />
                  <path
                    d="M155,458 L260,452 L268,455 L270,462 L268,470 L260,473 L155,478 L148,475 L145,468 L148,460 Z"
                    fill="#10111c"
                    stroke="rgba(245,160,181,0.06)"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="162"
                    y1="465"
                    x2="258"
                    y2="461"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="162"
                    y1="465"
                    x2="258"
                    y2="461"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.5"
                    strokeDasharray="4 3"
                  />
                  <path
                    d="M220,405 C235,415 250,425 258,435 L262,445 L260,452"
                    stroke="rgba(245,160,181,0.1)"
                    strokeWidth="0.8"
                    strokeDasharray="3 2"
                    fill="none"
                  />
                  {/* Animated Port Liner shuttle */}
                  <circle className="port-liner-dot" r="3" fill="#FF6B92">
                    <animateMotion
                      dur="8s"
                      repeatCount="indefinite"
                      path="M155,62 C160,70 168,78 175,85 L180,93 L180,160 L200,180 L200,250 L210,280 L220,350 L225,405"
                      keyTimes="0;0.15;0.3;0.5;0.65;0.8;0.9;1"
                      keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
                      calcMode="spline"
                    />
                  </circle>
                  <circle className="port-liner-dot" r="3" fill="#FF6B92" opacity="0.5">
                    <animateMotion
                      dur="8s"
                      repeatCount="indefinite"
                      begin="-4s"
                      path="M155,62 C160,70 168,78 175,85 L180,93 L180,160 L200,180 L200,250 L210,280 L220,350 L225,405"
                      keyTimes="0;0.15;0.3;0.5;0.65;0.8;0.9;1"
                      keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
                      calcMode="spline"
                    />
                  </circle>
                </svg>
              </div>

              {/* Layer 4: Street grid */}
              <div className="kobe-layer kobe-layer-grid">
                <svg viewBox="0 0 400 540" fill="none">
                  <line x1="150" y1="95" x2="150" y2="192" stroke="rgba(245,160,181,0.03)" strokeWidth="0.4" />
                  <line x1="180" y1="90" x2="180" y2="200" stroke="rgba(245,160,181,0.04)" strokeWidth="0.5" />
                  <line x1="210" y1="90" x2="210" y2="200" stroke="rgba(245,160,181,0.04)" strokeWidth="0.5" />
                  <line x1="120" y1="120" x2="240" y2="120" stroke="rgba(245,160,181,0.03)" strokeWidth="0.4" />
                  <line x1="120" y1="155" x2="242" y2="155" stroke="rgba(245,160,181,0.03)" strokeWidth="0.4" />
                  <line x1="122" y1="180" x2="240" y2="180" stroke="rgba(245,160,181,0.03)" strokeWidth="0.4" />
                  <line x1="160" y1="220" x2="170" y2="400" stroke="rgba(245,160,181,0.03)" strokeWidth="0.4" />
                  <line x1="195" y1="200" x2="205" y2="405" stroke="rgba(245,160,181,0.04)" strokeWidth="0.5" />
                  <line x1="230" y1="210" x2="245" y2="398" stroke="rgba(245,160,181,0.03)" strokeWidth="0.4" />
                  <line x1="128" y1="250" x2="248" y2="266" stroke="rgba(245,160,181,0.03)" strokeWidth="0.4" />
                  <line x1="130" y1="310" x2="280" y2="330" stroke="rgba(245,160,181,0.04)" strokeWidth="0.4" />
                  <line x1="132" y1="360" x2="275" y2="375" stroke="rgba(245,160,181,0.03)" strokeWidth="0.4" />
                </svg>
              </div>

              {/* Layer 5: Building footprints (ambient small buildings) */}
              <div className="kobe-layer kobe-layer-buildings">
                <svg viewBox="0 0 400 540" fill="none">
                  <rect x="135" y="100" width="18" height="10" rx="1" fill="#1e1e32" opacity="0.6" />
                  <rect x="200" y="98" width="22" height="14" rx="1" fill="#1e1e32" opacity="0.5" />
                  <rect x="160" y="118" width="14" height="10" rx="1" fill="#22223a" opacity="0.6" />
                  <rect x="130" y="150" width="20" height="25" rx="1" fill="#252540" opacity="0.8" />
                  <rect x="155" y="148" width="14" height="12" rx="1" fill="#22223a" opacity="0.6" />
                  <rect x="198" y="135" width="28" height="16" rx="1" fill="#252540" opacity="0.8" />
                  <rect x="210" y="158" width="18" height="12" rx="1" fill="#22223a" opacity="0.6" />
                  <rect x="148" y="210" width="20" height="14" rx="1" fill="#22223a" opacity="0.5" />
                  <rect x="185" y="215" width="24" height="10" rx="1" fill="#22223a" opacity="0.5" />
                  <rect x="220" y="225" width="16" height="12" rx="1" fill="#22223a" opacity="0.5" />
                  <rect x="170" y="248" width="22" height="16" rx="1" fill="#252540" opacity="0.7" />
                  <rect
                    x="158"
                    y="290"
                    width="26"
                    height="18"
                    rx="1"
                    fill="#2a1838"
                    stroke="rgba(245,160,181,0.1)"
                    strokeWidth="0.5"
                    opacity="0.9"
                  />
                  <rect
                    x="195"
                    y="285"
                    width="20"
                    height="16"
                    rx="1"
                    fill="#2a1838"
                    stroke="rgba(245,160,181,0.08)"
                    strokeWidth="0.5"
                    opacity="0.8"
                  />
                  <rect
                    x="230"
                    y="295"
                    width="18"
                    height="14"
                    rx="1"
                    fill="#2a1838"
                    stroke="rgba(245,160,181,0.06)"
                    strokeWidth="0.5"
                    opacity="0.7"
                  />
                  <rect
                    x="175"
                    y="320"
                    width="28"
                    height="18"
                    rx="1"
                    fill="#2a1838"
                    stroke="rgba(245,160,181,0.1)"
                    strokeWidth="0.5"
                    opacity="0.9"
                  />
                  <rect
                    x="145"
                    y="325"
                    width="16"
                    height="12"
                    rx="1"
                    fill="#2a1838"
                    stroke="rgba(245,160,181,0.06)"
                    strokeWidth="0.5"
                    opacity="0.7"
                  />
                  <rect
                    x="215"
                    y="318"
                    width="22"
                    height="14"
                    rx="1"
                    fill="#2a1838"
                    stroke="rgba(245,160,181,0.08)"
                    strokeWidth="0.5"
                    opacity="0.8"
                  />
                  <rect
                    x="160"
                    y="355"
                    width="20"
                    height="14"
                    rx="1"
                    fill="#2a1838"
                    stroke="rgba(245,160,181,0.06)"
                    strokeWidth="0.5"
                    opacity="0.7"
                  />
                  <rect
                    x="195"
                    y="350"
                    width="24"
                    height="16"
                    rx="1"
                    fill="#2a1838"
                    stroke="rgba(245,160,181,0.08)"
                    strokeWidth="0.5"
                    opacity="0.8"
                  />
                  <rect
                    x="235"
                    y="345"
                    width="16"
                    height="12"
                    rx="1"
                    fill="#2a1838"
                    stroke="rgba(245,160,181,0.06)"
                    strokeWidth="0.5"
                    opacity="0.6"
                  />
                  <ellipse cx="265" cy="310" rx="12" ry="16" fill="#142018" opacity="0.4" stroke="rgba(100,200,100,0.06)" strokeWidth="0.4" />
                  <ellipse cx="195" cy="330" rx="55" ry="50" fill="rgba(245,160,181,0.025)" />
                </svg>
              </div>

              {/* Layer 6: Animated coastline glow */}
              <div className="kobe-layer kobe-layer-glow">
                <svg viewBox="0 0 400 540" fill="none">
                  <path
                    className="coast-glow"
                    d="
              M120,95 L125,93 L170,93 L172,90 L195,90
              L195,88 L210,88 L210,93 L235,93 L238,95
              L238,125 L240,125 L240,145
              L242,148 L242,170
              L240,172 L240,192
              L235,192 L235,200
              L238,200 L242,204
              L242,230 L244,232
              L244,260
              L246,262 L248,265
              L250,265 L260,268
              L275,268 L278,270
              L280,275 L280,320
              L282,322 L282,348
              L280,360 L278,370
              L275,380 L268,388
              L260,394 L248,400
              L230,405 L200,408
              L178,408 L158,405
              L148,400 L140,394
              L135,388 L132,380
              L130,370 L128,355
              L128,330 L130,315
              L130,290 L128,270
              L128,250 L126,232
              L126,204 L128,200
              L128,192 L125,192
              L122,188 L120,172
              L118,170 L118,148
              L120,145 L120,125
              L118,125 L118,95
            "
                    stroke="url(#coastGlowGrad)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="8 4"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <defs>
                    <linearGradient id="coastGlowGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FFB8CC" />
                      <stop offset="50%" stopColor="#B8E3FF" />
                      <stop offset="100%" stopColor="#D4B8FF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* AMBIENT BUILDINGS */}
              <div className="iso-ambient amb-cool" style={{ '--h': '6px', width: '8px', height: '5px', top: '19.3%', left: '34%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient" style={{ '--h': '5px', width: '6px', height: '4px', top: '20.4%', left: '41%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-warm" style={{ '--h': '7px', width: '7px', height: '6px', top: '22.2%', left: '48%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-cool" style={{ '--h': '4px', width: '10px', height: '4px', top: '18.5%', left: '51%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient" style={{ '--h': '5px', width: '6px', height: '5px', top: '24.1%', left: '33%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-bright" style={{ '--h': '6px', width: '6px', height: '7px', top: '23.2%', left: '54%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient" style={{ '--h': '5px', width: '7px', height: '4px', top: '27.8%', left: '37%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-cool" style={{ '--h': '5px', width: '6px', height: '5px', top: '29.6%', left: '50%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient" style={{ '--h': '6px', width: '8px', height: '5px', top: '38.9%', left: '34%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-warm" style={{ '--h': '5px', width: '6px', height: '5px', top: '40.7%', left: '45%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-cool" style={{ '--h': '7px', width: '7px', height: '6px', top: '37%', left: '50%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient" style={{ '--h': '5px', width: '8px', height: '4px', top: '42.6%', left: '37%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-bright" style={{ '--h': '6px', width: '6px', height: '5px', top: '41.5%', left: '55%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-warm" style={{ '--h': '5px', width: '5px', height: '4px', top: '44.4%', left: '42%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-warm" style={{ '--h': '7px', width: '8px', height: '6px', top: '53.7%', left: '36%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient" style={{ '--h': '6px', width: '8px', height: '5px', top: '55.6%', left: '52%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-bright" style={{ '--h': '6px', width: '7px', height: '5px', top: '57.4%', left: '58%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-cool" style={{ '--h': '5px', width: '6px', height: '4px', top: '61.1%', left: '40%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient" style={{ '--h': '6px', width: '8px', height: '5px', top: '63%', left: '53%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-warm" style={{ '--h': '5px', width: '7px', height: '4px', top: '59.3%', left: '35%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-cool" style={{ '--h': '7px', width: '6px', height: '7px', top: '64.8%', left: '47%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient" style={{ '--h': '4px', width: '8px', height: '3px', top: '66.7%', left: '39%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-warm" style={{ '--h': '5px', width: '6px', height: '4px', top: '70.4%', left: '42%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient" style={{ '--h': '6px', width: '5px', height: '6px', top: '72.2%', left: '49%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-cool" style={{ '--h': '4px', width: '8px', height: '3px', top: '71.3%', left: '55%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-cool" style={{ '--h': '5px', width: '6px', height: '5px', top: '5.6%', left: '15%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient" style={{ '--h': '5px', width: '8px', height: '4px', top: '7.4%', left: '22%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-bright" style={{ '--h': '7px', width: '6px', height: '6px', top: '4.6%', left: '30%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-warm" style={{ '--h': '5px', width: '7px', height: '4px', top: '8.3%', left: '37%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient" style={{ '--h': '4px', width: '5px', height: '3px', top: '6.5%', left: '45%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-green" style={{ '--h': '5px', width: '6px', height: '5px', top: '12%', left: '75%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-green" style={{ '--h': '4px', width: '8px', height: '4px', top: '14.8%', left: '82%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-cool" style={{ '--h': '6px', width: '6px', height: '6px', top: '18.5%', left: '86%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-green" style={{ '--h': '5px', width: '7px', height: '4px', top: '16.7%', left: '78%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-cool" style={{ '--h': '5px', width: '6px', height: '4px', top: '25%', left: '65%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient" style={{ '--h': '4px', width: '5px', height: '3px', top: '27.8%', left: '68%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>
              <div className="iso-ambient amb-warm" style={{ '--h': '5px', width: '4px', height: '5px', top: '29.6%', left: '66%' } as React.CSSProperties}>
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
              </div>

              {/* INTERACTIVE BUILDINGS */}

              {/* KBIC */}
              <div
                className="iso-building primary venue"
                style={{ '--h': '28px', width: '28px', height: '22px', top: '57%', left: '46%' } as React.CSSProperties}
                data-title="KBIC — Biomedical Innovation Cluster"
                data-subtitle="The epicenter — your lab, your network, your launchpad"
                data-cat="Venue"
                data-text="The largest biomedical cluster in Japan. Home to RIKEN, the Foundation for Biomedical Research and Innovation, and 370+ companies working on everything from regenerative medicine to medical devices. Your co-working lab, collaborators, and regulatory fast-track — all within walking distance."
                data-s1v="370+"
                data-s1l="Companies"
                data-s2v="#1"
                data-s2l="Cluster in JP"
                data-s3v="2 min"
                data-s3l="Walk to lab"
              >
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
                <div className="iso-building-label">
                  KBIC<br />
                  <span style={{ fontSize: '7px', opacity: 0.5 }}>神戸医療産業都市</span>
                </div>
                <div className="kbic-beacon"></div>
              </div>

              {/* Portopia Hotel */}
              <div
                className="iso-building stay"
                style={{ '--h': '18px', width: '20px', height: '14px', top: '24%', left: '45%' } as React.CSSProperties}
                data-title="Portopia Hotel"
                data-subtitle="Your base on Port Island"
                data-cat="Stay"
                data-text="A full-service hotel directly on Port Island — walking distance to KBIC and the conference center. Rooftop pool, onsen bath, and views across Osaka Bay. The default home base for Mirai residents who want to stay on the island."
                data-s1v="5 min"
                data-s1l="Walk to KBIC"
                data-s2v="746"
                data-s2l="Rooms"
                data-s3v="Rooftop"
                data-s3l="Pool + Onsen"
              >
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
                <div className="iso-building-label">Portopia Hotel</div>
              </div>

              {/* Kobe Airport */}
              <div
                className="iso-building transit"
                style={{ '--h': '8px', width: '36px', height: '8px', top: '85.2%', left: '44%' } as React.CSSProperties}
                data-title="Kobe Airport"
                data-subtitle="18 minutes from Port Island by Port Liner"
                data-cat="Transit"
                data-text="A compact domestic airport on its own man-made island, connected to Port Island by the Port Liner monorail. Direct flights from Tokyo Haneda (65 min), plus easy access to Osaka's Kansai International for international arrivals. You land and you're at your lab in under 30 minutes."
                data-s1v="18 min"
                data-s1l="To Port Island"
                data-s2v="65 min"
                data-s2l="From Tokyo"
                data-s3v="Direct"
                data-s3l="Port Liner"
              >
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
                <div className="iso-building-label">Kobe Airport ✈</div>
              </div>

              {/* Sannomiya */}
              <div
                className="iso-building transit"
                style={{ '--h': '16px', width: '18px', height: '14px', top: '10%', left: '36%' } as React.CSSProperties}
                data-title="Sannomiya"
                data-subtitle="Downtown Kobe — 18 min by Port Liner"
                data-cat="Transit"
                data-text="The heart of Kobe city. The main transit hub connecting to Osaka (20 min), Kyoto (50 min), and the Shinkansen. Sannomiya is also where you'll find the nightlife, shopping arcades, and the famous Kobe beef restaurants. The Port Liner runs directly from here to Port Island."
                data-s1v="18 min"
                data-s1l="Port Liner"
                data-s2v="20 min"
                data-s2l="To Osaka"
                data-s3v="50 min"
                data-s3l="To Kyoto"
              >
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
                <div className="iso-building-label">← Sannomiya</div>
              </div>

              {/* Arima Onsen */}
              <div
                className="iso-building lifestyle"
                style={{ '--h': '12px', width: '16px', height: '12px', top: '2%', left: '5%' } as React.CSSProperties}
                data-title="Arima Onsen"
                data-subtitle="One of Japan's three ancient hot springs"
                data-cat="Lifestyle"
                data-text="The oldest hot spring in Japan — 1,300 years old, tucked in the mountains behind Kobe. Two distinct waters: the iron-rich gold spring (kinsen) and the radium-infused silver spring (ginsen). 30 minutes from Port Island by direct bus. Your weekend wind-down or post-lab reset."
                data-s1v="1,300"
                data-s1l="Years old"
                data-s2v="30 min"
                data-s2l="From KBIC"
                data-s3v="2"
                data-s3l="Spring types"
              >
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
                <div className="iso-building-label">
                  ↖ Arima Onsen<br />
                  <span style={{ fontSize: '7px', opacity: 0.5 }}>有馬温泉</span>
                </div>
              </div>

              {/* Kobe Beef District */}
              <div
                className="iso-building food"
                style={{ '--h': '14px', width: '16px', height: '12px', top: '7%', left: '42%' } as React.CSSProperties}
                data-title="Kobe Beef District"
                data-subtitle="The city that invented wagyu"
                data-cat="Food"
                data-text="Kobe is the birthplace of wagyu. The Tajima cattle that produce authentic Kobe beef are raised in Hyogo prefecture and served at dozens of teppanyaki restaurants in the Sannomiya and Kitano districts. A5-grade beef, seared on an iron plate in front of you. This is the real thing — not the tourist imitation."
                data-s1v="A5"
                data-s1l="Grade"
                data-s2v="¥8K+"
                data-s2l="Per course"
                data-s3v="Since"
                data-s3l="1868"
              >
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
                <div className="iso-building-label">Kobe Beef 🥩</div>
              </div>

              {/* Rokko Island */}
              <div
                className="iso-building active-cat"
                style={{ '--h': '10px', width: '22px', height: '16px', top: '13%', left: '80%' } as React.CSSProperties}
                data-title="Rokko Island"
                data-subtitle="Waterfront fitness and recreation"
                data-cat="Active"
                data-text="A man-made island northeast of Port Island with wide running paths along the waterfront, parks, and sports facilities. Connected by the Rokko Liner from the mainland. A popular spot for morning runs with views of Osaka Bay — or take the cable car up Mt. Rokko for serious hiking."
                data-s1v="5 km"
                data-s1l="Waterfront loop"
                data-s2v="931m"
                data-s2l="Mt. Rokko summit"
                data-s3v="10 min"
                data-s3l="By liner"
              >
                <div className="iso-building-top"></div>
                <div className="iso-building-front"></div>
                <div className="iso-building-left"></div>
                <div className="iso-building-label">六甲アイランド</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="map-legend">
            <div className="map-legend-item">
              <div className="map-legend-dot" style={{ background: '#FF6B92' }}></div>
              Venue
            </div>
            <div className="map-legend-item">
              <div className="map-legend-dot" style={{ background: '#D4B8FF' }}></div>
              Stay
            </div>
            <div className="map-legend-item">
              <div className="map-legend-dot" style={{ background: '#B8E3FF' }}></div>
              Transit
            </div>
            <div className="map-legend-item">
              <div className="map-legend-dot" style={{ background: '#E8C97D' }}></div>
              Lifestyle
            </div>
            <div className="map-legend-item">
              <div className="map-legend-dot" style={{ background: '#FF8C69' }}></div>
              Food
            </div>
            <div className="map-legend-item">
              <div className="map-legend-dot" style={{ background: '#82DCBE' }}></div>
              Active
            </div>
          </div>

          <div className="iso-drag-hint">Drag to explore · Click a building</div>
        </div>
      </div>
    </section>
  );
}
