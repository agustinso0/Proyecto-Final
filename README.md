# 💰 Sistema de Control de Gastos Personales - Full-Stack

## 📋 Descripción del Proyecto

Sistema web completo para la gestión y control de finanzas personales, desarrollado con arquitectura de microservicios usando React, Express.js, MongoDB y Docker. Permite a los usuarios registrar, categorizar y analizar sus transacciones financieras de manera intuitiva y eficiente.

## 🎯 Arquitectura del Sistema

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Nginx     │    │   React     │    │   Express   │
│  (Proxy)    │◄──►│ (Frontend)  │◄──►│  (Backend)  │
│   :80       │    │   :3000     │    │   :3001     │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                   ┌─────────────┐    ┌─────────────┐
                   │    Redis    │    │  MongoDB    │
                   │  (Cache)    │    │ (Database)  │
                   │   :6379     │    │  :27018     │
                   └─────────────┘    └─────────────┘
```

## 🔧 Stack Tecnológico

| Componente | Tecnología | Puerto | Función |
|------------|------------|--------|---------|
| **Frontend** | React 18 + CSS Modules | 3000 | Interfaz de usuario moderna y responsiva |
| **Backend** | Express.js + Mongoose | 3001 | API REST con autenticación JWT |
| **Database** | MongoDB 7 (Replica Set) | 27018 | Base de datos NoSQL con alta disponibilidad |
| **Cache** | Redis 7 | 6379 | Cache de sesiones y optimización |
| **Proxy** | Nginx Alpine | 80 | Reverse proxy y load balancer |

---

## 🏗️ Estructura del Proyecto

```
proyecto-final/
├── 📁 backend/                    # API REST con Express.js
│   ├── 📁 config/                 # Configuraciones del sistema
│   │   ├── config.js              # Variables de entorno y configuración general
│   │   └── database.js            # Configuración de MongoDB y Mongoose
│   ├── 📁 controllers/            # Lógica de negocio y manejo de requests
│   │   ├── auth.controller.js     # Autenticación y autorización
│   │   ├── category.controller.js # Gestión de categorías
│   │   ├── transaction.controller.js # Operaciones con transacciones
│   │   └── user.controller.js     # Gestión de usuarios
│   ├── 📁 data/                   # Datos de prueba y seeders
│   │   ├── auths.js               # Datos de autenticación mock
│   │   ├── categories.js          # Categorías predefinidas
│   │   ├── transactions.js        # Transacciones de ejemplo
│   │   ├── transaction_type.js    # Tipos de transacción
│   │   └── users.js               # Usuarios de prueba
│   ├── 📁 middleware/             # Middlewares personalizados
│   │   ├── ApiResponse.js         # Estandarización de respuestas
│   │   ├── auth.js                # Middleware de autenticación JWT
│   │   ├── rateLimiter.js         # Limitación de requests
│   │   └── validateRequest.js     # Validación de datos de entrada
│   ├── 📁 models/                 # Esquemas de Mongoose
│   │   ├── Auth.js                # Modelo de sesiones de autenticación
│   │   ├── Category.js            # Modelo de categorías
│   │   ├── Transaction.js         # Modelo de transacciones
│   │   ├── TransactionTypes.js    # Modelo de tipos de transacción
│   │   └── User.js                # Modelo de usuarios
│   ├── 📁 routes/                 # Definición de rutas del API
│   │   ├── auth.routes.js         # Rutas de autenticación
│   │   ├── category.routes.js     # Rutas de categorías
│   │   ├── index.js               # Router principal
│   │   ├── transaction.routes.js  # Rutas de transacciones
│   │   └── user.routes.js         # Rutas de usuarios
│   ├── 📁 seeders/                # Pobladores de base de datos
│   │   ├── categories.seeder.js   # Seeder de categorías
│   │   ├── transaction_types.seeder.js # Seeder de tipos
│   │   ├── transactions.seeder.js # Seeder de transacciones
│   │   └── user.seeder.js         # Seeder de usuarios
│   ├── 📁 services/               # Lógica de negocio
│   │   ├── category.service.js    # Servicios de categorías
│   │   ├── transaction.service.js # Servicios de transacciones
│   │   └── user.service.js        # Servicios de usuarios
│   ├── 📁 utils/                  # Utilidades del sistema
│   │   ├── ApiError.js            # Manejo estandarizado de errores
│   │   ├── ApiResponse.js         # Respuestas estandarizadas
│   │   └── logger.js              # Sistema de logging con Winston
│   ├── 📁 validators/             # Validaciones con Joi
│   │   ├── auth.validator.js      # Validaciones de autenticación
│   │   ├── category.validator.js  # Validaciones de categorías
│   │   ├── transaction.validator.js # Validaciones de transacciones
│   │   └── user.validator.js      # Validaciones de usuarios
│   ├── 📁 logs/                   # Archivos de log del sistema
│   │   ├── combined.log           # Logs combinados
│   │   └── error.log              # Logs de errores
│   ├── Dockerfile                 # Imagen Docker para producción
│   ├── Dockerfile.dev             # Imagen Docker para desarrollo
│   ├── package.json               # Dependencias y scripts de Node.js
│   ├── server.js                  # Punto de entrada del servidor
│   └── info.md                    # Documentación específica del backend
├── 📁 frontend/                   # Aplicación React
│   ├── 📁 public/                 # Archivos estáticos públicos
│   │   ├── index.html             # Plantilla HTML principal
│   │   ├── manifest.json          # Configuración PWA
│   │   ├── robots.txt             # Configuración para crawlers
│   │   └── sitemap.xml            # Mapa del sitio
│   ├── 📁 src/                    # Código fuente de React
│   │   ├── 📁 api/                # Cliente HTTP para comunicación con API
│   │   │   └── apiClient.js       # Configuración de Axios
│   │   ├── 📁 components/         # Componentes reutilizables
│   │   │   ├── CategoryManagement.jsx # Gestión de categorías
│   │   │   ├── SEOHead.jsx        # Componente de SEO optimizado
│   │   │   ├── TransactionManagement.jsx # Gestión de transacciones
│   │   │   ├── UserManagement.jsx # Gestión de usuarios
│   │   │   ├── 📁 auth/           # Componentes de autenticación
│   │   │   │   ├── LoginForm.jsx  # Formulario de login
│   │   │   │   └── RegisterForm.jsx # Formulario de registro
│   │   │   └── 📁 users/          # Componentes específicos de usuarios
│   │   │       ├── EditUserForm.jsx # Formulario de edición
│   │   │       └── UserCard.jsx   # Tarjeta de usuario
│   │   ├── 📁 context/            # Contextos de React
│   │   │   └── AuthContext.js     # Contexto de autenticación global
│   │   ├── 📁 hooks/              # Custom hooks
│   │   │   ├── index.js           # Barrel export de hooks
│   │   │   ├── useAuth.js         # Hook de autenticación
│   │   │   ├── useCategory.js     # Hook de categorías
│   │   │   ├── useTransaction.js  # Hook de transacciones
│   │   │   ├── useUserHandlers.js # Hook de manejadores de usuario
│   │   │   └── useUsers.js        # Hook de gestión de usuarios
│   │   ├── 📁 repositories/       # Capa de acceso a datos
│   │   │   ├── authRepository.js  # Repositorio de autenticación
│   │   │   ├── categoryRepository.js # Repositorio de categorías
│   │   │   ├── transactionRepository.js # Repositorio de transacciones
│   │   │   └── userRepository.js  # Repositorio de usuarios
│   │   ├── 📁 services/           # Servicios de negocio
│   │   │   ├── auth.service.js    # Servicios de autenticación
│   │   │   ├── category.service.js # Servicios de categorías
│   │   │   ├── transaction.service.js # Servicios de transacciones
│   │   │   ├── user.service.js    # Servicios de usuarios
│   │   │   └── 📁 utils/          # Utilidades de servicios
│   │   │       └── createValidationError.js # Creación de errores de validación
│   │   ├── 📁 styles/             # Hojas de estilo CSS
│   │   │   ├── Auth.css           # Estilos de autenticación
│   │   │   ├── CategoryList.css   # Estilos de lista de categorías
│   │   │   ├── Main.css           # Estilos principales
│   │   │   ├── transactions.css   # Estilos de transacciones
│   │   │   └── UserList.css       # Estilos de lista de usuarios
│   │   ├── 📁 utils/              # Utilidades del frontend
│   │   │   ├── ApiError.js        # Manejo de errores de API
│   │   │   └── errorHandler.js    # Manejador global de errores
│   │   ├── App.css                # Estilos principales de la aplicación
│   │   ├── App.js                 # Componente raíz de React
│   │   ├── index.css              # Estilos globales
│   │   ├── index.js               # Punto de entrada de React
│   ├── .env.development           # Variables de entorno de desarrollo
│   ├── craco.config.js            # Configuración de CRACO
│   ├── Dockerfile                 # Imagen Docker para producción
│   ├── Dockerfile.dev             # Imagen Docker para desarrollo
│   └── package.json               # Dependencias y scripts de React
├── 📁 database/                   # Archivos de base de datos
│   └── Diagrama ER Transacciones.png # Diagrama entidad-relación
├── 📁 nginx/                      # Configuración del proxy
│   └── nginx.conf                 # Configuración de Nginx
├── 📁 scripts/                    # Scripts de utilidad
│   └── init-replica.js            # Inicialización de MongoDB Replica Set
├── .gitignore                     # Archivos ignorados por Git
├── API_test.md                    # Documentación y tests de API
├── docker-compose.yml             # Orquestación de contenedores Docker
├── Ejemplos_de_proyectos.md       # Documentación de ejemplos
├── package.json                   # Configuración del workspace
└── README.md                      # Documentación principal (este archivo)
```

---

## 🚀 Configuración e Instalación

### 📋 Prerrequisitos

- **Docker Desktop** 4.0+ con Docker Compose V2
- **Node.js** 18+ (para desarrollo local opcional)
- **Git** para control de versiones
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

### 🛠️ Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/agustinso0/Proyecto-Final.git
cd Proyecto-Final

# 2. Construir e iniciar todos los servicios
docker-compose up --build

# 3. Poblar la base de datos (en otra terminal)
docker-compose exec backend npm run seed:all
```

