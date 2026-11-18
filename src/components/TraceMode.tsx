import { useState, useRef, useEffect, useCallback } from "react";
import { Eraser, Play, CheckCircle2, ArrowRight } from "lucide-react";
import { NUMBERS_DATA, PRAISE_PHRASES, type NumberItem } from "../data/numbers";
import { NumberIllustration } from "./NumberIllustrations";
import {
  playMarimbaNote,
  playCelebrationSound,
  fireCelebrationConfetti,
  speakKidVoice,
} from "../utils/audio";

interface TraceModeProps {
  onPromptChange: (msg: string, repeatAction: () => void) => void;
}

interface TraceGuide {
  paths: string[];
  startPoint: [number, number];
  checkpoints: [number, number][];
}

// Coordinate system: 240 x 240 SVG viewBox
const TRACE_GUIDES: Record<number, TraceGuide> = {
  1: {
    paths: ["M 92 72 L 122 42 L 122 198"],
    startPoint: [92, 72],
    checkpoints: [
      [95, 68],
      [122, 46],
      [122, 95],
      [122, 145],
      [122, 192],
    ],
  },
  2: {
    paths: [
      "M 74 80 C 74 44, 166 44, 166 86 C 166 122, 108 156, 72 196 L 172 196",
    ],
    startPoint: [74, 80],
    checkpoints: [
      [78, 74],
      [120, 50],
      [162, 84],
      [125, 140],
      [78, 194],
      [165, 194],
    ],
  },
  3: {
    paths: [
      "M 76 66 C 95 44, 162 46, 162 82 C 162 110, 126 118, 106 118 C 134 118, 168 134, 168 164 C 168 200, 96 206, 74 180",
    ],
    startPoint: [76, 66],
    checkpoints: [
      [82, 62],
      [148, 60],
      [112, 118],
      [162, 158],
      [120, 194],
      [78, 182],
    ],
  },
  4: {
    paths: ["M 148 196 L 148 44 L 68 144 L 176 144"],
    startPoint: [148, 44],
    checkpoints: [
      [146, 52],
      [110, 96],
      [74, 142],
      [125, 144],
      [170, 144],
      [148, 190],
    ],
  },
  5: {
    paths: [
      "M 162 48 L 84 48 L 80 112 C 110 98, 168 110, 168 154 C 168 196, 100 206, 74 180",
    ],
    startPoint: [162, 48],
    checkpoints: [
      [156, 48],
      [86, 50],
      [82, 108],
      [148, 122],
      [158, 172],
      [84, 184],
    ],
  },
  6: {
    paths: [
      "M 148 48 C 94 52, 74 106, 74 150 C 74 192, 166 196, 166 150 C 166 112, 86 112, 76 150",
    ],
    startPoint: [148, 48],
    checkpoints: [
      [144, 52],
      [90, 94],
      [76, 148],
      [122, 188],
      [162, 150],
      [118, 118],
    ],
  },
  7: {
    paths: ["M 72 52 L 168 52 L 102 198"],
    startPoint: [72, 52],
    checkpoints: [
      [78, 52],
      [124, 52],
      [164, 54],
      [134, 120],
      [104, 192],
    ],
  },
  8: {
    paths: [
      "M 120 116 C 80 112, 78 50, 120 50 C 162 50, 160 112, 120 116 C 72 122, 72 194, 120 194 C 168 194, 168 122, 120 116",
    ],
    startPoint: [120, 50],
    checkpoints: [
      [120, 52],
      [86, 82],
      [120, 116],
      [154, 156],
      [120, 192],
      [86, 156],
    ],
  },
  9: {
    paths: [
      "M 162 92 C 162 48, 76 48, 76 92 C 76 132, 158 132, 162 92 L 162 196",
    ],
    startPoint: [162, 92],
    checkpoints: [
      [120, 52],
      [78, 92],
      [122, 126],
      [160, 94],
      [162, 148],
      [162, 192],
    ],
  },
  10: {
    paths: [
      "M 48 76 L 72 48 L 72 194",
      "M 152 48 C 114 48, 110 194, 152 194 C 194 194, 190 48, 152 48",
    ],
    startPoint: [48, 76],
    checkpoints: [
      [52, 72],
      [72, 54],
      [72, 130],
      [72, 188],
      [152, 52],
      [122, 120],
      [152, 190],
      [182, 120],
    ],
  },
};

