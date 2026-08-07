import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Redirect, router } from "expo-router";
import { Screen } from "../components/Screen";
import { useAuth } from "../providers/AuthProvider";

export default function SignInScreen() {
  const { configured, loading, user, signIn, createAccount } = useAuth();
  const [mode, setMode] = useState<"signIn" | "create">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading || user) {
    return <Redirect href="/(tabs)/today" />;
  }

  async function submit() {
    if (!email.trim() || password.length < 6) {
      Alert.alert("Check your details", "Enter an email and a password with at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signIn") {
        await signIn(email.trim(), password);
      } else {
        await createAccount(email.trim(), password);
      }
      router.replace("/(tabs)/today");
    } catch (error) {
      Alert.alert("Authentication failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen accent="ember">
      <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>DailyFlow</Text>
          <Text style={styles.title}>A calmer tomorrow starts with today.</Text>
          <Text style={styles.subtitle}>Sign in to keep your tasks and history available across devices.</Text>
        </View>
        {!configured ? (
          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>Firebase is not configured</Text>
            <Text style={styles.noticeText}>Add the EXPO_PUBLIC_FIREBASE_* values from .env.example to enable accounts.</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" placeholder="Email" placeholderTextColor="#64748b" style={styles.input} value={email} onChangeText={setEmail} />
            <TextInput autoComplete="password" placeholder="Password" placeholderTextColor="#64748b" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
            <TouchableOpacity disabled={busy} style={styles.button} onPress={submit}>
              {busy ? <ActivityIndicator color="#081120" /> : <Text style={styles.buttonText}>{mode === "signIn" ? "Sign in" : "Create account"}</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode(mode === "signIn" ? "create" : "signIn")}>
              <Text style={styles.switchText}>{mode === "signIn" ? "Need an account? Create one" : "Already have an account? Sign in"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, justifyContent: "center", padding: 20, gap: 24 },
  hero: { gap: 10 },
  kicker: { color: "#fb7185", textTransform: "uppercase", letterSpacing: 1.6, fontSize: 12, fontWeight: "800" },
  title: { color: "#f8fafc", fontSize: 36, lineHeight: 40, fontWeight: "800" },
  subtitle: { color: "#cbd5e1", fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: "rgba(15, 23, 42, 0.9)", borderColor: "#24324f", borderWidth: 1, borderRadius: 24, padding: 16, gap: 12 },
  input: { borderRadius: 16, backgroundColor: "#0b1220", color: "#f8fafc", paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1, borderColor: "#24324f" },
  button: { borderRadius: 16, paddingVertical: 15, alignItems: "center", backgroundColor: "#fb7185" },
  buttonText: { color: "#081120", fontWeight: "800" },
  switchText: { color: "#fda4af", textAlign: "center", fontWeight: "700", paddingVertical: 6 },
  notice: { borderRadius: 20, backgroundColor: "#2b1220", borderColor: "#7f1d1d", borderWidth: 1, padding: 16, gap: 8 },
  noticeTitle: { color: "#fecaca", fontWeight: "800" },
  noticeText: { color: "#fda4af", lineHeight: 20 }
});
