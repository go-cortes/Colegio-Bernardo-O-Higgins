package com.colegio.convivencia.dto;

import com.colegio.convivencia.model.Asistencia.EstadoAsistencia;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

/**
 * DTO de entrada para registrar la asistencia de un estudiante.
 */
@Data
public class AsistenciaRequestDTO {

    @NotNull(message = "El ID del estudiante es obligatorio")
    private Long estudianteId;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @NotNull(message = "El estado de asistencia es obligatorio")
    private EstadoAsistencia estado;

    /** Observación opcional: llegó tarde, salida anticipada, etc. */
    private String observacion;
}
