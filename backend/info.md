# 📚 API Backend - Documentación de Endpoints

## 🛡️ Autenticación y Rutas Protegidas

- **Rutas protegidas**: requieren un token JWT en el header  
  `Authorization: Bearer <token>`
- **Cómo obtener el token**:  
  Haz un POST a `/api/auth/login` con usuario y contraseña válidos.  
  El token viene en la respuesta (`data.token`).

---

## 🔑 Auth

### POST `/api/auth/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "username": "usuario1",
  "password": "password123"
}
```

### POST `/api/auth/login`
Inicia sesión y devuelve un token JWT. 

**Body:** (usuario existente)
```json
{
  "username": "usuario1",
  "password": "password123"
}
```
**Respuesta:**
```json
{
  "statusCode": 200,
  "data": {
    "auth": { ... },
    "token": "JWT_AQUI"
  },
  "message": "Inicio de sesion exitoso",
  "success": true
}
```

### POST `/api/auth/logout`  
**Protegida**  
Cierra sesión (requiere token).

### PUT `/api/auth/change-password`  
**Protegida**  
Cambia la contraseña del usuario autenticado.

---

## 👤 Usuarios

Todas las rutas salvo `/email/:email` son **protegidas**.

### GET `/api/users/email/:email`
Busca usuario por email (pública).

### GET `/api/users/`
Lista todos los usuarios (**protegida**).

### GET `/api/users/:id`
Obtiene un usuario por ID (**protegida**).

### POST `/api/users/`
Crea un usuario (**protegida**).

### PUT `/api/users/:id`
Actualiza un usuario (**protegida**).

### DELETE `/api/users/:id`
Elimina (soft delete) un usuario (**protegida**).

### PATCH `/api/users/:id/balance`
Actualiza el balance (**protegida**).

---

## 📂 Categorías

- **GET `/api/categories/`**  
  Lista todas las categorías (**pública**).  
  **Soporta búsqueda por nombre:**  
  Filtrar categorías por nombre usando el query param `search`.  
  Ejemplo:  
  ```
  GET /api/categories?search=tec
  ```
  Devuelve todas las categorías que contenga "tec" (busqueda case-insensitive)

- **GET `/api/categories/:name`**  
  Busca una categoría por nombre (**pública**).

- **POST `/api/categories/`**  
  Crea una categoría (**protegida**).

  **Body:**
  ```json
  { "name": "Tecnologia" }
  ```
  **Header:**  
  `Authorization: Bearer <token>`

- **DELETE `/api/categories/:name`**  
  Elimina una categoría por nombre (**protegida**).

  **Header:**  
  `Authorization: Bearer <token>`

---

## 💸 Transacciones

Todas las rutas son **protegidas**.

### GET `/api/transactions/`
Lista todas las transacciones (**protegida**).

### GET `/api/transactions/summary`
Lista un resumen de las transacciones (**protegida**).


**Header:**  
`Authorization: Bearer <token>`

---

## 🩺 Healthcheck

### GET `/api/health`
Verifica si la API