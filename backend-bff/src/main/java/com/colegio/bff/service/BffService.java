package com.colegio.bff.service;

import com.colegio.bff.client.NotaClient;
import com.colegio.bff.client.UsuarioClient;
import com.colegio.bff.dto.DashboardResponseDTO;
import com.colegio.bff.dto.NotaDTO;
import com.colegio.bff.dto.UsuarioDTO;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BffService {

    private static final String CB_NAME = "msCircuitBreaker";

    private final UsuarioClient usuarioClient;
    private final NotaClient notaClient;

    // -------------------------------------------------------------------------
    // Dashboard (orquesta ambos microservicios — se protege con su propio CB)
    // -------------------------------------------------------------------------

    @CircuitBreaker(name = CB_NAME, fallbackMethod = "fallbackObtenerDatosDashboard")
    public DashboardResponseDTO obtenerDatosDashboard() {
        List<UsuarioDTO> usuarios = usuarioClient.getUsuarios();
        List<NotaDTO> notas = notaClient.getNotas();

        return DashboardResponseDTO.builder()
                .usuarios(usuarios)
                .notas(notas)
                .estadoBFF("Operativo - Datos combinados exitosamente")
                .build();
    }

    public DashboardResponseDTO fallbackObtenerDatosDashboard(Throwable t) {
        log.warn("Circuit breaker abierto en dashboard: {}", t.getMessage());
        return DashboardResponseDTO.builder()
                .usuarios(Collections.emptyList())
                .notas(Collections.emptyList())
                .estadoBFF("Servicio no disponible - intente más tarde")
                .build();
    }

    // -------------------------------------------------------------------------
    // Usuarios
    // -------------------------------------------------------------------------

    @CircuitBreaker(name = CB_NAME, fallbackMethod = "fallbackObtenerUsuarios")
    public List<UsuarioDTO> obtenerUsuarios() {
        return usuarioClient.getUsuarios();
    }

    public List<UsuarioDTO> fallbackObtenerUsuarios(Throwable t) {
        log.warn("Circuit breaker abierto en obtenerUsuarios: {}", t.getMessage());
        return Collections.emptyList();
    }

    @CircuitBreaker(name = CB_NAME, fallbackMethod = "fallbackCrearUsuario")
    public UsuarioDTO crearUsuario(UsuarioDTO dto) {
        return usuarioClient.postUsuario(dto);
    }

    public UsuarioDTO fallbackCrearUsuario(UsuarioDTO dto, Throwable t) {
        log.warn("Circuit breaker abierto en crearUsuario: {}", t.getMessage());
        UsuarioDTO fallback = new UsuarioDTO();
        fallback.setId(-1L);
        fallback.setNombre("Servicio no disponible");
        fallback.setEmail("");
        return fallback;
    }

    // -------------------------------------------------------------------------
    // Notas
    // -------------------------------------------------------------------------

    @CircuitBreaker(name = CB_NAME, fallbackMethod = "fallbackObtenerNotas")
    public List<NotaDTO> obtenerNotas() {
        return notaClient.getNotas();
    }

    public List<NotaDTO> fallbackObtenerNotas(Throwable t) {
        log.warn("Circuit breaker abierto en obtenerNotas: {}", t.getMessage());
        return Collections.emptyList();
    }

    @CircuitBreaker(name = CB_NAME, fallbackMethod = "fallbackCrearNota")
    public NotaDTO crearNota(NotaDTO dto) {
        return notaClient.postNota(dto);
    }

    public NotaDTO fallbackCrearNota(NotaDTO dto, Throwable t) {
        log.warn("Circuit breaker abierto en crearNota: {}", t.getMessage());
        NotaDTO fallback = new NotaDTO();
        fallback.setId(-1L);
        fallback.setEstudianteId(dto.getEstudianteId());
        fallback.setAsignatura("Servicio no disponible");
        fallback.setValorNota(0.0);
        return fallback;
    }
}
