import { useState, useEffect, useCallback } from "react";
import { Star, ArrowRight } from "lucide-react";
import {
  NUMBERS_DATA,
  PRAISE_PHRASES,
  formatCountQuestion,
  formatQuantitySpoken,
  type NumberItem,
} from "../data/numbers";
import { NumberIllustration } from "./NumberIllustrations";
import {
  playMarimbaNote,
  playCelebrationSound,
  playTryAgainSound,
  fireCelebrationConfetti,
  speakKidVoice,
} from "../utils/audio";

interface CountModeProps {
  onPromptChange: (msg: string, repeatAction: () => void) => void;
}

interface CountRound {
  target: NumberItem;
  options: NumberItem[];
}

function createRound(maxLimit: 5 | 6 | 10, prevNum?: number): CountRound {
  const available = NUMBERS_DATA.slice(0, maxLimit);
  const pool = available.filter((item) => item.num !== prevNum);
  const target = pool[Math.floor(Math.random() * pool.length)] ?? available[0];

  const optionNums = new Set<number>([target.num]);
  while (optionNums.size < 3) {
    const candidate = Math.floor(Math.random() * maxLimit) + 1;
    optionNums.add(candidate);
  }

  const options = Array.from(optionNums)
    .sort(() => Math.random() - 0.5)
    .map((n) => NUMBERS_DATA[n - 1]);

  return { target, options };
}

const OPTION_STYLES = [
  "bg-[#0EA5E9] border-[#0284C7] shadow-[0_6px_0_#0369A1]",
  "bg-[#F4B400] border-[#C78D00] shadow-[0_6px_0_#B37D00]",
  "bg-[#EC4899] border-[#BE185D] shadow-[0_6px_0_#AE1453]",
];