### 🔧 Variables de Entorno

El sistema utiliza las siguientes variables de entorno principales:

**Backend (.env):**

```env
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb://database:27017/app_database
JWT_SECRET=your_secure_jwt_secret_here
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

**Frontend (.env.development):**

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true
FAST_REFRESH=true
```

---

## 🎮 Uso del Sistema

### 📱 URLs de Acceso

- **Aplicación Principal:** <http://localhost:3000>
- **API Backend:** <http://localhost:3001/api>
- **Health Check:** <http://localhost:3001/health>
- **Proxy Nginx:** <http://localhost>
- **MongoDB:** localhost:27018

### 🔑 Funcionalidades Principales

#### 👤 **Gestión de Usuarios**

- **Registro y autenticación** con JWT y sistema de sesiones múltiples
- **Perfiles completos** con nombre, apellido y email
- **Gestión de contraseñas** con cambio seguro
- **Balance personal** con operaciones de suma y resta
- **Sesiones activas** con capacidad de invalidación individual
- **Eliminación lógica** para mantener integridad de datos

#### 💳 **Gestión de Transacciones**

- **Registro detallado** de ingresos y gastos con montos precisos
- **Categorización obligatoria** para mejor organización
- **Filtros avanzados** por categoría, rango de fechas
- **Descripciones opcionales** para contexto adicional
- **Asociación automática** con usuario autenticado
- **Resúmenes financieros** con estadísticas personalizadas
- **Consultas por categoría** para análisis específicos

