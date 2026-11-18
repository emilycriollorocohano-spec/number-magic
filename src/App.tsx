import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Sparkles,
  TrainFront,
  Pencil,
  Layers,
  Volume2,
  VolumeX,
  SlidersHorizontal,
} from "lucide-react";
import { MascotGuide } from "./components/MascotGuide";
import { ExploreMode } from "./components/ExploreMode";
import { CountMode } from "./components/CountMode";
import { OrderMode } from "./components/OrderMode";
import { TraceMode } from "./components/TraceMode";
import { MatchMode } from "./components/MatchMode";
import { VOICE_OPTIONS, type VoiceCharacter } from "./data/numbers";
import {
  getAudioContext,
  prewarmCoreClips,
  subscribeSpeaking,
  speakKidVoice,
  setSoundEnabled,
  setVoiceCharacter,
  setSlowPace,
  playMarimbaNote,
} from "./utils/audio";

type GameMode = "explorar" | "contar" | "ordenar" | "trazar" | "parejas";

export default function App() {
  const [mode, setMode] = useState<GameMode>("explorar");
  const [soundOn, setSoundOn] = useState(true);
  const [voice, setVoice] = useState<VoiceCharacter>("Kore");
  const [slow, setSlow] = useState(false);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [promptMessage, setPromptMessage] = useState(
    "¡Hola! Toca un número para escucharlo y contar juntos"
  );
  const repeatFnRef = useRef<() => void>(() =>
    speakKidVoice("¡Hola! Toca un número para escucharlo y contar juntos")
  );

  useEffect(() => {
    const unsubscribe = subscribeSpeaking(setIsSpeaking);
    return unsubscribe;
  }, []);

  // Unlock AudioContext and pre-warm core 1-10 voice clips on first interaction
  useEffect(() => {
    const handleFirstTouch = () => {
      getAudioContext();
      prewarmCoreClips();
    };
    window.addEventListener("pointerdown", handleFirstTouch, {
      once: true,
      passive: true,
    });
    return () => {
      window.removeEventListener("pointerdown", handleFirstTouch);
    };
  }, []);

  const handlePromptChange = useCallback(
    (msg: string, repeatAction: () => void) => {
      setPromptMessage(msg);
      repeatFnRef.current = repeatAction;
    },
    []
  );

  const handleSwitchMode = (nextMode: GameMode) => {
    setMode(nextMode);
    setShowVoiceMenu(false);
    playMarimbaNote(392);

    if (nextMode === "explorar") {
      const msg = "¡Toca un número para escucharlo y ver sus dibujos!";
      handlePromptChange(msg, () =>
        speakKidVoice("Toca un número para escucharlo")
      );
      speakKidVoice("Toca un número para escucharlo");
    } else if (nextMode === "trazar") {
      speakKidVoice("Traza el número siguiendo las líneas");
    }
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) {
      playMarimbaNote(523.25);
      speakKidVoice("Sonido activado");
    }
  };

  const handleSelectVoice = (nextVoice: VoiceCharacter) => {
    setVoice(nextVoice);
    setVoiceCharacter(nextVoice);
    playMarimbaNote(523.25);
    speakKidVoice("¡Hola! Vamos a contar: uno, dos, tres");
  };

  const handleTogglePace = (isSlow: boolean) => {
    setSlow(isSlow);
    setSlowPace(isSlow);
    playMarimbaNote(440);
    speakKidVoice(
      isSlow
        ? "Ahora hablo más despacito para ti"
        : "Ahora hablo con ritmo alegre"
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gradient-to-b from-[#E0F2FE] via-[#FFFBF2] to-[#FEF3C7] text-slate-800">
      {/* Top Bar */}
      <header className="w-full bg-white/95 border-b-2 border-sky-200 px-3 sm:px-6 py-3 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Zone 1: Brand Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span
              className="w-10 h-10 rounded-2xl bg-[#F4B400] text-white flex items-center justify-center text-xl font-bold shadow-[0_3px_0_#C78D00]"
              aria-hidden="true"
            >
              123
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0369A1] whitespace-nowrap">
              Números Mágicos
            </h1>
          </div>

          {/* Zone 2: 5 Kid-Friendly Mode Tabs */}
          <nav
            aria-label="Modos de juego"
            className="flex flex-wrap items-center gap-1.5 sm:gap-2 order-3 lg:order-2 w-full lg:w-auto justify-center"
          >
            <button
              type="button"
              onClick={() => handleSwitchMode("explorar")}
              className={`toy-press flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-2xl font-bold text-sm sm:text-base whitespace-nowrap cursor-pointer border-2 ${
                mode === "explorar"
                  ? "bg-[#F4B400] border-[#C78D00] text-slate-900 shadow-[0_4px_0_#C78D00]"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-amber-50"
              }`}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Explorar</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode("contar")}
              className={`toy-press flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-2xl font-bold text-sm sm:text-base whitespace-nowrap cursor-pointer border-2 ${
                mode === "contar"
                  ? "bg-[#22B573] border-[#168A56] text-white shadow-[0_4px_0_#13794B]"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-emerald-50"
              }`}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Contar</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode("ordenar")}
              className={`toy-press flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-2xl font-bold text-sm sm:text-base whitespace-nowrap cursor-pointer border-2 ${
                mode === "ordenar"
                  ? "bg-[#9333EA] border-[#6B21A8] text-white shadow-[0_4px_0_#581C87]"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-purple-50"
              }`}
            >
              <TrainFront className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Ordenar</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode("trazar")}
              className={`toy-press flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-2xl font-bold text-sm sm:text-base whitespace-nowrap cursor-pointer border-2 ${
                mode === "trazar"
                  ? "bg-[#EC4899] border-[#BE185D] text-white shadow-[0_4px_0_#AE1453]"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-pink-50"
              }`}
            >
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Trazar</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode("parejas")}
              className={`toy-press flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-2xl font-bold text-sm sm:text-base whitespace-nowrap cursor-pointer border-2 ${
                mode === "parejas"
                  ? "bg-[#0EA5E9] border-[#0284C7] text-white shadow-[0_4px_0_#0369A1]"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-sky-50"
              }`}
            >
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Parejas</span>
            </button>
          </nav>

          {/* Zone 3: Audio & Voice Controls */}
          <div className="relative flex items-center gap-2 shrink-0 order-2 lg:order-3">
            <button
              type="button"
              onClick={handleToggleSound}
              aria-label={soundOn ? "Silenciar sonido" : "Activar sonido"}
              className={`toy-press p-2.5 rounded-2xl border-2 cursor-pointer ${
                soundOn
                  ? "bg-amber-100 border-amber-300 text-amber-900 shadow-[0_3px_0_#FCD34D]"
                  : "bg-slate-200 border-slate-300 text-slate-600 shadow-[0_3px_0_#CBD5E1]"
              }`}
            >
              {soundOn ? (
                <Volume2 className="w-6 h-6" />
              ) : (
                <VolumeX className="w-6 h-6" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowVoiceMenu((v) => !v)}
              aria-expanded={showVoiceMenu}
              className="toy-press bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 text-sky-900 px-3.5 py-2.5 rounded-2xl font-bold text-sm sm:text-base shadow-[0_3px_0_#7DD3FC] flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Voz</span>
            </button>

            {showVoiceMenu && (
              <div className="anim-pop-spring absolute right-0 top-14 w-72 bg-white border-2 border-sky-200 rounded-3xl p-4 shadow-xl z-40 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-base">
                    Elegir voz infantil
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowVoiceMenu(false)}
                    className="text-sm font-bold text-slate-500 hover:text-slate-800 px-2 py-1 cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {VOICE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectVoice(opt.id)}
                      className={`text-left px-3.5 py-2.5 rounded-2xl border-2 transition-colors cursor-pointer ${
                        voice === opt.id
                          ? "bg-sky-50 border-[#0EA5E9] text-sky-950"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="font-bold text-sm">{opt.label}</div>
                      <div className="text-xs text-slate-500">{opt.subtitle}</div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-sm font-bold text-slate-700 mb-2">
                    Velocidad al hablar
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleTogglePace(false)}
                      className={`py-2 px-3 rounded-xl font-bold text-sm border-2 cursor-pointer ${
                        !slow
                          ? "bg-amber-400 border-amber-500 text-slate-900"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTogglePace(true)}
                      className={`py-2 px-3 rounded-xl font-bold text-sm border-2 cursor-pointer ${
                        slow
                          ? "bg-amber-400 border-amber-500 text-slate-900"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      Despacito
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Play Stage */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4">
        <MascotGuide
          message={promptMessage}
          isSpeaking={isSpeaking}
          onRepeat={() => repeatFnRef.current()}
        />

        {mode === "explorar" && (
          <ExploreMode onPromptChange={handlePromptChange} />
        )}
        {mode === "contar" && <CountMode onPromptChange={handlePromptChange} />}
        {mode === "ordenar" && <OrderMode onPromptChange={handlePromptChange} />}
        {mode === "trazar" && <TraceMode onPromptChange={handlePromptChange} />}
        {mode === "parejas" && <MatchMode onPromptChange={handlePromptChange} />}
      </main>

      <footer className="py-3 text-center text-xs sm:text-sm font-semibold text-slate-500">
        Números del 1 al 10 · Aprende jugando con voz y música
      </footer>
    </div>
  );
}
