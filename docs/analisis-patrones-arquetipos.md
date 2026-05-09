# Análisis de Patrones y Arquetipos
## Sistema de Gestión Académica — Colegio Bernardo O'Higgins

**Asignatura:** Full Stack 3  
**Evaluación:** Parcial 2  
**Autor:** Bryckson  
**Fecha:** Mayo 2026

---

## 1. Introducción

El Colegio Bernardo O'Higgins gestiona diariamente información crítica de sus estudiantes: calificaciones, asistencias, perfiles de docentes y registros administrativos. Históricamente, esta información residía en una arquitectura monolítica acoplada directamente a una base de datos Supabase, donde el frontend React consumía las tablas de forma directa. Este esquema presentaba limitaciones severas a medida que el sistema crecía:

- **Acoplamiento total:** Cualquier cambio en el esquema de datos impactaba directamente la interfaz.
- **Sin tolerancia a fallos:** La caída de un módulo (ej. el servicio de usuarios) bloqueaba toda la plataforma con errores HTTP 500.
- **Imposibilidad de escalar:** No existía forma de escalar independientemente el módulo de notas del módulo de usuarios en períodos de alta demanda (ej. cierre de semestre).
- **Deuda técnica acumulada:** La lógica de negocio y el acceso a datos estaban mezclados en los componentes de UI.

Para resolver estos problemas, se diseñó una arquitectura de **microservicios** compuesta por tres capas desacopladas:

```
┌─────────────────────────────────────────────┐
│          Frontend React (puerto 5173)        │
│    Consume únicamente el BFF — nunca la BD  │
└──────────────────────┬──────────────────────┘
                       │ HTTP
                       ▼
┌─────────────────────────────────────────────┐
│        BFF — backend-bff (puerto 8080)       │
│  Circuit Breaker + Orquestación + CORS       │
└──────────┬──────────────────────┬───────────┘
           │ HTTP                 │ HTTP
           ▼                      ▼
┌──────────────────┐   ┌──────────────────────┐
│ microservicio-   │   │  microservicio-notas  │
│ usuarios :8081   │   │       :8082           │
│ JPA + PostgreSQL │   │  JPA + PostgreSQL     │
└──────────────────┘   └──────────────────────┘
```

Esta arquitectura se sustenta en tres patrones de diseño formalmente implementados y un arquetipo Maven de estandarización, que se documentan en las secciones siguientes.

---

## 2. Justificación del Arquetipo Maven

### 2.1 Contexto del problema

Al crear múltiples microservicios Spring Boot, el equipo enfrentó el problema de la **inconsistencia entre proyectos**: cada servicio nuevo se configuraba manualmente, con riesgo de omitir dependencias críticas (como el driver de PostgreSQL o Spring Data JPA), versiones incompatibles, o configuraciones de compilación divergentes.

### 2.2 Solución: `maven-arquetipo-spring`

Se creó un **arquetipo Maven personalizado** (`com.colegio:maven-arquetipo-spring:1.0.0`) que actúa como plantilla estándar para todos los microservicios del colegio. Este arquetipo incluye, por defecto:

| Componente | Versión/Descripción |
|---|---|
| `spring-boot-starter-parent` | 3.2.3 |
| `spring-boot-starter-web` | API REST lista para usar |
| `spring-boot-starter-data-jpa` | Persistencia JPA con repositorios |
| `postgresql` (runtime) | Driver JDBC para PostgreSQL |
| `lombok` | Reducción de boilerplate |
| `spring-boot-starter-test` | JUnit 5 + Mockito |
| Java | 17 (LTS) |

### 2.3 Estructura generada por el arquetipo

Al ejecutar `mvn archetype:generate`, el arquetipo produce automáticamente la siguiente estructura:

```
microservicio-{nombre}/
├── pom.xml                          ← Dependencias base preconfiguradas
└── src/
    ├── main/
    │   ├── java/com/colegio/{nombre}/
    │   │   ├── Application.java     ← @SpringBootApplication
    │   │   ├── controller/          ← Capa REST
    │   │   ├── service/             ← Capa de lógica de negocio
    │   │   ├── repository/          ← Interfaz JpaRepository
    │   │   ├── model/               ← Entidades @Entity
    │   │   └── dto/                 ← Data Transfer Objects
    │   └── resources/
    │       └── application.properties  ← Configuración DB lista
    └── test/
        └── java/com/colegio/{nombre}/service/
            └── {Nombre}ServiceTest.java  ← Tests unitarios base
```

