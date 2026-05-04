# Colegio Bernardo O’Higgins — Frontend (Libro de Clases Digital)

Aplicación web de una sola página (SPA) para gestión académica: autenticación, dashboards por rol, notas, asistencia y administración de usuarios, con datos en **Supabase** y utilidades locales para desarrollo.

Este documento resume **todas las tecnologías** declaradas en el proyecto y **cómo se aplican** en el código.

---

## Resumen del stack


| Área                 | Tecnología                                                 | Versión aprox. (según `package.json`)    |
| -------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| Runtime UI           | React + React DOM                                          | ^19.2.x                                  |
| Lenguaje             | TypeScript                                                 | ~6.0.x                                   |
| Bundler / dev server | Vite                                                       | ^8.0.x                                   |
| Plugin React         | `@vitejs/plugin-react`                                     | ^6.0.x                                   |
| Estilos              | Tailwind CSS + plugin Vite                                 | ^4.2.x                                   |
| Enrutamiento         | `react-router-dom`                                         | ^7.14.x                                  |
| Iconos               | `lucide-react`                                             | ^1.8.x                                   |
| Gráficos             | Recharts                                                   | ^3.8.x                                   |
| Utilidades CSS/JS    | `clsx`, `tailwind-merge`                                   | ver `package.json`                       |
| Cliente backend      | `@supabase/supabase-js`                                    | *(usado en `src/lib/supabaseClient.js`)* |
| Lint                 | ESLint 9 (flat config) + TypeScript ESLint + plugins React | ver `package.json`                       |


---

## Detalle por tecnología

### React (`react`, `react-dom`)

- **Qué es:** biblioteca para interfaces declarativas con componentes y estado.
- **Uso en el proyecto:** toda la UI (`src/pages`, `src/components`, `src/layouts`). Punto de entrada: `src/main.tsx` monta `<App />` en `#root` con `createRoot` de React 19.
- **Modo estricto:** la app se envuelve en `<StrictMode>` para ayudar a detectar efectos secundarios duplicados en desarrollo.

### TypeScript (`typescript`, `@types/react`, `@types/react-dom`, `@types/node`)

- **Qué es:** JavaScript con tipos estáticos.
- **Uso en el proyecto:** casi todo el código fuente es `.ts` / `.tsx`. Configuración en `tsconfig.json` (referencias) + `tsconfig.app.json` (app) y `tsconfig.node.json` (config de Vite).
- **Opciones destacables:** `jsx: "react-jsx"`, `moduleResolution: "bundler"`, objetivo `ES2023`, tipos de Vite (`vite/client`).

### Vite (`vite`)

