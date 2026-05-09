# maven-arquetipo-spring

Arquetipo Maven personalizado que genera la estructura base estándar para nuevos microservicios Spring Boot del Colegio O'Higgins. Incluye las dependencias necesarias preconfiguradas: Web, JPA, PostgreSQL, Lombok y Test.

## Requisitos

- Java 17+
- Maven 3.8+

## Paso 1 — Instalar el arquetipo localmente

Desde la carpeta `maven-arquetipo-spring/`:

```bash
mvn clean install
```

Esto registra el arquetipo en el repositorio local Maven (`~/.m2`).

## Paso 2 — Generar un nuevo microservicio

Desde la carpeta raíz del proyecto (fuera de esta carpeta):

```bash
mvn archetype:generate \
  -DarchetypeGroupId=com.colegio.archetypes \
  -DarchetypeArtifactId=spring-boot-base-archetype \
  -DarchetypeVersion=1.0.0
```

Maven solicitará de forma interactiva:

| Campo | Ejemplo |
|---|---|
| `groupId` | `com.colegio.asistencias` |
| `artifactId` | `microservicio-asistencias` |
| `version` | `1.0.0` |
| `package` | *(Enter para usar groupId)* |

## Resultado

Se crea automáticamente la siguiente estructura:

```
microservicio-asistencias/
├── pom.xml                       # Web + JPA + PostgreSQL + Lombok + Test
└── src/main/java/com/colegio/asistencias/
    ├── Application.java
    ├── controller/ExampleController.java
    ├── service/ExampleService.java
    └── repository/ExampleRepository.java
```

Renombra las clases `Example*` por las entidades de tu dominio y el microservicio estará listo para compilar.
