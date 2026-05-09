# Sistema de Gestión Académica — Colegio Bernardo O'Higgins

Plataforma web full-stack para la gestión de calificaciones y usuarios del Colegio Bernardo O'Higgins. Construida con arquitectura de microservicios desacoplados, un BFF como capa de orquestación y un frontend React que consume exclusivamente el BFF, sin acceso directo a la base de datos.

---

## Arquitectura

```
Frontend React (5173)
        │
        ▼  HTTP / REST
BFF Spring Boot (8080)   ← Circuit Breaker + CORS
        │
   ┌────┴────┐
   ▼         ▼
ms-usuarios  ms-notas
  (8081)      (8082)
   │             │
   └──── PostgreSQL ────┘
```

---

## Patrones Implementados

- **BFF (Backend For Frontend):** `BffController` y `BffService` actúan como API Gateway único para el frontend, orquestando llamadas a los microservicios y agregando los datos en una sola respuesta.
- **Repository (JPA):** `NotaRepository` y `UsuarioRepository` extienden `JpaRepository<T, Long>`. Las entidades usan `@Entity`, `@Table`, `@Id` y `@GeneratedValue`, desacoplando la lógica de negocio del acceso a datos.
- **Circuit Breaker (Resilience4j):** Implementado en `BffService` con `@CircuitBreaker`. Si un microservicio falla, el BFF retorna una respuesta de fallback en lugar de propagar un error 500 al frontend.

---

## Instrucciones de Ejecución

Levantar los servicios en este orden:

### 1. Base de datos PostgreSQL

Asegúrate de tener PostgreSQL corriendo y crea las bases de datos:

```sql
CREATE DATABASE colegio_usuarios;
CREATE DATABASE colegio_notas;
```

### 2. Microservicio de Usuarios (puerto 8081)

```bash
cd microservicio-usuarios
mvn spring-boot:run
```

### 3. Microservicio de Notas (puerto 8082)

```bash
cd microservicio-notas
mvn spring-boot:run
```

### 4. BFF (puerto 8080)

```bash
cd backend-bff
mvn spring-boot:run
```

### 5. Frontend (puerto 5173)

```bash
cd frontend-webapp
npm install
npm run dev
```

Abre el navegador en **http://localhost:5173**

---

## Credenciales de demo

| Email | Contraseña | Rol |
|---|---|---|
| admin@colegio.cl | 1234 | Administrador |
| profesor@colegio.cl | 1234 | Profesor |
| estudiante@colegio.cl | 1234 | Alumno |

---

## Puertos

| Servicio | Puerto |
|---|---|
| Frontend | 5173 |
| BFF | 8080 |
| microservicio-usuarios | 8081 |
| microservicio-notas | 8082 |

---

## Estructura del repositorio

```
Colegio-Bernardo-O-Higgins/
├── frontend-webapp/          # SPA React + TypeScript + Vite
├── backend-bff/              # BFF Spring Boot 3 — API Gateway
├── microservicio-usuarios/   # Microservicio usuarios (JPA + PostgreSQL)
├── microservicio-notas/      # Microservicio notas (JPA + PostgreSQL)
├── maven-arquetipo-spring/   # Arquetipo Maven base para nuevos microservicios
└── docs/                     # Documentación técnica
```

---

*Evaluación Parcial 2 — Full Stack 3 — 2026*
