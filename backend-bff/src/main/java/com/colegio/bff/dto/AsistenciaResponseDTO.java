package com.colegio.bff.dto;

import com.colegio.bff.dto.AsistenciaRequestDTO.EstadoAsistencia;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO de salida para asistencia — espejo del DTO en ms-convivencia.
 */
@Data
public class AsistenciaResponseDTO {

    private Long id;
    private Long estudianteId;
    private LocalDate fecha;
    private EstadoAsistencia estado;
    private String observacion;
}
