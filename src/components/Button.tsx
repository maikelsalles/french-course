import { Pressable, StyleSheet, Text } from "react-native";
import type { PressableProps } from "react-native";
import { theme } from "../tokens/theme";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  title: string;
  onPress: NonNullable<PressableProps["onPress"]>;
  variant?: ButtonVariant;
  disabled?: boolean;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.md,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  primaryLabel: {
    color: theme.colors.text,
  },
  secondaryLabel: {
    color: theme.colors.primary,
  },
});
