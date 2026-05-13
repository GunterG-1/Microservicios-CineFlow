# API Gateway y Modificaciones de Usuarios - CineFlow

## Resumen de Cambios

### 1. API Gateway (CineFlow-Gateway)

Se ha creado un nuevo servicio **API Gateway** basado en Spring Cloud Gateway que actúa como punto de entrada centralizado para todos los microservicios.

**Características:**
- Puerto: **8080**
- Enrutamiento centralizado a todos los microservicios
- CORS habilitado globalmente
- Descubrimiento de servicios con Eureka (opcional)

**Rutas configuradas:**

| Ruta | Destino | Puerto |
|------|---------|--------|
| `/usuarios/**` | CineFlow-Usuarios | 8081 |
| `/cartelera/**` | CineFlow-Cartelera | 8082 |
| `/confiteria/**` | CineFlow-Confitería | 8083 |
| `/entradas/**` | CineFlow-Entradas | 8084 |

**Iniciar:**
```bash
cd CineFlow-Gateway
mvn clean install
mvn spring-boot:run
```

---

### 2. Modificaciones en CineFlow-Usuarios

Se han modificado los DTOs y endpoints para cambiar el flujo de registro y actualización.

#### **Cambio 1: Registro Simplificado**

**Nuevo DTO: `RegistroDTO`**

Ahora el registro solo requiere:
- `nombre` (string, requerido)
- `apellido` (string, requerido)
- `email` o `correo` (string, requerido)
- `password` o `contrasena` (string, requerido)
- `confirmarContrasena` o `repetirContrasena` (string, requerido)
- `fechaNacimiento` (date, requerido)

**NO incluye método de pago**

#### **Cambio 2: Actualización con Método de Pago**

**Nuevo DTO: `ActualizarUsuarioDTO`**

La actualización ahora permite:
- `nombre` (opcional)
- `apellido` (opcional)
- `contrasena` (opcional)
- `metodoPago` (requerido para actualizar)

---

## Endpoints de la API

### **Registro (nuevo)**

**POST** `/usuarios/registrar`

**Body (RegistroDTO):**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "password": "MiContraseña123",
  "confirmarContrasena": "MiContraseña123",
  "fechaNacimiento": "1990-05-15"
}
```

**Response (201 Created):**
```json
{
  "idUsuario": 1,
  "nombreUsuario": "Juan",
  "apellidoUsuario": "Pérez",
  "correo": "juan@example.com",
  "fechaNacimiento": "1990-05-15",
  "metodoPago": null
}
```

---

### **Actualizar Usuario con Método de Pago (nuevo)**

**PUT** `/usuarios/{id}/actualizar`

**Body (ActualizarUsuarioDTO):**
```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez García",
  "metodoPago": "Tarjeta de Crédito Visa"
}
```

**Response (200 OK):**
```json
{
  "idUsuario": 1,
  "nombreUsuario": "Juan Carlos",
  "apellidoUsuario": "Pérez García",
  "correo": "juan@example.com",
  "fechaNacimiento": "1990-05-15",
  "metodoPago": "Tarjeta de Crédito Visa"
}
```

---

### **Login (sin cambios)**

**POST** `/usuarios/login`

**Body:**
```json
{
  "correo": "juan@example.com",
  "contrasena": "MiContraseña123"
}
```

---

### **Obtener Perfil por Correo**

**GET** `/usuarios/perfil?correo=juan@example.com`

---

### **Obtener Usuario por ID**

**GET** `/usuarios/{id}`

---

### **Obtener Todos los Usuarios**

**GET** `/usuarios`

---

### **Eliminar Usuario**

**DELETE** `/usuarios/{id}`

---

### **Verificar si Existe Correo**

**GET** `/usuarios/existe-correo/{correo}`

---

## Ejemplos con cURL

### Registrar nuevo usuario
```bash
curl -X POST http://localhost:8080/usuarios/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "password": "Contraseña123",
    "confirmarContrasena": "Contraseña123",
    "fechaNacimiento": "1990-05-15"
  }'
```

### Actualizar usuario con método de pago
```bash
curl -X PUT http://localhost:8080/usuarios/1/actualizar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "apellido": "Pérez García",
    "metodoPago": "Visa 1234"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "juan@example.com",
    "contrasena": "Contraseña123"
  }'
```

### Obtener perfil
```bash
curl "http://localhost:8080/usuarios/perfil?correo=juan@example.com"
```

---

## Cambios de Base de Datos

El campo `metodoPago` ahora es **nullable** (`nullable = true`).

**Migración automática:** Con `spring.jpa.hibernate.ddl-auto=update`, la base de datos se actualizará automáticamente al iniciar la aplicación.

---

## Flujo de Uso Recomendado

1. **Usuario se registra:**
   - POST `/usuarios/registrar` con `RegistroDTO`
   - Sistema crea usuario sin método de pago

2. **Usuario inicia sesión:**
   - POST `/usuarios/login` con correo y contraseña
   - Sistema retorna datos del usuario

3. **Usuario actualiza su perfil:**
   - PUT `/usuarios/{id}/actualizar` con `ActualizarUsuarioDTO`
   - Sistema actualiza nombre, apellido, contraseña y/o método de pago

---

## Compatibilidad

El endpoint antiguo `/usuarios/registrar-completo` sigue disponible para compatibilidad con código antiguo que envía el modelo `Usuario` completo.

---

## Notas Técnicas

- **DTOs creados:** `RegistroDTO.java`, `ActualizarUsuarioDTO.java`, `ErrorResponse.java`
- **Service actualizado:** `usuarioService.registrarUsuario()`, `usuarioService.actualizarUsuarioDesdeDTO()`
- **Controller actualizado:** Nuevos endpoints `/registrar`, `/actualizar`
- **Modelo Usuario:** Campo `metodoPago` ahora es opcional
