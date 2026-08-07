import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../components/Screen";
import { StatChip } from "../../components/StatChip";
import { useDailyFlow } from "../../providers/AppProvider";
import { recentDates } from "../../lib/date";

export default function HistoryScreen() {
  const { state } = useDailyFlow();
  const dates = recentDates(7);

  const records = dates
    .map((date) => state.days[date] ?? { date, tasks: [], completionRate: 0, closedAt: null })
    .reverse();

  const average =
    records.length === 0
      ? 0
      : Math.round((records.reduce((sum, record) => sum + record.completionRate, 0) / records.length) * 100);

  return (
    <Screen accent="dawn">
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>History</Text>
          <Text style={styles.title}>See the shape of the week.</Text>
          <Text style={styles.subtitle}>
            This view is intentionally simple now: enough to prove the closure flow and create room for Firestore later.
          </Text>
          <View style={styles.statsRow}>
            <StatChip label="7-day avg" value={`${average}%`} />
            <StatChip label="Closed days" value={String(records.filter((record) => record.closedAt).length)} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent days</Text>
          <View style={styles.list}>
            {records.map((record) => (
              <View key={record.date} style={styles.row}>
                <View style={styles.rowTitle}>
                  <Text style={styles.date}>{record.date}</Text>
                  <Text style={styles.meta}>
                    {record.tasks.length} task{record.tasks.length === 1 ? "" : "s"} - {Math.round(record.completionRate * 100)}% done
                  </Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${Math.max(4, record.completionRate * 100)}%` }]} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 120,
    gap: 16
  },
  hero: {
    gap: 10
  },
  kicker: {
    color: "#34d399",
    textTransform: "uppercase",
    letterSpacing: 1.6,
    fontSize: 12,
    fontWeight: "800"
  },
  title: {
    color: "#f8fafc",
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
    maxWidth: 330
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 340
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 6
  },
  card: {
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderColor: "#24324f",
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    gap: 14
  },
  cardTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700"
  },
  list: {
    gap: 12
  },
  row: {
    gap: 8,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#0b1220",
    borderWidth: 1,
    borderColor: "#24324f"
  },
  rowTitle: {
    gap: 4
  },
  date: {
    color: "#f8fafc",
    fontWeight: "800",
    fontSize: 14
  },
  meta: {
    color: "#94a3b8",
    fontSize: 12
  },
  barTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#172036",
    overflow: "hidden"
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#38bdf8"
  }
});
