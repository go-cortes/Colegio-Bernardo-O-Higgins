# frontend-webapp

SPA React + TypeScript que provee los portales de Administrador, Profesor y Alumno. Consume datos exclusivamente a través del BFF en `http://localhost:8080`.

## Requisitos

- Node.js 20+
- BFF corriendo en el puerto 8080

## Ejecución

```bash
npm install
npm run dev
```

Disponible en **http://localhost:5173**

## Otras tareas

```bash
npm run build      # Build de producción
npm run test       # Pruebas unitarias con Vitest
npm run coverage   # Reporte de cobertura
npm run lint       # Análisis estático con ESLint
```

## Credenciales de demo

| Email | Contraseña | Rol |
|---|---|---|
| admin@colegio.cl | 1234 | Administrador |
| profesor@colegio.cl | 1234 | Profesor |
| estudiante@colegio.cl | 1234 | Alumno |

## Variables de entorno (opcionales)

Crea `.env.local` solo si usas Supabase para auth. El sistema usa auth local por defecto:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

## Stack

| Tecnología | Uso |
|---|---|
| React 19 + TypeScript | UI declarativa |
| Vite 8 | Dev server y bundler |
| Tailwind CSS 4 | Estilos |
| React Router 7 | Enrutamiento SPA |
| Recharts | Gráficos en el dashboard |
