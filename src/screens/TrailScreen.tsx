import { router } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { lessons, useCourse } from "../course/CourseContext";
import { theme } from "../tokens/theme";

export function TrailScreen() {
  const { width } = useWindowDimensions();
  const compactLayout = width < 600;
  const { completedIds, getProgress, isLessonUnlocked, startLesson } = useCourse();

  function openLesson(id: string) {
    startLesson(id);
    router.push(`/exercise/${id}`);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.content, compactLayout && styles.compactContent]}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>
              parcours<Text style={styles.brandDot}>.</Text>
            </Text>
            <Text style={styles.levelBadge}>A1</Text>
          </View>

          <View style={styles.heading}>
            <Text style={styles.eyebrow}>SUA TRILHA</Text>
            <Text style={[styles.title, compactLayout && styles.compactTitle]}>
              Primeiras conversas.
            </Text>
          </View>

          <View style={styles.packageCard}>
            <View style={styles.packageHeading}>
              <View style={styles.packageCopy}>
                <Text style={styles.packageTitle}>O essencial</Text>
                <Text style={styles.packageDescription}>être · avoir · aller</Text>
              </View>
              <Text style={styles.packageProgress}>
                {completedIds.length}/{lessons.length}
              </Text>
            </View>

            <View style={styles.lessonList}>
              {lessons.map((lesson, index) => {
                const unlocked = isLessonUnlocked(index);
                const progress = getProgress(lesson);
                const completed = completedIds.includes(lesson.id);

                return (
                  <Pressable
                    key={lesson.id}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !unlocked }}
                    disabled={!unlocked}
                    onPress={() => openLesson(lesson.id)}
                    style={({ pressed }) => [
                      styles.lessonRow,
                      !unlocked && styles.lockedLesson,
                      pressed && unlocked && styles.pressedLesson,
                    ]}
                  >
                    <View
                      style={[
                        styles.lessonNumber,
                        completed && styles.completedNumber,
                        !unlocked && styles.lockedNumber,
                      ]}
                    >
                      <Text style={styles.lessonNumberText}>
                        {completed ? "✓" : unlocked ? `0${index + 1}` : "•"}
                      </Text>
                    </View>
                    <View style={styles.lessonCopy}>
                      <Text style={styles.lessonName}>{lesson.infinitive}</Text>
                      <Text style={styles.lessonDescription}>
                        {completed ? "Concluído" : unlocked ? "Toque para começar" : "Bloqueado"}
                      </Text>
                    </View>
                    <Text style={styles.lessonProgress}>{unlocked ? `${progress}%` : "🔒"}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.lockedPackage}>
            <View style={styles.lockedIcon}>
              <Text style={styles.lockedIconText}>Ⅱ</Text>
            </View>
            <View style={styles.packageCopy}>
              <Text style={styles.lockedPackageTitle}>Seu dia a dia</Text>
              <Text style={styles.lockedPackageDescription}>Conclua o pacote anterior</Text>
            </View>
            <Text style={styles.lockSymbol}>🔒</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  content: {
    width: "100%",
    maxWidth: 620,
    gap: theme.spacing.xl,
  },
  compactContent: {
    maxWidth: 500,
    gap: theme.spacing.lg,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: theme.spacing.md,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  brand: {
    color: theme.colors.text,
    fontFamily: "Georgia",
    fontSize: 28,
    fontWeight: "700",
  },
  brandDot: {
    color: "#91AD82",
  },
  levelBadge: {
    overflow: "hidden",
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  heading: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  eyebrow: {
    color: "#91AD82",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    color: theme.colors.text,
    fontFamily: "Georgia",
    fontSize: 34,
    textAlign: "center",
  },
  compactTitle: {
    fontSize: 27,
  },
  packageCard: {
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surface,
  },
  packageHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: theme.spacing.md,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  packageCopy: {
    gap: theme.spacing.xs,
  },
  packageTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  packageDescription: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  packageProgress: {
    color: "#B7C4B8",
    fontSize: 13,
    fontWeight: "700",
  },
  lessonList: {
    gap: theme.spacing.sm,
  },
  lessonRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.sm,
    borderRadius: theme.radii.md,
    backgroundColor: "#1C241F",
  },
  lockedLesson: {
    opacity: 0.45,
  },
  pressedLesson: {
    opacity: 0.75,
  },
  lessonNumber: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#45544A",
    borderWidth: 1,
    borderRadius: theme.radii.pill,
    backgroundColor: "#222A25",
  },
  completedNumber: {
    borderColor: theme.colors.success,
    backgroundColor: "#304B36",
  },
  lockedNumber: {
    borderColor: theme.colors.border,
  },
  lessonNumberText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  lessonCopy: {
    flex: 1,
    gap: 3,
  },
  lessonName: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  lessonDescription: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  lessonProgress: {
    minWidth: 38,
    color: "#B7C4B8",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
  },
  lockedPackage: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radii.lg,
    opacity: 0.65,
  },
  lockedIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.surface,
  },
  lockedIconText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },
  lockedPackageTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  lockedPackageDescription: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  lockSymbol: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
});
