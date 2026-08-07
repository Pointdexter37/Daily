import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Screen } from "../../components/Screen";
import { StatChip } from "../../components/StatChip";
import { TaskRow } from "../../components/TaskRow";
import { useDailyFlow } from "../../providers/AppProvider";
import { todayKey } from "../../lib/date";

const priorities = [
  { label: "Low", value: "low" },
  { label: "Normal", value: "normal" },
  { label: "High", value: "high" }
] as const;

export default function TodayScreen() {
  const router = useRouter();
  const { state, actions } = useDailyFlow();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<(typeof priorities)[number]["value"]>("normal");
  const [busy, setBusy] = useState(false);
  const date = todayKey();
  const day = state.days[date] ?? { date, tasks: [], closedAt: null, completionRate: 0 };
  const completed = day.tasks.filter((task) => task.done).length;
  const open = day.tasks.length - completed;

  const addTask = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    await actions.addTask(date, trimmed, priority);
    setTitle("");
    setPriority("normal");
  };

  const closeDay = async () => {
    if (day.closedAt) {
      Alert.alert("Day already closed", "Open Tomorrow Preview to continue planning.");
      return;
    }
    setBusy(true);
    try {
      await actions.closeDay(date);
      router.push("/(tabs)/tomorrow");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen accent="sunrise">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Text style={styles.kicker}>DailyFlow</Text>
            <Text style={styles.title}>Build today. Replan tomorrow.</Text>
            <Text style={styles.subtitle}>
              A local-first daily command center for tasks, carry-overs, and a lighter close-out ritual.
            </Text>
            <View style={styles.statsRow}>
              <StatChip label="Tasks" value={String(day.tasks.length)} />
              <StatChip label="Done" value={String(completed)} />
              <StatChip label="Open" value={String(open)} />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Add task</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="What needs to happen today?"
                placeholderTextColor="#64748b"
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={addTask}
              />
              <TouchableOpacity style={styles.micButton} onPress={() => Alert.alert("Voice input", "Speech-to-text is scaffolded next. For now, type the task here.")}>
                <Ionicons name="mic-outline" size={18} color="#e2e8f0" />
              </TouchableOpacity>
            </View>
            <View style={styles.priorityRow}>
              {priorities.map((item) => {
                const active = priority === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[styles.priorityPill, active && styles.priorityPillActive]}
                    onPress={() => setPriority(item.value)}
                  >
                    <Text style={[styles.priorityText, active && styles.priorityTextActive]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity style={styles.addButton} onPress={addTask}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.listHeader}>
            <Text style={styles.cardTitle}>Today</Text>
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={() =>
                actions.speakTasks(day.tasks.map((task) => `${task.title}${task.done ? ", done" : ""}`))
              }
            >
              <Ionicons name="volume-high-outline" size={18} color="#e2e8f0" />
              <Text style={styles.voiceText}>Read aloud</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listCard}>
            {day.tasks.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No tasks yet</Text>
                <Text style={styles.emptyText}>Add the first item above. This list stays local until you connect Firebase.</Text>
              </View>
            ) : (
              day.tasks.map((task, index) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  index={index}
                  onToggle={() => actions.toggleTask(date, task.id)}
                  onDelete={() => actions.deleteTask(date, task.id)}
                  onRename={(nextTitle) => actions.renameTask(date, task.id, nextTitle)}
                />
              ))
            )}
          </View>

          <TouchableOpacity style={[styles.closeButton, day.closedAt && styles.closeButtonDisabled]} onPress={closeDay} disabled={busy}>
            {busy ? <ActivityIndicator color="#081120" /> : <Text style={styles.closeButtonText}>{day.closedAt ? "Day closed" : "Close day and plan tomorrow"}</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  content: {
    padding: 20,
    paddingBottom: 120,
    gap: 16
  },
  hero: {
    gap: 10
  },
  kicker: {
    color: "#93c5fd",
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
    gap: 12
  },
  cardTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700"
  },
  inputRow: {
    flexDirection: "row",
    gap: 10
  },
  input: {
    flex: 1,
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: "#0b1220",
    color: "#f8fafc",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#24324f"
  },
  micButton: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#1d4ed8"
  },
  priorityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center"
  },
  priorityPill: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#0b1220",
    borderWidth: 1,
    borderColor: "#24324f"
  },
  priorityPillActive: {
    backgroundColor: "#e2e8f0"
  },
  priorityText: {
    color: "#cbd5e1",
    fontWeight: "700",
    fontSize: 12
  },
  priorityTextActive: {
    color: "#081120"
  },
  addButton: {
    marginLeft: "auto",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: "#f8fafc"
  },
  addButtonText: {
    color: "#081120",
    fontWeight: "800"
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  voiceButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#24324f",
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  voiceText: {
    color: "#e2e8f0",
    fontWeight: "700",
    fontSize: 12
  },
  listCard: {
    gap: 10
  },
  emptyState: {
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#24324f",
    padding: 18,
    gap: 6
  },
  emptyTitle: {
    color: "#f8fafc",
    fontWeight: "700",
    fontSize: 16
  },
  emptyText: {
    color: "#94a3b8",
    lineHeight: 20
  },
  closeButton: {
    marginTop: 4,
    borderRadius: 18,
    backgroundColor: "#f8fafc",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  closeButtonDisabled: {
    opacity: 0.72
  },
  closeButtonText: {
    color: "#081120",
    fontWeight: "800"
  }
});
