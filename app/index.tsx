import { Redirect } from "expo-router";
import { useAuth } from "../providers/AuthProvider";

export default function Index() {
  const { configured, loading, user } = useAuth();
  if (configured && !loading && !user) {
    return <Redirect href="/sign-in" />;
  }
  return <Redirect href="/(tabs)/today" />;
}
