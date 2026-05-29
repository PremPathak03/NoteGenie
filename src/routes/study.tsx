import { ClientOnly, createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Nav } from "@/components/Nav";
import { PageBackground } from "@/components/PageBackground";
import { FloatingShapes } from "@/components/FloatingShapes";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlashcardsTab } from "@/components/study/FlashcardsTab";
import { QuizTab } from "@/components/study/QuizTab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getActiveSessionId,
  getSession,
  getSessions,
  recordAttempt,
  setActiveSessionId,
} from "@/lib/storage";
import type { StudySession } from "@/lib/types";

export const Route = createFileRoute("/study")({
  head: () => ({
    meta: [
      { title: "NoteGenie — Study workspace" },
      {
        name: "description",
        content: "Review your AI-generated summary, flashcards, and quiz.",
      },
    ],
  }),
  component: () => (
    <ClientOnly fallback={null}>
      <StudyPage />
    </ClientOnly>
  ),
});

function StudyPage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const all = getSessions();
    setSessions(all);
    setActiveId(getActiveSessionId() ?? all[0]?.id ?? null);
  }, []);

  const session = activeId
    ? (sessions.find((s) => s.id === activeId) ?? getSession(activeId))
    : undefined;

  if (sessions.length === 0) {
    return (
      <>
        <PageBackground />
        <Nav />
        <main className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <FloatingShapes />
          <h1 className="relative z-10 font-heading text-5xl font-black uppercase tracking-tight text-white text-shadow-mega">
            No sessions yet
          </h1>
          <p className="relative z-10 mt-4 text-lg font-medium text-white/80">
            Upload your notes to create your first study pack.
          </p>
          <div className="relative z-10 mt-8 inline-block">
            <Button asChild>
              <Link to="/">Go to upload ✨</Link>
            </Button>
          </div>
        </main>
      </>
    );
  }

  if (!session) return null;

  const handleQuizSubmit = (score: number, total: number) => {
    recordAttempt(session.id, { at: Date.now(), score, total });
    setSessions(getSessions());
  };

  return (
    <>
      <PageBackground />
      <Nav />
      <main className="relative mx-auto max-w-5xl px-6 py-12">
        <FloatingShapes />

        <div className="relative z-10 mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-block rounded-full border-4 border-max-yellow bg-max-magenta px-4 py-1 font-heading text-xs font-black uppercase tracking-widest text-white shadow-hard-2">
              Study pack
            </span>
            <h1 className="mt-3 font-heading text-5xl font-black uppercase tracking-tight text-white text-shadow-pop sm:text-6xl">
              {session.title}
            </h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-max-cyan">
              Created {new Date(session.createdAt).toLocaleString()}
            </p>
          </div>
          <Select
            value={session.id}
            onValueChange={(v) => {
              setActiveSessionId(v);
              setActiveId(v);
            }}
          >
            <SelectTrigger className="h-12 w-72 rounded-full border-4 border-max-cyan bg-max-surface/80 px-5 font-heading font-black uppercase tracking-widest text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-4 border-max-magenta bg-max-surface text-white">
              {sessions.map((s) => (
                <SelectItem
                  key={s.id}
                  value={s.id}
                  className="font-bold focus:bg-max-magenta focus:text-white"
                >
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="summary" className="relative z-10">
          <TabsList className="flex h-auto flex-wrap gap-2 rounded-full border-4 border-max-yellow bg-max-surface/70 p-2 backdrop-blur-sm">
            {[
              { v: "summary", label: "Summary" },
              { v: "flashcards", label: `Flashcards (${session.flashcards.length})` },
              { v: "quiz", label: `Quiz (${session.quiz.length})` },
            ].map((t) => (
              <TabsTrigger
                key={t.v}
                value={t.v}
                className="rounded-full px-5 py-2 font-heading text-xs font-black uppercase tracking-widest text-white transition-all data-[state=active]:bg-max-magenta data-[state=active]:text-white data-[state=active]:glow-magenta sm:text-sm"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="summary" className="mt-8">
            <article className="relative overflow-hidden whitespace-pre-wrap rounded-3xl border-4 border-max-cyan bg-max-surface/80 p-8 text-base leading-relaxed text-white/90 backdrop-blur-sm shadow-hard-2">
              <span className="pointer-events-none absolute inset-0 pattern-stripes opacity-30" />
              <span className="relative">{session.summary}</span>
            </article>
          </TabsContent>
          <TabsContent value="flashcards" className="mt-8">
            <FlashcardsTab cards={session.flashcards} />
          </TabsContent>
          <TabsContent value="quiz" className="mt-8">
            <QuizTab quiz={session.quiz} onSubmit={handleQuizSubmit} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