#### 🏷️ **Sistema de Categorías**

- **Categorías personalizables** con nombre y descripción
- **Iconos y colores** para identificación visual
- **Protección de integridad** (no eliminación si tiene transacciones)
- **Gestión completa** CRUD para administradores
- **Asociación automática** con transacciones

#### � **Seguridad y Autenticación**

- **JWT robusto** con expiración configurable
- **Rate limiting** de 100 requests por 15 minutos
- **Validación estricta** con Joi en todos los endpoints
- **Middleware de autenticación** en rutas protegidas
- **Hash seguro** de contraseñas con bcrypt
- **CORS configurado** para desarrollo y producción

#### 📊 **Monitoreo y Logging**

- **Health check** endpoint para verificar estado del sistema
- **Logs estructurados** con Winston (combined.log, error.log)
- **Información del sistema** (uptime, environment, database status)
- **Middleware de auditoría** para tracking de requests

---

## 🔄 Desarrollo y Hot Reload

### 🛠️ **Configuración de Desarrollo**

El sistema está optimizado para desarrollo con:

- ✅ **Hot Reload automático** en React y Express
- ✅ **Reinicio automático** del backend con cambios
- ✅ **Live reload** de estilos CSS
- ✅ **Debugging remoto** en puerto 9229
- ✅ **Persistencia de datos** con volúmenes Docker

### 📝 **Workflow de Desarrollo**

