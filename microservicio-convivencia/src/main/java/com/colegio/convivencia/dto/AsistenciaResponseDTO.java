package com.colegio.convivencia.dto;

import com.colegio.convivencia.model.Asistencia.EstadoAsistencia;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * DTO de salida para asistencia.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AsistenciaResponseDTO {

    private Long id;
    private Long estudianteId;
    private LocalDate fecha;
    private EstadoAsistencia estado;
    private String observacion;
}
