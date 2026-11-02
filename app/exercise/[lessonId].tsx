import { useLocalSearchParams, router } from "expo-router";
import { useEffect } from "react";
import { ExerciseScreen } from "../../src/screens/ExerciseScreen";
import { lessons, useCourse } from "../../src/course/CourseContext";

export default function ExerciseRoute() {
  const { lessonId: routeLessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { isLessonUnlocked, selectedId, startLesson } = useCourse();
  const lesson = lessons.find((item) => item.id === routeLessonId);
  const lessonIndex = lessons.findIndex((item) => item.id === routeLessonId);
  const isUnlocked = lessonIndex >= 0 && isLessonUnlocked(lessonIndex);

  useEffect(() => {
    if (!lesson || !isUnlocked) {
      router.replace("/");
      return;
    }

    if (selectedId !== lesson.id) {
      startLesson(lesson.id);
    }
  }, [isUnlocked, lesson, selectedId, startLesson]);

  if (!lesson || !isUnlocked || selectedId !== lesson.id) return null;
  return <ExerciseScreen lesson={lesson} />;
}
