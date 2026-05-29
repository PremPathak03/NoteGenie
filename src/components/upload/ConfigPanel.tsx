import type { QuestionCount } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  count: QuestionCount;
  onChange: (count: QuestionCount) => void;
};

export function ConfigPanel({ count, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border-4 border-dashed border-max-orange bg-max-surface/40 p-4 backdrop-blur-sm">
      <label className="font-heading text-sm font-black uppercase tracking-widest text-max-yellow">
        Items to generate
      </label>
      <Select value={String(count)} onValueChange={(v) => onChange(Number(v) as QuestionCount)}>
        <SelectTrigger className="h-12 w-32 rounded-full border-4 border-max-magenta bg-max-surface/80 px-5 font-heading font-black uppercase tracking-widest text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-4 border-max-cyan bg-max-surface text-white">
          {[5, 10, 15, 20].map((n) => (
            <SelectItem
              key={n}
              value={String(n)}
              className="font-bold focus:bg-max-magenta focus:text-white"
            >
              {n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs font-bold uppercase tracking-widest text-max-cyan">
        Flashcards · Quiz Qs
      </p>
    </div>
  );
}
