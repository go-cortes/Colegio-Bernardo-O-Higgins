package com.colegio.bff.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO de entrada para registrar asistencia — espejo del DTO en ms-convivencia.
 */
@Data
public class AsistenciaRequestDTO {

    @NotNull
    private Long estudianteId;

    @NotNull
    private LocalDate fecha;

    @NotNull
    private EstadoAsistencia estado;

    private String observacion;

    public enum EstadoAsistencia {
        PRESENTE, AUSENTE, TARDANZA, JUSTIFICADO
    }
}
