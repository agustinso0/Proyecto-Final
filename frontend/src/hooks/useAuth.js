import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  register,
  login,
  logout,
  getCurrentUser,
  getSessions,
  invalidateSession,
  invalidateAllSessions,
} from "../repositories/authRepository";
import { useAuthContext } from "../context/AuthContext";

export const useAuthMutations = () => {
  const queryClient = useQueryClient();
  const { saveAuth, clearAuth } = useAuthContext();

  const registerMutation = useMutation(
    async (userData) => {
      return await register(userData);
    },
    {
      onSuccess: (data) => {
        saveAuth(data);
        queryClient.invalidateQueries("currentUser");
      },
      onError: (error) => {
        console.error("Error en registro:", error);
      },
    }
  );

  const loginMutation = useMutation(
    async (credentials) => {
      return await login(credentials);
    },
    {
      onSuccess: (data) => {
        saveAuth(data);
        queryClient.invalidateQueries("currentUser");
      },
      onError: (error) => {
        console.error("Error en login:", error);
      },
    }
  );

  const logoutMutation = useMutation(
    async () => {
      return await logout();
    },
    {
      onSuccess: () => {
        clearAuth();
      },
      onError: (error) => {
        console.error("Error en logout:", error);
        clearAuth();
      },
    }
  );

  return {
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isLoading,
    registerError: registerMutation.error,

    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isLoading,
    loginError: loginMutation.error,

    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isLoading,
  };
};

export const useCurrentUser = () => {
  const { isAuthenticated, sessionToken, user, saveAuth, clearAuth } =
    useAuthContext();

  return useQuery("currentUser", getCurrentUser, {
    enabled: isAuthenticated && !!sessionToken,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    onSuccess: (userData) => {
      if (userData && userData._id !== user?._id) {
        saveAuth({ user: userData });
      }
    },
    onError: (error) => {
      console.error("Error al obtener usuario actual:", error);
      if (error.message?.includes("No autorizado")) {
        clearAuth();
      }
    },
  });
};

export const useSessions = () => {
  const { isAuthenticated, sessionToken, clearAuth } = useAuthContext();

  const sessionsQuery = useQuery("userSessions", getSessions, {
    enabled: isAuthenticated && !!sessionToken,
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: false,
  });

  const invalidateSessionMutation = useMutation(
    async (sessionId) => {
      return await invalidateSession(sessionId);
    },
    {
      onSuccess: () => {
        sessionsQuery.refetch();
      },
      onError: (error) => {
        console.error("Error al invalidar sesión:", error);
      },
    }
  );

  const invalidateAllSessionsMutation = useMutation(
    async () => {
      return await invalidateAllSessions();
    },
    {
      onSuccess: () => {
        clearAuth();
      },
      onError: (error) => {
        console.error("Error al invalidar todas las sesiones:", error);
      },
    }
  );

  return {
    sessions: sessionsQuery.data || [],
    isLoadingSessions: sessionsQuery.isLoading,
    refetchSessions: sessionsQuery.refetch,

    invalidateSession: invalidateSessionMutation.mutateAsync,
    isInvalidatingSession: invalidateSessionMutation.isLoading,

    invalidateAllSessions: invalidateAllSessionsMutation.mutateAsync,
    isInvalidatingAllSessions: invalidateAllSessionsMutation.isLoading,
  };
};

export const useAuthData = () => {
  const authContext = useAuthContext();
  const authMutations = useAuthMutations();
  const currentUserQuery = useCurrentUser();
  const sessions = useSessions();

  return {
    ...authContext,
    ...authMutations,
    currentUser: currentUserQuery.data,
    isLoadingCurrentUser: currentUserQuery.isLoading,
    refetchUser: currentUserQuery.refetch,
    ...sessions,
  };
};

export const useAuth = useAuthData;