### 2.4 Beneficios concretos

**Sin arquetipo:** Crear `microservicio-asistencias` requeriría buscar las dependencias correctas, configurar manualmente el `pom.xml`, crear carpetas y clases base, y correr el riesgo de omitir configuraciones como `ddl-auto` o el dialecto de Hibernate.

**Con arquetipo:** Un único comando genera el proyecto completo y compilable en menos de 60 segundos, garantizando que todos los microservicios del Colegio O'Higgins comparten la misma base tecnológica y convenciones de código.

> **Principio de diseño aplicado:** *Convention over Configuration* — el arquetipo codifica las decisiones técnicas del equipo para que los desarrolladores puedan enfocarse en la lógica de negocio desde el primer commit.

---

## 3. Patrón 1: Backend For Frontend (BFF)

### 3.1 Definición

El patrón **BFF (Backend For Frontend)**, introducido por Sam Newman, consiste en crear una capa intermedia exclusiva para cada tipo de cliente que necesita consumir servicios backend. En lugar de que el frontend acceda directamente a múltiples microservicios o a la base de datos, toda la comunicación pasa por este orquestador especializado.

### 3.2 Problema que resuelve en el Colegio O'Higgins

Antes de implementar el BFF, el frontend React accedía directamente a Supabase mediante `@supabase/supabase-js`, ejecutando queries SQL desde el navegador:

```typescript
// ❌ ANTES: Frontend accedía directo a la BD
export const getAllGrades = async () => {
  return await supabase.from('grades').select('*');
};
export const getStudents = async () => {
  return await supabase
    .from('students')
    .select(`id, rut, profiles (first_name, last_name)`);
};
```

Este enfoque tenía tres problemas graves:

1. **Exposición de credenciales:** La `anon key` de Supabase viajaba en el bundle JavaScript del navegador, visible para cualquier usuario.
2. **Lógica de agregación en el cliente:** El frontend debía combinar datos de múltiples tablas, aumentando la complejidad de los componentes React.
3. **Acoplamiento tecnológico:** Cambiar de Supabase a PostgreSQL propio requería modificar cada componente del frontend.

### 3.3 Implementación

#### Controlador (`BffController.java`)

```java
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")   // ← Solo el frontend autorizado
public class BffController {

    private final BffService bffService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponseDTO> getDashboardData() {
        return ResponseEntity.ok(bffService.obtenerDatosDashboard());
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioDTO>> getUsuarios() {
        return ResponseEntity.ok(bffService.obtenerUsuarios());
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioDTO> crearUsuario(@RequestBody UsuarioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bffService.crearUsuario(dto));
    }

    @GetMapping("/notas")
    public ResponseEntity<List<NotaDTO>> getNotas() {
        return ResponseEntity.ok(bffService.obtenerNotas());
    }

    @PostMapping("/notas")
    public ResponseEntity<NotaDTO> crearNota(@RequestBody NotaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bffService.crearNota(dto));
    }
}
```

#### Servicio de orquestación (`BffService.java` — endpoint dashboard)

```java
public DashboardResponseDTO obtenerDatosDashboard() {
    List<UsuarioDTO> usuarios = usuarioClient.getUsuarios();  // → puerto 8081
    List<NotaDTO>    notas    = notaClient.getNotas();        // → puerto 8082

    return DashboardResponseDTO.builder()
            .usuarios(usuarios)
            .notas(notas)
            .estadoBFF("Operativo - Datos combinados exitosamente")
            .build();
}
```

#### Frontend tras la refactorización (`apiService.ts`)

```typescript
// ✅ DESPUÉS: Frontend consume exclusivamente el BFF
const BFF_URL = 'http://localhost:8080';

export const getNotas = () =>
  bffFetch<NotaDTO[]>('/notas');

export const crearNota = (data: NuevaNota) =>
  bffFetch<NotaDTO>('/notas', { method: 'POST', body: JSON.stringify(data) });
```

### 3.4 Tabla de endpoints del BFF

| Método | Endpoint BFF | Microservicio destino | Descripción |
|--------|-------------|----------------------|-------------|
| GET | `/dashboard` | Ambos (8081 + 8082) | Vista agregada para el panel principal |
| GET | `/usuarios` | microservicio-usuarios:8081 | Lista todos los usuarios/docentes |
| POST | `/usuarios` | microservicio-usuarios:8081 | Registra un nuevo usuario |
| GET | `/notas` | microservicio-notas:8082 | Lista todas las calificaciones |
| POST | `/notas` | microservicio-notas:8082 | Registra una nueva calificación |

