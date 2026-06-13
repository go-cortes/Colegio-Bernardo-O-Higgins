package com.colegio.convivencia.dto;

import com.colegio.convivencia.model.Anotacion.TipoAnotacion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO de entrada para crear una anotación de convivencia.
 * No incluye 'id' ni 'fechaRegistro' — los genera el servidor.
 * @Valid en el Controller activa estas validaciones automáticamente.
 */
@Data
public class AnotacionRequestDTO {

    @NotNull(message = "El ID del estudiante es obligatorio")
    private Long estudianteId;

    @NotNull(message = "El ID del profesor es obligatorio")
    private Long profesorId;

    @NotNull(message = "El tipo de anotación es obligatorio")
    private TipoAnotacion tipo;

    @NotBlank(message = "La descripción no puede estar vacía")
    private String descripcion;

    /** Campo opcional: medida tomada o propuesta */
    private String medida;
}
