package com.colegio.bff.service;

import com.colegio.bff.client.NotaClient;
import com.colegio.bff.client.UsuarioClient;
import com.colegio.bff.dto.DashboardResponseDTO;
import com.colegio.bff.dto.NotaDTO;
import com.colegio.bff.dto.UsuarioDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service Layer del BFF. 
 * Orquesta las llamadas a los diferentes clientes y agrupa la información.
 */
@Service
@RequiredArgsConstructor
public class BffService {

    private final UsuarioClient usuarioClient;
    private final NotaClient notaClient;

    public DashboardResponseDTO obtenerDatosDashboard() {
        // Llamadas a los microservicios backend
        List<UsuarioDTO> usuarios = usuarioClient.getUsuarios();
        List<NotaDTO> notas = notaClient.getNotas();

        // Agregación de datos (Patrón BFF)
        return DashboardResponseDTO.builder()
                .usuarios(usuarios)
                .notas(notas)
                .estadoBFF("Operativo - Datos combinados exitosamente")
                .build();
    }
}
