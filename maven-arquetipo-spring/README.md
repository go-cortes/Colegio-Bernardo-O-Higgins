# Arquetipo Base Spring Boot

Este es un Arquetipo Maven (`maven-archetype`) creado para facilitar y estandarizar la generación de nuevos microservicios Spring Boot académicos.

Un "Arquetipo" es una plantilla. En lugar de crear la estructura de carpetas `src/main/java...`, los paquetes de Controller, Service, Repository y el archivo `pom.xml` manualmente cada vez que necesitas un nuevo microservicio, este arquetipo genera toda esa estructura básica en segundos con un solo comando.

## 1. Instalar el Arquetipo Localmente

Antes de poder usar esta plantilla para crear proyectos, necesitas instalar el arquetipo en tu repositorio Maven local (`~/.m2`).

Abre una terminal en la carpeta raíz de este arquetipo (`maven-arquetipo-spring`) y ejecuta:

```bash
mvn clean install
```
Si es exitoso, verás un mensaje `BUILD SUCCESS`. Esto significa que Maven ahora conoce la existencia de tu plantilla `spring-boot-base-archetype`.

## 2. Generar un Nuevo Microservicio

Para crear un proyecto nuevo basado en este arquetipo, ve a la carpeta donde deseas crear tu nuevo microservicio (por ejemplo, fuera de la carpeta del arquetipo) y ejecuta el siguiente comando interactivo:

```bash
mvn archetype:generate -DarchetypeGroupId=com.colegio.archetypes -DarchetypeArtifactId=spring-boot-base-archetype -DarchetypeVersion=1.0.0
```

Maven te pedirá que ingreses por consola:
* **`groupId`**: El paquete base de tu empresa/colegio (Ej: `com.colegio.asistencia`)
* **`artifactId`**: El nombre del nuevo microservicio (Ej: `microservicio-asistencia`)
* **`version`**: Puedes dejar `1.0-SNAPSHOT` apretando Enter.
* **`package`**: Puedes dejar el mismo del `groupId` apretando Enter.
* Te pedirá confirmación (`Y: :` apreta Enter).

## 3. Resultado

¡Listo! Maven creará automáticamente la carpeta `microservicio-asistencia` con:
* Un `pom.xml` configurado con Spring Boot y Lombok.
* La clase principal `Application.java`.
* La estructura de paquetes `controller`, `service` y `repository`.
* Clases de ejemplo (`ExampleController`, etc.) listas para ser modificadas.

Esto te ahorrará horas de configuración manual y asegura que todos tus microservicios tengan exactamente la misma estructura base.
