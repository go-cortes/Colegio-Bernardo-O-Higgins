package com.colegio.convivencia.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

/**
 * Entidad JPA que representa el registro diario de asistencia de un estudiante.
 *
 * La restricción uniqueConstraints evita registrar dos asistencias para el mismo
 * alumno en el mismo día — integridad garantizada a nivel de base de datos.
 */
@Entity
@Table(
    name = "asistencias",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_asistencia_estudiante_fecha",
        columnNames = {"estudiante_id", "fecha"}
    )
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID del estudiante en ms-usuarios.
     * Referencia por valor (no @ManyToOne): cada microservicio tiene su propia BD.
     */
    @Column(name = "estudiante_id", nullable = false)
    private Long estudianteId;

    @Column(nullable = false)
    private LocalDate fecha;

    /**
     * @Enumerated(STRING): almacena "PRESENTE" en vez de 0/1.
     * Los reportes SQL son legibles sin JOIN a tablas auxiliares.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoAsistencia estado;

    /** Observación libre opcional: llegó tarde, salida anticipada, etc. */
    @Column(length = 255)
    private String observacion;

    public enum EstadoAsistencia {
        PRESENTE, AUSENTE, TARDANZA, JUSTIFICADO
    }
}
