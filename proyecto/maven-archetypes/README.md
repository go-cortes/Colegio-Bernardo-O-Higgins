# Arquetipos Maven del Proyecto

Un **Arquetipo Maven** es un template o plantilla de proyecto reutilizable. En lugar de que cada miembro del equipo deba crear un microservicio de Spring Boot desde cero (creando manualmente la estructura de directorios, copiando los archivos `.properties`, configurando los plugins de construcción y ajustando las versiones de las dependencias), utilizamos este arquetipo para estandarizar la arquitectura en un solo paso.

## 🎯 ¿Qué problema resuelve?
*   **Consistencia de Arquitectura:** Garantiza que todos los nuevos microservicios creados en la organización tengan exactamente la misma estructura de paquetes base (ej. `controller`, `service`, `model`, `exception`).
*   **Eficiencia:** Reduce el tiempo de configuración inicial (Boilerplate) de horas a segundos.
*   **Estándares Forzados:** Incluye por defecto el Manejador Global de Excepciones (`@ControllerAdvice`) y el endpoint de `/health` requerido para los despliegues en contenedores Docker.

## ⚙️ Instrucciones: ¿Cómo instalarlo y usarlo?

### 1. Instalar el arquetipo en tu entorno local
Para que Maven reconozca este template, primero debes instalarlo en tu repositorio local (`~/.m2`):
```bash
cd microservice-base-archetype
mvn clean install
```

### 2. Generar un nuevo microservicio a partir del arquetipo
Una vez instalado, ubícate en la carpeta raíz donde deseas crear el nuevo proyecto (ej. dentro de `proyecto/`) y ejecuta el generador:

```bash
mvn archetype:generate \
  -DarchetypeGroupId=com.colegio.archetypes \
  -DarchetypeArtifactId=microservice-base-archetype \
  -DarchetypeVersion=1.0.0-SNAPSHOT \
  -DgroupId=com.colegio \
  -DartifactId=microservice-payments \
  -Dversion=1.0.0
```

Al ejecutarlo, Maven clonará la estructura completa y nombrará al nuevo proyecto como `microservice-payments`, ajustando automáticamente los *packages* de Java al valor indicado en `groupId`.
