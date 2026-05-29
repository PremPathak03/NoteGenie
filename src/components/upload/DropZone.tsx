import { useRef, useState } from "react";
import { Upload } from "lucide-react";

type Props = {
  onFile: (file: File) => void;
  disabled?: boolean;
};

export function DropZone({ onFile, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
      onClick={() => inputRef.current?.click()}
      className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-4 border-dashed bg-max-surface/60 p-10 text-center transition-all duration-300 backdrop-blur-sm ${
        over
          ? "border-max-yellow scale-[1.02] glow-yellow"
          : "border-max-cyan hover:border-max-magenta hover:scale-[1.01] hover:glow-cyan"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <div className="pointer-events-none absolute inset-0 pattern-checker opacity-60" />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-max-yellow bg-max-magenta glow-magenta animate-pulse-glow">
        <Upload className="h-9 w-9 text-white" strokeWidth={3} />
      </div>
      <p className="relative mt-5 font-heading text-xl font-black uppercase tracking-wide text-white text-shadow-sm">
        Drop a .pdf, .docx, or .txt
      </p>
      <p className="relative mt-1 text-sm font-bold text-max-cyan">
        or click to pick a file from your device
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
