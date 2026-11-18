import confetti from "canvas-confetti";
import type { VoiceCharacter } from "../data/numbers";

let audioCtx: AudioContext | null = null;
let soundEnabled = true;
let activeVoice: VoiceCharacter = "Kore";
let slowPace = false;

let cachedSpanishVoices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

type SpeakingListener = (isSpeaking: boolean) => void;
const speakingListeners = new Set<SpeakingListener>();

function notifySpeaking(isSpeaking: boolean): void {
  speakingListeners.forEach((cb) => cb(isSpeaking));
}

export function subscribeSpeaking(listener: SpeakingListener): () => void {
  speakingListeners.add(listener);
  return () => {
    speakingListeners.delete(listener);
  };
}

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (Ctx) {
      audioCtx = new Ctx();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (!enabled) {
    stopAllVoice();
  }
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setVoiceCharacter(voice: VoiceCharacter): void {
  activeVoice = voice;
}

export function getVoiceCharacter(): VoiceCharacter {
  return activeVoice;
}

export function setSlowPace(slow: boolean): void {
  slowPace = slow;
}

export function isSlowPace(): boolean {
  return slowPace;
}

export function stopAllVoice(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  notifySpeaking(false);
}

// Wooden marimba / xylophone note for each number (1-10)
export function playMarimbaNote(freq: number): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const harmonic = ctx.createOscillator();
    const gain = ctx.createGain();
    const harmonicGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    harmonic.type = "triangle";
    harmonic.frequency.setValueAtTime(freq * 2, now);
    harmonicGain.gain.setValueAtTime(0.1, now);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    osc.connect(gain);
    harmonic.connect(harmonicGain);
    harmonicGain.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    harmonic.start(now);
    osc.stop(now + 0.44);
    harmonic.stop(now + 0.44);
  } catch {
    // AudioContext blocked
  }
}

// Gentle celebratory star chimes and rhythmic claps
export function playCelebrationSound(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const starNotes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    starNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.001, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.07 + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.34);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.36);
    });

    // Soft rhythmic claps
    const bufferSize = Math.floor(ctx.sampleRate * 0.075);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const channelData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      channelData[i] =
        (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.016));
    }

    for (let c = 0; c < 8; c++) {
      const clapTime = now + 0.14 + c * 0.095 + Math.random() * 0.015;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1150 + Math.random() * 350;
      filter.Q.value = 1.2;

      const clapGain = ctx.createGain();
      clapGain.gain.setValueAtTime(0.18, clapTime);
      clapGain.gain.exponentialRampToValueAtTime(0.008, clapTime + 0.07);

      noise.connect(filter);
      filter.connect(clapGain);
      clapGain.connect(ctx.destination);

      noise.start(clapTime);
      noise.stop(clapTime + 0.075);
    }
  } catch {
    // Ignore
  }
}

// Gentle boing when a child misses
export function playTryAgainSound(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.14);
    osc.frequency.exponentialRampToValueAtTime(295, now + 0.28);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.31);
  } catch {
    // Ignore
  }
}

// Friendly two-tone toy train whistle
export function playTrainWhistle(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [0, 0.22].forEach((offset, idx) => {
      const duration = idx === 0 ? 0.16 : 0.34;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "triangle";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(523.25, now + offset);
      osc2.frequency.setValueAtTime(659.25, now + offset);

      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.linearRampToValueAtTime(0.16, now + offset + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now + offset);
      osc2.start(now + offset);
      osc1.stop(now + offset + duration + 0.02);
      osc2.stop(now + offset + duration + 0.02);
    });
  } catch {
    // Ignore
  }
}

export function fireCelebrationConfetti(): void {
  confetti({
    particleCount: 70,
    spread: 75,
    origin: { y: 0.62 },
    colors: ["#FF5964", "#F4B400", "#22B573", "#0EA5E9", "#9333EA"],
  });
}

const PREFERRED_VOICE_KEYWORDS = [
  "google español",
  "natural",
  "neural",
  "paulina",
  "sabina",
  "helena",
  "mónica",
  "monica",
  "camila",
  "lucía",
  "lucia",
  "laura",
  "sofia",
  "sofía",
  "valeria",
  "elena",
  "paloma",
  "rosa",
];

function loadSpanishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }
  const allVoices = window.speechSynthesis.getVoices();
  const spanish = allVoices.filter(
    (v) => v.lang && v.lang.toLowerCase().startsWith("es")
  );

  cachedSpanishVoices = spanish.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    const scoreA = PREFERRED_VOICE_KEYWORDS.findIndex((k) => nameA.includes(k));
    const scoreB = PREFERRED_VOICE_KEYWORDS.findIndex((k) => nameB.includes(k));
    const rankA = scoreA === -1 ? 999 : scoreA;
    const rankB = scoreB === -1 ? 999 : scoreB;
    return rankA - rankB;
  });

  voicesLoaded = true;
  return cachedSpanishVoices;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadSpanishVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadSpanishVoices();
  };
}

export function speakKidVoice(text: string): void {
  if (!soundEnabled || !text.trim()) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    notifySpeaking(false);
    return;
  }

  try {
    window.speechSynthesis.cancel();

    if (!voicesLoaded || cachedSpanishVoices.length === 0) {
      loadSpanishVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = cachedSpanishVoices;

    if (voices.length > 0) {
      if (activeVoice === "Kore") {
        // Maestra dulce
        utterance.voice = voices[0];
        utterance.pitch = 1.14;
        utterance.rate = slowPace ? 0.76 : 0.88;
      } else if (activeVoice === "Zephyr") {
        // Amiga alegre
        utterance.voice = voices[1] || voices[0];
        utterance.pitch = 1.24;
        utterance.rate = slowPace ? 0.8 : 0.94;
      } else {
        // Puck: duende juguetón
        utterance.voice = voices[voices.length > 2 ? 2 : 0];
        utterance.pitch = 1.36;
        utterance.rate = slowPace ? 0.84 : 1.0;
      }
      utterance.lang = utterance.voice.lang || "es-MX";
    } else {
      utterance.lang = "es-MX";
      utterance.pitch = activeVoice === "Puck" ? 1.35 : 1.15;
      utterance.rate = slowPace ? 0.78 : 0.9;
    }

    utterance.volume = 1.0;

    utterance.onstart = () => {
      notifySpeaking(true);
    };
    utterance.onend = () => {
      notifySpeaking(false);
    };
    utterance.onerror = () => {
      notifySpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    notifySpeaking(false);
  }
}

export function prewarmCoreClips(): void {
  // Load voices and resume audio context on first user tap
  getAudioContext();
  loadSpanishVoices();
}
