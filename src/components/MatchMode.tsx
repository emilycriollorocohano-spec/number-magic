import { useState, useEffect, useCallback } from "react";
import { RotateCcw, Trophy, HelpCircle } from "lucide-react";
import {
  NUMBERS_DATA,
  PRAISE_PHRASES,
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

interface MatchModeProps {
  onPromptChange: (msg: string, repeatAction: () => void) => void;
}

interface MatchCard {
  id: string;
  num: number;
  kind: "digit" | "objects";
  item: NumberItem;
}

function buildDeck(limit: 5 | 6 | 10): MatchCard[] {
  const pool = [...NUMBERS_DATA.slice(0, limit)];
  // Keep deck at 4 pairs (8 cards) for 1-5, and 6 pairs (12 cards) for 1-6 / 1-10
  const pairCount = limit === 5 ? 4 : 6;
  const chosen = pool.sort(() => Math.random() - 0.5).slice(0, pairCount);

  const cards: MatchCard[] = [];
  chosen.forEach((item) => {
    cards.push({
      id: `digit-${item.num}`,
      num: item.num,
      kind: "digit",
      item,
    });
    cards.push({
      id: `objects-${item.num}`,
      num: item.num,
      kind: "objects",
      item,
    });
  });

  return cards.sort(() => Math.random() - 0.5);
}

export function MatchMode({ onPromptChange }: MatchModeProps) {
  const [maxRange, setMaxRange] = useState<5 | 6 | 10>(5);
  const [cards, setCards] = useState<MatchCard[]>(() => buildDeck(5));
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedNums, setMatchedNums] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const totalPairs = cards.length / 2;
  const isAllMatched = totalPairs > 0 && matchedNums.length === totalPairs;

  const startNewGame = useCallback(
    (limit: 5 | 6 | 10, speakIntro = true) => {
      setMaxRange(limit);
      setCards(buildDeck(limit));
      setFlippedIds([]);
      setMatchedNums([]);
      setIsChecking(false);

      const spokenLimit = limit === 5 ? "cinco" : limit === 6 ? "seis" : "diez";
      onPromptChange(`¡Encuentra las parejas del 1 al ${limit}!`, () =>
        speakKidVoice(
          `Voltea las tarjetas y une cada número con sus dibujos del uno al ${spokenLimit}`
        )
      );
      if (speakIntro) {
        speakKidVoice("¡Encuentra las parejas de números y dibujos!");
      }
    },
    [onPromptChange]
  );

  useEffect(() => {
    startNewGame(5, true);
  }, [startNewGame]);

  const handleCardClick = (card: MatchCard) => {
    if (isChecking) return;
    if (matchedNums.includes(card.num)) return;
    if (flippedIds.includes(card.id)) return;

    playMarimbaNote(card.item.noteFreq);
    const labelText =
      card.kind === "digit"
        ? card.item.word
        : `${card.item.spoken} ${
            card.item.num === 1
              ? card.item.itemSingular
              : card.item.itemPlural
          }`;
    speakKidVoice(labelText);

    const nextFlipped = [...flippedIds, card.id];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setIsChecking(true);
      const firstCard = cards.find((c) => c.id === nextFlipped[0]);
      const secondCard = cards.find((c) => c.id === nextFlipped[1]);

      if (firstCard && secondCard && firstCard.num === secondCard.num) {
        const nextMatched = [...matchedNums, firstCard.num];
        setTimeout(() => {
          setMatchedNums(nextMatched);
          setFlippedIds([]);
          setIsChecking(false);

          if (nextMatched.length === totalPairs) {
            const praise =
              PRAISE_PHRASES[Math.floor(Math.random() * PRAISE_PHRASES.length)];
            playCelebrationSound();
            fireCelebrationConfetti();
            onPromptChange(`¡Fantástico! Encontraste todas las parejas`, () =>
              speakKidVoice(`${praise} ¡Encontraste todas las parejas!`)
            );
            speakKidVoice(`${praise} ¡Encontraste todas las parejas!`);
          } else {
            playCelebrationSound();
            speakKidVoice(`¡Pareja del ${firstCard.item.spoken}!`);
          }
        }, 420);
      } else {
        setTimeout(() => {
          playTryAgainSound();
          setFlippedIds([]);
          setIsChecking(false);
        }, 950);
      }
    }
  };

  return (
    <div className="w-full bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Parejas Mágicas
          </h2>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {([5, 6, 10] as const).map((limit) => (
              <button
                key={limit}
                type="button"
                onClick={() => {
                  playMarimbaNote(440);
                  startNewGame(limit, true);
                }}
                className={`px-3 py-1.5 rounded-xl text-sm sm:text-base font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  maxRange === limit
                    ? "bg-[#0EA5E9] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                1 al {limit}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-base sm:text-lg font-bold text-slate-700 tabular-nums">
            Parejas: {matchedNums.length}/{totalPairs}
          </span>
          <button
            type="button"
            onClick={() => {
              playMarimbaNote(392);
              startNewGame(maxRange, true);
            }}
            className="toy-press bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm sm:text-base px-4 py-2 rounded-2xl border-2 border-amber-500 shadow-[0_4px_0_#D97706] flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Cards Grid or Victory */}
      {isAllMatched ? (
        <div className="anim-pop-spring py-8 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-amber-600">
            <Trophy className="w-11 h-11" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-sky-800">
            ¡Encontraste todas las parejas!
          </h3>
          <button
            type="button"
            onClick={() => startNewGame(maxRange, true)}
            className="toy-press bg-[#22B573] hover:bg-[#1A9D62] text-white px-8 py-4 rounded-3xl font-bold text-xl border-2 border-[#168A56] shadow-[0_6px_0_#13794B] flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-6 h-6" />
            <span>¡Jugar otra vez!</span>
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-3 sm:gap-4 ${
            cards.length <= 8
              ? "grid-cols-2 sm:grid-cols-4"
              : "grid-cols-3 sm:grid-cols-4"
          }`}
        >
          {cards.map((card) => {
            const isMatched = matchedNums.includes(card.num);
            const isFlipped = flippedIds.includes(card.id) || isMatched;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(card)}
                className={`toy-press min-h-[120px] sm:min-h-[140px] rounded-3xl border-2 p-2.5 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isMatched
                    ? "bg-emerald-50 border-emerald-400 shadow-[0_4px_0_#34D399]"
                    : isFlipped
                      ? "bg-white border-[#0EA5E9] shadow-[0_4px_0_#38BDF8]"
                      : "bg-[#38BDF8] border-[#0284C7] shadow-[0_6px_0_#0369A1] text-white hover:bg-[#0EA5E9]"
                }`}
              >
                {!isFlipped ? (
                  <HelpCircle className="w-11 h-11 sm:w-12 sm:h-12 opacity-90" />
                ) : card.kind === "digit" ? (
                  <div className="anim-pop-spring flex flex-col items-center">
                    <span
                      className="text-5xl sm:text-6xl font-bold leading-none tabular-nums"
                      style={{ color: card.item.accentHex }}
                    >
                      {card.num}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-slate-700 mt-1">
                      {card.item.spoken}
                    </span>
                  </div>
                ) : (
                  <div className="anim-pop-spring flex flex-wrap items-center justify-center gap-1 max-w-[120px]">
                    {Array.from({ length: card.num }).map((_, i) => (
                      <NumberIllustration
                        key={i}
                        theme={card.item.theme}
                        className={
                          card.num <= 2
                            ? "w-12 h-12 sm:w-14 sm:h-14"
                            : card.num <= 6
                              ? "w-8 h-8 sm:w-9 sm:h-9"
                              : "w-6 h-6 sm:w-7 sm:h-7"
                        }
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
