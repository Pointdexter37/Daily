import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type ScreenProps = {
  children: ReactNode;
  accent?: "sunrise" | "night" | "dawn" | "ember";
};

const accentMap = {
  sunrise: ["#f59e0b", "#fb7185"],
  night: ["#38bdf8", "#8b5cf6"],
  dawn: ["#34d399", "#38bdf8"],
  ember: ["#fb7185", "#f59e0b"]
} as const;

export function Screen({ children, accent = "night" }: ScreenProps) {
  const [one, two] = accentMap[accent];

  return (
    <View style={styles.shell}>
      <View style={styles.base} />
      <View style={[styles.glow, { backgroundColor: one, top: -80, right: -40 }]} />
      <View style={[styles.glow, { backgroundColor: two, bottom: 60, left: -70 }]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: "#081120"
  },
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#081120"
  },
  glow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 999,
    opacity: 0.18,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 30
  },
  content: {
    flex: 1
  }
});
