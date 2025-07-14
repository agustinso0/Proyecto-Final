import React, { useState } from "react";

const EditUserForm = ({ user, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    email: user.email || "",
  });
  console.log("EditUserForm", user);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="user-form">
      <h4>Editar Usuario</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="editFirstName">Nombre</label>
          <input
            type="text"
            id="editFirstName"
            value={formData.firstname}
            onChange={(e) => handleInputChange("firstname", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="editLastName">Apellido</label>
          <input
            type="text"
            id="editLastName"
            value={formData.lastname}
            onChange={(e) => handleInputChange("lastname", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="editEmail">Email</label>
          <input
            type="email"
            id="editEmail"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
