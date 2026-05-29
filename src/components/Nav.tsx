import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

const items = [
  { to: "/", label: "Upload" },
  { to: "/study", label: "Study" },
  { to: "/history", label: "History" },
] as const;

export function Nav() {
  return (
    <header className="relative z-30 border-b-8 border-max-yellow bg-max-surface/70 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 pattern-stripes opacity-50" />
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          to="/"
          className="group flex items-center gap-2 font-heading text-2xl font-black uppercase tracking-tight text-white text-shadow-pop"
        >
          <Sparkles
            className="h-8 w-8 text-max-yellow animate-wiggle"
            strokeWidth={2.8}
            fill="currentColor"
          />
          <span className="text-gradient-rainbow">NoteGenie</span>
        </Link>
        <ul className="flex items-center gap-2 sm:gap-4">
          {items.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-full border-4 border-max-magenta px-4 py-2 font-heading text-xs font-black uppercase tracking-widest text-white transition-all duration-200 hover:scale-110 hover:bg-max-magenta hover:text-white hover:border-max-cyan sm:text-sm sm:px-5"
                activeProps={{
                  className: "bg-max-yellow text-background border-max-cyan glow-yellow",
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
