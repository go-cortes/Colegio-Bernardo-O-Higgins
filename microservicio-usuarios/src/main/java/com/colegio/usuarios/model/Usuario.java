package com.colegio.usuarios.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad principal que representa a un Usuario en la base de datos (simulada).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    
    private Long id;
    private String nombre;
    private String email;
    
}
