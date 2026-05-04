package com.colegio.bff.dto;

import lombok.Data;

@Data
public class NotaDTO {
    private Long id;
    private Long estudianteId;
    private String asignatura;
    private Double valorNota;
}
