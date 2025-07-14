import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  validateRegistrationData,
  formatRegistrationData,
} from "../../services/auth.service";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../utils/errorHandler";
import "../../styles/Auth.css";

const RegisterForm = ({ onSuccess, onLoginClick }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isRegistering } = useAuth();

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
    const validationErrors = validateRegistrationData(formData);
    const errorObj = {};

    if (formData.password !== formData.confirmPassword) {
      validationErrors.push("Las contraseñas no coinciden");
    }

    validationErrors.forEach((error) => {
      if (error.includes("nombre") && error.includes("obligatorio")) {
        errorObj.firstname = error;
      } else if (error.includes("apellido")) {
        errorObj.lastname = error;
      } else if (error.includes("email")) {
        errorObj.email = error;
      } else if (error.includes("contraseña") && !error.includes("coinciden")) {
        errorObj.password = error;
      } else if (error.includes("coinciden")) {
        errorObj.confirmPassword = error;
      } else if (error.includes("dirección")) {
        errorObj.address = error;
      }
    });

    setErrors(errorObj);
    return Object.keys(errorObj).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData = formatRegistrationData(formData);
      const result = await register(registrationData);

      showSuccessNotification("Registro exitoso. ¡Bienvenido!");

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error("Error en registro:", error);
      showErrorNotification(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-form-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Crear Cuenta</h2>
          <p>Completa los datos para registrarte</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstname">
                Nombre <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className={`form-input ${errors.firstname ? "error" : ""}`}
                placeholder="Juan"
                disabled={isRegistering || isSubmitting}
                autoComplete="given-name"
              />
              {errors.firstname && (
                <span className="error-message">{errors.firstname}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastname">
                Apellido <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className={`form-input ${errors.lastname ? "error" : ""}`}
                placeholder="Pérez"
                disabled={isRegistering || isSubmitting}
                autoComplete="family-name"
              />
              {errors.lastname && (
                <span className="error-message">{errors.lastname}</span>
              )}
            </div>
          </div>

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
              disabled={isRegistering || isSubmitting}
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">Dirección (opcional)</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`form-input ${errors.address ? "error" : ""}`}
              placeholder="Av. Corrientes 1234, CABA"
              disabled={isRegistering || isSubmitting}
              autoComplete="street-address"
            />
            {errors.address && (
              <span className="error-message">{errors.address}</span>
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
              disabled={isRegistering || isSubmitting}
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirmar Contraseña <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? "error" : ""}`}
              placeholder="••••••••"
              disabled={isRegistering || isSubmitting}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isRegistering || isSubmitting}
          >
            {isRegistering || isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creando cuenta...
              </>
            ) : (
              "Crear Cuenta"
            )}
          </button>
        </form>

        {onLoginClick && (
          <div className="auth-footer">
            <p>
              ¿Ya tienes una cuenta?{" "}
              <button
                type="button"
                className="link-button"
                onClick={onLoginClick}
                disabled={isRegistering || isSubmitting}
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
