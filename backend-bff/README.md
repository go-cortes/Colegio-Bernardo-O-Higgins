# backend-bff

API Gateway que implementa el patrón **BFF (Backend For Frontend)**. Recibe todas las peticiones del frontend, las delega a los microservicios correspondientes y agrega las respuestas. Incluye **Circuit Breaker** con Resilience4j para tolerancia a fallos.

## Requisitos

- Java 17+
- Maven 3.8+
- `microservicio-usuarios` corriendo en puerto 8081
- `microservicio-notas` corriendo en puerto 8082

## Ejecución

```bash
mvn spring-boot:run
```

Disponible en **http://localhost:8080**

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/dashboard` | Usuarios + notas combinados |
| GET | `/usuarios` | Lista usuarios (delega a :8081) |
| POST | `/usuarios` | Crea usuario (delega a :8081) |
| GET | `/notas` | Lista notas (delega a :8082) |
| POST | `/notas` | Crea nota (delega a :8082) |

## Circuit Breaker

Si un microservicio no responde, el BFF retorna una respuesta de fallback en lugar de propagar el error:

- `GET /usuarios` → `[]`
- `GET /notas` → `[]`
- `GET /dashboard` → `{ usuarios: [], notas: [], estadoBFF: "Servicio no disponible" }`

## Pruebas

```bash
mvn test
```
