# CineFlow API Gateway

API Gateway centralizado para los microservicios de CineFlow basado en Spring Cloud Gateway.

## Puertos y Rutas

| Servicio | Puerto | Ruta | URL Base |
|----------|--------|------|----------|
| Gateway | 8080 | / | http://localhost:8080 |
| Usuarios | 8081 | /usuarios | http://localhost:8080/usuarios |
| Cartelera | 8082 | /cartelera | http://localhost:8080/cartelera |
| Confitería | 8083 | /confiteria | http://localhost:8080/confiteria |
| Entradas | 8084 | /entradas | http://localhost:8080/entradas |

## Características

- ✅ Enrutamiento centralizado
- ✅ CORS habilitado globalmente
- ✅ Descubrimiento de servicios con Eureka (opcional)
- ✅ Logging de peticiones

## Uso

### Iniciar el Gateway

```bash
cd CineFlow-Gateway
mvn clean install
mvn spring-boot:run
```

### Ejemplos de Uso

#### Registrar un usuario
```bash
curl -X POST http://localhost:8080/usuarios/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "fechaNacimiento": "1990-05-15"
  }'
```

#### Obtener todos los usuarios
```bash
curl http://localhost:8080/usuarios
```

#### Obtener cartelera
```bash
curl http://localhost:8080/cartelera
```

#### Obtener confitería
```bash
curl http://localhost:8080/confiteria
```

#### Obtener entradas
```bash
curl http://localhost:8080/entradas
```

## Configuración

Edita `application.yml` para:
- Agregar/eliminar rutas
- Cambiar puertos de los microservicios
- Configurar filtros personalizados
- Ajustar configuración de CORS
