import type { NumberThemeId } from "../data/numbers";

interface IllustrationProps {
  theme: NumberThemeId;
  className?: string;
}

export function NumberIllustration({
  theme,
  className = "w-16 h-16 sm:w-20 sm:h-20",
}: IllustrationProps) {
  switch (theme) {
    case "apple":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <path
            d="M50 26 C50 16, 58 10, 62 11"
            stroke="#78350F"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M52 19 C64 10, 77 16, 72 28 C64 31, 55 26, 52 19 Z"
            fill="#22C55E"
            stroke="#15803D"
            strokeWidth="2.5"
          />
          <path
            d="M50 28 C34 22, 16 32, 18 55 C20 79, 36 90, 48 86 C50 85, 51 85, 52 86 C64 90, 80 79, 82 55 C84 32, 66 22, 50 28 Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="3.5"
          />
          <ellipse
            cx="33"
            cy="44"
            rx="6"
            ry="11"
            transform="rotate(-20 33 44)"
            fill="#FCA5A5"
            opacity="0.7"
          />
          <circle cx="40" cy="56" r="3.5" fill="#1E293B" />
          <circle cx="60" cy="56" r="3.5" fill="#1E293B" />
          <circle cx="41.2" cy="54.8" r="1.2" fill="#FFFFFF" />
          <circle cx="61.2" cy="54.8" r="1.2" fill="#FFFFFF" />
          <path
            d="M43 65 Q50 72 57 65"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case "puppy":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <ellipse
            cx="24"
            cy="45"
            rx="13"
            ry="22"
            transform="rotate(14 24 45)"
            fill="#B45309"
            stroke="#78350F"
            strokeWidth="3"
          />
          <ellipse
            cx="76"
            cy="45"
            rx="13"
            ry="22"
            transform="rotate(-14 76 45)"
            fill="#B45309"
            stroke="#78350F"
            strokeWidth="3"
          />
          <circle
            cx="50"
            cy="52"
            r="30"
            fill="#FBBF24"
            stroke="#92400E"
            strokeWidth="3.5"
          />
          <ellipse cx="38" cy="50" rx="10" ry="11" fill="#FEF3C7" />
          <ellipse cx="50" cy="64" rx="16" ry="13" fill="#FEF3C7" />
          <circle cx="38" cy="48" r="4" fill="#1E293B" />
          <circle cx="62" cy="48" r="4" fill="#1E293B" />
          <circle cx="39.3" cy="46.5" r="1.4" fill="#FFFFFF" />
          <circle cx="63.3" cy="46.5" r="1.4" fill="#FFFFFF" />
          <ellipse cx="50" cy="59" rx="6" ry="4.5" fill="#1E293B" />
          <path
            d="M43 68 Q50 74 57 68"
            stroke="#78350F"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M47 71 Q50 79 53 71"
            fill="#FB7185"
            stroke="#BE123C"
            strokeWidth="2"
          />
        </svg>
      );

    case "banana":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <path
            d="M72 16 C78 16, 80 22, 76 26 C84 48, 72 78, 34 86 C21 89, 14 82, 20 74 C36 69, 54 55, 60 28 C61 20, 66 16, 72 16 Z"
            fill="#FACC15"
            stroke="#CA8A04"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M66 15 L74 16 L71 22 L65 21 Z"
            fill="#78350F"
            stroke="#451A03"
            strokeWidth="2"
          />
          <path
            d="M36 74 C52 67, 63 54, 67 36"
            stroke="#FEF08A"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="51" cy="54" r="3" fill="#1E293B" />
          <circle cx="61" cy="59" r="3" fill="#1E293B" />
          <path
            d="M50 63 Q55 68 60 64"
            stroke="#1E293B"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case "frog":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <ellipse
            cx="50"
            cy="78"
            rx="36"
            ry="11"
            fill="#86EFAC"
            stroke="#16A34A"
            strokeWidth="2.5"
          />
          <circle
            cx="34"
            cy="34"
            r="12"
            fill="#4ADE80"
            stroke="#15803D"
            strokeWidth="3.5"
          />
          <circle
            cx="66"
            cy="34"
            r="12"
            fill="#4ADE80"
            stroke="#15803D"
            strokeWidth="3.5"
          />
          <ellipse
            cx="50"
            cy="56"
            rx="31"
            ry="23"
            fill="#4ADE80"
            stroke="#15803D"
            strokeWidth="3.5"
          />
          <ellipse cx="50" cy="64" rx="20" ry="12" fill="#DCFCE7" />
          <circle cx="34" cy="34" r="7" fill="#FFFFFF" />
          <circle cx="66" cy="34" r="7" fill="#FFFFFF" />
          <circle cx="35" cy="34" r="3.8" fill="#1E293B" />
          <circle cx="65" cy="34" r="3.8" fill="#1E293B" />
          <circle cx="29" cy="54" r="4" fill="#FB7185" opacity="0.6" />
          <circle cx="71" cy="54" r="4" fill="#FB7185" opacity="0.6" />
          <path
            d="M36 56 Q50 67 64 56"
            stroke="#14532D"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case "strawberry":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <path
            d="M50 26 C26 26, 20 46, 28 66 C35 82, 45 90, 50 90 C55 90, 65 82, 72 66 C80 46, 74 26, 50 26 Z"
            fill="#F43F5E"
            stroke="#BE123C"
            strokeWidth="3.5"
          />
          <path
            d="M32 28 C38 18, 46 22, 50 15 C54 22, 62 18, 68 28 C60 32, 55 29, 50 33 C45 29, 40 32, 32 28 Z"
            fill="#22C55E"
            stroke="#15803D"
            strokeWidth="2.8"
          />
          <circle cx="34" cy="48" r="2" fill="#FEF08A" />
          <circle cx="66" cy="48" r="2" fill="#FEF08A" />
          <circle cx="38" cy="68" r="2" fill="#FEF08A" />
          <circle cx="62" cy="68" r="2" fill="#FEF08A" />
          <circle cx="50" cy="78" r="2" fill="#FEF08A" />
          <circle cx="42" cy="52" r="3.4" fill="#1E293B" />
          <circle cx="58" cy="52" r="3.4" fill="#1E293B" />
          <circle cx="43.1" cy="50.8" r="1.1" fill="#FFFFFF" />
          <circle cx="59.1" cy="50.8" r="1.1" fill="#FFFFFF" />
          <path
            d="M44 61 Q50 67 56 61"
            stroke="#1E293B"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case "star":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <path
            d="M50 11 L61 36 L88 39 L68 57 L73 84 L50 71 L27 84 L32 57 L12 39 L39 36 Z"
            fill="#FACC15"
            stroke="#CA8A04"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="41" cy="49" r="3.5" fill="#1E293B" />
          <circle cx="59" cy="49" r="3.5" fill="#1E293B" />
          <circle cx="42.1" cy="47.8" r="1.2" fill="#FFFFFF" />
          <circle cx="60.1" cy="47.8" r="1.2" fill="#FFFFFF" />
          <circle cx="35" cy="56" r="3.5" fill="#FB7185" opacity="0.65" />
          <circle cx="65" cy="56" r="3.5" fill="#FB7185" opacity="0.65" />
          <path
            d="M44 58 Q50 64 56 58"
            stroke="#1E293B"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case "watermelon":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <path
            d="M14 42 C14 72, 30 86, 50 86 C70 86, 86 72, 86 42 Z"
            fill="#16A34A"
            stroke="#14532D"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M20 42 C20 67, 34 79, 50 79 C66 79, 80 67, 80 42 Z"
            fill="#ECFDF5"
          />
          <path
            d="M24 42 C24 63, 36 74, 50 74 C64 74, 76 63, 76 42 Z"
            fill="#FB7185"
            stroke="#E11D48"
            strokeWidth="2"
          />
          <circle cx="36" cy="52" r="2.3" fill="#1E293B" />
          <circle cx="64" cy="52" r="2.3" fill="#1E293B" />
          <circle cx="50" cy="66" r="2.3" fill="#1E293B" />
          <circle cx="43" cy="53" r="3" fill="#1E293B" />
          <circle cx="57" cy="53" r="3" fill="#1E293B" />
          <path
            d="M45 60 Q50 64 55 60"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case "panda":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <circle cx="26" cy="28" r="12" fill="#1E293B" />
          <circle cx="74" cy="28" r="12" fill="#1E293B" />
          <circle
            cx="50"
            cy="54"
            r="31"
            fill="#FFFFFF"
            stroke="#334155"
            strokeWidth="3.5"
          />
          <ellipse
            cx="36"
            cy="50"
            rx="9"
            ry="11"
            transform="rotate(-15 36 50)"
            fill="#1E293B"
          />
          <ellipse
            cx="64"
            cy="50"
            rx="9"
            ry="11"
            transform="rotate(15 64 50)"
            fill="#1E293B"
          />
          <circle cx="37" cy="49" r="3.2" fill="#FFFFFF" />
          <circle cx="63" cy="49" r="3.2" fill="#FFFFFF" />
          <circle cx="37" cy="49" r="1.5" fill="#0F172A" />
          <circle cx="63" cy="49" r="1.5" fill="#0F172A" />
          <ellipse cx="50" cy="60" rx="5.5" ry="4" fill="#1E293B" />
          <circle cx="29" cy="63" r="4.5" fill="#FDA4AF" opacity="0.7" />
          <circle cx="71" cy="63" r="4.5" fill="#FDA4AF" opacity="0.7" />
          <path
            d="M44 68 Q50 73 56 68"
            stroke="#1E293B"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case "orange":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <path
            d="M50 24 C56 12, 74 14, 70 26 C62 28, 54 26, 50 24 Z"
            fill="#22C55E"
            stroke="#15803D"
            strokeWidth="2.8"
          />
          <circle
            cx="50"
            cy="56"
            r="31"
            fill="#FB923C"
            stroke="#EA580C"
            strokeWidth="3.5"
          />
          <circle cx="34" cy="40" r="6" fill="#FED7AA" opacity="0.7" />
          <circle cx="40" cy="54" r="3.5" fill="#1E293B" />
          <circle cx="60" cy="54" r="3.5" fill="#1E293B" />
          <circle cx="41.2" cy="52.8" r="1.2" fill="#FFFFFF" />
          <circle cx="61.2" cy="52.8" r="1.2" fill="#FFFFFF" />
          <path
            d="M43 64 Q50 71 57 64"
            stroke="#1E293B"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case "butterfly":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <path
            d="M48 48 C30 16, 8 24, 16 48 C21 58, 36 55, 48 52 Z"
            fill="#A855F7"
            stroke="#7E22CE"
            strokeWidth="3"
          />
          <path
            d="M52 48 C70 16, 92 24, 84 48 C79 58, 64 55, 52 52 Z"
            fill="#A855F7"
            stroke="#7E22CE"
            strokeWidth="3"
          />
          <path
            d="M48 54 C30 56, 18 76, 32 84 C42 88, 48 70, 48 58 Z"
            fill="#EC4899"
            stroke="#BE185D"
            strokeWidth="3"
          />
          <path
            d="M52 54 C70 56, 82 76, 68 84 C58 88, 52 70, 52 58 Z"
            fill="#EC4899"
            stroke="#BE185D"
            strokeWidth="3"
          />
          <circle cx="29" cy="39" r="5" fill="#FDE047" />
          <circle cx="71" cy="39" r="5" fill="#FDE047" />
          <rect
            x="45"
            y="34"
            width="10"
            height="42"
            rx="5"
            fill="#334155"
          />
          <circle cx="50" cy="32" r="7" fill="#475569" />
          <path
            d="M46 26 Q40 15 35 17"
            stroke="#334155"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M54 26 Q60 15 65 17"
            stroke="#334155"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );
  }
}

