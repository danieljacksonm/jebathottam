"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/** Soft procedural breeze / bird-like tones after user gesture. */
export function AmbientToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    return () => {
      nodesRef.current?.stop();
      ctxRef.current?.close();
    };
  }, []);

  function startSoundscape() {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;

    // Soft wind noise
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 420;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.035;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();

    // Distant soft tones
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 660;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.008;
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start();

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 40;
    lfo.connect(lfoGain);
    lfoGain.connect(noiseFilter.frequency);
    lfo.start();

    nodesRef.current = {
      stop: () => {
        try {
          noise.stop();
          osc.stop();
          lfo.stop();
        } catch {
          /* already stopped */
        }
      },
    };
  }

  function toggle() {
    if (on) {
      nodesRef.current?.stop();
      nodesRef.current = null;
      void ctxRef.current?.close();
      ctxRef.current = null;
      setOn(false);
      return;
    }
    startSoundscape();
    setOn(true);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-20 right-5 z-[70] flex items-center gap-2 rounded-full border border-[rgba(244,210,122,0.35)] bg-[rgba(4,22,43,0.65)] px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.18em] text-gold-bright backdrop-blur-xl transition hover:border-gold-bright md:bottom-5"
      aria-pressed={on}
    >
      {on ? <Volume2 size={14} /> : <VolumeX size={14} />}
      {on ? "Soundscape" : "Listen"}
      {on && (
        <span className="ml-1 flex gap-0.5">
          <i className="block h-2.5 w-0.5 animate-pulse bg-gold-bright" />
          <i className="block h-3.5 w-0.5 animate-pulse bg-gold-bright [animation-delay:120ms]" />
          <i className="block h-2 w-0.5 animate-pulse bg-gold-bright [animation-delay:240ms]" />
        </span>
      )}
    </button>
  );
}
