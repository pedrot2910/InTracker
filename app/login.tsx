import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../lib/auth-context";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleLogin() {
    setError(null);

    if (!email.trim() || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    const result = signIn(email, password);

    if (!result.success) {
      setError(result.message ?? "Não foi possível fazer login");
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f4f7f5" }}
      edges={["top", "left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#f4f7f5" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingVertical: 32,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{ flex: 1, justifyContent: "center", paddingHorizontal: 28 }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#10367d",
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              InTracker UFC
            </Text>

            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                color: "#9ca3af",
                textAlign: "center",
                marginTop: 8,
                marginBottom: 32,
              }}
            >
              Acompanhe o transporte universitário da UFC
            </Text>

            <View style={{ width: "100%", paddingHorizontal: 12 }}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="E-mail"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  height: 48,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  marginBottom: 16,
                  color: "#111",
                  fontSize: 16,
                }}
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Senha"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                style={{
                  height: 48,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  marginBottom: 16,
                  color: "#111",
                  fontSize: 16,
                }}
                onSubmitEditing={handleLogin}
              />

              {error && (
                <Text
                  style={{ fontSize: 14, color: "#f87171", marginBottom: 16 }}
                >
                  {error}
                </Text>
              )}

              <Pressable
                style={{
                  height: 48,
                  backgroundColor: "#10367d",
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={handleLogin}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#fff",
                  }}
                >
                  Entrar
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
