package com.colegio.notas.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad de Dominio que representa una Nota/Calificación.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Nota {
    
    private Long id;
    private Long estudianteId;
    private String asignatura;
    private Double nota;
    
}
