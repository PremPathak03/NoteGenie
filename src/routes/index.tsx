import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";

import { Nav } from "@/components/Nav";
import { PageBackground } from "@/components/PageBackground";
import { FloatingShapes, BackgroundWord } from "@/components/FloatingShapes";
import { DropZone } from "@/components/upload/DropZone";
import { ConfigPanel } from "@/components/upload/ConfigPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { parseFile } from "@/lib/parsers";
import { generateStudyMaterial } from "@/lib/ai.functions";
import { saveSession, setActiveSessionId } from "@/lib/storage";
import type { QuestionCount, StudySession } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NoteGenie — Upload notes" },
      {
        name: "description",
        content:
          "Drop a PDF or DOCX of your notes and instantly generate a summary, flashcards, and a quiz.",
      },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [count, setCount] = useState<QuestionCount>(5);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large (max 10 MB).");
      return;
    }
    setBusy(true);
    setStatus(`Parsing ${file.name}…`);
    try {
      const extracted = await parseFile(file);
      if (!extracted || extracted.length < 20) {
        toast.error("Could not extract enough text from that file.");
      } else {
        setText(extracted);
        if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
        toast.success(`Extracted ${extracted.length.toLocaleString()} characters.`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to parse file.");
    } finally {
      setBusy(false);
      setStatus(null);
    }
  };

  const handleGenerate = async () => {
    if (text.trim().length < 20) {
      toast.error("Add more notes first (at least 20 characters).");
      return;
    }
    setBusy(true);
    setStatus("Generating study material…");
    try {
      const result = await generateStudyMaterial({
        data: { text: text.trim(), count },
      });
      const session: StudySession = {
        id: nanoid(),
        createdAt: Date.now(),
        title: title.trim() || `Session ${new Date().toLocaleString()}`,
        summary: result.summary,
        flashcards: result.flashcards,
        quiz: result.quiz,
        attempts: [],
      };
      saveSession(session);
      setActiveSessionId(session.id);
      toast.success("Study pack ready!");
      navigate({ to: "/study" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed. Please try again.");
    } finally {
      setBusy(false);
      setStatus(null);
    }
  };

  return (
    <>
      <PageBackground />
      <Nav />
      <Toaster />
      <main className="relative mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <FloatingShapes />
        <BackgroundWord>WOW</BackgroundWord>

        {/* HERO */}
        <section className="relative z-10 text-center">
          <span className="inline-block rounded-full border-4 border-max-cyan bg-max-surface/70 px-5 py-2 font-heading text-xs font-black uppercase tracking-[0.3em] text-max-cyan backdrop-blur-sm animate-bounce-subtle">
            ✨ AI study sidekick
          </span>
          <h1 className="mt-6 font-heading text-6xl font-black uppercase leading-none tracking-tighter text-white sm:text-7xl md:text-8xl">
            <span className="text-shadow-mega">Turn notes</span>
            <br />
            <span className="text-gradient-rainbow">into a study pack</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-white/80">
            Drop a file or paste text. NoteGenie spits out a summary, flashcards, and a quiz — fast,
            loud, and ready to study.
          </p>
        </section>

        {/* WORK SURFACE */}
        <section className="relative z-10 mt-16 space-y-8">
          <DropZone onFile={handleFile} disabled={busy} />

          <div className="relative">
            <label
              htmlFor="notes"
              className="absolute -top-4 left-6 z-10 inline-block rotate-[-2deg] rounded-full border-4 border-max-yellow bg-max-magenta px-4 py-1 font-heading text-xs font-black uppercase tracking-widest text-white shadow-hard-2"
            >
              Or paste notes
            </label>
            <Textarea
              id="notes"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw text from your notes here…"
              className="min-h-56"
              disabled={busy}
            />
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-max-cyan">
              {text.length.toLocaleString()} characters
            </p>
          </div>

          <div className="relative">
            <label
              htmlFor="title"
              className="absolute -top-4 left-6 z-10 inline-block rotate-[1deg] rounded-full border-4 border-max-cyan bg-max-purple px-4 py-1 font-heading text-xs font-black uppercase tracking-widest text-white shadow-hard-2"
            >
              Session title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Biology — Chapter 4"
              disabled={busy}
            />
          </div>

          <ConfigPanel count={count} onChange={setCount} />

          <div className="flex flex-wrap items-center gap-5 pt-4">
            <Button size="lg" onClick={handleGenerate} disabled={busy}>
              {busy ? "Working…" : "Generate study pack 🚀"}
            </Button>
            {status && (
              <span className="font-heading text-sm font-black uppercase tracking-widest text-max-yellow animate-pulse">
                {status}
              </span>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