1. **Iniciar servicios**: `docker-compose up -d`
2. **Verificar logs**: `docker-compose logs -f`
3. **Desarrollar**: Modificar archivos en `frontend/src/` o `backend/`
4. **Ver cambios**: Automáticamente reflejados en el navegador

### 🗃️ **Configuración de MongoDB con Replica Set**

El sistema utiliza **MongoDB 7** configurado con **Replica Set** para proporcionar alta disponibilidad, replicación de datos y soporte para transacciones ACID.

#### **🔧 Configuración Automática**

La configuración del Replica Set se inicializa automáticamente mediante:

1. **Docker Compose**: Configuración del contenedor MongoDB
2. **Script de Inicialización**: `scripts/init-replica.js` ejecutado al primer arranque
3. **Backend Connection**: Conexión optimizada desde Express.js

#### **📋 Configuración en docker-compose.yml**

```yaml
database:
  image: mongo:7
  container_name: app_mongo
  restart: unless-stopped
  ports:
    - "27018:27017"
  volumes:
    - mongo_data:/data/db
    - ./scripts/init-replica.js:/docker-entrypoint-initdb.d/init-replica.js:ro
  environment:
    - MONGO_INITDB_DATABASE=app_database
  command: ["mongod", "--replSet", "rs0", "--bind_ip_all"]
  networks:
    - app_network
```

#### **🚀 Script de Inicialización (scripts/init-replica.js)**

```javascript
// Inicializar replica set de MongoDB
try {
  // Verificar si el replica set ya está inicializado
  var status = rs.status();
  print("Replica set ya está inicializado");
} catch (e) {
  // El replica set no está inicializado, proceder a configurarlo
  print("Inicializando replica set...");

  var config = {
    _id: "rs0",
    members: [
      {
        _id: 0,
        host: "database:27017",
      },
    ],
  };

  rs.initiate(config);

  // Esperar a que el replica set esté listo
  var attempts = 0;
  var maxAttempts = 30;

  while (attempts < maxAttempts) {
    try {
      var status = rs.status();
      if (status.members[0].state === 1) {
        print("Replica set inicializado correctamente");
        break;
      }
    } catch (e) {
      // Continuar esperando
    }

    attempts++;
    sleep(1000); // Esperar 1 segundo
  }

  if (attempts >= maxAttempts) {
    print("Error: No se pudo inicializar el replica set en el tiempo esperado");
  }
}
```

#### **⚙️ Configuración del Backend**

El backend se conecta al Replica Set usando la configuración en `backend/config/database.js`:

```javascript
const connectToDatabase = async (env = process.env.NODE_ENV || "development") => {
  const uri = getMongoURI(env);
  
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
};

// URI de conexión: mongodb://database:27017/app_database
```

#### **🔍 Comandos de Verificación**

```bash
# Verificar estado del replica set
docker-compose exec database mongosh --eval "rs.status()"

# Ver configuración del replica set
docker-compose exec database mongosh --eval "rs.conf()"

# Verificar miembros del replica set
docker-compose exec database mongosh --eval "rs.printReplicationInfo()"

# Acceder al shell de MongoDB
docker-compose exec database mongosh app_database

# Verificar si es el nodo primario
docker-compose exec database mongosh --eval "rs.isMaster()"

# Ver logs del replica set
docker-compose logs database | grep -i replica
```

#### **🗃️ Comandos de Base de Datos**

```bash
# Poblar datos iniciales
docker-compose exec backend npm run seed:categories
docker-compose exec backend npm run seed:transaction_types
docker-compose exec backend npm run seed:users
docker-compose exec backend npm run seed:transactions

# Poblar todo de una vez
docker-compose exec backend npm run seed:all

# Verificar conexión desde el backend
docker-compose exec backend npm run test:db-connection
```

#### **🛠️ Configuración Manual (si es necesario)**

Si por alguna razón el script automático falla, puedes inicializar manualmente:

```bash
# 1. Acceder al shell de MongoDB
docker-compose exec database mongosh

# 2. Inicializar el replica set
rs.initiate({
  _id: "rs0",
  members: [
    {
      _id: 0,
      host: "database:27017"
    }
  ]
});

# 3. Verificar estado
rs.status();

# 4. Esperar hasta que el estado sea PRIMARY
rs.isMaster();
```

#### **📊 Beneficios del Replica Set**

