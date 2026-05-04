# Backend For Frontend (BFF) - Colegio O'Higgins

Este microservicio actúa como un orquestador o capa intermedia (BFF) entre el cliente (Frontend en React) y los microservicios de backend. Su responsabilidad principal es recibir peticiones del frontend, comunicarse con uno o múltiples microservicios, agrupar las respuestas y devolver un único JSON unificado.

## Arquitectura
- **Controller:** Punto de entrada único para el Frontend (`/dashboard`).
- **Service:** Agrupa y orquesta la información.
- **Client:** Implementa `RestTemplate` para realizar llamadas HTTP (GET) a los microservicios subyacentes.

## Dependencias Requeridas (Microservicios)
Para que este BFF devuelva información real, los siguientes microservicios deben estar levantados y ejecutándose en tu máquina local:
1. `microservicio-usuarios` (Debe correr en el puerto `8081`)
2. `microservicio-notas` (Debe correr en el puerto `8082`)

## Ejecución Local

Para ejecutar el BFF:

```bash
cd backend-bff
mvn spring-boot:run
```
El servidor del BFF iniciará en el puerto **`8080`**.

## Endpoints

### 1. Obtener Dashboard Combinado
**GET** `/dashboard`

Este endpoint hace dos peticiones en segundo plano (una a `usuarios` y otra a `notas`) y agrupa los resultados.

**Respuesta Exitosa (200 OK):**
```json
{
  "usuarios": [
    {
      "id": 1,
      "nombre": "Admin Colegio",
      "email": "admin@colegio.cl"
    }
  ],
  "notas": [
    {
      "id": 1,
      "estudianteId": 101,
      "asignatura": "Matemáticas",
      "valorNota": 6.5
    }
  ],
  "estadoBFF": "Operativo - Datos combinados exitosamente"
}
```

## Manejo de Errores
Si uno de los microservicios se cae (ej: apagaste el de notas), el BFF está programado con manejo básico de excepciones (bloque `try/catch` en la capa Client) para devolver una lista vacía en vez de arrojar un error HTTP 500 al Frontend.
