package com.colegio.notas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) para enviar y recibir datos de calificaciones.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotaDTO {
    
    private Long id;
    private Long estudianteId;
    private String asignatura;
    private Double valorNota; // Renombrado sutilmente en el DTO para demostrar separación
    
}
