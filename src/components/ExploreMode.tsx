import { useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import {
  NUMBERS_DATA,
  formatQuantitySpoken,
  formatQuantityLabel,
  type NumberItem,
} from "../data/numbers";
import {
  NumberIllustration,
  FingerCountingHands,
} from "./NumberIllustrations";
import {
  playMarimbaNote,
  playCelebrationSound,
  fireCelebrationConfetti,
  speakKidVoice,
} from "../utils/audio";

interface ExploreModeProps {
  onPromptChange: (msg: string, repeatAction: () => void) => void;
}

export function ExploreMode({ onPromptChange }: ExploreModeProps) {
  const [maxRange, setMaxRange] = useState<5 | 6 | 10>(6);
  const [selectedItem, setSelectedItem] = useState<NumberItem>(NUMBERS_DATA[0]);
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [hopIndex, setHopIndex] = useState<number | null>(null);

  const visibleNumbers = NUMBERS_DATA.slice(0, maxRange);

  const handleRangeChange = (range: 5 | 6 | 10) => {
    setMaxRange(range);
    playMarimbaNote(440);
    if (selectedItem.num > range) {
      const next = NUMBERS_DATA[0];
      setSelectedItem(next);
      setTappedIndices([]);
    }
    const spokenLimit = range === 5 ? "cinco" : range === 6 ? "seis" : "diez";
    const label = `Números del uno al ${spokenLimit}`;
    onPromptChange(`¡Exploremos los números del 1 al ${range}!`, () =>
      speakKidVoice(label)
    );
    speakKidVoice(label);
  };

  const handleSelectNumber = (item: NumberItem) => {
    setSelectedItem(item);
    setTappedIndices([]);
    setHopIndex(null);
    playMarimbaNote(item.noteFreq);

    const qtySpoken = formatQuantitySpoken(item);
    const spokenPhrase = `${item.word} ${qtySpoken}`;
    onPromptChange(
      `Número ${item.num}: ¡Toca cada ${item.itemSingular} para contar!`,
      () => speakKidVoice(spokenPhrase)
    );
    speakKidVoice(spokenPhrase);
  };

  const handleTapObject = (idx: number) => {
    setHopIndex(idx);
    setTimeout(() => setHopIndex((prev) => (prev === idx ? null : prev)), 380);

    const existingPos = tappedIndices.indexOf(idx);
    if (existingPos === -1) {
      const nextList = [...tappedIndices, idx];
      setTappedIndices(nextList);
      const countNum = nextList.length;
      const countData = NUMBERS_DATA[countNum - 1];

      if (countData) {
        playMarimbaNote(countData.noteFreq);
        speakKidVoice(countData.word);
      }

      if (countNum === selectedItem.num) {
        const qtySpoken = formatQuantitySpoken(selectedItem);
        const qtyLabel = formatQuantityLabel(selectedItem);
        onPromptChange(`¡Bravo! Contaste ${qtyLabel.toLowerCase()}`, () =>
          speakKidVoice(`¡Muy bien! ${qtySpoken}`)
        );
        setTimeout(() => {
          playCelebrationSound();
          fireCelebrationConfetti();
        }, 380);
      }
    } else {
      const countData = NUMBERS_DATA[existingPos];
      if (countData) {
        playMarimbaNote(countData.noteFreq);
        speakKidVoice(countData.spoken);
      }
    }
  };

  const handleResetCount = () => {
    setTappedIndices([]);
    playMarimbaNote(selectedItem.noteFreq);
    speakKidVoice(`Contemos ${formatQuantitySpoken(selectedItem)}`);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Interactive Showcase Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col gap-5">
        {/* Top toolbar: Number identity + Finger counting + Range switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${selectedItem.cardBg} text-white flex items-center justify-center text-4xl sm:text-5xl font-bold shadow-sm`}
            >
              {selectedItem.num}
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
                {selectedItem.spoken}
              </h2>
              <p className="text-base sm:text-lg font-semibold text-slate-600">
                {formatQuantityLabel(selectedItem)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <FingerCountingHands count={selectedItem.num} />

            {/* Segmented Range Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {([5, 6, 10] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => handleRangeChange(range)}
                  className={`px-3 py-2 rounded-xl text-sm sm:text-base font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    maxRange === range
                      ? "bg-[#F4B400] text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  1 al {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Objects Grid */}
        <div
          className={`${selectedItem.softBg} border-2 border-dashed border-slate-200 rounded-3xl p-4 sm:p-6 min-h-[190px] sm:min-h-[220px] flex flex-col items-center justify-center gap-4`}
        >
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 max-w-3xl">
            {Array.from({ length: selectedItem.num }).map((_, idx) => {
              const tappedOrder = tappedIndices.indexOf(idx);
              const isTapped = tappedOrder !== -1;
              const isHopping = hopIndex === idx;

              return (
                <button
                  key={`${selectedItem.num}-${idx}`}
                  type="button"
                  onClick={() => handleTapObject(idx)}
                  style={{ animationDelay: `${idx * 45}ms` }}
                  aria-label={`${selectedItem.itemSingular} ${idx + 1}`}
                  className={`anim-pop-spring toy-press relative rounded-3xl p-3 sm:p-4 border-2 flex flex-col items-center justify-center min-w-[84px] min-h-[84px] sm:min-w-[104px] sm:min-h-[104px] cursor-pointer ${
                    isTapped
                      ? "bg-white border-[#0EA5E9] shadow-[0_4px_0_#0EA5E9]"
                      : "bg-white border-slate-200 shadow-[0_4px_0_#CBD5E1] hover:border-amber-300"
                  } ${isHopping ? "anim-hop" : ""}`}
                >
                  <NumberIllustration
                    theme={selectedItem.theme}
                    className="w-14 h-14 sm:w-20 sm:h-20"
                  />
                  {isTapped && (
                    <span className="anim-pop-spring absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-[#0EA5E9] text-white font-bold text-base flex items-center justify-center border-2 border-white shadow">
                      {tappedOrder + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Visual dot progress bar (1-to-1 correspondence helper) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {Array.from({ length: selectedItem.num }).map((_, dotIdx) => {
              const filled = dotIdx < tappedIndices.length;
              return (
                <span
                  key={dotIdx}
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 transition-transform duration-200 ${
                    filled
                      ? `${selectedItem.cardBg} border-white scale-110 shadow-sm`
                      : "bg-white border-slate-300"
                  }`}
                />
              );
            })}

            {tappedIndices.length === selectedItem.num ? (
              <button
                type="button"
                onClick={handleResetCount}
                className="ml-2 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Contar otra vez</span>
              </button>
            ) : (
              <span className="ml-2 inline-flex items-center gap-1 text-sm sm:text-base font-bold text-slate-600">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  Toca cada {selectedItem.itemSingular} ({tappedIndices.length}/
                  {selectedItem.num})
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Big Tactile Number Buttons */}
      <div
        className={`grid gap-3 sm:gap-4 ${
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
              className={`toy-press ${item.cardBg} ${item.cardBottom} text-white rounded-3xl py-4 sm:py-5 flex flex-col items-center justify-center border-2 ${item.cardBorder} cursor-pointer ${
                isActive ? "ring-4 ring-amber-300 -translate-y-1" : "opacity-95 hover:opacity-100"
              }`}
            >
              <span className="text-4xl sm:text-5xl font-bold leading-none drop-shadow-sm tabular-nums">
                {item.num}
              </span>
              <span className="text-sm sm:text-base font-bold mt-1">
                {item.spoken}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