### 3.5 Beneficio arquitectónico

El BFF actúa como **único punto de entrada** para el frontend. Si mañana se migra el microservicio de notas de PostgreSQL a MongoDB, el frontend React no requiere ningún cambio. Sólo se actualiza el `NotaClient.java` dentro del BFF.

---

## 4. Patrón 2: Repository (JPA)

### 4.1 Definición

El patrón **Repository** (Martin Fowler, *Patterns of Enterprise Application Architecture*) establece una capa de abstracción entre la lógica de negocio y el mecanismo de persistencia. El repositorio presenta una interfaz orientada a colecciones de objetos de dominio, ocultando completamente los detalles de cómo se almacenan o recuperan los datos.

Spring Data JPA implementa este patrón mediante la interfaz `JpaRepository<T, ID>`, que provee automáticamente más de 15 métodos CRUD sin necesidad de escribir una sola línea de SQL.

### 4.2 Problema que resuelve en el Colegio O'Higgins

En la versión inicial, los repositorios eran clases concretas que simulaban persistencia con `ArrayList` en memoria:

```java
// ❌ ANTES: Repositorio simulado con lista en memoria
@Repository
public class NotaRepository {
    private final List<Nota> notas = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public NotaRepository() {
        // Datos semilla hardcodeados — se pierden al reiniciar
        notas.add(new Nota(idGenerator.getAndIncrement(), 101L, "Matemáticas", 6.5));
    }

    public Nota save(Nota nota) {
        if (nota.getId() == null) {
            nota.setId(idGenerator.getAndIncrement());
            notas.add(nota);
        }
        return nota;
    }
}
```

Este enfoque era inviable para producción: los datos se perdían con cada reinicio del servidor, no existía transaccionalidad y era imposible escalar horizontalmente (dos instancias del servicio tendrían listas distintas).

### 4.3 Implementación

#### Entidad JPA (`Nota.java`)

```java
@Entity
@Table(name = "notas")        // ← Mapeo a tabla real de PostgreSQL
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // ← Auto-increment en BD
    private Long id;
    private Long estudianteId;
    private String asignatura;
    private Double nota;
}
```

Las anotaciones JPA tienen responsabilidades específicas:

| Anotación | Responsabilidad |
|---|---|
| `@Entity` | Declara la clase como entidad gestionada por Hibernate |
| `@Table(name = "notas")` | Vincula la clase a la tabla `notas` en PostgreSQL |
| `@Id` | Designa el campo como clave primaria |
| `@GeneratedValue(IDENTITY)` | Delega la generación del ID al motor de BD (autoincremental) |

#### Repositorio JPA (`NotaRepository.java`)

```java
// ✅ DESPUÉS: Interfaz limpia que hereda todo el CRUD de JpaRepository
public interface NotaRepository extends JpaRepository<Nota, Long> {
    // Sin código adicional — Spring Data genera la implementación en tiempo de ejecución
}
```

En **7 líneas** se obtienen automáticamente: `findAll()`, `findById()`, `save()`, `delete()`, `count()`, `existsById()`, paginación, ordenamiento y más.

#### Servicio de negocio (`NotaService.java`)

```java
@Service
@RequiredArgsConstructor
public class NotaService {

    private final NotaRepository notaRepository;   // ← Dependencia inyectada

    public List<NotaDTO> obtenerTodasLasNotas() {
        return notaRepository.findAll()             // ← Método JPA nativo
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public NotaDTO crearNota(NotaDTO dto) {
        Nota nota = new Nota();
        nota.setEstudianteId(dto.getEstudianteId());
        nota.setAsignatura(dto.getAsignatura());
        nota.setNota(dto.getValorNota());

        Nota guardada = notaRepository.save(nota);  // ← Persiste en PostgreSQL
        return mapToDTO(guardada);
    }
}
```

