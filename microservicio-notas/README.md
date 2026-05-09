# microservicio-notas

Microservicio Spring Boot para la gestión de calificaciones académicas. Persiste los datos en PostgreSQL mediante Spring Data JPA.

## Requisitos

- Java 17+
- Maven 3.8+
- PostgreSQL corriendo con la base de datos `colegio_notas`

## Configuración de base de datos

```sql
CREATE DATABASE colegio_notas;
```

Las variables de entorno `DB_URL`, `DB_USER` y `DB_PASSWORD` sobreescriben los valores por defecto del `application.properties`. Sin ellas, se usan:

```
url:      jdbc:postgresql://localhost:5432/colegio_notas
usuario:  postgres
password: postgres
```

## Ejecución

```bash
mvn spring-boot:run
```

Disponible en **http://localhost:8082**

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/notas` | Lista todas las calificaciones |
| POST | `/notas` | Registra una nueva calificación |

**Ejemplo POST `/notas`:**

```json
{
  "estudianteId": 1,
  "asignatura": "Matemáticas",
  "valorNota": 6.5
}
```

## Pruebas

```bash
mvn test
```