export function TraceMode({ onPromptChange }: TraceModeProps) {
  const [maxRange, setMaxRange] = useState<5 | 6 | 10>(6);
  const [selectedItem, setSelectedItem] = useState<NumberItem>(NUMBERS_DATA[0]);
  const [completedTrace, setCompletedTrace] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const hitCheckpointsRef = useRef<Set<number>>(new Set());

  const visibleNumbers = NUMBERS_DATA.slice(0, maxRange);
  const guide = TRACE_GUIDES[selectedItem.num];

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hitCheckpointsRef.current = new Set();
    setCompletedTrace(false);
  }, []);

  useEffect(() => {
    clearCanvas();
    const phrase = `Traza el número ${selectedItem.spoken} con tu dedito`;
    onPromptChange(`¡Traza el número ${selectedItem.num}!`, () =>
      speakKidVoice(phrase)
    );
  }, [selectedItem, clearCanvas, onPromptChange]);

  const handleSelectNumber = (item: NumberItem) => {
    setSelectedItem(item);
    setShowDemo(false);
    playMarimbaNote(item.noteFreq);
    speakKidVoice(`Traza el número ${item.spoken}`);
  };

  const handleRangeChange = (range: 5 | 6 | 10) => {
    setMaxRange(range);
    playMarimbaNote(440);
    if (selectedItem.num > range) {
      setSelectedItem(NUMBERS_DATA[0]);
    }
    const spokenLimit = range === 5 ? "cinco" : range === 6 ? "seis" : "diez";
    speakKidVoice(`Trazar números del uno al ${spokenLimit}`);
  };

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 240;
    const y = ((e.clientY - rect.top) / rect.height) * 240;
    return { x, y };
  };

  const checkProgress = (pt: { x: number; y: number }) => {
    if (completedTrace) return;
    const checkpoints = guide.checkpoints;
    checkpoints.forEach(([cx, cy], idx) => {
      const dist = Math.hypot(pt.x - cx, pt.y - cy);
      if (dist <= 30) {
        hitCheckpointsRef.current.add(idx);
      }
    });

    const threshold = Math.max(3, Math.ceil(checkpoints.length * 0.72));
    if (hitCheckpointsRef.current.size >= threshold) {
      setCompletedTrace(true);
      const praise =
        PRAISE_PHRASES[Math.floor(Math.random() * PRAISE_PHRASES.length)];
      playCelebrationSound();
      fireCelebrationConfetti();
      onPromptChange(`¡Genial! Trazaste el ${selectedItem.num}`, () =>
        speakKidVoice(`${praise} ¡Trazaste el número ${selectedItem.spoken}!`)
      );
      speakKidVoice(`${praise} ¡Trazaste el número ${selectedItem.spoken}!`);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const pt = getCanvasPoint(e);
    if (!pt) return;

    isDrawingRef.current = true;
    lastPointRef.current = pt;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = selectedItem.accentHex;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    checkProgress(pt);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pt = getCanvasPoint(e);
    if (!pt) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = selectedItem.accentHex;
      ctx.lineWidth = 20;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }

    lastPointRef.current = pt;
    checkProgress(pt);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleNextNumber = () => {
    const nextNum =
      selectedItem.num >= maxRange ? 1 : selectedItem.num + 1;
    handleSelectNumber(NUMBERS_DATA[nextNum - 1]);
  };

  const handleTriggerDemo = () => {
    setShowDemo(false);
    requestAnimationFrame(() => setShowDemo(true));
    playMarimbaNote(selectedItem.noteFreq);
    speakKidVoice(`Empieza en el punto verde para dibujar el ${selectedItem.spoken}`);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col gap-5">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl ${selectedItem.cardBg} text-white flex items-center justify-center text-3xl font-bold`}
            >
              {selectedItem.num}
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
                Traza el {selectedItem.spoken}
              </h2>
              <p className="text-sm sm:text-base font-semibold text-slate-500">
                Empieza en el punto verde y sigue las líneas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {([5, 6, 10] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => handleRangeChange(range)}
                className={`px-3 py-1.5 rounded-xl text-sm sm:text-base font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  maxRange === range
                    ? "bg-[#EC4899] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                1 al {range}
              </button>
            ))}
          </div>
        </div>

        {/* Tracing Stage */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-center justify-items-center">
          {/* Whiteboard Canvas */}
          <div className="relative w-full max-w-[240px] sm:max-w-[290px] aspect-square bg-[#FFFDF7] border-4 border-dashed border-sky-300 rounded-3xl shadow-inner overflow-hidden">
            {/* Guide SVG underneath */}
            <svg
              viewBox="0 0 240 240"
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden="true"
            >
              {/* Soft notebook guidelines */}
              <line
                x1="20"
                y1="120"
                x2="220"
                y2="120"
                stroke="#E2E8F0"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              {guide.paths.map((d, idx) => (
                <path
                  key={idx}
                  d={d}
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="22"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              {guide.paths.map((d, idx) => (
                <path
                  key={`dash-${idx}`}
                  d={d}
                  fill="none"
                  stroke={showDemo ? selectedItem.accentHex : "#94A3B8"}
                  strokeWidth="4"
                  strokeDasharray="8 10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={showDemo ? 0.9 : 0.7}
                />
              ))}
              {/* Green Start Circle */}
              <circle
                cx={guide.startPoint[0]}
                cy={guide.startPoint[1]}
                r="11"
                fill="#22C55E"
                stroke="#FFFFFF"
                strokeWidth="3"
              />
            </svg>

            <canvas
              ref={canvasRef}
              width={240}
              height={240}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative z-10 w-full h-full touch-none cursor-crosshair"
            />
          </div>

          {/* Right Controls & Companion Illustration */}
          <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            <div
              className={`w-full ${selectedItem.softBg} border-2 border-slate-200 rounded-3xl p-4 flex items-center justify-center gap-3`}
            >
              <NumberIllustration
                theme={selectedItem.theme}
                className="w-16 h-16"
              />
              <div className="text-left">
                <div className="text-2xl font-bold text-slate-800">
                  {selectedItem.num === 1
                    ? selectedItem.gender === "f"
                      ? `Una ${selectedItem.itemSingular}`
                      : `Un ${selectedItem.itemSingular}`
                    : `${selectedItem.num} ${selectedItem.itemPlural}`}
                </div>
                {completedTrace ? (
                  <div className="inline-flex items-center gap-1 text-emerald-700 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡Trazo logrado!</span>
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-slate-600">
                    Dibuja sobre la línea punteada
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={handleTriggerDemo}
                className="toy-press bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-3 px-4 rounded-2xl border-2 border-amber-500 shadow-[0_4px_0_#D97706] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5" />
                <span>Guía</span>
              </button>

              <button
                type="button"
                onClick={clearCanvas}
                className="toy-press bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-2xl border-2 border-slate-300 shadow-[0_4px_0_#CBD5E1] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eraser className="w-5 h-5" />
                <span>Limpiar</span>
              </button>
            </div>

            {completedTrace && (
              <button
                type="button"
                onClick={handleNextNumber}
                className="toy-press anim-pop-spring w-full bg-[#22B573] hover:bg-[#1A9D62] text-white font-bold text-lg py-3.5 px-5 rounded-2xl border-2 border-[#168A56] shadow-[0_5px_0_#13794B] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Siguiente número</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Number Selector Row */}
      <div
        className={`grid gap-2.5 sm:gap-3 ${
          maxRange === 6
            ? "grid-cols-3 sm:grid-cols-6"
            : "grid-cols-3 sm:grid-cols-5"
        }`}
      >
        {visibleNumbers.map((item) => {
          const isActive = item.num === selectedItem.num;
          return (
            <button
              key={item.num}
              type="button"
              onClick={() => handleSelectNumber(item)}
              className={`toy-press ${item.cardBg} ${item.cardBottom} text-white rounded-2xl py-3 sm:py-4 flex items-center justify-center gap-2 border-2 ${item.cardBorder} cursor-pointer ${
                isActive ? "ring-4 ring-amber-300 -translate-y-0.5" : "opacity-90 hover:opacity-100"
              }`}
            >
              <span className="text-3xl sm:text-4xl font-bold tabular-nums">
                {item.num}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
