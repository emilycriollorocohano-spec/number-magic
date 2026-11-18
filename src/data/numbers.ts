export type NumberThemeId =
  | "apple"
  | "puppy"
  | "banana"
  | "frog"
  | "strawberry"
  | "star"
  | "watermelon"
  | "panda"
  | "orange"
  | "butterfly";

export interface NumberItem {
  num: number;
  word: string;
  spoken: string;
  theme: NumberThemeId;
  itemSingular: string;
  itemPlural: string;
  gender: "f" | "m";
  noteFreq: number;
  cardBg: string;
  cardBorder: string;
  cardBottom: string;
  softBg: string;
  accentHex: string;
}

export const NUMBERS_DATA: NumberItem[] = [
  {
    num: 1,
    word: "¡Uno!",
    spoken: "Uno",
    theme: "apple",
    itemSingular: "manzana",
    itemPlural: "manzanas",
    gender: "f",
    noteFreq: 261.63,
    cardBg: "bg-[#FF5964]",
    cardBorder: "border-[#D93843]",
    cardBottom: "shadow-[0_6px_0_#C82D38]",
    softBg: "bg-[#FFF0F1]",
    accentHex: "#FF5964",
  },
  {
    num: 2,
    word: "¡Dos!",
    spoken: "Dos",
    theme: "puppy",
    itemSingular: "perrito",
    itemPlural: "perritos",
    gender: "m",
    noteFreq: 293.66,
    cardBg: "bg-[#FF8A3D]",
    cardBorder: "border-[#D9681F]",
    cardBottom: "shadow-[0_6px_0_#C95D16]",
    softBg: "bg-[#FFF4EC]",
    accentHex: "#FF8A3D",
  },
  {
    num: 3,
    word: "¡Tres!",
    spoken: "Tres",
    theme: "banana",
    itemSingular: "plátano",
    itemPlural: "plátanos",
    gender: "m",
    noteFreq: 329.63,
    cardBg: "bg-[#F4B400]",
    cardBorder: "border-[#C78D00]",
    cardBottom: "shadow-[0_6px_0_#B37D00]",
    softBg: "bg-[#FFFBEB]",
    accentHex: "#F4B400",
  },
  {
    num: 4,
    word: "¡Cuatro!",
    spoken: "Cuatro",
    theme: "frog",
    itemSingular: "ranita",
    itemPlural: "ranitas",
    gender: "f",
    noteFreq: 349.23,
    cardBg: "bg-[#22B573]",
    cardBorder: "border-[#168A56]",
    cardBottom: "shadow-[0_6px_0_#13794B]",
    softBg: "bg-[#ECFDF5]",
    accentHex: "#22B573",
  },
  {
    num: 5,
    word: "¡Cinco!",
    spoken: "Cinco",
    theme: "strawberry",
    itemSingular: "fresa",
    itemPlural: "fresas",
    gender: "f",
    noteFreq: 392.0,
    cardBg: "bg-[#EC4899]",
    cardBorder: "border-[#BE185D]",
    cardBottom: "shadow-[0_6px_0_#AE1453]",
    softBg: "bg-[#FDF2F8]",
    accentHex: "#EC4899",
  },
  {
    num: 6,
    word: "¡Seis!",
    spoken: "Seis",
    theme: "star",
    itemSingular: "estrella",
    itemPlural: "estrellas",
    gender: "f",
    noteFreq: 440.0,
    cardBg: "bg-[#0EA5E9]",
    cardBorder: "border-[#0284C7]",
    cardBottom: "shadow-[0_6px_0_#0369A1]",
    softBg: "bg-[#F0F9FF]",
    accentHex: "#0EA5E9",
  },
  {
    num: 7,
    word: "¡Siete!",
    spoken: "Siete",
    theme: "watermelon",
    itemSingular: "sandía",
    itemPlural: "sandías",
    gender: "f",
    noteFreq: 493.88,
    cardBg: "bg-[#14B8A6]",
    cardBorder: "border-[#0F766E]",
    cardBottom: "shadow-[0_6px_0_#115E59]",
    softBg: "bg-[#F0FDFA]",
    accentHex: "#14B8A6",
  },
  {
    num: 8,
    word: "¡Ocho!",
    spoken: "Ocho",
    theme: "panda",
    itemSingular: "panda",
    itemPlural: "pandas",
    gender: "m",
    noteFreq: 523.25,
    cardBg: "bg-[#6366F1]",
    cardBorder: "border-[#4338CA]",
    cardBottom: "shadow-[0_6px_0_#3730A3]",
    softBg: "bg-[#EEF2FF]",
    accentHex: "#6366F1",
  },
  {
    num: 9,
    word: "¡Nueve!",
    spoken: "Nueve",
    theme: "orange",
    itemSingular: "naranja",
    itemPlural: "naranjas",
    gender: "f",
    noteFreq: 587.33,
    cardBg: "bg-[#F97316]",
    cardBorder: "border-[#C2410C]",
    cardBottom: "shadow-[0_6px_0_#9A3412]",
    softBg: "bg-[#FFF7ED]",
    accentHex: "#F97316",
  },
  {
    num: 10,
    word: "¡Diez!",
    spoken: "Diez",
    theme: "butterfly",
    itemSingular: "mariposa",
    itemPlural: "mariposas",
    gender: "f",
    noteFreq: 659.25,
    cardBg: "bg-[#9333EA]",
    cardBorder: "border-[#6B21A8]",
    cardBottom: "shadow-[0_6px_0_#581C87]",
    softBg: "bg-[#FAF5FF]",
    accentHex: "#9333EA",
  },
];

export function formatQuantitySpoken(item: NumberItem): string {
  if (item.num === 1) {
    return item.gender === "f"
      ? `una ${item.itemSingular}`
      : `un ${item.itemSingular}`;
  }
  return `${item.spoken.toLowerCase()} ${item.itemPlural}`;
}

export function formatQuantityLabel(item: NumberItem): string {
  if (item.num === 1) {
    return item.gender === "f"
      ? `Una ${item.itemSingular}`
      : `Un ${item.itemSingular}`;
  }
  return `${item.num} ${item.itemPlural}`;
}

export function formatCountQuestion(item: NumberItem): string {
  const qWord = item.gender === "f" ? "¿Cuántas" : "¿Cuántos";
  return `${qWord} ${item.itemPlural} hay?`;
}

export const PRAISE_PHRASES = [
  "¡Muy bien!",
  "¡Excelente!",
  "¡Lo lograste!",
  "¡Fantástico!",
  "¡Bravo, qué genial!",
];

export type VoiceCharacter = "Kore" | "Zephyr" | "Puck";

export interface VoiceOption {
  id: VoiceCharacter;
  label: string;
  subtitle: string;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: "Kore", label: "Maestra Dulce", subtitle: "Cálida y tierna" },
  { id: "Zephyr", label: "Amiga Alegre", subtitle: "Suave y luminosa" },
  { id: "Puck", label: "Duende Juguetón", subtitle: "Divertido y vivo" },
];
