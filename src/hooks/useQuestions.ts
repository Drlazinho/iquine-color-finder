import { useCallback, useEffect, useState } from "react";
import { QuizQuestion, QUESTIONS_STORAGE_KEY } from "@/types";
import { uid } from "@/hooks/useFlows";

const isBrowser = typeof window !== "undefined";

function readAll(): QuizQuestion[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QuizQuestion[];
  } catch {
    return [];
  }
}

function writeAll(questions: QuizQuestion[]) {
  if (!isBrowser) return;
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
}

export function useQuestions() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setQuestions(readAll());
    setReady(true);
  }, []);

  const refresh = useCallback(() => setQuestions(readAll()), []);

  const saveQuestion = useCallback((question: QuizQuestion) => {
    let all = readAll();
    const idx = all.findIndex((q) => q.id === question.id);
    if (idx >= 0) all[idx] = question;
    else all.push(question);
    writeAll(all);
    setQuestions(all);
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    const all = readAll().filter((q) => q.id !== id);
    writeAll(all);
    setQuestions(all);
  }, []);

  const getQuestion = useCallback((id: string): QuizQuestion | undefined => {
    return readAll().find((q) => q.id === id);
  }, []);

  return { questions, ready, refresh, saveQuestion, deleteQuestion, getQuestion };
}
