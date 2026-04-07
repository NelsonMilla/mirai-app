'use client';

import React, { useEffect, useRef, useState, useCallback, ReactNode } from 'react';
import { useScrollState } from '@/hooks/useScrollState';
import { SoundContext, SoundContextType } from './SoundContext';

export function SoundProvider({ children }: { children: ReactNode }) {
  const { progress: scrollProgress } = useScrollState();
  const audioContextRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioStartedRef = useRef(false);

  // Bus references
  const masterGainRef = useRef<GainNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const uiGainRef = useRef<GainNode | null>(null);
  const reverbSendRef = useRef<GainNode | null>(null);

  // Layer gain nodes for scroll-reactive mixing
  const heartbeatGainRef = useRef<GainNode | null>(null);
  const padGainRef = useRef<GainNode | null>(null);
  const tickGainRef = useRef<GainNode | null>(null);
  const motifGainRef = useRef<GainNode | null>(null);
  const shimmerGainRef = useRef<GainNode | null>(null);

  // Oscillator references for scroll modulation
  const padOscsRef = useRef<
    Array<{
      osc: OscillatorNode;
      osc2: OscillatorNode;
      voiceGain: GainNode;
      lfo: OscillatorNode;
    }>
  >([]);
  const heartbeatOscRef = useRef<OscillatorNode | null>(null);
  const heartbeatLfoRef = useRef<OscillatorNode | null>(null);
  const padFilterRef = useRef<BiquadFilterNode | null>(null);

  // Timers for scheduled functions
  const risingFifthTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shimmerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSoundUpdateRef = useRef(0);

  // ── Fake convolution reverb via feedback delay network ──
  const createReverb = useCallback((ctx: AudioContext) => {
    const input = ctx.createGain();
    const output = ctx.createGain();
    output.gain.value = 0.35;
    const preDelay = ctx.createDelay(0.1);
    preDelay.delayTime.value = 0.02;
    const delays = [0.037, 0.059, 0.083, 0.113];
    const feedbacks = [0.75, 0.72, 0.68, 0.65];
    const merger = ctx.createChannelMerger(2);
    input.connect(preDelay);
    delays.forEach((dt, i) => {
      const d = ctx.createDelay(0.2);
      d.delayTime.value = dt;
      const fb = ctx.createGain();
      fb.gain.value = feedbacks[i];
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 2800 - i * 400;
      preDelay.connect(d);
      d.connect(lp);
      lp.connect(fb);
      fb.connect(d); // feedback loop
      lp.connect(output);
    });
    return { input, output };
  }, []);

  // Initialize the complete audio system
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;
    const t = ctx.currentTime;

    // ── Master bus ──
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, t);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // ── Ambient bus ──
    const ambientGain = ctx.createGain();
    ambientGain.gain.value = 1;
    ambientGain.connect(masterGain);
    ambientGainRef.current = ambientGain;

    // ── UI sound bus ──
    const uiGain = ctx.createGain();
    uiGain.gain.setValueAtTime(0, t);
    uiGain.connect(ctx.destination);
    uiGainRef.current = uiGain;

    // ── Reverb send (shared by UI sounds) ──
    const reverb = createReverb(ctx);
    reverbSendRef.current = reverb.input;
    reverb.output.connect(uiGain);

    // ═══════════════════════════════════════
    // LAYER 1: HEARTBEAT SUB-PULSE
    // ═══════════════════════════════════════
    const heartbeatGain = ctx.createGain();
    heartbeatGain.gain.value = 0.22;
    heartbeatGain.connect(ambientGain);
    heartbeatGainRef.current = heartbeatGain;

    const heartbeatOsc = ctx.createOscillator();
    heartbeatOsc.type = 'sine';
    heartbeatOsc.frequency.value = 42; // sub-bass fundamental
    heartbeatOscRef.current = heartbeatOsc;

    const hbOsc2 = ctx.createOscillator();
    hbOsc2.type = 'sine';
    hbOsc2.frequency.value = 84; // octave above
    const hbOsc2Gain = ctx.createGain();
    hbOsc2Gain.gain.value = 0.08;

    // Amplitude LFO — the "heartbeat" rhythm
    const heartbeatLfo = ctx.createOscillator();
    heartbeatLfo.type = 'sine';
    heartbeatLfo.frequency.value = 0.5; // one throb every 2 seconds
    heartbeatLfoRef.current = heartbeatLfo;
    const hbLfoGain = ctx.createGain();
    hbLfoGain.gain.value = 0.18; // modulation depth
    heartbeatLfo.connect(hbLfoGain);

    const hbShaper = ctx.createGain();
    hbShaper.gain.value = 0.18;
    hbLfoGain.connect(hbShaper.gain);

    // Sub lowpass to keep it felt, not buzzy
    const hbLP = ctx.createBiquadFilter();
    hbLP.type = 'lowpass';
    hbLP.frequency.value = 90;
    hbLP.Q.value = 0.7;

    heartbeatOsc.connect(hbShaper);
    hbOsc2.connect(hbOsc2Gain);
    hbOsc2Gain.connect(hbShaper);
    hbShaper.connect(hbLP);
    hbLP.connect(heartbeatGain);

    heartbeatOsc.start(t);
    hbOsc2.start(t);
    heartbeatLfo.start(t);

    // ═══════════════════════════════════════
    // LAYER 2: EVOLVING PAD DRONES
    // ═══════════════════════════════════════
    const padGain = ctx.createGain();
    padGain.gain.value = 0.14;
    padGainRef.current = padGain;
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 300; // starts dark, opens with scroll
    padFilter.Q.value = 0.5;
    padFilterRef.current = padFilter;
    padGain.connect(padFilter);
    padFilter.connect(ambientGain);

    // D2, A2, D3, F3 — Dm voicing
    const padNotes = [73.42, 110.0, 146.83, 174.61];
    const detuneAmounts = [-4, 3, -6, 5];
    padOscsRef.current = [];

    padNotes.forEach((freq, i) => {
      // Main voice — triangle for warmth
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      osc.detune.value = detuneAmounts[i];

      // Detuned double — sine
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = freq;
      osc2.detune.value = detuneAmounts[i] + (Math.random() * 4 - 2);

      const voiceGain = ctx.createGain();
      voiceGain.gain.value = 0.25 / padNotes.length;

      // Slow individual LFO for each voice — breathing
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.03 + i * 0.012; // slightly different rates
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.08 / padNotes.length;
      lfo.connect(lfoGain);
      lfoGain.connect(voiceGain.gain);
      lfo.start(t);

      osc.connect(voiceGain);
      osc2.connect(voiceGain);
      voiceGain.connect(padGain);
      osc.start(t);
      osc2.start(t);

      padOscsRef.current.push({ osc, osc2, voiceGain, lfo });
    });

    // ═══════════════════════════════════════
    // LAYER 3: RISING FIFTH MOTIF
    // ═══════════════════════════════════════
    const motifGain = ctx.createGain();
    motifGain.gain.value = 0.12;
    motifGain.connect(ambientGain);
    motifGainRef.current = motifGain;

    const scheduleRisingFifth = () => {
      if (!soundEnabled) {
        risingFifthTimerRef.current = setTimeout(scheduleRisingFifth, 3000);
        return;
      }
      const delay = 18 + Math.random() * 14; // 18-32 seconds
      risingFifthTimerRef.current = setTimeout(() => {
        if (!soundEnabled || !audioContextRef.current) {
          scheduleRisingFifth();
          return;
        }
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        // Root note — D
        const root = ctx.createOscillator();
        root.type = 'triangle';
        root.frequency.value = 73.42; // D2
        const rootG = ctx.createGain();
        rootG.gain.setValueAtTime(0, now);
        rootG.gain.linearRampToValueAtTime(0.06, now + 3);
        rootG.gain.linearRampToValueAtTime(0, now + 7);

        // Fifth — A, enters 1.5s after root
        const fifth = ctx.createOscillator();
        fifth.type = 'triangle';
        fifth.frequency.value = 110.0; // A2
        fifth.detune.value = 2;
        const fifthG = ctx.createGain();
        fifthG.gain.setValueAtTime(0, now + 1.5);
        fifthG.gain.linearRampToValueAtTime(0.05, now + 4);
        fifthG.gain.linearRampToValueAtTime(0, now + 7.5);

        // Octave shimmer — D4
        const shimmer = ctx.createOscillator();
        shimmer.type = 'sine';
        shimmer.frequency.value = 293.66; // D4
        const shimG = ctx.createGain();
        shimG.gain.setValueAtTime(0, now + 2);
        shimG.gain.linearRampToValueAtTime(0.015, now + 4.5);
        shimG.gain.linearRampToValueAtTime(0, now + 8);

        // Warm filter
        const motifLP = ctx.createBiquadFilter();
        motifLP.type = 'lowpass';
        motifLP.frequency.setValueAtTime(200, now);
        motifLP.frequency.linearRampToValueAtTime(
          500 + scrollProgress * 300,
          now + 5
        );
        motifLP.frequency.linearRampToValueAtTime(200, now + 8);
        motifLP.Q.value = 0.5;

        root.connect(rootG);
        rootG.connect(motifLP);
        fifth.connect(fifthG);
        fifthG.connect(motifLP);
        shimmer.connect(shimG);
        shimG.connect(motifLP);
        motifLP.connect(motifGain);

        root.start(now);
        root.stop(now + 8);
        fifth.start(now + 1.5);
        fifth.stop(now + 8.5);
        shimmer.start(now + 2);
        shimmer.stop(now + 9);

        scheduleRisingFifth();
      }, delay * 1000);
    };
    scheduleRisingFifth();

    // ═══════════════════════════════════════
    // LAYER 4: TIME-TICK TEXTURE
    // ═══════════════════════════════════════
    const tickGain = ctx.createGain();
    tickGain.gain.value = 0.0; // fades in with scroll
    tickGain.connect(ambientGain);
    tickGainRef.current = tickGain;

    const scheduleTick = () => {
      if (!soundEnabled) {
        tickTimerRef.current = setTimeout(scheduleTick, 2000);
        return;
      }
      // Irregular timing: 0.8-3.5s between ticks
      const delay = 0.8 + Math.random() * 2.7;
      tickTimerRef.current = setTimeout(() => {
        if (!soundEnabled || !audioContextRef.current) {
          scheduleTick();
          return;
        }
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        // High metallic ping — band-limited click
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        const baseFreq = 3200 + Math.random() * 1200;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.04);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.025, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = baseFreq;
        bp.Q.value = 20;
        osc.connect(bp);
        bp.connect(g);
        g.connect(tickGain);
        osc.start(now);
        osc.stop(now + 0.08);
        scheduleTick();
      }, delay * 1000);
    };
    scheduleTick();

    // ═══════════════════════════════════════
    // LAYER 5: HARMONIC SHIMMER
    // ═══════════════════════════════════════
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.08;
    shimmerGain.connect(ambientGain);
    shimmerGainRef.current = shimmerGain;

    const scheduleShimmer = () => {
      if (!soundEnabled) {
        shimmerTimerRef.current = setTimeout(scheduleShimmer, 2000);
        return;
      }
      const delay = 5 + Math.random() * 10;
      shimmerTimerRef.current = setTimeout(() => {
        if (!soundEnabled || !audioContextRef.current) {
          scheduleShimmer();
          return;
        }
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        // Harmonic series of D
        const harmonics = [3, 4, 5, 6, 8, 10, 12];
        osc.frequency.value =
          73.42 * harmonics[Math.floor(Math.random() * harmonics.length)];
        const g = ctx.createGain();
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = osc.frequency.value;
        bp.Q.value = 15;
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.03, now + 2);
        g.gain.linearRampToValueAtTime(0, now + 5);
        osc.connect(bp);
        bp.connect(g);
        g.connect(shimmerGain);
        osc.start(now);
        osc.stop(now + 5.5);
        scheduleShimmer();
      }, delay * 1000);
    };
    scheduleShimmer();

    // ═══════════════════════════════════════
    // LAYER 6: BREATH NOISE TEXTURE
    // ═══════════════════════════════════════
    const bufferSize = ctx.sampleRate * 4;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      noiseData[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    noiseSrc.loop = true;
    const noiseBP = ctx.createBiquadFilter();
    noiseBP.type = 'bandpass';
    noiseBP.frequency.value = 180;
    noiseBP.Q.value = 0.4;
    const noiseLP = ctx.createBiquadFilter();
    noiseLP.type = 'lowpass';
    noiseLP.frequency.value = 280;
    // Breathing LFO on noise
    const noiseLfo = ctx.createOscillator();
    noiseLfo.type = 'sine';
    noiseLfo.frequency.value = 0.07;
    const noiseLfoG = ctx.createGain();
    noiseLfoG.gain.value = 50;
    noiseLfo.connect(noiseLfoG);
    noiseLfoG.connect(noiseBP.frequency);
    noiseLfo.start(t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.5;
    noiseSrc.connect(noiseBP);
    noiseBP.connect(noiseLP);
    noiseLP.connect(noiseGain);
    noiseGain.connect(ambientGain);
    noiseSrc.start(t);
  }, [createReverb, soundEnabled, scrollProgress]);

  // UI Sounds
  const playPing = useCallback((freq: number, vol = 0.07) => {
    if (!soundEnabled || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.frequency.linearRampToValueAtTime(freq * 0.94, t + 0.12);
    // Harmonic overtone for richness
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2.01; // slightly detuned octave
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(vol * 0.3, t);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = freq;
    bp.Q.value = 6;
    osc.connect(bp);
    bp.connect(g);
    g.connect(uiGainRef.current!);
    osc2.connect(g2);
    g2.connect(uiGainRef.current!);
    // Reverb send
    g.connect(reverbSendRef.current!);
    osc.start(t);
    osc.stop(t + 0.9);
    osc2.start(t);
    osc2.stop(t + 0.6);
  }, [soundEnabled]);

  const playThud = useCallback((vol = 0.06) => {
    if (!soundEnabled || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    osc.connect(g);
    g.connect(uiGainRef.current!);
    g.connect(reverbSendRef.current!);
    osc.start(t);
    osc.stop(t + 0.25);
  }, [soundEnabled]);

  const playSelect = useCallback(() => {
    if (!soundEnabled || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const t = ctx.currentTime;
    // D4, F4, A4, D5
    const notes = [293.66, 349.23, 440, 587.33];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i < 2 ? 'triangle' : 'sine'; // warm base, clear top
      osc.frequency.value = freq;
      const g = ctx.createGain();
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = freq;
      bp.Q.value = 4;
      g.gain.setValueAtTime(0, t + i * 0.08);
      g.gain.linearRampToValueAtTime(0.05, t + i * 0.08 + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.08 + 1.2);
      osc.connect(bp);
      bp.connect(g);
      g.connect(uiGainRef.current!);
      g.connect(reverbSendRef.current!);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 1.3);
    });
  }, [soundEnabled]);

  const playFlip = useCallback(() => {
    if (!soundEnabled || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const t = ctx.currentTime;
    const bufSize = ctx.sampleRate * 0.2;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * 0.6;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(600, t);
    bp.frequency.exponentialRampToValueAtTime(2400, t + 0.06);
    bp.frequency.exponentialRampToValueAtTime(300, t + 0.18);
    bp.Q.value = 3;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    src.connect(bp);
    bp.connect(g);
    g.connect(uiGainRef.current!);
    g.connect(reverbSendRef.current!);
    src.start(t);
    // Accompanying tonal "whomp"
    const womp = ctx.createOscillator();
    womp.type = 'sine';
    womp.frequency.setValueAtTime(300, t);
    womp.frequency.exponentialRampToValueAtTime(80, t + 0.15);
    const wG = ctx.createGain();
    wG.gain.setValueAtTime(0.04, t);
    wG.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    womp.connect(wG);
    wG.connect(uiGainRef.current!);
    womp.start(t);
    womp.stop(t + 0.2);
  }, [soundEnabled]);

  const playHover = useCallback(() => {
    if (!soundEnabled || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 2000 + Math.random() * 600;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.012, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    osc.connect(g);
    g.connect(uiGainRef.current!);
    g.connect(reverbSendRef.current!);
    osc.start(t);
    osc.stop(t + 0.12);
  }, [soundEnabled]);

  // Fade in/out
  const fadeIn = useCallback(() => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;
    // Master: 5-second cinematic fade-in
    masterGainRef.current!.gain.setValueAtTime(
      masterGainRef.current!.gain.value,
      t
    );
    masterGainRef.current!.gain.linearRampToValueAtTime(0.22, t + 5);
    uiGainRef.current!.gain.setValueAtTime(uiGainRef.current!.gain.value, t);
    uiGainRef.current!.gain.linearRampToValueAtTime(1, t + 0.5);
  }, []);

  const fadeOut = useCallback(() => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const t = ctx.currentTime;
    masterGainRef.current!.gain.setValueAtTime(
      masterGainRef.current!.gain.value,
      t
    );
    masterGainRef.current!.gain.linearRampToValueAtTime(0, t + 2);
    uiGainRef.current!.gain.setValueAtTime(uiGainRef.current!.gain.value, t);
    uiGainRef.current!.gain.linearRampToValueAtTime(0, t + 0.5);
  }, []);

  // Toggle sound
  const toggleSound = useCallback(() => {
    if (!audioContextRef.current) {
      initAudio();
    }
    setSoundEnabled((prev) => {
      const newState = !prev;
      if (newState) {
        fadeIn();
      } else {
        fadeOut();
      }
      return newState;
    });
  }, [initAudio, fadeIn, fadeOut]);

  // Auto-start on first user gesture
  useEffect(() => {
    const autoStart = () => {
      if (audioStartedRef.current || !soundEnabled) return;
      audioStartedRef.current = true;
      if (!audioContextRef.current) {
        initAudio();
      }
      fadeIn();
      ['click', 'pointerdown', 'scroll', 'keydown', 'touchstart'].forEach(
        (evt) =>
          document.removeEventListener(evt, autoStart, { capture: true })
      );
    };

    ['click', 'pointerdown', 'scroll', 'keydown', 'touchstart'].forEach(
      (evt) =>
        document.addEventListener(evt, autoStart, {
          capture: true,
          once: false,
          passive: true,
        })
    );

    return () => {
      ['click', 'pointerdown', 'scroll', 'keydown', 'touchstart'].forEach(
        (evt) =>
          document.removeEventListener(evt, autoStart, { capture: true })
      );
    };
  }, [soundEnabled, initAudio, fadeIn]);

  // Scroll-reactive intensity updates (~10Hz)
  useEffect(() => {
    const handleScrollReactivity = () => {
      const now = performance.now();
      if (now - lastSoundUpdateRef.current < 100) return; // ~10Hz
      lastSoundUpdateRef.current = now;
      if (!soundEnabled || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const t = ctx.currentTime;

      if (padFilterRef.current) {
        padFilterRef.current.frequency.setValueAtTime(
          padFilterRef.current.frequency.value,
          t
        );
        padFilterRef.current.frequency.linearRampToValueAtTime(
          300 + scrollProgress * 600,
          t + 2
        );
      }
      if (padGainRef.current) {
        padGainRef.current.gain.setValueAtTime(
          padGainRef.current.gain.value,
          t
        );
        padGainRef.current.gain.linearRampToValueAtTime(
          0.14 + scrollProgress * 0.08,
          t + 2
        );
      }
      if (heartbeatLfoRef.current) {
        heartbeatLfoRef.current.frequency.setValueAtTime(
          heartbeatLfoRef.current.frequency.value,
          t
        );
        heartbeatLfoRef.current.frequency.linearRampToValueAtTime(
          0.5 + scrollProgress * 0.25,
          t + 3
        );
      }
      if (tickGainRef.current) {
        const tickVol =
          scrollProgress > 0.4 ? ((scrollProgress - 0.4) / 0.6) * 0.06 : 0;
        tickGainRef.current.gain.setValueAtTime(
          tickGainRef.current.gain.value,
          t
        );
        tickGainRef.current.gain.linearRampToValueAtTime(tickVol, t + 2);
      }
      if (shimmerGainRef.current) {
        shimmerGainRef.current.gain.setValueAtTime(
          shimmerGainRef.current.gain.value,
          t
        );
        shimmerGainRef.current.gain.linearRampToValueAtTime(
          0.08 + scrollProgress * 0.06,
          t + 2
        );
      }
      if (heartbeatOscRef.current) {
        heartbeatOscRef.current.frequency.setValueAtTime(
          heartbeatOscRef.current.frequency.value,
          t
        );
        heartbeatOscRef.current.frequency.linearRampToValueAtTime(
          42 + scrollProgress * 6,
          t + 2
        );
      }
    };

    const interval = setInterval(handleScrollReactivity, 100);
    return () => clearInterval(interval);
  }, [soundEnabled, scrollProgress]);

  const soundContextValue: SoundContextType = {
    soundEnabled,
    toggleSound,
    playPing,
    playThud,
    playSelect,
    playFlip,
    playHover,
  };

  return (
    <SoundContext.Provider value={soundContextValue}>
      {children}
    </SoundContext.Provider>
  );
}
