# NoteGenie

NoteGenie is a B.Tech Computer Science and Engineering project developed for the final presentation at JIS University. It is an AI-powered study assistant that turns raw notes into polished summaries, flashcards, and quizzes with a resilient fallback pipeline for model failures.

## Features
- AI study pack generation: summary, flashcards, and quiz from a single upload or paste.
- Bulletproof fallback: cascades across multiple AI models to keep generation reliable.
- Fast uploads: supports PDF and DOCX parsing directly in the browser.
- Study workspace: tabbed summary, flashcards, and quiz with scoring.
- Local history: revisit and continue past study sessions.

## Tech Stack
- Vite + React (SPA)
- TanStack Router + TanStack Query
- Tailwind CSS + Radix UI
- Supabase (client-side data and auth)
- Zod for validation

## Setup and Installation

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
Create a `.env` file in the project root with the following variables:
```bash
VITE_GEMINI_API_KEY=your_gemini_key
VITE_OPENAI_API_KEY=your_openai_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

### 3) Run locally
```bash
npm run dev
```

### 4) Production build
```bash
npm run build
npm run preview
```

## Architecture
- **UI layer**: React routes handle the upload flow, study workspace, and history pages.
- **AI pipeline**: `generateStudyMaterial` validates input, calls the primary model, and automatically falls back to secondary models on failure.
- **Parsing layer**: PDF/DOCX parsers extract text for AI generation.
- **State + storage**: study sessions are persisted locally for quick retrieval and history display.
- **Supabase client**: configured via Vite environment variables for browser-only usage.

## Presentation Context
This project is built as a client-only Vite SPA, optimized for a clean, production-ready demo for the JIS University B.Tech CSE presentation.
