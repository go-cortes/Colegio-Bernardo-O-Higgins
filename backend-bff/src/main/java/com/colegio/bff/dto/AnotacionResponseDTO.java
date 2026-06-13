package com.colegio.bff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO de salida para anotaciones — espejo del DTO de ms-convivencia.
 * El BFF deserializa la respuesta del microservicio en este objeto
 * y lo reenvía tal cual al frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnotacionResponseDTO {

    private Long id;
    private Long estudianteId;
    private Long profesorId;
    private TipoAnotacion tipo;
    private String descripcion;
    private String medida;
    private LocalDateTime fechaRegistro;

    public enum TipoAnotacion {
        POSITIVA, NEGATIVA, INFORMATIVA
    }
}
