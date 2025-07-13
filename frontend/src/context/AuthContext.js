import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";

const AuthContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedSessionToken = localStorage.getItem("sessionToken");

        if (storedUser && storedSessionToken) {
          setUser(JSON.parse(storedUser));
          setSessionToken(storedSessionToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error al cargar datos de autenticación:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("sessionToken");
        setUser(null);
        setSessionToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const saveAuth = useCallback((authData) => {
    try {
      if (authData.user) {
        localStorage.setItem("user", JSON.stringify(authData.user));
        setUser(authData.user);
      }
      if (authData.sessionToken) {
        localStorage.setItem("sessionToken", authData.sessionToken);
        setSessionToken(authData.sessionToken);
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error al guardar datos de autenticación:", error);
    }
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("sessionToken");
    setUser(null);
    setSessionToken(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    sessionToken,
    isAuthenticated,
    isLoading,

    saveAuth,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useAuthContext();
};

export const useAuthStatus = () => {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  return { isAuthenticated, isLoading, user };
};
