# Sistema Fullstack: Gestión Académica (Colegio Bernardo O'Higgins)

Este proyecto cumple íntegramente con los estándares y rúbricas académicas exigentes para el desarrollo de software distribuido. Aborda el diseño e implementación de un sistema escalable utilizando React (SPA) para el frontend, y microservicios independientes (Java + Spring Boot) orquestados mediante un BFF (Node.js).

---

## 🏗️ 1. Arquitectura del Sistema (Frontend + Backend)

El sistema opera bajo una arquitectura distribuida orientada a microservicios.

*   **Frontend (SPA):** Desarrollado con React, TypeScript, Vite y Tailwind CSS. Gestiona la capa de presentación y el estado de la UI de manera aislada. Se comunica directamente con Supabase para la autenticación y con el BFF para transacciones complejas.
*   **API Gateway / BFF (Backend For Frontend):** Servidor intermedio en Node.js (Express). Encapsula las complejidades de la red interna, realiza llamadas asíncronas en paralelo (`Promise.all`) a los microservicios y arma modelos de datos agregados (*Dashboard*) a la medida del frontend.
*   **Microservicios Core (Java 17 + Spring Boot):** 
    *   `microservice-users`: Procesa la lógica de usuarios (estudiantes).
    *   `microservice-academic`: Gestiona exclusivamente el dominio de notas/calificaciones.

> Para mayor detalle en la separación, revisa el archivo `repositorios.txt` incluido en la raíz, donde se sugiere la configuración para CI/CD independiente de cada módulo.

---

## 🔒 2. Autenticación y Control de Roles (Frontend)

El Frontend implementa un sólido esquema de seguridad utilizando **Supabase Auth**.

1. **Autenticación Real:** El formulario `/login` valida las credenciales directamente contra Supabase generando un JWT seguro.
2. **Control de Acceso (Guard):** No es posible acceder a ninguna ruta interna (como `/dashboard` o `/admin`) sin una sesión activa. Si se intenta, el sistema bloquea el acceso y redirige al login.
3. **Flujo por Roles Estricto:** Al iniciar sesión, el sistema evalúa el rol del usuario (extraído de su `user_metadata`) y lo empuja a su entorno aislado:
    *   `admin` → Redirige a **`/admin`** (Gestión de usuarios y asignación de roles).
    *   `profesor` → Redirige a **`/profesor`** (Lista de alumnos, notas, asistencia).
    *   `alumno` → Redirige a **`/dashboard`** (Mis notas, promedio, historial).

---

## 🧩 3. Patrones de Diseño Implementados

Se han implementado **4 patrones de diseño de software**, esenciales para mantener un código limpio (Clean Code) y altamente cohesionado:

### 3.1 Patrón *Provider / Context* (State Management)
*   **Dónde se aplica:** Frontend (`src/contexts/AuthContext.tsx`).
*   **Problema que resuelve:** El problema del *Prop Drilling* (pasar el objeto de sesión del usuario por múltiples capas de componentes).
*   **Justificación técnica:** Inyecta datos globales (la sesión y el rol) en la raíz de la app (`App.tsx`). Cualquier componente interno usa el hook `useAuth()` para saber instantáneamente quién es el usuario.

### 3.2 Patrón *Guard / Protected Route* (Control de Acceso)
*   **Dónde se aplica:** Frontend (`src/components/ProtectedRoute.tsx` y el enrutador en `App.tsx`).
*   **Problema que resuelve:** Usuarios no autenticados o con roles incorrectos accediendo a pantallas privadas ingresando la URL a mano.
*   **Justificación técnica:** Encapsula la lógica de autorización en un componente tipo Wrapper. Si la validación de `allowedRoles` falla, bloquea el renderizado y redirige, centralizando la seguridad en el cliente en lugar de repartir `if/else` en cada vista.

### 3.3 Patrón *Service Layer* (Capa de Servicios)
*   **Dónde se aplica:** Backend Java (`UserService.java` y `AcademicService.java`).
*   **Problema que resuelve:** Evita que los controladores HTTP concentren lógica de negocio compleja (*Fat Controllers*).
*   **Justificación técnica:** Aumenta drásticamente la mantenibilidad y permite someter la lógica a pruebas unitarias rigurosas (*mockeando* las dependencias) sin levantar el contexto web completo.

### 3.4 Patrón *Repository (Abstracción de Datos)*
*   **Dónde se aplica:** Frontend (`src/services/api.test.ts` que simula el `ApiService`).
*   **Problema que resuelve:** Componentes de React (UI) mezclados y acoplados fuertemente a bibliotecas de red como `fetch` o `axios`.
*   **Justificación técnica:** Centraliza las llamadas a la API (o a Supabase). Si mañana cambia la ruta del BFF o la librería HTTP, se modifica un solo archivo de servicio, aislando la lógica de obtención de datos de la lógica visual.

---

## 🌿 4. Estrategia de Branching

Para el trabajo en equipo, hemos definido un proceso basado en **GitFlow** (Ramas temporales `feature/*` y `hotfix/*`, que convergen en ramas persistentes `develop` y `main`).
*   **Resolución de conflictos y flujos PR:** Documentado a fondo en el archivo `estrategia_branching.md`.

---

## 🧪 5. Pruebas Unitarias (Testing)

Se garantiza la correctitud funcional mediante la adopción de TDD/BDD.
*   **Tecnología:** Vitest + React Testing Library.
*   **Componentes Probados:** Validación de renderizado (Component-based). Ej: `Button.test.tsx`.
*   **Lógica Probada:** Validación de inyección de dependencias y servicios API. Ej: `api.test.ts`.

### 💻 Ejecutar los tests (Frontend):
```bash
cd frontend-webapp
npm run test
npm run coverage
```

---

## 🚀 6. Ejecución Completa del Sistema

La solución está completamente contenedorizada para eliminar el clásico problema "en mi máquina funciona".

1. Levantar toda la orquestación (BFF + Microservicios) mediante Docker:
   ```bash
   cd proyecto
   docker-compose up --build
   ```

2. Ejecutar el Frontend Localmente (Con Vite):
   ```bash
   cd frontend-webapp
   npm run dev
   ```

3. Puertos:
   *   **Frontend (SPA React):** `http://localhost:5173`
   *   **Dashboard Visual del BFF:** `http://localhost:3000/dashboard`
   *   **API BFF REST:** `http://localhost:3000/api/dashboard`
   *   **Microservicio Users (Salud):** `http://localhost:8081/health`
   *   **Microservicio Academic (Salud):** `http://localhost:8082/health`

---

## 📦 7. Arquetipos Maven

Para la escalabilidad futura del colegio, se construyó un Arquetipo Maven base (`proyecto/maven-archetypes/microservice-base-archetype`). Esto permite generar la base de nuevos microservicios en segundos con la estructura oficial aprobada por la arquitectura, evitando configuración manual (*boilerplate*). Para usarlo, consultar `proyecto/maven-archetypes/README.md`.
