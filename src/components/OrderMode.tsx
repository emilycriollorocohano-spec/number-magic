import { useState, useEffect, useCallback } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import {
  NUMBERS_DATA,
  PRAISE_PHRASES,
  type NumberItem,
} from "../data/numbers";
import {
  playMarimbaNote,
  playCelebrationSound,
  playTryAgainSound,
  playTrainWhistle,
  fireCelebrationConfetti,
  speakKidVoice,
} from "../utils/audio";

interface OrderModeProps {
  onPromptChange: (msg: string, repeatAction: () => void) => void;
}

function shuffleNumbers(maxVal: number): NumberItem[] {
  const list = NUMBERS_DATA.slice(0, maxVal);
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  if (copy.every((item, idx) => item.num === idx + 1)) {
    copy.reverse();
  }
  return copy;
}

export function OrderMode({ onPromptChange }: OrderModeProps) {
  const [maxOrder, setMaxOrder] = useState<5 | 6 | 10>(6);
  const [nextExpected, setNextExpected] = useState(1);
  const [bubbles, setBubbles] = useState<NumberItem[]>(() => shuffleNumbers(6));
  const [wiggleNum, setWiggleNum] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>(
    "Toca los números en orden, empezando por el 1"
  );

  const startRound = useCallback(
    (limit: 5 | 6 | 10, announce = true) => {
      setMaxOrder(limit);
      setNextExpected(1);
      setBubbles(shuffleNumbers(limit));
      setWiggleNum(null);
      setFeedback(`Toca los números en orden del 1 al ${limit}`);
      const spokenLimit = limit === 5 ? "cinco" : limit === 6 ? "seis" : "diez";
      onPromptChange(`¡Ordena el tren del 1 al ${limit}! Busca el 1`, () =>
        speakKidVoice(`Busca el número uno para empezar el tren del uno al ${spokenLimit}`)
      );
      if (announce) {
        speakKidVoice("Toca los números en orden, empezando por el uno");
      }
    },
    [onPromptChange]
  );

  useEffect(() => {
    startRound(6, true);
  }, [startRound]);

  const isCompleted = nextExpected > maxOrder;

  const handleTapBubble = (item: NumberItem) => {
    if (isCompleted) return;

    if (item.num === nextExpected) {
      playMarimbaNote(item.noteFreq);
      const updatedNext = nextExpected + 1;
      setNextExpected(updatedNext);

      if (updatedNext > maxOrder) {
        const praise =
          PRAISE_PHRASES[Math.floor(Math.random() * PRAISE_PHRASES.length)];
        setFeedback(`¡Tren completo! ${praise}`);
        onPromptChange(`¡Tren completo! ${praise}`, () =>
          speakKidVoice(`${praise} ¡Ordenaste todos los números!`)
        );
        setTimeout(() => {
          playTrainWhistle();
          playCelebrationSound();
          fireCelebrationConfetti();
          speakKidVoice(`${praise} ¡Ordenaste todos los números!`);
        }, 280);
      } else {
        const nextWord = NUMBERS_DATA[updatedNext - 1].spoken;
        setFeedback(`¡Muy bien! ${item.word} Ahora busca el ${updatedNext}`);
        onPromptChange(`¡Bien! Ahora busca el ${updatedNext}`, () =>
          speakKidVoice(`Busca el número ${nextWord}`)
        );
        speakKidVoice(item.word);
      }
    } else {
      playTryAgainSound();
      setWiggleNum(item.num);
      setTimeout(() => setWiggleNum(null), 450);

      const expectedWord = NUMBERS_DATA[nextExpected - 1].spoken;
      setFeedback(
        `¡Casi! Ese es el ${item.num}. Busca el número ${nextExpected}`
      );
      speakKidVoice(`¡Inténtalo de nuevo! Busca el ${expectedWord}`);
    }
  };

  return (
    <div className="w-full bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col gap-5">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {([5, 6, 10] as const).map((limit) => (
            <button
              key={limit}
              type="button"
              onClick={() => {
                playMarimbaNote(440);
                startRound(limit, true);
              }}
              className={`px-3.5 py-2 rounded-xl text-sm sm:text-base font-bold transition-colors whitespace-nowrap cursor-pointer ${
                maxOrder === limit
                  ? "bg-[#9333EA] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              1 al {limit}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            playMarimbaNote(392);
            startRound(maxOrder, true);
          }}
          className="toy-press bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-base px-4 py-2.5 rounded-2xl shadow-[0_4px_0_#0369A1] flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Mezclar</span>
        </button>
      </div>

      {/* Illustrated Number Train */}
      <div className="bg-[#FAF5FF] border-2 border-purple-200 rounded-3xl p-3 sm:p-5">
        <div className="flex flex-wrap items-end justify-center gap-x-1.5 gap-y-3 mx-auto pb-1">
          {/* SVG Cute Locomotive */}
          <div className="shrink-0 flex flex-col items-center">
            <svg
              viewBox="0 0 88 76"
              className="w-16 h-14 sm:w-20 sm:h-16"
              aria-hidden="true"
            >
              {/* Chimney */}
              <rect
                x="14"
                y="14"
                width="14"
                height="20"
                rx="3"
                fill="#EF4444"
                stroke="#991B1B"
                strokeWidth="2.5"
              />
              {/* Boiler */}
              <rect
                x="10"
                y="30"
                width="44"
                height="28"
                rx="8"
                fill="#0EA5E9"
                stroke="#0369A1"
                strokeWidth="2.5"
              />
              {/* Cabin */}
              <rect
                x="48"
                y="16"
                width="30"
                height="42"
                rx="6"
                fill="#F59E0B"
                stroke="#B45309"
                strokeWidth="2.5"
              />
              {/* Window */}
              <rect
                x="54"
                y="23"
                width="18"
                height="15"
                rx="3"
                fill="#E0F2FE"
                stroke="#0369A1"
                strokeWidth="2"
              />
              {/* Wheels */}
              <circle cx="24" cy="62" r="9" fill="#334155" stroke="#0F172A" strokeWidth="2.5" />
              <circle cx="24" cy="62" r="3" fill="#CBD5E1" />
              <circle cx="62" cy="62" r="10" fill="#334155" stroke="#0F172A" strokeWidth="2.5" />
              <circle cx="62" cy="62" r="3.5" fill="#CBD5E1" />
            </svg>
          </div>

          {/* Train Cars (1..maxOrder) */}
          {NUMBERS_DATA.slice(0, maxOrder).map((car) => {
            const isPlaced = car.num < nextExpected;
            const isNextTarget = car.num === nextExpected;

            return (
              <div
                key={car.num}
                className="flex flex-col items-center shrink-0"
              >
                {/* Connector bar */}
                <div className="flex items-center">
                  <div className="w-2 h-1.5 bg-slate-400 rounded-full -ml-1 mr-0.5" />
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold border-2 transition-all tabular-nums ${
                      isPlaced
                        ? `anim-pop-spring ${car.cardBg} ${car.cardBorder} text-white shadow-sm`
                        : isNextTarget
                          ? "bg-white border-purple-500 border-dashed text-purple-600 ring-4 ring-purple-200"
                          : "bg-white/70 border-purple-200 border-dashed text-purple-300"
                    }`}
                  >
                    {car.num}
                  </div>
                </div>
                {/* Train car wheels */}
                <div className="flex items-center justify-between w-9 sm:w-11 mt-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-700 border-2 border-slate-400" />
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-700 border-2 border-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Banner */}
      <div
        className={`rounded-2xl px-4 py-2.5 text-center font-bold text-lg sm:text-xl border-2 ${
          isCompleted
            ? "bg-emerald-50 border-emerald-300 text-emerald-800"
            : wiggleNum !== null
              ? "bg-amber-50 border-amber-300 text-amber-900"
              : "bg-purple-50 border-purple-200 text-purple-900"
        }`}
      >
        {feedback}
      </div>

      {/* Bubbles Area or Victory Card */}
      <div className="min-h-[190px] flex flex-wrap items-center justify-center gap-3 sm:gap-5 py-2">
        {isCompleted ? (
          <div className="anim-pop-spring flex flex-col items-center text-center gap-4 py-2">
            <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-amber-600 shadow-sm">
              <Trophy className="w-11 h-11" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-purple-800">
              ¡Completaste el tren del 1 al {maxOrder}!
            </h3>
            <button
              type="button"
              onClick={() => startRound(maxOrder, true)}
              className="toy-press bg-[#22B573] hover:bg-[#1A9D62] text-white px-8 py-4 rounded-3xl font-bold text-xl sm:text-2xl border-2 border-[#168A56] shadow-[0_6px_0_#13794B] flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-6 h-6" />
              <span>¡Jugar otra vez!</span>
            </button>
          </div>
        ) : (
          bubbles.map((item, idx) => {
            const alreadyPlaced = item.num < nextExpected;
            const isWiggling = wiggleNum === item.num;

            return (
              <button
                key={item.num}
                type="button"
                disabled={alreadyPlaced}
                onClick={() => handleTapBubble(item)}
                style={{ animationDelay: `${idx * 45}ms` }}
                className={`toy-press anim-pop-spring w-24 h-24 sm:w-28 sm:h-28 rounded-full text-white border-2 flex flex-col items-center justify-center ${
                  alreadyPlaced
                    ? "opacity-0 pointer-events-none scale-75"
                    : `${item.cardBg} ${item.cardBorder} ${item.cardBottom} cursor-pointer`
                } ${isWiggling ? "anim-wiggle" : ""}`}
              >
                <span className="text-4xl sm:text-5xl font-bold leading-none tabular-nums">
                  {item.num}
                </span>
                <span className="text-xs sm:text-sm font-bold mt-0.5">
                  {item.spoken}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
