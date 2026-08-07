import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Screen } from "../../components/Screen";
import { useDailyFlow } from "../../providers/AppProvider";

export default function TomorrowScreen() {
  const router = useRouter();
  const { state, actions } = useDailyFlow();
  const preview = state.preview;

  const accept = async () => {
    if (!preview) {
      Alert.alert("Nothing to accept", "Close today's day first to generate a tomorrow preview.");
      return;
    }
    await actions.acceptPreview();
    router.push("/(tabs)/today");
  };

  return (
    <Screen accent="night">
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Tomorrow preview</Text>
          <Text style={styles.title}>A suggested order for the next day.</Text>
          <Text style={styles.subtitle}>
            The local planner reorders unfinished work first and keeps the logic ready for a Gemini swap later.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Preview</Text>
            <TouchableOpacity style={styles.voiceButton} onPress={() => actions.speakTasks(preview?.tasks.map((item) => item.title) ?? [])}>
              <Ionicons name="volume-high-outline" size={18} color="#e2e8f0" />
              <Text style={styles.voiceText}>Read aloud</Text>
            </TouchableOpacity>
          </View>

          {!preview ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No preview yet</Text>
              <Text style={styles.emptyText}>Close out today to generate the next suggested order.</Text>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/(tabs)/today")}>
                <Text style={styles.secondaryButtonText}>Go to Today</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.previewList}>
              {preview.tasks.map((item, index) => (
                <View key={item.id} style={styles.previewRow}>
                  <Text style={styles.rank}>{String(index + 1).padStart(2, "0")}</Text>
                  <View style={styles.previewBody}>
                    <TextInput
                      value={item.title}
                      onChangeText={(next) => actions.renamePreviewTask(item.id, next)}
                      style={styles.previewInput}
                      placeholderTextColor="#64748b"
                    />
                    <Text style={styles.reason}>{item.reason}</Text>
                  </View>
                  <View style={styles.rowActions}>
                    <TouchableOpacity onPress={() => actions.movePreviewTask(item.id, -1)} style={styles.iconButton}>
                      <Ionicons name="chevron-up" size={16} color="#e2e8f0" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => actions.movePreviewTask(item.id, 1)} style={styles.iconButton}>
                      <Ionicons name="chevron-down" size={16} color="#e2e8f0" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => actions.removePreviewTask(item.id)} style={styles.iconButtonDanger}>
                      <Ionicons name="trash-outline" size={16} color="#fecaca" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={[styles.acceptButton, !preview && styles.acceptButtonDisabled]} onPress={accept} disabled={!preview}>
          {!preview ? <ActivityIndicator color="#081120" /> : <Text style={styles.acceptButtonText}>Accept preview</Text>}
        </TouchableOpacity>
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
    color: "#f59e0b",
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
  card: {
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderColor: "#24324f",
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    gap: 14
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  cardTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700"
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
  emptyState: {
    backgroundColor: "#0b1220",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#24324f",
    padding: 18,
    gap: 8
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
  secondaryButton: {
    marginTop: 6,
    alignSelf: "flex-start",
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  secondaryButtonText: {
    color: "#081120",
    fontWeight: "800"
  },
  previewList: {
    gap: 10
  },
  previewRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    borderRadius: 20,
    backgroundColor: "#0b1220",
    borderWidth: 1,
    borderColor: "#24324f",
    padding: 12
  },
  rank: {
    color: "#93c5fd",
    fontWeight: "800",
    fontSize: 14,
    width: 28
  },
  previewBody: {
    flex: 1,
    gap: 6
  },
  previewInput: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 0
  },
  reason: {
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 18
  },
  rowActions: {
    gap: 8
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#101a2d"
  },
  iconButtonDanger: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#2b1220"
  },
  acceptButton: {
    borderRadius: 18,
    backgroundColor: "#f8fafc",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  acceptButtonDisabled: {
    opacity: 0.72
  },
  acceptButtonText: {
    color: "#081120",
    fontWeight: "800"
  }
});