- **Qué es:** herramienta de desarrollo y empaquetado centrada en ESM y recarga rápida (HMR).
- **Uso en el proyecto:** `vite.config.ts` define plugins; scripts `npm run dev`, `npm run build`, `npm run preview`.
- **Variables de entorno:** prefijo `**VITE_`** expone valores al cliente (p. ej. `import.meta.env.VITE_SUPABASE_URL`). Ver sección [Variables de entorno](#variables-de-entorno).

### `@vitejs/plugin-react`

- **Qué es:** integración oficial de React con Vite (Fast Refresh, JSX).
- **Uso:** registrado en `vite.config.ts` como `react()`.

### Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`)

- **Qué es:** framework utility-first para CSS; en v4 se integra de forma nativa con Vite mediante el plugin `@tailwindcss/vite`.
- **Uso en el proyecto:**
  - `src/index.css`: `@import "tailwindcss";`, bloque `@theme` (colores `primary-`*, fuentes, animación `fade-in-up`), y `@layer base` con `@apply` para `body`.
  - Clases utilitarias en componentes (`flex`, `rounded-lg`, `bg-blue-700`, etc.).

### React Router (`react-router-dom`)

- **Qué es:** enrutamiento del lado del cliente para SPAs (rutas, redirecciones, layouts anidados).
- **Uso en el proyecto:** `src/App.tsx` define `<BrowserRouter>`, `<Routes>`, `<Route>`, `<Navigate>`; rutas protegidas con componentes propios (`ProtectedRoute`, `RoleRoute`) y rutas bajo `/dashboard/`*.

### Lucide React (`lucide-react`)

- **Qué es:** conjunto de iconos SVG como componentes React.
- **Uso en el proyecto:** iconografía en páginas y layout (por ejemplo `Loader2`, `BookOpen`, `Users`, etc.).

### Recharts (`recharts`)

- **Qué es:** biblioteca de gráficos para React basada en SVG.
- **Uso en el proyecto:** `src/pages/Dashboard.tsx` importa componentes como `BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer` para visualizar tendencias de notas.

### `clsx` y `tailwind-merge`

- `**clsx`:** construye strings de clases CSS de forma condicional.
- `**tailwind-merge`:** fusiona clases de Tailwind evitando conflictos (útil para componentes reutilizables con variantes).
- **Uso típico:** patrones de diseño en componentes UI (p. ej. `Button`) para componer clases sin duplicados.

### Supabase (`@supabase/supabase-js`)

- **Qué es:** cliente oficial para **Supabase**: Auth, Postgres (vía API REST/PostgREST), Realtime, Storage, RPC, etc.
- **Uso en el proyecto:**
  - `src/lib/supabaseClient.js` crea el cliente con `createClient(supabaseUrl, supabaseAnonKey)` usando variables `VITE_SUPABASE_`*.
  - `src/contexts/AuthContext.tsx`: sesión (`getSession`, `onAuthStateChange`, `signInWithPassword`, `signOut`) y lectura de perfiles.
  - `src/services/apiService.ts`: consultas a tablas (`profiles`, `students`, `grades`, `attendance`, etc.) y RPC como `create_student_account`.
- **Nota:** asegúrate de tener `@supabase/supabase-js` instalado en `dependencies` si aún no aparece en tu `package.json` local (el código lo importa explícitamente).

### ESLint (`eslint`, `@eslint/js`, `typescript-eslint`, plugins React)

- **Qué es:** analizador estático para mantener estilo y detectar errores.
- **Uso en el proyecto:** configuración **flat config** en `eslint.config.js`:
  - Reglas recomendadas de JS y TypeScript.
  - `eslint-plugin-react-hooks` (reglas de hooks).
  - `eslint-plugin-react-refresh` (compatibilidad con Fast Refresh de Vite).
- **Script:** `npm run lint`.

### Otras herramientas de tipos / entorno

- `**globals`:** definición de globales de navegador para ESLint.
- `**@types/node`:** tipos de Node útiles en archivos de configuración (`vite.config.ts`, etc.).

---

## Patrones de arquitectura en el frontend

- **Context API:** `AuthProvider` / `useAuth`, `NotificationProvider` para estado global sin Redux.
- **Capa de datos:** `apiService.ts` concentra llamadas a Supabase; `dbService.ts` complementa con datos locales (p. ej. almacenamiento en navegador) donde aplique.
- **Componentes UI reutilizables:** `src/components/ui` (Card, Button, etc.).
- **Layouts:** `MainLayout`, `Sidebar`, `Header` para la zona autenticada.

---

## Scripts NPM


| Comando           | Descripción                                                                       |
| ----------------- | --------------------------------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo Vite (HMR). Por defecto suele ser `http://localhost:5173`. |
| `npm run build`   | `tsc -b` (comprobación de tipos) + `vite build` (salida en `dist/`).              |
| `npm run preview` | Sirve la build de producción localmente para pruebas.                             |
| `npm run lint`    | Ejecuta ESLint sobre el proyecto.                                                 |


---

## Variables de entorno

Crea un archivo `.env` (o `.env.local`) en la raíz del frontend con al menos:


| Variable                 | Propósito                                             |
| ------------------------ | ----------------------------------------------------- |
| `VITE_SUPABASE_URL`      | URL del proyecto Supabase.                            |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon) para el cliente en el navegador. |


Sin estas variables, el cliente de Supabase mostrará una advertencia en consola y las funciones que dependan de la API no funcionarán correctamente.

---

## Estructura de carpetas (referencia)

```
frontend-webapp/
├── index.html
├── vite.config.ts
├── eslint.config.js
├── tsconfig*.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/           # p. ej. supabaseClient
│   ├── pages/
│   ├── services/
│   └── types/
└── public/            # activos estáticos (favicon, etc.)
```

---

## Requisitos previos

- **Node.js** (versión compatible con Vite 8 y React 19; se recomienda una LTS reciente).
- Cuenta y proyecto **Supabase** con tablas y políticas alineadas al uso del código (Auth, `profiles`, `students`, `grades`, etc.).

---

## Licencia y propiedad

Proyecto privado (`"private": true` en `package.json`). Ajusta esta sección según la licencia real del colegio o institución.