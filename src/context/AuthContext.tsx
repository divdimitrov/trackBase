'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'trackbase_api_key';

interface AuthContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  apiKey: null,
  setApiKey: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Read from localStorage on mount; auto-login on localhost
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setApiKeyState(stored);
      setLoaded(true);
      return;
    }

    // Auto-login on localhost (dev convenience)
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: '__dev_bypass__' }),
      })
        .then((r) => r.json())
        .then((json) => {
          if (json.apiKey) {
            localStorage.setItem(STORAGE_KEY, json.apiKey);
            setApiKeyState(json.apiKey);
          }
        })
        .catch(() => {})
        .finally(() => setLoaded(true));
    } else {
      setLoaded(true);
    }
  }, []);

  const setApiKey = useCallback((key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKeyState(key);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKeyState(null);
  }, []);

  // Avoid flash of gate before localStorage is read
  if (!loaded) return null;

  return (
    <AuthContext.Provider value={{ apiKey, setApiKey, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
