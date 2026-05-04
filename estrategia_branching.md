# Estrategia de Branching: GitFlow Adaptado

Para garantizar la calidad del código, el trabajo colaborativo sin conflictos y un pipeline de Integración/Despliegue Continuo (CI/CD) ordenado, el proyecto adopta una estrategia basada en **GitFlow**.

## 1. Ramas Principales (Infinitas)

- **`main` (o `master`)**: Representa el código en Producción. Todo lo que está en esta rama DEBE ser estable, funcional y estar desplegado en el servidor en vivo. Nunca se comitea directamente aquí.
- **`develop`**: Es la rama de integración principal. Contiene las funcionalidades completas para el próximo lanzamiento (Release). Los entornos de pruebas (QA o Staging) apuntan a esta rama para validar antes de pasar a producción.

## 2. Ramas Temporales (Efímeras)

- **`feature/<nombre-funcionalidad>`**: 
  - **Origen**: Nace desde `develop`.
  - **Destino**: Se fusiona hacia `develop`.
  - **Uso**: Cada nueva historia de usuario o requerimiento (ej: `feature/login-component`, `feature/student-api`). Al terminar el trabajo, se integran mediante un *Pull Request* (PR).

- **`hotfix/<nombre-error>`**:
  - **Origen**: Nace desde `main`.
  - **Destino**: Se fusiona hacia `main` y `develop`.
  - **Uso**: Corrección de errores críticos en producción. Es la única rama que nace de la línea principal de producción. Permite arreglar el error sin esperar a la próxima *Release* de `develop`.

## 3. Flujo de Trabajo del Equipo (Workflow)

1. **Planificación**: Se asigna un ticket en la herramienta de gestión ágil (Ej: TASK-102 en Jira o Trello).
2. **Creación de Rama**: El desarrollador crea una rama local basada en `develop` sincronizada: 
   `git checkout -b feature/TASK-102-crear-boton develop`.
3. **Desarrollo y Commits**: Se realizan commits atómicos y descriptivos siguiendo la convención de *Conventional Commits* (ej: `feat: agrega botón de login` o `fix: corrige validación de notas`).
4. **Pull Request (PR)**: Se abre un PR hacia la rama `develop`. Este PR requiere la revisión de código (*Code Review*) de al menos 1 miembro del equipo para asegurar los estándares y patrones de diseño (Service Layer, BFF, etc.).
5. **CI/CD Automatizado**: Al crear el PR, se ejecutan automáticamente los pipelines (ej: GitHub Actions) que corren las pruebas unitarias (Vitest en Frontend, JUnit en Backend). Si los tests fallan, el PR se bloquea y no permite la fusión.
6. **Integración (Merge)**: Una vez aprobado por pares y con los tests en verde, se integra usando la estrategia **Squash and Merge** (o Fast-forward) para mantener un historial de commits limpio en `develop`.

## 4. Resolución de Conflictos

Es responsabilidad exclusiva del desarrollador de la *feature* mantener su rama actualizada.
Si `develop` ha avanzado mientras se trabajaba en la rama `feature` (otro desarrollador integró código que choca), se debe proceder de la siguiente manera:
1. Ir a la rama local de `develop` y actualizarla: `git pull origin develop`.
2. Volver a la rama de `feature` y realizar un rebase: `git rebase develop`.
3. Resolver los conflictos directamente en el editor (ej. VS Code) aceptando los cambios entrantes o manteniendo los actuales de manera consensuada.
4. Finalizar el rebase: `git rebase --continue`.
5. Hacer push forzado a su PR: `git push -f origin feature/...`.
