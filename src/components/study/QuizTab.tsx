import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const BORDERS = [
  "border-max-magenta",
  "border-max-cyan",
  "border-max-yellow",
  "border-max-orange",
  "border-max-purple",
];

type Props = {
  quiz: QuizQuestion[];
  onSubmit: (score: number, total: number) => void;
};

export function QuizTab({ quiz, onSubmit }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (quiz.length === 0) {
    return <p className="text-center font-bold text-white/70">No quiz questions.</p>;
  }

  const score = quiz.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0);

  const submit = () => {
    setSubmitted(true);
    onSubmit(score, quiz.length);
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {quiz.map((q, i) => {
        const picked = answers[i];
        const borderColor = BORDERS[i % BORDERS.length];
        return (
          <div
            key={i}
            className={`relative overflow-hidden rounded-3xl border-4 ${borderColor} bg-max-surface/80 p-6 backdrop-blur-sm shadow-hard-2 ${
              i % 2 === 1 ? "md:translate-y-4" : ""
            }`}
          >
            <span className="pointer-events-none absolute inset-0 pattern-dots-cyan opacity-25" />
            <p className="relative mb-4 font-heading text-lg font-black uppercase tracking-tight text-white text-shadow-sm">
              <span className="text-max-yellow">{i + 1}.</span> {q.question}
            </p>
            <RadioGroup
              value={picked !== undefined ? String(picked) : undefined}
              onValueChange={(v) => !submitted && setAnswers((a) => ({ ...a, [i]: Number(v) }))}
              className="relative flex flex-col gap-2"
            >
              {q.options.map((opt, j) => {
                const isCorrect = submitted && j === q.correctIndex;
                const isWrongPick = submitted && picked === j && j !== q.correctIndex;
                return (
                  <div
                    key={j}
                    className={`flex items-center gap-3 rounded-full border-4 px-4 py-3 text-sm font-bold transition-all ${
                      isCorrect
                        ? "border-max-cyan bg-max-cyan/20 text-white glow-cyan"
                        : isWrongPick
                          ? "border-destructive bg-destructive/20 text-white"
                          : "border-max-purple/40 bg-max-surface/40 text-white hover:border-max-magenta"
                    }`}
                  >
                    <RadioGroupItem value={String(j)} id={`q${i}-${j}`} disabled={submitted} />
                    <Label htmlFor={`q${i}-${j}`} className="cursor-pointer text-base font-medium">
                      {opt}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-4">
        {!submitted ? (
          <Button onClick={submit} disabled={Object.keys(answers).length === 0}>
            Submit answers ⚡
          </Button>
        ) : (
          <>
            <p className="font-heading text-2xl font-black uppercase tracking-tight text-white text-shadow-pop">
              Score:{" "}
              <span className="text-max-yellow">
                {score} / {quiz.length}
              </span>
            </p>
            <Button variant="outline" onClick={reset}>
              Try again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
