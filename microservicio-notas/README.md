# Microservicio de Notas

Microservicio desarrollado en Java con Spring Boot para la gestión de calificaciones, diseñado con arquitectura multicapas y un almacenamiento simulado en memoria, coherente con el microservicio de usuarios.

## Arquitectura (Capas)
- **Controller:** Expone los endpoints REST.
- **Service:** Lógica de negocio y transformación de datos.
- **Repository:** Almacenamiento simulado en memoria (List).
- **DTO:** Data Transfer Objects para transferencias de red.
- **Model:** Entidad del dominio de negocio (Nota).

## Requisitos
- Java 17+
- Maven 3.8+

## Ejecución Local

Para compilar y ejecutar el proyecto:

```bash
# Navegar a la carpeta del microservicio
cd microservicio-notas

# Ejecutar con Maven
mvn spring-boot:run
```
El servidor iniciará por defecto en `http://localhost:8080`. *(Nota: si levantas ambos microservicios al mismo tiempo, asegúrate de cambiar el puerto en `application.properties`)*.

## Endpoints

### 1. Obtener todas las notas
**GET** `/notas`

**Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": 1,
    "estudianteId": 101,
    "asignatura": "Matemáticas",
    "valorNota": 6.5
  },
  {
    "id": 2,
    "estudianteId": 101,
    "asignatura": "Lenguaje",
    "valorNota": 5.8
  }
]
```

### 2. Crear una calificación
**POST** `/notas`

**Cuerpo de la Petición (JSON):**
```json
{
  "estudianteId": 102,
  "asignatura": "Ciencias Naturales",
  "valorNota": 7.0
}
```

**Respuesta Exitosa (201 Created):**
```json
{
  "id": 3,
  "estudianteId": 102,
  "asignatura": "Ciencias Naturales",
  "valorNota": 7.0
}
```

## Pruebas Unitarias
El proyecto cuenta con cobertura de pruebas unitarias usando **JUnit 5** y **Mockito** en la capa de servicios. Para ejecutarlas:

```bash
mvn test
```
