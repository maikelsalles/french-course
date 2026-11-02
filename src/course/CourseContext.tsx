import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type ConjugationForm = {
  subject: string;
  answer: string;
};

export type Lesson = {
  id: string;
  infinitive: string;
  translation: string;
  acceptedTranslations: string[];
  conjugations: ConjugationForm[];
  acceptedSentences: string[];
  sentenceHint: string;
};

export type QuizStep = "conjugation" | "sentence" | "complete";
export type Feedback = { message: string; tone: "success" | "error" } | null;

export const lessons: Lesson[] = [
  {
    id: "etre",
    infinitive: "Être",
    translation: "ser / estar",
    acceptedTranslations: ["ser / estar", "ser/estar", "ser, estar", "ser e estar", "ser", "estar"],
    conjugations: [
      { subject: "Je", answer: "suis" },
      { subject: "Tu", answer: "es" },
      { subject: "Il / Elle", answer: "est" },
      { subject: "Nous", answer: "sommes" },
      { subject: "Vous", answer: "êtes" },
      { subject: "Ils / Elles", answer: "sont" },
    ],
    acceptedSentences: ["Je suis français.", "Je suis française."],
    sentenceHint: "Escreva a frase completa: « Eu sou francês/francesa. »",
  },
  {
    id: "avoir",
    infinitive: "Avoir",
    translation: "ter",
    acceptedTranslations: ["ter"],
    conjugations: [
      { subject: "J'", answer: "ai" },
      { subject: "Tu", answer: "as" },
      { subject: "Il / Elle", answer: "a" },
      { subject: "Nous", answer: "avons" },
      { subject: "Vous", answer: "avez" },
      { subject: "Ils / Elles", answer: "ont" },
    ],
    acceptedSentences: ["J'ai un livre."],
    sentenceHint: "Escreva a frase completa: « Eu tenho um livro. »",
  },
  {
    id: "aller",
    infinitive: "Aller",
    translation: "ir",
    acceptedTranslations: ["ir"],
    conjugations: [
      { subject: "Je", answer: "vais" },
      { subject: "Tu", answer: "vas" },
      { subject: "Il / Elle", answer: "va" },
      { subject: "Nous", answer: "allons" },
      { subject: "Vous", answer: "allez" },
      { subject: "Ils / Elles", answer: "vont" },
    ],
    acceptedSentences: ["Je vais à Paris."],
    sentenceHint: "Escreva a frase completa: « Eu vou a Paris. »",
  },
];

const maxConjugationMistakes = 6;
const maxSentenceMistakes = 6;

function normalizeAnswer(value: string) {
  return value
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("fr-FR")
    .replace(/[’‘]/gu, "'")
    .replace(/[.!?]+$/u, "")
    .replace(/\s+/gu, " ");
}

const CourseContext = createContext<ReturnType<typeof useCourseState> | null>(null);

