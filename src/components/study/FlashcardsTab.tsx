import { useState } from "react";
import type { Flashcard } from "@/lib/types";
import { Button } from "@/components/ui/button";

const ACCENT_BORDERS = [
  "border-max-magenta",
  "border-max-cyan",
  "border-max-yellow",
  "border-max-orange",
  "border-max-purple",
];

export function FlashcardsTab({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) {
    return <p className="text-center font-bold text-white/70">No flashcards.</p>;
  }

  const card = cards[index];
  const borderColor = ACCENT_BORDERS[index % ACCENT_BORDERS.length];
  const go = (delta: number) => {
    setFlipped(false);
    setIndex((i) => (i + delta + cards.length) % cards.length);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={() => setFlipped((f) => !f)}
        className={`relative flex min-h-56 w-full max-w-2xl items-center justify-center overflow-hidden rounded-3xl border-4 ${borderColor} bg-max-surface/80 p-10 text-center text-xl font-bold text-white backdrop-blur-sm shadow-hard-2 transition-all duration-300 hover:scale-[1.02] hover:-rotate-1`}
      >
        <span className="pointer-events-none absolute inset-0 pattern-dots opacity-30" />
        <span className="absolute left-4 top-3 font-heading text-xs font-black uppercase tracking-widest text-max-yellow">
          {flipped ? "Answer" : "Question"}
        </span>
        <span className="relative max-w-prose text-shadow-sm">{flipped ? card.a : card.q}</span>
      </button>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => go(-1)}>
          ← Prev
        </Button>
        <span className="font-heading text-sm font-black uppercase tracking-widest text-max-cyan">
          {index + 1} / {cards.length}
        </span>
        <Button variant="outline" size="sm" onClick={() => go(1)}>
          Next →
        </Button>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-white/50">
        Tap the card to flip ✨
      </p>
    </div>
  );
}
