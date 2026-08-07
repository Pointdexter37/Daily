import { StyleSheet, Text, View } from "react-native";

type StatChipProps = {
  label: string;
  value: string;
};

export function StatChip({ label, value }: StatChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    minWidth: 92,
    backgroundColor: "rgba(15, 23, 42, 0.84)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#24324f",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 3
  },
  value: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "800"
  },
  label: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7
  }
});
