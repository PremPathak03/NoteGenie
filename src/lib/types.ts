export type Flashcard = { q: string; a: string };

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type QuizAttempt = {
  at: number;
  score: number;
  total: number;
};

export type StudySession = {
  id: string;
  createdAt: number;
  title: string;
  summary: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  attempts: QuizAttempt[];
};

export type StudyMaterial = {
  summary: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
};

export type QuestionCount = 5 | 10 | 15 | 20;
