package com.colegio.convivencia.dto;

import com.colegio.convivencia.model.Anotacion.TipoAnotacion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO de salida para anotaciones de convivencia.
 * Incluye id y fechaRegistro generados por el servidor.
 * Separar Request/Response permite evolucionar ambos contratos de forma
 * independiente sin romper la API ni el modelo de dominio.
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
}
