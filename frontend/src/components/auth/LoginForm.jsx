import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  validateLoginData,
  formatLoginData,
} from "../../services/auth.service";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../utils/errorHandler";
import "../../styles/Auth.css";

const LoginForm = ({ onSuccess, onRegisterClick }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isLoggingIn } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const validationErrors = validateLoginData(formData);
    const errorObj = {};

    validationErrors.forEach((error) => {
      if (error.includes("email")) {
        errorObj.email = error;
      } else if (error.includes("contraseña")) {
        errorObj.password = error;
      }
    });

    setErrors(errorObj);
    return Object.keys(errorObj).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted, preventing default behavior');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const loginData = formatLoginData(formData);
      console.log('Attempting login with data:', { ...loginData, password: '[HIDDEN]' });
      
      const result = await login(loginData);
      console.log('Login successful, result:', { 
        user: result?.user?.email, 
        hasToken: !!result?.sessionToken 
      });

      showSuccessNotification("Inicio de sesión exitoso");

      if (onSuccess) {
        console.log('Calling onSuccess callback');
        onSuccess(result);
      }
      
      console.log('Login process completed, current URL:', window.location.href);
    } catch (error) {
      console.error("Error en login:", error);
      showErrorNotification(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Iniciar Sesión</h2>
          <p>Ingresa tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="tu@email.com"
              disabled={isLoggingIn || isSubmitting}
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? "error" : ""}`}
              placeholder="••••••••"
              disabled={isLoggingIn || isSubmitting}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoggingIn || isSubmitting}
          >
            {isLoggingIn || isSubmitting ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        {onRegisterClick && (
          <div className="auth-footer">
            <p>
              ¿No tienes una cuenta?{" "}
              <button
                type="button"
                className="link-button"
                onClick={onRegisterClick}
                disabled={isLoggingIn || isSubmitting}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
