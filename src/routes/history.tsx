import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { Nav } from "@/components/Nav";
import { PageBackground } from "@/components/PageBackground";
import { FloatingShapes } from "@/components/FloatingShapes";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { deleteSession, getSessions, setActiveSessionId } from "@/lib/storage";
import type { StudySession } from "@/lib/types";

const BORDERS = [
  "border-max-magenta",
  "border-max-cyan",
  "border-max-yellow",
  "border-max-orange",
  "border-max-purple",
];

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "NoteGenie — Study history" },
      {
        name: "description",
        content: "Browse past study sessions and quiz scores.",
      },
    ],
  }),
  component: () => (
    <ClientOnly fallback={null}>
      <HistoryPage />
    </ClientOnly>
  ),
});

function bestScore(s: StudySession) {
  if (s.attempts.length === 0) return null;
  return s.attempts.reduce((best, a) => {
    const pct = (a.score / a.total) * 100;
    return pct > best ? pct : best;
  }, 0);
}

function HistoryPage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  if (sessions.length === 0) {
    return (
      <>
        <PageBackground />
        <Nav />
        <main className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <FloatingShapes />
          <h1 className="relative z-10 font-heading text-5xl font-black uppercase tracking-tight text-white text-shadow-mega">
            No history yet
          </h1>
          <p className="relative z-10 mt-4 text-lg font-medium text-white/80">
            Your past study sessions and quiz scores will appear here.
          </p>
          <div className="relative z-10 mt-8 inline-block">
            <Button asChild>
              <Link to="/">Create your first session 🚀</Link>
            </Button>
          </div>
        </main>
      </>
    );
  }

  const sorted = [...sessions].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <>
      <PageBackground />
      <Nav />
      <main className="relative mx-auto max-w-5xl px-6 py-12">
        <FloatingShapes />

        <header className="relative z-10 mb-12">
          <span className="inline-block rounded-full border-4 border-max-cyan bg-max-yellow px-4 py-1 font-heading text-xs font-black uppercase tracking-widest text-background shadow-hard-2">
            Archive
          </span>
          <h1 className="mt-3 font-heading text-5xl font-black uppercase tracking-tight text-white text-shadow-pop sm:text-6xl">
            Study <span className="text-gradient-rainbow">history</span>
          </h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-max-cyan">
            {sessions.length} session{sessions.length === 1 ? "" : "s"} stored on this device
          </p>
        </header>

        <ul className="relative z-10 grid gap-6 md:grid-cols-2">
          {sorted.map((s, i) => {
            const best = bestScore(s);
            const borderColor = BORDERS[i % BORDERS.length];
            return (
              <li
                key={s.id}
                className={`relative overflow-hidden rounded-3xl border-4 ${borderColor} bg-max-surface/80 p-6 backdrop-blur-sm shadow-hard-2 transition-all duration-300 hover:-rotate-1 hover:scale-[1.02] ${
                  i % 2 === 1 ? "md:translate-y-6" : ""
                }`}
              >
                <span className="pointer-events-none absolute inset-0 pattern-dots opacity-25" />
                <div className="relative flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-heading text-2xl font-black uppercase tracking-tight text-white text-shadow-sm">
                      {s.title}
                    </h2>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-max-cyan">
                      {new Date(s.createdAt).toLocaleDateString()} · {s.flashcards.length} cards ·{" "}
                      {s.quiz.length} Qs
                    </p>
                  </div>
                </div>

                <div className="relative mt-5">
                  {best === null ? (
                    <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                      No quiz attempts yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                          Best · {s.attempts.length} attempt
                          {s.attempts.length === 1 ? "" : "s"}
                        </span>
                        <span className="font-heading text-2xl font-black text-max-yellow text-shadow-sm">
                          {Math.round(best)}%
                        </span>
                      </div>
                      <Progress
                        value={best}
                        className="h-3 overflow-hidden rounded-full border-2 border-max-magenta bg-max-surface [&>div]:bg-max-cyan"
                      />
                      <div className="flex flex-wrap gap-1 pt-1">
                        {s.attempts.slice(-6).map((a, j) => (
                          <span
                            key={j}
                            className="rounded-full border-2 border-max-purple bg-max-surface/60 px-2 py-0.5 text-[10px] font-bold text-white/80"
                          >
                            {a.score}/{a.total}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative mt-6 flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <Link to="/study" onClick={() => setActiveSessionId(s.id)}>
                      Open
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      deleteSession(s.id);
                      setSessions(getSessions());
                    }}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
