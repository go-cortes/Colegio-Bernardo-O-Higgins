package com.colegio.bff.dto;

import com.colegio.bff.dto.AnotacionResponseDTO.TipoAnotacion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO de entrada para anotaciones — espejo del DTO en ms-convivencia.
 * El BFF recibe este objeto del frontend y lo reenvía al microservicio.
 */
@Data
public class AnotacionRequestDTO {

    @NotNull
    private Long estudianteId;

    @NotNull
    private Long profesorId;

    @NotNull
    private TipoAnotacion tipo;

    @NotBlank
    private String descripcion;

    private String medida;
}