#### Configuración de conexión (`application.properties`)

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/colegio_notas}
spring.datasource.username=${DB_USER:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
spring.jpa.hibernate.ddl-auto=update      # ← Crea/actualiza tablas automáticamente
spring.jpa.show-sql=true
```

El uso de variables de entorno (`${DB_URL}`) garantiza que las credenciales nunca se hardcodeen en el repositorio de código.

### 4.4 Separación de responsabilidades

El patrón Repository en este proyecto garantiza el principio **SRP (Single Responsibility Principle)**:

```
NotaController  →  recibe HTTP, valida input, delega
NotaService     →  ejecuta lógica de negocio, mapea DTOs
NotaRepository  →  acceso a datos únicamente
Nota (@Entity)  →  representación del dominio
```

Si el día de mañana el colegio decide migrar de PostgreSQL a Oracle, **solo cambia el driver en el `pom.xml` y la URL en `application.properties`**. La lógica de negocio en `NotaService` permanece intacta.

### 4.5 Protección de la integridad de los datos

Al centralizar todo el acceso a datos en los repositorios JPA, se garantiza que:

- Ninguna clase del sistema puede modificar la tabla `notas` o `usuarios` directamente.
- Las transacciones están gestionadas por Spring (`@Transactional`) de forma automática.
- Los constraints de la base de datos (NOT NULL, UNIQUE) son la última línea de defensa, y la capa JPA los traduce en excepciones manejables.

---

## 5. Patrón 3: Circuit Breaker

### 5.1 Definición

El patrón **Circuit Breaker** (Michael Nygard, *Release It!*) es un mecanismo de resiliencia que previene que un fallo en un servicio dependiente se propague en cascada por todo el sistema. Funciona como el interruptor automático de un tablero eléctrico: cuando detecta un nivel de fallos inaceptable, "abre el circuito" y devuelve respuestas de respaldo (fallback) instantáneamente, sin esperar el timeout de red.

### 5.2 Problema que resuelve en el Colegio O'Higgins

En una arquitectura de microservicios, las dependencias entre servicios son inevitables. Considérese el siguiente escenario real:

> **Escenario:** Son las 8:00 AM, inicio del turno de clases. El servidor de `microservicio-usuarios` (puerto 8081) sufre un error de conexión a su base de datos PostgreSQL. Sin Circuit Breaker, cada solicitud al BFF que involucre usuarios esperará 30 segundos antes de fallar con un **HTTP 500**, bloqueando los threads del servidor BFF y eventualmente colapsando toda la plataforma — incluyendo el módulo de notas, que funcionaba perfectamente.

**Con Circuit Breaker:** El sistema detecta el fallo, abre el circuito y responde instantáneamente con una lista vacía o un mensaje de estado. Los profesores pueden seguir viendo el dashboard base y registrando asistencias. La degradación es **graceful**.

### 5.3 Implementación con Resilience4j

#### Dependencias agregadas al BFF (`pom.xml`)

```xml
<!-- Motor del Circuit Breaker para Spring Boot 3 -->
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
    <version>2.2.0</version>
</dependency>

<!-- AOP necesario para procesar las anotaciones @CircuitBreaker -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

#### Anotación en los métodos del BFF (`BffService.java`)

```java
@Slf4j
@Service
@RequiredArgsConstructor
public class BffService {

    private static final String CB_NAME = "msCircuitBreaker";

    // --- Usuarios ---

    @CircuitBreaker(name = CB_NAME, fallbackMethod = "fallbackObtenerUsuarios")
    public List<UsuarioDTO> obtenerUsuarios() {
        return usuarioClient.getUsuarios();   // llamada al microservicio-usuarios
    }

    public List<UsuarioDTO> fallbackObtenerUsuarios(Throwable t) {
        log.warn("Circuit breaker abierto en obtenerUsuarios: {}", t.getMessage());
        return Collections.emptyList();       // respuesta segura en lugar de 500
    }

    // --- Notas ---

    @CircuitBreaker(name = CB_NAME, fallbackMethod = "fallbackCrearNota")
    public NotaDTO crearNota(NotaDTO dto) {
        return notaClient.postNota(dto);
    }

    public NotaDTO fallbackCrearNota(NotaDTO dto, Throwable t) {
        log.warn("Circuit breaker abierto en crearNota: {}", t.getMessage());
        NotaDTO fallback = new NotaDTO();
        fallback.setId(-1L);
        fallback.setAsignatura("Servicio no disponible");
        fallback.setValorNota(0.0);
        return fallback;
    }
}
```

> **Regla de firma de fallback:** El método fallback debe tener la misma firma que el método original más un parámetro `Throwable` al final. Resilience4j resuelve el método en tiempo de ejecución vía reflexión.

#### Configuración de umbrales (`application.properties`)

```properties
# Evalúa el estado del circuito sobre las últimas 5 llamadas
resilience4j.circuitbreaker.instances.msCircuitBreaker.sliding-window-size=5

# Abre el circuito si el 50% o más de las llamadas fallan
resilience4j.circuitbreaker.instances.msCircuitBreaker.failure-rate-threshold=50

# Permanece abierto 10 segundos antes de intentar recuperarse
resilience4j.circuitbreaker.instances.msCircuitBreaker.wait-duration-in-open-state=10s

# Permite 3 llamadas de prueba en estado HALF-OPEN
resilience4j.circuitbreaker.instances.msCircuitBreaker.permitted-number-of-calls-in-half-open-state=3

# Registra el estado en el health indicator de Actuator
resilience4j.circuitbreaker.instances.msCircuitBreaker.register-health-indicator=true
```

### 5.4 Máquina de estados del Circuit Breaker

```
           ┌──────────────────────────────────────────────────┐
           │                                                  │
           ▼                                                  │
    ┌─────────────┐   ≥50% fallos        ┌──────────────┐    │
    │   CLOSED    │ ───────────────────► │    OPEN      │    │
    │  (normal)   │   en ventana de 5    │  (cortado)   │    │
    └─────────────┘                      └──────┬───────┘    │
           ▲                                    │            │
           │                                    │ 10 segundos│
           │ 3 pruebas exitosas                 ▼            │
           │                             ┌──────────────┐    │
           └─────────────────────────────│  HALF-OPEN   │    │
                                         │ (probando)   │────┘
                                         └──────────────┘
                                          3 pruebas fallan →
                                          vuelve a OPEN
```

| Estado | Comportamiento | Impacto en el colegio |
|--------|---------------|----------------------|
| **CLOSED** | Todas las llamadas pasan al microservicio | Funcionamiento normal |
| **OPEN** | Todas las llamadas van directo al fallback | Profesores ven dashboard sin datos de usuarios, pero sin error 500 |
| **HALF-OPEN** | 3 llamadas de prueba pasan al microservicio | Recuperación transparente, sin intervención humana |

### 5.5 Respuestas de fallback implementadas

| Endpoint afectado | Respuesta fallback |
|---|---|
| `GET /usuarios` | `[]` — lista vacía |
| `POST /usuarios` | `{ id: -1, nombre: "Servicio no disponible", email: "" }` |
| `GET /notas` | `[]` — lista vacía |
| `POST /notas` | `{ id: -1, asignatura: "Servicio no disponible", valorNota: 0.0 }` |
| `GET /dashboard` | `{ usuarios: [], notas: [], estadoBFF: "Servicio no disponible - intente más tarde" }` |

### 5.6 Justificación de los parámetros elegidos

- **Ventana de 5 llamadas:** Apropiada para un sistema académico con tráfico moderado. Detecta fallos rápidamente sin ser demasiado sensible a errores esporádicos.
- **Umbral del 50%:** Equilibrio entre falsos positivos y tiempo de respuesta. Si 3 de 5 llamadas fallan, es evidencia suficiente de un problema sistémico.
- **Espera de 10 segundos:** Da tiempo suficiente para que el microservicio se recupere (ej. reinicio del contenedor Docker) sin mantener el circuito abierto innecesariamente.

---

## 6. Conclusión

La arquitectura implementada para el Colegio Bernardo O'Higgins demuestra que los patrones de diseño no son conceptos abstractos, sino soluciones concretas a problemas reales de ingeniería de software:

| Patrón/Arquetipo | Problema resuelto | Archivo(s) clave |
|---|---|---|
| **Arquetipo Maven** | Inconsistencia entre microservicios nuevos | `maven-arquetipo-spring/` |
| **BFF** | Frontend acoplado a la base de datos | `BffController.java`, `BffService.java` |
| **Repository (JPA)** | Lógica de negocio mezclada con acceso a datos | `NotaRepository.java`, `UsuarioRepository.java` |
| **Circuit Breaker** | Fallos en cascada ante caída de microservicios | `BffService.java`, `application.properties` |

La combinación de estos tres patrones sobre la base del arquetipo Maven produce un sistema que es **mantenible** (cada capa tiene una responsabilidad única), **resiliente** (tolera fallos parciales sin colapso total) y **extensible** (añadir un nuevo microservicio como `microservicio-asistencias` sigue exactamente el mismo patrón establecido).

---

*Documento generado como parte de la Evaluación Parcial 2 — Full Stack 3.*  
*Colegio Bernardo O'Higgins — Sistema de Gestión Académica.*
