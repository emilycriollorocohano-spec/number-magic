import { Volume2 } from "lucide-react";

interface MascotGuideProps {
  message: string;
  isSpeaking: boolean;
  onRepeat: () => void;
  buttonLabel?: string;
}

export function MascotGuide({
  message,
  isSpeaking,
  onRepeat,
  buttonLabel = "Escuchar",
}: MascotGuideProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border-2 border-amber-200 rounded-3xl px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        {/* Tico el Búho Amigable */}
        <div
          className={`relative shrink-0 transition-transform duration-200 ${
            isSpeaking ? "scale-105" : ""
          }`}
        >
          <svg
            viewBox="0 0 96 96"
            className={`w-14 h-14 sm:w-16 sm:h-16 ${isSpeaking ? "anim-float" : ""}`}
            aria-hidden="true"
          >
            {/* Ears */}
            <path
              d="M22 26 L16 12 L34 20 Z"
              fill="#7C3AED"
              stroke="#5B21B6"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M74 26 L80 12 L62 20 Z"
              fill="#7C3AED"
              stroke="#5B21B6"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Body */}
            <ellipse
              cx="48"
              cy="54"
              rx="32"
              ry="32"
              fill="#8B5CF6"
              stroke="#5B21B6"
              strokeWidth="3"
            />
            {/* Belly */}
            <ellipse cx="48" cy="64" rx="20" ry="18" fill="#EDE9FE" />
            {/* Eye circles */}
            <circle cx="36" cy="42" r="11" fill="#FFFFFF" stroke="#5B21B6" strokeWidth="2.5" />
            <circle cx="60" cy="42" r="11" fill="#FFFFFF" stroke="#5B21B6" strokeWidth="2.5" />
            <circle cx="37" cy="42" r="5" fill="#1E293B" />
            <circle cx="59" cy="42" r="5" fill="#1E293B" />
            <circle cx="38.5" cy="40" r="1.8" fill="#FFFFFF" />
            <circle cx="60.5" cy="40" r="1.8" fill="#FFFFFF" />
            {/* Beak (opens slightly when speaking) */}
            <path
              d={
                isSpeaking
                  ? "M43 50 L53 50 L48 59 Z"
                  : "M44 49 L52 49 L48 55 Z"
              }
              fill="#F59E0B"
              stroke="#B45309"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Feet */}
            <ellipse cx="38" cy="86" rx="6" ry="3.5" fill="#F59E0B" />
            <ellipse cx="58" cy="86" rx="6" ry="3.5" fill="#F59E0B" />
          </svg>

          {/* Visual voice equalizer bars when talking */}
          {isSpeaking && (
            <div
              className="absolute -right-1 -top-1 flex items-end gap-0.5 bg-amber-400 px-1.5 py-1 rounded-full border-2 border-white shadow"
              aria-hidden="true"
            >
              <span className="w-1 h-2.5 bg-white rounded-full anim-sound-bar" />
              <span
                className="w-1 h-3.5 bg-white rounded-full anim-sound-bar"
                style={{ animationDelay: "120ms" }}
              />
              <span
                className="w-1 h-2 bg-white rounded-full anim-sound-bar"
                style={{ animationDelay: "240ms" }}
              />
            </div>
          )}
        </div>

        <p className="text-lg sm:text-2xl font-bold text-slate-800 leading-snug text-center sm:text-left">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onRepeat}
        className="toy-press shrink-0 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-base sm:text-lg px-5 py-3 rounded-2xl shadow-[0_5px_0_#0369A1] flex items-center gap-2 whitespace-nowrap cursor-pointer"
      >
        <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
        <span>{buttonLabel}</span>
      </button>
    </div>
  );
}