- ✅ **Alta Disponibilidad**: Failover automático en caso de fallas
- ✅ **Replicación de Datos**: Copia de seguridad automática
- ✅ **Transacciones ACID**: Soporte completo para transacciones
- ✅ **Lectura de Secundarios**: Balanceamiento de carga de lectura
- ✅ **Consistencia de Datos**: Garantía de consistencia eventual
- ✅ **Backup Incremental**: Oplog para respaldos eficientes

#### **⚠️ Consideraciones Importantes**

1. **Primer Arranque**: El replica set se inicializa en el primer `docker-compose up`
2. **Puerto Personalizado**: MongoDB expuesto en puerto `27018` (no el estándar 27017)
3. **Persistencia**: Los datos se mantienen en el volumen `mongo_data`
4. **Red Interna**: Comunicación interna en red `app_network`
5. **Tiempo de Inicialización**: Puede tomar 10-30 segundos en el primer arranque

---

## 📊 API Documentation

### 🌐 **Base URL**

```url
http://localhost:3001/api
```

### 🔐 **Autenticación**

Todas las rutas excepto registro y login requieren autenticación JWT mediante header `Authorization: Bearer <token>`.

#### **Endpoints de Autenticación**

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstname": "string",
  "lastname": "string", 
  "email": "string",
  "password": "string"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "string",
  "newPassword": "string"
}
```

```http
GET /api/auth/sessions
Authorization: Bearer <token>
# Obtener todas las sesiones activas del usuario
```

```http
DELETE /api/auth/sessions/:sessionId
Authorization: Bearer <token>
# Invalidar una sesión específica
```

### 👥 **Usuarios**

#### **Endpoints de Usuarios**

```http
GET /api/users
Authorization: Bearer <token>
# Obtener todos los usuarios (solo admin)
```

```http
GET /api/users/:id
Authorization: Bearer <token>
# Obtener usuario específico por ID
```

```http
GET /api/users/email/:email
Authorization: Bearer <token>
# Obtener usuario por email
```

```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstname": "string",
  "lastname": "string",
  "email": "string", 
  "password": "string",
  "balance": "number (opcional)"
}
```

```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstname": "string (opcional)",
  "lastname": "string (opcional)",
  "email": "string (opcional)"
}
```

```http
DELETE /api/users/:id
Authorization: Bearer <token>
# Eliminación lógica (desactivar usuario)
```

```http
PATCH /api/users/:id/balance
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": "number",
  "operation": "sumar | restar"
}
```

### 💰 **Transacciones**

#### **Endpoints de Transacciones**

```http
GET /api/transactions
Authorization: Bearer <token>
# Query params opcionales:
# ?category=categoryId
# ?startDate=YYYY-MM-DD
# ?endDate=YYYY-MM-DD
```

```http
GET /api/transactions/:id
Authorization: Bearer <token>
# Obtener transacción específica
```

```http
GET /api/transactions/summary
Authorization: Bearer <token>
# Obtener resumen financiero del usuario
```

```http
GET /api/transactions/category/:categoryId
Authorization: Bearer <token>
# Obtener transacciones por categoría específica
```

```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": "number",
  "type": "income | expense",
  "category": "categoryId",
  "description": "string (opcional)"
}
```

```http
PUT /api/transactions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": "number (opcional)",
  "type": "income | expense (opcional)",
  "category": "categoryId (opcional)",
  "description": "string (opcional)"
}
```

```http
DELETE /api/transactions/:id
Authorization: Bearer <token>
# Eliminar transacción
```

### 🏷️ **Categorías**

#### **Endpoints de Categorías**

```http
GET /api/categories
Authorization: Bearer <token>
# Obtener todas las categorías disponibles
```

```http
GET /api/categories/:id
Authorization: Bearer <token>
# Obtener categoría específica por ID
```

```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "description": "string (opcional)",
  "color": "string (opcional)",
  "icon": "string (opcional)"
}
```

```http
PUT /api/categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string (opcional)",
  "description": "string (opcional)", 
  "color": "string (opcional)",
  "icon": "string (opcional)"
}
```

```http
DELETE /api/categories/:id
Authorization: Bearer <token>
# Eliminar categoría (solo si no tiene transacciones asociadas)
```

### 🔍 **Health Check**

```http
GET /health
# Verificar estado del servidor (no requiere autenticación)