export function CountMode({ onPromptChange }: CountModeProps) {
  const [maxCount, setMaxCount] = useState<5 | 6 | 10>(6);
  const [round, setRound] = useState<CountRound>(() => createRound(6));
  const [score, setScore] = useState(0);
  const [tappedObjects, setTappedObjects] = useState<number[]>([]);
  const [wrongChoices, setWrongChoices] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState<string>(
    "Toca cada dibujo para contarlo y elige el número"
  );

  const announceQuestion = useCallback(
    (target: NumberItem) => {
      const questionText = formatCountQuestion(target);
      onPromptChange(questionText, () => speakKidVoice(questionText));
      speakKidVoice(questionText);
    },
    [onPromptChange]
  );

  useEffect(() => {
    announceQuestion(round.target);
    // Only announce when round target object reference changes
  }, [round, announceQuestion]);

  const handleCategoryChange = (limit: 5 | 6 | 10) => {
    setMaxCount(limit);
    playMarimbaNote(440);
    const next = createRound(limit, round.target.num);
    setRound(next);
    setTappedObjects([]);
    setWrongChoices([]);
    setSolved(false);
    setFeedback(`Contemos del 1 al ${limit}. Toca cada dibujo y elige el número`);
  };

  const startNextRound = () => {
    const next = createRound(maxCount, round.target.num);
    setRound(next);
    setTappedObjects([]);
    setWrongChoices([]);
    setSolved(false);
    setFeedback("Toca cada dibujo para contarlo y elige el número");
  };

  const handleTapObject = (idx: number) => {
    const existing = tappedObjects.indexOf(idx);
    if (existing === -1) {
      const next = [...tappedObjects, idx];
      setTappedObjects(next);
      const countItem = NUMBERS_DATA[next.length - 1];
      if (countItem) {
        playMarimbaNote(countItem.noteFreq);
        speakKidVoice(countItem.spoken);
      }
    } else {
      const countItem = NUMBERS_DATA[existing];
      if (countItem) {
        playMarimbaNote(countItem.noteFreq);
      }
    }
  };

  const handleChooseOption = (option: NumberItem) => {
    if (solved) return;

    if (option.num === round.target.num) {
      setSolved(true);
      setScore((s) => s + 1);
      const praise =
        PRAISE_PHRASES[Math.floor(Math.random() * PRAISE_PHRASES.length)];
      const qtySpoken = formatQuantitySpoken(round.target);

      setFeedback(`${praise} ¡Hay ${qtySpoken}!`);
      onPromptChange(`${praise} ¡Hay ${qtySpoken}!`, () =>
        speakKidVoice(`${praise} ¡Hay ${qtySpoken}!`)
      );

      playCelebrationSound();
      fireCelebrationConfetti();
      speakKidVoice(`${praise} ¡Hay ${qtySpoken}!`);
    } else {
      if (!wrongChoices.includes(option.num)) {
        setWrongChoices((prev) => [...prev, option.num]);
      }
      playTryAgainSound();
      setFeedback("¡Inténtalo de nuevo! Tócalos despacito uno por uno");
      speakKidVoice("¡Inténtalo de nuevo! Cuenta despacito");
    }
  };

  return (
    <div className="w-full bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col gap-5">
      {/* Header with 1-5, 1-6, 1-10 categories & stars */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            {formatCountQuestion(round.target)}
          </h2>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {([5, 6, 10] as const).map((limit) => (
              <button
                key={limit}
                type="button"
                onClick={() => handleCategoryChange(limit)}
                className={`px-3 py-1.5 rounded-xl text-sm sm:text-base font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  maxCount === limit
                    ? "bg-[#22B573] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                1 al {limit}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-2xl px-4 py-2">
          <Star className="w-6 h-6 text-[#F4B400] fill-[#F4B400]" />
          <span className="text-lg sm:text-xl font-bold text-amber-900 tabular-nums">
            Estrellas: {score}
          </span>
        </div>
      </div>

      {/* Counting stage */}
      <div className="bg-[#ECFDF5] border-2 border-dashed border-emerald-300 rounded-3xl p-4 sm:p-7 min-h-[200px] sm:min-h-[230px] flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 max-w-2xl">
          {Array.from({ length: round.target.num }).map((_, idx) => {
            const tappedOrder = tappedObjects.indexOf(idx);
            const isTapped = tappedOrder !== -1;

            return (
              <button
                key={`${round.target.num}-${idx}`}
                type="button"
                onClick={() => handleTapObject(idx)}
                style={{ animationDelay: `${idx * 50}ms` }}
                aria-label={`Objeto ${idx + 1}`}
                className={`anim-pop-spring toy-press relative rounded-3xl p-3 sm:p-4 bg-white border-2 cursor-pointer transition-transform ${
                  isTapped
                    ? "border-emerald-500 shadow-[0_4px_0_#10B981] scale-105"
                    : "border-emerald-200 shadow-[0_4px_0_#A7F3D0] hover:border-emerald-400"
                }`}
              >
                <NumberIllustration
                  theme={round.target.theme}
                  className="w-14 h-14 sm:w-20 sm:h-20"
                />
                {isTapped && (
                  <span className="anim-pop-spring absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-base flex items-center justify-center border-2 border-white shadow">
                    {tappedOrder + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gentle Feedback Banner */}
      <div
        className={`rounded-2xl px-4 py-3 text-center font-bold text-lg sm:text-2xl border-2 transition-colors ${
          solved
            ? "bg-emerald-50 border-emerald-300 text-emerald-800"
            : wrongChoices.length > 0
              ? "bg-amber-50 border-amber-300 text-amber-900"
              : "bg-slate-50 border-slate-200 text-slate-700"
        }`}
      >
        {feedback}
      </div>

      {/* 3 Large Answer Options or Next Round CTA */}
      {solved ? (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={startNextRound}
            className="toy-press bg-[#22B573] hover:bg-[#1A9D62] text-white font-bold text-xl sm:text-2xl px-8 py-4 rounded-3xl border-2 border-[#168A56] shadow-[0_6px_0_#13794B] flex items-center gap-3 cursor-pointer"
          >
            <span>¡Siguiente pregunta!</span>
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl w-full mx-auto">
          {round.options.map((opt, idx) => {
            const isWrong = wrongChoices.includes(opt.num);
            return (
              <button
                key={opt.num}
                type="button"
                onClick={() => handleChooseOption(opt)}
                className={`toy-press rounded-3xl py-5 sm:py-7 text-white border-2 flex flex-col items-center justify-center cursor-pointer ${
                  isWrong
                    ? "bg-slate-300 border-slate-400 shadow-[0_4px_0_#94A3B8] opacity-65 anim-wiggle"
                    : OPTION_STYLES[idx]
                }`}
              >
                <span className="text-5xl sm:text-6xl font-bold leading-none tabular-nums">
                  {opt.num}
                </span>
                <span className="text-base sm:text-xl font-bold mt-1">
                  {opt.spoken}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
