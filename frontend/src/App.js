import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./context/AuthContext";
import { LoginForm, RegisterForm } from "./components/auth";
import TransactionManagement from "./components/TransactionManagement";
import UserList from "./components/users/UserList";
import CategoryManagement from "./components/CategoryManagement";
import "./App.css";
import "./styles/Main.css";
import "./styles/transactions.css";

const AppContent = () => {
  const { user, isAuthenticated, isLoading, logout, isLoggingOut } = useAuth();
  const [activeTab, setActiveTab] = useState("transactions");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthFlow />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Control de Gastos Personales</h1>
          <div className="user-section">
            <span className="welcome-text">
              Hola, {user?.firstname} {user?.lastname}
            </span>
            <button
              onClick={handleLogout}
              className="logout-btn"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
            </button>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <div className="nav-tabs">
          <button
            className={`tab-btn ${
              activeTab === "transactions" ? "active" : ""
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            Transacciones
          </button>
          <button
            className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            Categorías
          </button>
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Usuarios
          </button>
        </div>
      </nav>

      <main className="app-main">
        {activeTab === "transactions" && (
          <div className="tab-content">
            <div className="section">
              <h2>Administrar Transacciones</h2>
              <TransactionManagement />
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="tab-content">
            <div className="section">
              <h2>Administrar Categorías</h2>
              <CategoryManagement />
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="tab-content">
            <div className="section">
              <h2>Administrar Usuarios</h2>
              <UserList />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const AuthFlow = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthSuccess = (result) => {
    console.log("Autenticación exitosa:", result);
  };

  return (
    <div className="auth-flow">
      {isLogin ? (
        <LoginForm
          onSuccess={handleAuthSuccess}
          onRegisterClick={() => setIsLogin(false)}
        />
      ) : (
        <RegisterForm
          onSuccess={handleAuthSuccess}
          onLoginClick={() => setIsLogin(true)}
        />
      )}
    </div>
  );
};

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
