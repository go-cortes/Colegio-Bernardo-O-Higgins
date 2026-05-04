# Microservicio de Usuarios

Microservicio desarrollado en Java con Spring Boot para la gestión de usuarios, diseñado con arquitectura multicapas y un almacenamiento simulado en memoria.

## Arquitectura (Capas)
- **Controller:** Maneja las peticiones REST.
- **Service:** Lógica de negocio y conversiones.
- **Repository:** Almacenamiento simulado de datos en memoria (List).
- **DTO:** Data Transfer Objects para entradas y salidas.
- **Model:** Entidad del dominio de negocio.

## Requisitos
- Java 17+
- Maven 3.8+

## Ejecución Local

Para compilar y ejecutar el proyecto:

```bash
# Navegar a la carpeta del microservicio
cd microservicio-usuarios

# Ejecutar con Maven Wrapper o Maven local
mvn spring-boot:run
```
El servidor iniciará por defecto en `http://localhost:8080`.

## Endpoints

### 1. Obtener todos los usuarios
**GET** `/usuarios`

**Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Admin Colegio",
    "email": "admin@colegio.cl"
  },
  {
    "id": 2,
    "nombre": "Profesor Jefe",
    "email": "profesor@colegio.cl"
  }
]
```

### 2. Crear un usuario
**POST** `/usuarios`

**Cuerpo de la Petición (JSON):**
```json
{
  "nombre": "Estudiante Nuevo",
  "email": "estudiante@colegio.cl"
}
```

**Respuesta Exitosa (201 Created):**
```json
{
  "id": 3,
  "nombre": "Estudiante Nuevo",
  "email": "estudiante@colegio.cl"
}
```

## Pruebas Unitarias
El proyecto cuenta con cobertura de pruebas unitarias usando **JUnit 5** y **Mockito** en la capa de servicios. Para ejecutarlas:

```bash
mvn test
```