function useCourseState() {
  const [selectedId, setSelectedId] = useState(lessons[0].id);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [step, setStep] = useState<QuizStep>("conjugation");
  const [translationInput, setTranslationInput] = useState("");
  const [translationMistakes, setTranslationMistakes] = useState(0);
  const [conjugationInputs, setConjugationInputs] = useState<Record<string, string>>({});
  const [conjugationMistakes, setConjugationMistakes] = useState<Record<string, number>>({});
  const [showConjugationErrors, setShowConjugationErrors] = useState(false);
  const [sentenceInput, setSentenceInput] = useState("");
  const [sentenceMistakes, setSentenceMistakes] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedId) ?? lessons[0];
  const selectedIndex = lessons.findIndex((lesson) => lesson.id === selectedId);
  const nextLesson = lessons[selectedIndex + 1];
  const incorrectConjugations = selectedLesson.conjugations.filter(
    (form) =>
      normalizeAnswer(conjugationInputs[form.subject] ?? "") !== normalizeAnswer(form.answer),
  );
  const hasRevealedAnswers =
    selectedLesson.conjugations.some(
      (form) => (conjugationMistakes[form.subject] ?? 0) >= maxConjugationMistakes,
    ) || translationMistakes >= maxConjugationMistakes;
  const hasRevealedSentenceAnswer = sentenceMistakes >= maxSentenceMistakes;
  const isTranslationCorrect = selectedLesson.acceptedTranslations.some(
    (translation) => normalizeAnswer(translationInput) === normalizeAnswer(translation),
  );
  const correctAnswers =
    selectedLesson.conjugations.length -
    incorrectConjugations.length +
    Number(isTranslationCorrect);

  function startLesson(id: string) {
    setSelectedId(id);
    setStep("conjugation");
    setTranslationInput("");
    setTranslationMistakes(0);
    setConjugationInputs({});
    setConjugationMistakes({});
    setShowConjugationErrors(false);
    setSentenceInput("");
    setSentenceMistakes(0);
    setFeedback(null);
  }

  function handleSubmit() {
    if (step === "conjugation") {
      const hasIncompleteAnswer =
        !translationInput.trim() ||
        selectedLesson.conjugations.some(
          (form) => !(conjugationInputs[form.subject] ?? "").trim(),
        );
      if (hasIncompleteAnswer) {
        setFeedback({
          message: "Preencha a tradução e todas as conjugações antes de continuar.",
          tone: "error",
        });
        return;
      }

      setShowConjugationErrors(true);
      if (incorrectConjugations.length > 0 || !isTranslationCorrect) {
        setConjugationMistakes((current) => {
          const next = { ...current };
          for (const form of incorrectConjugations) {
            next[form.subject] = Math.min(
              (current[form.subject] ?? 0) + 1,
              maxConjugationMistakes,
            );
          }
          return next;
        });
        if (!isTranslationCorrect) {
          setTranslationMistakes((current) => Math.min(current + 1, maxConjugationMistakes));
        }
        setFeedback(null);
        return;
      }

      setStep("sentence");
      setShowConjugationErrors(false);
      setFeedback({
        message: "Muito bem! Você conjugou o verbo inteiro. Agora forme uma frase.",
        tone: "success",
      });
      return;
    }

    if (step === "sentence") {
      const isAcceptedSentence = selectedLesson.acceptedSentences.some(
        (sentence) => normalizeAnswer(sentenceInput) === normalizeAnswer(sentence),
      );
      if (!isAcceptedSentence) {
        const nextMistakeCount = Math.min(sentenceMistakes + 1, maxSentenceMistakes);
        setSentenceMistakes(nextMistakeCount);
        setFeedback({
          message:
            nextMistakeCount >= maxSentenceMistakes
              ? "Você atingiu o limite de tentativas. Confira a resposta correta."
              : `Frase incorreta. Tentativa ${nextMistakeCount}/${maxSentenceMistakes}.`,
          tone: "error",
        });
        return;
      }

      setCompletedIds((current) =>
        current.includes(selectedLesson.id) ? current : [...current, selectedLesson.id],
      );
      setStep("complete");
      setSentenceMistakes(0);
      setFeedback({
        message: nextLesson
          ? `Parabéns! ${nextLesson.infinitive} foi desbloqueado.`
          : "Parabéns! Você concluiu todos os verbos.",
        tone: "success",
      });
    }
  }

  function retryConjugations() {
    setTranslationInput("");
    setTranslationMistakes(0);
    setConjugationInputs({});
    setConjugationMistakes({});
    setShowConjugationErrors(false);
    setFeedback(null);
  }

  function retrySentence() {
    setSentenceInput("");
    setSentenceMistakes(0);
    setFeedback(null);
  }

  function getProgress(lesson: Lesson) {
    if (completedIds.includes(lesson.id)) return 100;
    if (lesson.id === selectedId) {
      if (step === "sentence") return 50;
      return Math.round((correctAnswers / (selectedLesson.conjugations.length + 1)) * 50);
    }
    return 0;
  }

  function isLessonUnlocked(index: number) {
    return index === 0 || completedIds.includes(lessons[index - 1].id);
  }

  return {
    completedIds,
    conjugationInputs,
    conjugationMistakes,
    feedback,
    getProgress,
    handleSubmit,
    hasRevealedAnswers,
    hasRevealedSentenceAnswer,
    incorrectConjugations,
    isLessonUnlocked,
    isTranslationCorrect,
    nextLesson,
    retryConjugations,
    retrySentence,
    selectedId,
    selectedLesson,
    sentenceInput,
    sentenceMistakes,
    setConjugationInputs,
    setSentenceInput,
    setTranslationInput,
    showConjugationErrors,
    startLesson,
    step,
    translationInput,
    translationMistakes,
  };
}

export function CourseProvider({ children }: { children: ReactNode }) {
  const course = useCourseState();
  return <CourseContext.Provider value={course}>{children}</CourseContext.Provider>;
}

export function useCourse() {
  const course = useContext(CourseContext);
  if (!course) {
    throw new Error("useCourse must be used within a CourseProvider.");
  }
  return course;
}
