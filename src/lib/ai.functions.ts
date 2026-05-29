import { z } from "zod";

const inputSchema = z.object({
  text: z.string().min(20).max(60000),
  count: z.union([z.literal(5), z.literal(10), z.literal(15), z.literal(20)]),
});

const studyMaterialSchema = z.object({
  summary: z.string().min(1),
  flashcards: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).min(1),
  quiz: z
    .array(
      z.object({
        question: z.string().min(1),
        options: z.array(z.string().min(1)).min(2),
        correctIndex: z.number().int().min(0),
      }),
    )
    .min(1),
});

const SYSTEM_PROMPT = `You are NoteGenie, an expert study assistant. Given raw notes from a student, produce a study pack as STRICT JSON with this exact shape:

{
  "summary": string (3-6 concise paragraphs covering the key ideas),
  "flashcards": Array<{ "q": string, "a": string }>,
  "quiz": Array<{ "question": string, "options": string[] (exactly 4), "correctIndex": number (0-3) }>
}

Rules:
- Generate EXACTLY the requested number of flashcards AND quiz questions.
- Quiz questions must have 4 plausible options and one unambiguous correct answer (correctIndex 0-3).
- Base every fact on the provided notes; do not invent material that is not implied by the notes.
- Output ONLY the JSON object. No prose, no markdown, no code fences.`;

const GEMINI_PRIMARY_MODEL = "gemini-3.5-flash";
const OPENAI_SECONDARY_MODEL = "gpt-4o-mini";
const OPENAI_TERTIARY_MODEL = "gpt-4o";

type ModelProvider = "gemini" | "openai";
type ModelCandidate = {
  provider: ModelProvider;
  model: string;
  apiKey?: string;
};

type GenerateInput = z.infer<typeof inputSchema>;

async function fetchJsonWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = 25_000,
): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`AI request failed (${res.status}): ${body.slice(0, 200)}`);
    }
    return (await res.json()) as unknown;
  } finally {
    clearTimeout(timeout);
  }
}

async function callGemini(apiKey: string, model: string, userContent: string): Promise<unknown> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const data = (await fetchJsonWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: userContent }] }],
      generationConfig: { responseMimeType: "application/json" },
    }),
  })) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error("Empty Gemini response");
  return JSON.parse(content);
}

async function callOpenAI(apiKey: string, model: string, userContent: string): Promise<unknown> {
  const data = (await fetchJsonWithTimeout("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
    }),
  })) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty OpenAI response");
  return JSON.parse(content);
}

export async function generateStudyMaterial({ data }: { data: GenerateInput }) {
  const parsedInput = inputSchema.safeParse(data);
  if (!parsedInput.success) {
    throw new Error("Invalid input for study generation.");
  }

  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!geminiKey && !openaiKey) {
    throw new Error("VITE_GEMINI_API_KEY or VITE_OPENAI_API_KEY is not configured");
  }

  const userContent = `Generate EXACTLY ${parsedInput.data.count} flashcards and EXACTLY ${parsedInput.data.count} quiz questions.\n\nNotes:\n${parsedInput.data.text}`;

  const modelWaterfall: ModelCandidate[] = [
    { provider: "gemini", model: GEMINI_PRIMARY_MODEL, apiKey: geminiKey },
    {
      provider: "openai",
      model: OPENAI_SECONDARY_MODEL,
      apiKey: openaiKey,
    },
    {
      provider: "openai",
      model: OPENAI_TERTIARY_MODEL,
      apiKey: openaiKey,
    },
  ].filter((candidate) => Boolean(candidate.apiKey));

  let raw: unknown;
  let lastError: unknown;
  for (const candidate of modelWaterfall) {
    try {
      if (candidate.provider === "gemini") {
        raw = await callGemini(candidate.apiKey as string, candidate.model, userContent);
      } else {
        raw = await callOpenAI(candidate.apiKey as string, candidate.model, userContent);
      }
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!raw || lastError) {
    throw new Error("All AI models failed to generate study material. Please try again.");
  }

  const parsed = studyMaterialSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error("AI returned malformed study material. Please try again.");
  }
  // Clamp correctIndex within bounds.
  const quiz = parsed.data.quiz.map((q) => ({
    ...q,
    correctIndex: Math.min(q.correctIndex, q.options.length - 1),
  }));
  return { ...parsed.data, quiz };
}
