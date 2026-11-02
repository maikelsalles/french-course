import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { theme } from "../tokens/theme";

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    shadowColor: "#172033",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
});
