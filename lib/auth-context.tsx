import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface User {
  name: string;
  email: string;
}

interface LoginResult {
  success: boolean;
  message?: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => LoginResult;
  signOut: () => void;
}

const MOCK_USER = {
  name: "Jade Silva",
  email: "jade.silva2709@alu.ufc.br",
  password: "12345678",
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  function signIn(email: string, password: string): LoginResult {
    const normalizedEmail = email.trim().toLowerCase();

    const credentialsAreValid =
      normalizedEmail === MOCK_USER.email && password === MOCK_USER.password;

    if (!credentialsAreValid) {
      return { success: false, message: "Credenciais inválidas" };
    }

    setUser({ name: MOCK_USER.name, email: MOCK_USER.email });

    return { success: true };
  }

  function signOut() {
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      signIn,
      signOut,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
