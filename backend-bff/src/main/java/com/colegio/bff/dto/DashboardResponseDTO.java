package com.colegio.bff.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DashboardResponseDTO {
    private List<UsuarioDTO> usuarios;
    private List<NotaDTO> notas;
    private String estadoBFF;
}
