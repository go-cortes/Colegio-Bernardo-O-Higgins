package com.colegio.convivencia.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * Entidad JPA para registrar observaciones de convivencia escolar.
 *
 * @CreationTimestamp: Hibernate asigna la fecha automáticamente al persistir,
 * sin depender del código de aplicación — evita inconsistencias de zona horaria.
 */
@Entity
@Table(name = "anotaciones")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Anotacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID del estudiante observado (referencia por valor, cross-microservicio) */
    @Column(name = "estudiante_id", nullable = false)
    private Long estudianteId;

    /** ID del profesor que registra la anotación */
    @Column(name = "profesor_id", nullable = false)
    private Long profesorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoAnotacion tipo;

    /**
     * columnDefinition = "TEXT": sin límite de longitud.
     * VARCHAR por defecto en JPA es 255 chars — insuficiente para anotaciones detalladas.
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    /** Medida tomada o propuesta (opcional) */
    @Column(length = 500)
    private String medida;

    @CreationTimestamp
    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    public enum TipoAnotacion {
        POSITIVA, NEGATIVA, INFORMATIVA
    }
}
