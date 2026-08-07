import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Screen } from "../../components/Screen";
import { useAuth } from "../../providers/AuthProvider";
import { useDailyFlow } from "../../providers/AppProvider";

export default function SettingsScreen() {
  const { state, actions } = useDailyFlow();
  const { configured, user, signOut } = useAuth();

  return (
    <Screen accent="ember">
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Settings</Text>
          <Text style={styles.title}>Keep the loop lightweight.</Text>
          <Text style={styles.subtitle}>
            The core app works locally first. These controls shape how the future Firebase and Gemini integrations plug in.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Voice</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Read lists aloud</Text>
              <Text style={styles.settingSub}>Uses expo-speech when available.</Text>
            </View>
            <Switch value={state.settings.voiceEnabled} onValueChange={(value) => actions.updateSettings({ voiceEnabled: value })} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily close-out</Text>
          <View style={styles.settingStack}>
            <Text style={styles.settingLabel}>Reminder time</Text>
            <TextInput
              value={state.settings.reminderTime}
              onChangeText={(value) => actions.updateSettings({ reminderTime: value })}
              placeholder="19:30"
              placeholderTextColor="#64748b"
              style={styles.input}
            />
            <Text style={styles.settingSub}>Stored locally for now. Notification wiring comes after the core flow is stable.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <Text style={styles.settingSub}>
            {user ? `Signed in as ${user.email ?? "your account"}` : configured ? "Not signed in" : "Firebase setup is pending"}
          </Text>
          {user ? (
            <TouchableOpacity style={styles.secondaryButton} onPress={() => signOut()}>
              <Text style={styles.secondaryText}>Sign out</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={() =>
              Alert.alert("Reset local data?", "This clears the local state stored on this device.", [
                { text: "Cancel", style: "cancel" },
                { text: "Reset", style: "destructive", onPress: () => actions.resetAll() }
              ])
            }
          >
            <Text style={styles.dangerText}>Reset local data</Text>
          </TouchableOpacity>
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
    color: "#fb7185",
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
  cardTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700"
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  settingStack: {
    gap: 10
  },
  settingText: {
    flex: 1,
    gap: 4
  },
  settingLabel: {
    color: "#f8fafc",
    fontWeight: "700",
    fontSize: 14
  },
  settingSub: {
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 18
  },
  input: {
    borderRadius: 16,
    backgroundColor: "#0b1220",
    color: "#f8fafc",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#24324f",
    maxWidth: 140
  },
  dangerButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#2b1220",
    borderWidth: 1,
    borderColor: "#7f1d1d"
  },
  dangerText: {
    color: "#fecaca",
    fontWeight: "800"
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#17233a",
    borderWidth: 1,
    borderColor: "#334155"
  },
  secondaryText: {
    color: "#e2e8f0",
    fontWeight: "800"
  }
});
