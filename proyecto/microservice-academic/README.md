# Microservicio Core: Academic

Microservicio desarrollado en **Spring Boot (Java 17)** encargado de gestionar el registro de calificaciones (Grades) de los estudiantes.

## 🎯 Arquitectura y Diseño
Sigue estrictamente la arquitectura por capas definida en el arquetipo de la organización:
1.  **Capa Web / API:** `AcademicController.java` (Expone la ruta `/grades` con códigos HTTP estándar).
2.  **Capa de Servicio (Domain):** `AcademicService.java` (Aisla la lógica y aplica las reglas de notas académicas).
3.  **Capa de Modelo (Entities):** `Grade.java` (POJO inmutable o estructurado).

Además incluye Manejo Global de Excepciones y un endpoint `/health` de vital importancia en entornos de orquestación de contenedores.

## ⚙️ Requisitos
*   Java 17 (Eclipse Temurin)
*   Maven 3.9+
*   Docker

## 🚀 Compilación y Ejecución

1. Empaquetar la aplicación:
   ```bash
   mvn clean package -DskipTests
   ```
2. Levantar la aplicación localmente (Puerto 8082):
   ```bash
   java -jar target/academic-service-1.0.jar
   ```
3. Generar la imagen y ejecutar en contenedor:
   ```bash
   docker build -t microservice-academic .
   docker run -p 8082:8082 microservice-academic
   ```