Respuesta:
{
  "status": "OK",
  "timestamp": "2025-07-14T10:30:00.000Z",
  "uptime": 1234.567,
  "environment": "development",
  "database": "connected"
}
```

### 📋 **Estructura de Respuestas**

#### **Respuesta Exitosa**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    // Datos solicitados
  },
  "message": "Descripción del resultado"
}
```

#### **Respuesta de Error**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Descripción del error",
  "errors": [
    // Array de errores de validación (si aplica)
  ]
}
```

### 🔒 **Autenticación y Autorización**

- **JWT Token**: Se requiere en header `Authorization: Bearer <token>` para rutas protegidas
- **Sesiones**: Sistema de sesiones múltiples con invalidación individual
- **Rate Limiting**: 100 requests por 15 minutos por IP
- **Validación**: Validación estricta con Joi para todos los inputs
- **CORS**: Configurado para frontend en `http://localhost:3000`

---

## 🐛 Solución de Problemas

### ❌ **Problemas Comunes**

#### 🔴 **Error: MongoDB Connection Failed**

```bash
# Verificar estado de MongoDB
docker-compose ps database

# Reiniciar base de datos
docker-compose restart database

# Ver logs de MongoDB
docker-compose logs database
```

#### 🔴 **Error: Puerto ya en uso**

```bash
# Verificar puertos ocupados
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Cambiar puertos en docker-compose.yml o matar procesos
taskkill /PID <PID_NUMBER> /F
```

#### 🔴 **Error: Hot reload no funciona**

```bash
# Verificar variables de entorno de polling
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true

# Reiniciar servicio frontend
docker-compose restart frontend
```

### 🧹 **Comandos de Limpieza**

```bash
# Limpiar contenedores parados
docker container prune -f

# Limpiar imágenes sin uso
docker image prune -f

# Limpiar volúmenes no utilizados
docker volume prune -f

# Limpieza completa del sistema
docker system prune -a --volumes -f

# Reconstruir completamente
docker-compose down -v --rmi all
docker-compose build --no-cache
docker-compose up
```

---

## 🚀 Despliegue a Producción

### 🏭 **Configuración de Producción**

1. **Variables de entorno seguras**:

```env
NODE_ENV=production
MONGO_URI=mongodb://mongo-cluster/app_database
JWT_SECRET=ultra_secure_random_string_256_bits
CORS_ORIGIN=https://yourdomain.com
```

2. **Optimizaciones Docker**:

- Multi-stage builds para imágenes mínimas
- Health checks robustos
- Límites de recursos (CPU, memoria)
- Secrets management con Docker Swarm

3. **Configuración Nginx**:

- SSL/TLS con certificados válidos
- Compresión gzip/brotli
- Cache de archivos estáticos
- Rate limiting avanzado

### 🔒 **Consideraciones de Seguridad**

- ✅ **HTTPS obligatorio** en producción
- ✅ **JWT con expiración corta** y refresh tokens
- ✅ **Rate limiting** por IP y usuario
- ✅ **Validación estricta** de inputs
- ✅ **Logs de auditoría** completos
- ✅ **Backup automático** de base de datos
- ✅ **Monitoring** y alertas

---

## 📚 Recursos y Referencias

### 📖 **Documentación Técnica**

- **MongoDB:** [Documentación Oficial](https://docs.mongodb.com/)
- **Express.js:** [Guía de Express](https://expressjs.com/guide/)
- **React:** [Documentación React](https://react.dev/)
- **Docker:** [Docker Documentation](https://docs.docker.com/)

### 🛠️ **Herramientas de Desarrollo**

- **MongoDB Compass:** GUI para explorar la base de datos
- **Postman:** Testing de APIs REST
- **React DevTools:** Debugging de componentes React
- **Docker Desktop:** Gestión visual de contenedores

### 🏗️ **Arquitectura y Patrones**

Este proyecto implementa:

- **Clean Architecture** con separación de capas
- **Repository Pattern** para acceso a datos
- **Service Layer** para lógica de negocio
- **Custom Hooks** para lógica reutilizable en React
- **Error Boundaries** para manejo robusto de errores
- **JWT Authentication** con refresh tokens

---

### 📝 **Estándares de Código**

- **Nomenclatura:** camelCase para JavaScript, kebab-case para archivos
- **Commits:** Conventional Commits (feat:, fix:, docs:, etc.)
- **Linting:** ESLint + Prettier configurados

---

**🎉 Sistema de Control de Gastos Personales listo para usar!**

Desarrollado con ❤️ por **Grupo 4** - Universidad Tecnológica Nacional
