# microservicio-usuarios

Microservicio Spring Boot para la gestión de usuarios del colegio. Persiste los datos en PostgreSQL mediante Spring Data JPA.

## Requisitos

- Java 17+
- Maven 3.8+
- PostgreSQL corriendo con la base de datos `colegio_usuarios`

## Configuración de base de datos

```sql
CREATE DATABASE colegio_usuarios;
```

Las variables de entorno `DB_URL`, `DB_USER` y `DB_PASSWORD` sobreescriben los valores por defecto del `application.properties`. Sin ellas, se usan:

```
url:      jdbc:postgresql://localhost:5432/colegio_usuarios
usuario:  postgres
password: postgres
```

## Ejecución

```bash
mvn spring-boot:run
```

Disponible en **http://localhost:8081**

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/usuarios` | Lista todos los usuarios |
| POST | `/usuarios` | Registra un nuevo usuario |

**Ejemplo POST `/usuarios`:**

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@colegio.cl"
}
```

## Pruebas

```bash
mvn test
```
