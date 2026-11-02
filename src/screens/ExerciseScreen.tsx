import { router } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { lessons, useCourse } from "../course/CourseContext";
import type { Lesson } from "../course/CourseContext";
import { theme } from "../tokens/theme";

type ExerciseScreenProps = {
  lesson: Lesson;
};

const maxMistakes = 6;

export function ExerciseScreen({ lesson }: ExerciseScreenProps) {
  const { width, height } = useWindowDimensions();
  const compactLayout = width < 760 || height < 620;
  const {
    conjugationInputs,
    conjugationMistakes,
    completedIds,
    feedback,
    handleSubmit,
    hasRevealedAnswers,
    hasRevealedSentenceAnswer,
    incorrectConjugations,
    isTranslationCorrect,
    nextLesson,
    retryConjugations,
    retrySentence,
    selectedId,
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
  } = useCourse();

  if (selectedId !== lesson.id) return null;

  function continueToLesson(next: Lesson) {
    startLesson(next.id);
    router.replace(`/exercise/${next.id}`);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.exerciseContent,
          compactLayout && styles.compactExerciseContent,
        ]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar exercício e voltar à trilha"
          onPress={() => router.replace("/")}
          style={styles.exitExerciseButton}
        >
          <Text style={styles.exitExerciseLabel}>×</Text>
        </Pressable>

        <View style={styles.pageHeading}>
          <Text style={[styles.pageTitle, compactLayout && styles.compactPageTitle]}>
            Primeiras conversas.
          </Text>
        </View>

        <View style={styles.verbTabs}>
          {lessons.map((item, index) => {
            const isUnlocked = index === 0 || completedIds.includes(lessons[index - 1].id);
            const isSelected = item.id === lesson.id;

            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityState={{ disabled: !isUnlocked, selected: isSelected }}
                disabled={!isUnlocked}
                onPress={() => continueToLesson(item)}
                style={({ pressed }) => [
                  styles.verbTab,
                  compactLayout && styles.compactVerbTab,
                  isSelected && styles.selectedVerbTab,
                  !isUnlocked && styles.lockedVerbTab,
                  pressed && isUnlocked && styles.pressedVerbTab,
                ]}
              >
                <Text
                  style={[
                    styles.verbTabText,
                    isSelected && styles.selectedVerbTabText,
                    !isUnlocked && styles.lockedVerbTabText,
                  ]}
                >
                  {item.infinitive}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Card style={[styles.lessonPanel, compactLayout && styles.compactLessonPanel]}>
          <View style={styles.lessonPanelHeader}>
            <Text style={[styles.lessonPanelTitle, compactLayout && styles.compactPanelTitle]}>
              {lesson.infinitive}
            </Text>
            <TextInput
              accessibilityLabel={`Tradução de ${lesson.infinitive}`}
              autoCapitalize="sentences"
              autoCorrect={false}
              onChangeText={setTranslationInput}
              onSubmitEditing={handleSubmit}
              placeholder="tradução em português"
              placeholderTextColor={theme.colors.textMuted}
              returnKeyType="done"
              style={[
                styles.translationInput,
                compactLayout && styles.compactTranslationInput,
                showConjugationErrors && !isTranslationCorrect && styles.incorrectTranslationInput,
              ]}
              value={translationInput}
            />
            {translationMistakes >= maxMistakes && (
              <Text style={styles.revealedAnswer}>
                Tradução correta: {lesson.acceptedTranslations[0]}
              </Text>
            )}
            <Text style={styles.tenseBadge}>Présent</Text>
          </View>

          {step === "conjugation" ? (
            <View style={styles.exerciseFields}>
              <View
                style={[styles.conjugationGrid, compactLayout && styles.compactConjugationGrid]}
              >
                {lesson.conjugations.map((form) => {
                  const isIncorrect =
                    showConjugationErrors &&
                    incorrectConjugations.some((item) => item.subject === form.subject);
                  const hasRevealedAnswer =
                    (conjugationMistakes[form.subject] ?? 0) >= maxMistakes;
                  const subjectPlaceholder =
                    form.subject === "J'"
                      ? "je"
                      : form.subject === "Il / Elle"
                        ? "il / elle"
                        : form.subject.toLocaleLowerCase("fr-FR");

                  return (
                    <View
                      key={form.subject}
                      style={[
                        styles.conjugationField,
                        compactLayout && styles.compactConjugationField,
                      ]}
                    >
                      <TextInput
                        accessibilityLabel={`${form.subject}, conjugação de ${lesson.infinitive}`}
                        accessibilityHint={
                          hasRevealedAnswer
                            ? `Resposta correta: ${form.answer}`
                            : isIncorrect
                              ? "Conjugação incorreta. Confira a resposta."
                              : undefined
                        }
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={(value) =>
                          setConjugationInputs((current) => ({
                            ...current,
                            [form.subject]: value,
                          }))
                        }
                        onSubmitEditing={handleSubmit}
                        placeholder={subjectPlaceholder}
                        placeholderTextColor={theme.colors.textMuted}
                        returnKeyType="next"
                        style={[
                          styles.input,
                          compactLayout && styles.compactInput,
                          isIncorrect && styles.incorrectInput,
                        ]}
                        value={conjugationInputs[form.subject] ?? ""}
                      />
                      {hasRevealedAnswer && (
                        <Text style={styles.revealedAnswer}>{form.answer}</Text>
                      )}
                    </View>
                  );
                })}
              </View>

              {showConjugationErrors && incorrectConjugations.length > 0 && (
                <Text accessibilityLiveRegion="polite" style={styles.errorFeedback}>
                  Confira: {incorrectConjugations.map((form) => form.subject).join(", ")}.
                </Text>
              )}
              {showConjugationErrors && !isTranslationCorrect && (
                <Text accessibilityLiveRegion="polite" style={styles.errorFeedback}>
                  Confira a tradução do verbo.
                </Text>
              )}
              {hasRevealedAnswers && (
                <Text accessibilityLiveRegion="polite" style={styles.errorFeedback}>
                  Resposta revelada após {maxMistakes} tentativas.
                </Text>
              )}
            </View>
          ) : step === "sentence" ? (
            <View style={styles.sentenceField}>
              <Text style={styles.fieldLabel}>Forme uma frase simples</Text>
              <Text style={styles.fieldHint}>Pressione Enter para conferir sua frase.</Text>
              <TextInput
                accessibilityLabel={`Frase com o verbo ${lesson.infinitive}`}
                autoCapitalize="sentences"
                autoCorrect={false}
                onChangeText={setSentenceInput}
                onSubmitEditing={handleSubmit}
                placeholder={lesson.sentenceHint}
                placeholderTextColor={theme.colors.textMuted}
                returnKeyType="done"
                style={[styles.input, styles.translationInput]}
                value={sentenceInput}
              />
              <Text style={styles.fieldHint}>{lesson.sentenceHint}</Text>
              {hasRevealedSentenceAnswer && (
                <Text accessibilityLiveRegion="polite" style={styles.revealedAnswer}>
                  Resposta correta: {lesson.acceptedSentences[0]}
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.completionMessage}>
              <Text style={styles.successFeedback}>{feedback?.message}</Text>
            </View>
          )}

          <View style={styles.lessonPanelFooter}>
            {feedback && step !== "complete" && (
              <Text
                accessibilityLiveRegion="polite"
                style={[
                  styles.feedback,
                  feedback.tone === "success" ? styles.successFeedback : styles.errorFeedback,
                ]}
              >
                {feedback.message}
              </Text>
            )}
            {step === "conjugation" && hasRevealedAnswers ? (
              <Button onPress={retryConjugations} title="Tentar novamente" />
            ) : step === "sentence" && hasRevealedSentenceAnswer ? (
              <Button onPress={retrySentence} title="Tentar novamente" />
            ) : step !== "complete" ? null : nextLesson ? (
              <Button
                onPress={() => continueToLesson(nextLesson)}
                title={`Continuar: ${nextLesson.infinitive} →`}
              />
            ) : (
              <Button
                onPress={() => continueToLesson(lesson)}
                title="Praticar novamente"
                variant="secondary"
              />
            )}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  exerciseContent: {
    flexGrow: 1,
    alignItems: "stretch",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  compactExerciseContent: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  exitExerciseButton: {
    alignSelf: "flex-end",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radii.pill,
    borderColor: theme.colors.border,
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
  },
  exitExerciseLabel: {
    color: theme.colors.text,
    fontSize: 26,
    lineHeight: 30,
  },
  pageHeading: {
    alignItems: "center",
  },
  pageTitle: {
    color: theme.colors.text,
    fontFamily: "Georgia",
    fontSize: 30,
    textAlign: "center",
  },
  compactPageTitle: {
    fontSize: 19,
  },
  verbTabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    justifyContent: "center",
  },
  verbTab: {
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.surface,
  },
  compactVerbTab: {
    minHeight: 32,
    paddingHorizontal: theme.spacing.sm,
  },
  selectedVerbTab: {
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.text,
  },
  lockedVerbTab: {
    opacity: 0.5,
  },
  pressedVerbTab: {
    opacity: 0.75,
  },
  verbTabText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  selectedVerbTabText: {
    color: theme.colors.background,
  },
  lockedVerbTabText: {
    color: theme.colors.textMuted,
  },
  lessonPanel: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    flexGrow: 1,
    flexShrink: 0,
    minHeight: 350,
    justifyContent: "flex-start",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surface,
    shadowOpacity: 0,
    elevation: 0,
  },
  compactLessonPanel: {
    minHeight: 430,
    gap: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  lessonPanelHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  lessonPanelTitle: {
    color: theme.colors.text,
    fontFamily: "Georgia",
    fontSize: 30,
    flexShrink: 0,
  },
  compactPanelTitle: {
    fontSize: 23,
  },
  tenseBadge: {
    marginLeft: "auto",
    overflow: "hidden",
    borderRadius: theme.radii.sm,
    backgroundColor: "#304B36",
    color: "#E8F0E7",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  exerciseFields: {
    gap: theme.spacing.md,
  },
  fieldLabel: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  input: {
    minHeight: 42,
    minWidth: 0,
    paddingHorizontal: theme.spacing.sm,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    backgroundColor: "transparent",
    color: theme.colors.text,
    fontSize: 16,
  },
  translationInput: {
    minHeight: 42,
    minWidth: 80,
    width: 180,
    flexShrink: 1,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    color: theme.colors.textMuted,
    fontSize: 13,
    paddingHorizontal: theme.spacing.xs,
  },
  compactTranslationInput: {
    minWidth: 0,
    flex: 1,
    fontSize: 11,
    paddingHorizontal: 2,
  },
  incorrectTranslationInput: {
    borderBottomColor: theme.colors.danger,
    borderBottomWidth: 2,
  },
  compactInput: {
    minHeight: 36,
    fontSize: 13,
    paddingHorizontal: theme.spacing.sm,
  },
  conjugationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: theme.spacing.sm,
  },
  compactConjugationGrid: {
    flexDirection: "column",
    flexWrap: "nowrap",
    rowGap: theme.spacing.sm,
  },
  conjugationField: {
    width: "48%",
    minHeight: 48,
    justifyContent: "center",
  },
  compactConjugationField: {
    width: "100%",
    minHeight: 40,
  },
  incorrectInput: {
    borderBottomColor: theme.colors.danger,
    borderBottomWidth: 2,
  },
  revealedAnswer: {
    color: "#B7D2B7",
    fontSize: 11,
    fontWeight: "700",
  },
  errorFeedback: {
    color: theme.colors.danger,
    fontSize: 12,
  },
  successFeedback: {
    color: "#B7D2B7",
  },
  sentenceField: {
    gap: theme.spacing.sm,
  },
  fieldHint: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  completionMessage: {
    paddingVertical: theme.spacing.xl,
  },
  lessonPanelFooter: {
    alignItems: "flex-end",
    gap: theme.spacing.sm,
    marginTop: "auto",
  },
  feedback: {
    alignSelf: "stretch",
    fontSize: 13,
    fontWeight: "600",
  },
});
