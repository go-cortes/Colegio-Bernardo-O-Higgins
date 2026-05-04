# Backend For Frontend (BFF) Gateway

Este repositorio contiene la capa de orquestación (BFF) construida en Node.js con Express. Su propósito es actuar como único punto de entrada para la aplicación de React (SPA), ocultando la complejidad y ubicación de los microservicios subyacentes.

## 🎯 Patrones y Responsabilidades
*   **BFF Pattern:** Adapta los datos de backend a las necesidades exactas del cliente web.
*   **API Gateway Simplificado:** Protege a los microservicios Java aislando las llamadas.
*   **Agregación de Datos:** En el endpoint `/api/dashboard`, el BFF realiza llamadas en paralelo a los microservicios de Usuarios y Notas usando `Promise.all` para crear un modelo de vista unificado que luego es renderizado por el cliente.

## ⚙️ Requisitos
*   Node.js v18+
*   Docker (para ejecución contenerizada)

## 🚀 Instalación y Ejecución Local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el servidor local:
   ```bash
   npm start
   # o en desarrollo (si cuentas con nodemon):
   npm run dev
   ```
3. Iniciar vía Docker:
   ```bash
   docker build -t bff-gateway .
   docker run -p 3000:3000 bff-gateway
   ```

El servicio estará escuchando en `http://localhost:3000`.
