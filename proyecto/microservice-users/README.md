# Microservicio Core: Users

Microservicio desarrollado en **Spring Boot (Java 17)** encargado de gestionar la entidad de estudiantes (Students). 

## 🎯 Patrones Implementados
*   **Service Layer Pattern:** Aisla la lógica de negocio en `UserService`. El controlador solo maneja el transporte HTTP.
*   **Controller Pattern:** Utiliza `ResponseEntity` para estandarizar los códigos de estado HTTP de salida.
*   **Centralized Error Handling:** Utiliza `@ControllerAdvice` (`GlobalExceptionHandler.java`) para capturar cualquier excepción no manejada y evitar que Java arroje un *Stack Trace* al cliente, retornando en su lugar un JSON estándar 500.

## ⚙️ Requisitos
*   Java 17 (Eclipse Temurin recomendado)
*   Maven 3.9+
*   Docker

## 🚀 Compilación y Ejecución

1. Compilar el Fat JAR:
   ```bash
   mvn clean package -DskipTests
   ```
2. Ejecutar localmente (requiere tener el puerto 8081 libre):
   ```bash
   java -jar target/users-service-1.0.jar
   ```
3. Ejecutar vía Docker:
   ```bash
   docker build -t microservice-users .
   docker run -p 8081:8081 microservice-users
   ```

## 📡 Endpoints principales
*   `GET /students`: Devuelve la lista de estudiantes registrados.
*   `GET /health`: Health-check para balanceadores de carga y Kubernetes.
