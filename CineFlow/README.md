# CineFlow BFF (Backend for Frontend)

## 📋 Descripción

Este es el Backend for Frontend (BFF) de CineFlow que actúa como API Gateway, conectando el frontend React con los cuatro microservicios:
- **CineFlow-Usuarios** (Puerto 8081)
- **CineFlow-Cartelera** (Puerto 8082)
- **CineFlow-Confitería** (Puerto 8083)
- **CineFlow-Entradas** (Puerto 8084)

## 🚀 Inicio Rápido

### Requisitos
- Java 17+
- Maven 3.8+
- Los 4 microservicios corriendo en los puertos especificados

### Configuración

Las URLs de los microservicios están configuradas en `application.properties`:
```properties
feign.client.config.usuarios-client.url=http://localhost:8081
feign.client.config.cartelera-client.url=http://localhost:8082
feign.client.config.confiteria-client.url=http://localhost:8083
feign.client.config.entradas-client.url=http://localhost:8084
```

### Compilar y Ejecutar

```bash
# Compilar el proyecto
mvn clean package

# Ejecutar la aplicación
mvn spring-boot:run

# O ejecutar desde el JAR
java -jar target/CineFlow-0.0.1-SNAPSHOT.jar
```

El BFF estará disponible en: **http://localhost:8085**

## 📡 Endpoints Disponibles

### 1️⃣ Usuarios
```
GET    /api/usuarios                  - Obtener todos los usuarios
GET    /api/usuarios/{id}             - Obtener usuario por ID
GET    /api/usuarios/correo/{correo}  - Obtener usuario por email
POST   /api/usuarios/login            - Login
POST   /api/usuarios/registrar        - Registrar nuevo usuario
GET    /api/usuarios/perfil           - Obtener perfil (requiere ?correo=)
PUT    /api/usuarios/{id}             - Actualizar usuario
DELETE /api/usuarios/{id}             - Eliminar usuario
```

### 2️⃣ Cartelera
```
GET  /api/cartelera/peliculas              - Obtener todas las películas
GET  /api/cartelera/peliculas/{id}         - Obtener película por ID
GET  /api/cartelera/funciones/{id}/butacas - Obtener asientos de una función
POST /api/cartelera/funciones              - Crear nueva función
```

### 3️⃣ Confitería
```
GET  /api/confiteria/combos              - Obtener todos los combos
GET  /api/confiteria/combos/disponibles  - Obtener combos disponibles
GET  /api/confiteria/combos/{id}         - Obtener combo por ID
POST /api/confiteria/pedidos             - Crear pedido
GET  /api/confiteria/pedidos/{id}        - Obtener detalles del pedido
```

### 4️⃣ Entradas
```
PATCH /api/entradas/reservar         - Reservar asiento
POST  /api/entradas/pagar            - Procesar pago de entrada
GET   /api/entradas/{id}             - Obtener ticket por ID
GET   /api/entradas/{id}/codigoqr    - Obtener código QR del ticket
```

## 🔗 Ejemplos de Uso desde el Frontend (React)

### Login
```javascript
const response = await fetch('http://localhost:8085/api/usuarios/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@example.com',
    password: 'password123'
  })
});
const data = await response.json();
```

### Obtener Cartelera
```javascript
const response = await fetch('http://localhost:8085/api/cartelera/peliculas');
const peliculas = await response.json();
```

### Obtener Asientos de una Función
```javascript
const response = await fetch('http://localhost:8085/api/cartelera/funciones/1/butacas');
const butacas = await response.json();
```

### Obtener Menú de Confitería
```javascript
const response = await fetch('http://localhost:8085/api/confiteria/combos');
const combos = await response.json();
```

### Reservar Asiento
```javascript
const response = await fetch('http://localhost:8085/api/entradas/reservar', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    funcionId: 1,
    butacaId: 5,
    email: 'usuario@example.com'
  })
});
const ticket = await response.json();
```

## 🛠️ Estructura del Proyecto

```
src/main/java/com/backend/CineFlow/CineFlow/
├── clients/                    # Feign Clients para microservicios
│   ├── UsuariosClient.java
│   ├── CarteraClient.java
│   ├── ConfiteriaClient.java
│   └── EntradasClient.java
├── controllers/                # Controladores REST
│   ├── UsuariosController.java
│   ├── CarteraController.java
│   ├── ConfiteriaController.java
│   └── EntradasController.java
├── dto/                        # Modelos de datos
│   ├── UsuarioDTO.java
│   ├── PeliculaDTO.java
│   ├── ComboDTO.java
│   └── ...
├── config/                     # Configuración (CORS, etc)
│   └── CorsConfig.java
└── CineFlowApplication.java    # Clase principal
```

## ✅ CORS Habilitado

El BFF tiene CORS configurado para aceptar solicitudes desde cualquier origen. Las siguientes operaciones están permitidas:
- GET, POST, PUT, PATCH, DELETE
- Headers personalizados
- Credenciales incluidas

## 🧪 Pruebas con Postman

1. Importa la URL base: `http://localhost:8085`
2. Usa los endpoints listados arriba
3. Asegúrate de que todos los microservicios estén corriendo

## 📝 Notas Importantes

- **Todos los microservicios deben estar corriendo** en sus respectivos puertos
- El BFF está configurado con timeouts de 10 segundos para las llamadas a microservicios
- Logging habilitado a nivel DEBUG para facilitar troubleshooting
- RabbitMQ está configurado pero es opcional (los servicios lo usan internamente)

## 🐛 Troubleshooting

### Error: "Connection refused"
- Verifica que los microservicios estén corriendo en los puertos correctos
- Revisa las URLs en `application.properties`

### Error: "CORS blocked"
- El CORS está habilitado globalmente, verifica la consola del navegador para más detalles

### Error: "Feign timeout"
- Aumenta los timeouts en `application.properties` si es necesario:
  ```properties
  feign.client.config.default.readTimeout=15000
  ```

## 📞 Soporte

Para más información sobre los microservicios individuales, consulta sus respectivos README.md
