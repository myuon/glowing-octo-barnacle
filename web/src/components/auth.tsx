import React, { PropsWithChildren, useMemo } from "react";
import { auth } from "../api/firebase";
import { useLocalStorageState } from "../helper/useLocalStorageState";

export interface AuthProviderState {
  authenticated: boolean;
  token: string | undefined;
  login: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthProviderContext = React.createContext<AuthProviderState | undefined>(
  undefined
);

export const useAuth = () => {
  const context = React.useContext(AuthProviderContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useLocalStorageState<string | undefined>(
    "token",
    1 * 60 * 60, // 1 hour
    undefined
  );

  const value = useMemo(
    () => ({
      authenticated: Boolean(token),
      token,
      login: async (idToken: string) => {
        setToken(idToken);
      },
      logout: async () => {
        setToken(undefined);
      },
    }),
    [setToken, token]
  );

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
};

export const getAuthToken = async () => {
  return await auth.currentUser?.getIdToken();
};