interface FingerHandsProps {
  count: number;
}

export function FingerCountingHands({ count }: FingerHandsProps) {
  const leftFingers = Math.min(5, Math.max(0, count));
  const rightFingers = Math.max(0, Math.min(5, count - 5));

  const renderHand = (raised: number, isRight: boolean) => {
    const fingers = [
      { id: "pinky", x: 16, y: 26, h: 24 },
      { id: "ring", x: 27, y: 17, h: 31 },
      { id: "middle", x: 39, y: 13, h: 35 },
      { id: "index", x: 51, y: 18, h: 30 },
      { id: "thumb", x: 65, y: 38, h: 20, rotate: 28 },
    ];

    return (
      <svg
        viewBox="0 0 86 92"
        className={`w-16 h-16 sm:w-20 sm:h-20 ${isRight ? "scale-x-[-1]" : ""}`}
        aria-hidden="true"
      >
        {/* Fingers */}
        {fingers.map((f, idx) => {
          const isUp = idx < raised;
          if (isUp) {
            return (
              <rect
                key={f.id}
                x={f.x}
                y={f.y}
                width="10"
                height={f.h}
                rx="5"
                transform={f.rotate ? `rotate(${f.rotate} ${f.x + 5} ${f.y + 10})` : undefined}
                fill="#FDBA74"
                stroke="#C2410C"
                strokeWidth="2.4"
              />
            );
          }
          // Folded finger knuckle
          return (
            <rect
              key={f.id}
              x={f.x}
              y={44}
              width="10"
              height="12"
              rx="5"
              fill="#FED7AA"
              stroke="#C2410C"
              strokeWidth="2"
              opacity="0.7"
            />
          );
        })}
        {/* Palm */}
        <rect
          x="15"
          y="46"
          width="48"
          height="36"
          rx="16"
          fill="#FDBA74"
          stroke="#C2410C"
          strokeWidth="2.6"
        />
      </svg>
    );
  };

  return (
    <div
      className="flex items-center justify-center gap-1 bg-amber-50 border-2 border-amber-200 rounded-2xl px-3 py-1.5"
      aria-label={`${count} dedos levantados`}
    >
      {renderHand(leftFingers, false)}
      {count > 5 && renderHand(rightFingers, true)}
    </div>
  );
}
