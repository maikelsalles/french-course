import { Stack } from "expo-router";
import { CourseProvider } from "../src/course/CourseContext";

export default function RootLayout() {
  return (
    <CourseProvider>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
    </CourseProvider>
  );
}
