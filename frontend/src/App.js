import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { HelmetProvider } from "react-helmet-async";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./context/AuthContext";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import TransactionManagement from "./components/TransactionManagement";
import UserManagement from "./components/UserManagement";
import CategoryManagement from "./components/CategoryManagement";
import SEOHead from "./components/SEOHead";
import "./App.css";
import "./styles/Main.css";
import "./styles/transactions.css";

const AppContent = () => {
  const { user, isAuthenticated, isLoading, logout, isLoggingOut } = useAuth();
  const [activeTab, setActiveTab] = useState("transactions");

  // Prevenir navegación no deseada
  useEffect(() => {
    // Prevenir que el navegador navegue a URLs de API
    const handleBeforeUnload = (e) => {
      // No hacer nada, solo log para debug
      console.log("Navegación detectada:", window.location.href);
    };

    // Verificar URL actual al montar el componente
    if (window.location.pathname.includes("/api/")) {
      console.warn("URL problemática detectada:", window.location.href);
      // Forzar navegación de vuelta a la raíz
      window.history.replaceState({}, "", "/");
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Debug: Log del estado de autenticación
  useEffect(() => {
    console.log("Estado de autenticación:", {
      isAuthenticated,
      isLoading,
      user: user?.email,
    });
  }, [isAuthenticated, isLoading, user]);

  // SEO dinámico basado en la pestaña activa
  const getSEOData = () => {
    switch (activeTab) {
      case "transactions":
        return {
          title: "Transacciones - Control de Gastos Personales",
          description:
            "Gestiona y controla todas tus transacciones financieras. Registra ingresos y gastos, categorízalos y mantén un balance actualizado de tus finanzas personales.",
          keywords:
            "transacciones financieras, registro gastos, ingresos personales, balance financiero, control transacciones",
          canonical: "/transacciones",
        };
      case "categories":
        return {
          title: "Categorías - Control de Gastos Personales",
          description:
            "Organiza tus gastos por categorías personalizadas. Crea, edita y gestiona categorías para clasificar mejor tus transacciones financieras.",
          keywords:
            "categorías gastos, clasificación transacciones, organización financiera, tipos gastos",
          canonical: "/categorias",
        };
      case "users":
        return {
          title: "Gestión de Usuarios - Control de Gastos Personales",
          description:
            "Administra usuarios y perfiles en tu sistema de control de gastos. Gestiona permisos y configuraciones de cuenta.",
          keywords:
            "gestión usuarios, administración cuentas, perfiles financieros",
          canonical: "/usuarios",
        };
      default:
        return {
          title: "Control de Gastos Personales - Gestiona tus Finanzas",
          description:
            "Gestiona tus finanzas personales de manera inteligente. Controla gastos, categoriza transacciones y mantén un balance saludable de tus ingresos y egresos.",
          keywords:
            "control gastos, finanzas personales, gestión dinero, presupuesto personal",
          canonical: "",
        };
    }
  };

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
        <SEOHead
          title="Cargando - Control de Gastos Personales"
          description="Cargando aplicación de control de gastos personales..."
          noIndex={true}
        />
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <SEOHead
          title="Iniciar Sesión - Control de Gastos Personales"
          description="Accede a tu cuenta para gestionar tus finanzas personales. Inicia sesión o regístrate en nuestra plataforma de control de gastos."
          keywords="login, registro, acceso cuenta, finanzas personales"
          canonical="/login"
        />
        <AuthFlow />
      </>
    );
  }

  const seoData = getSEOData();

  return (
    <div className="app-container">
      <SEOHead {...seoData} />
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

      <main className="app-main" role="main">
        {activeTab === "transactions" && (
          <div className="tab-content">
            <div className="section">
              <header>
                <h2>Administrar Transacciones</h2>
                <p className="section-description">
                  Gestiona tus ingresos y gastos de forma organizada. Registra
                  nuevas transacciones y mantén un control detallado de tu
                  balance financiero.
                </p>
              </header>
              <TransactionManagement />
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="tab-content">
            <div className="section">
              <header>
                <h2>Administrar Categorías</h2>
                <p className="section-description">
                  Organiza tus gastos por categorías personalizadas. Crea y
                  gestiona diferentes tipos de gastos para un mejor control
                  financiero.
                </p>
              </header>
              <CategoryManagement />
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="tab-content">
            <div className="section">
              <header>
                <h2>Administrar Usuarios</h2>
                <p className="section-description">
                  Gestiona usuarios y perfiles del sistema. Administra permisos
                  y configuraciones de cuenta.
                </p>
              </header>
              <UserManagement />
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
    // NO hacer navegación aquí, el contexto de auth maneja el estado
    // Esto previene navegaciones no deseadas
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
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
