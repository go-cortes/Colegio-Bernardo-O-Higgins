package com.colegio.bff.service;

import com.colegio.bff.client.AnotacionClient;
import com.colegio.bff.client.AsistenciaClient;
import com.colegio.bff.client.NotaClient;
import com.colegio.bff.client.UsuarioClient;
import com.colegio.bff.dto.AnotacionRequestDTO;
import com.colegio.bff.dto.AnotacionResponseDTO;
import com.colegio.bff.dto.AsistenciaRequestDTO;
import com.colegio.bff.dto.AsistenciaResponseDTO;
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
    private final AnotacionClient anotacionClient;
    private final AsistenciaClient asistenciaClient;

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

    @CircuitBreaker(name = CB_NAME, fallbackMethod = "fallbackObtenerUsuarios")
    public List<UsuarioDTO> obtenerAlumnos() {
        return usuarioClient.getAlumnos();
    }

    /**
     * Busca un usuario por email en el microservicio de usuarios.
     * Se usa para autenticación: si existe en la BD → credenciales válidas.
     */
    public java.util.Optional<UsuarioDTO> loginPorEmail(String email) {
        return usuarioClient.getByEmail(email);
    }


    @CircuitBreaker(name = CB_NAME, fallbackMethod = "fallbackObtenerNotas")
    public List<NotaDTO> obtenerNotas() {
        return notaClient.getNotas();
    }

    public List<NotaDTO> fallbackObtenerNotas(Throwable t) {
        log.warn("Circuit breaker abierto en obtenerNotas: {}", t.getMessage());
        return Collections.emptyList();
    }

    @CircuitBreaker(name = CB_NAME, fallbackMethod = "fallbackObtenerNotasEstudiante")
    public List<NotaDTO> obtenerNotasPorEstudiante(Long estudianteId) {
        return notaClient.getNotasPorEstudiante(estudianteId);
    }

    public List<NotaDTO> fallbackObtenerNotasEstudiante(Long estudianteId, Throwable t) {
        log.warn("Circuit breaker abierto en obtenerNotasPorEstudiante: {}", t.getMessage());
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

    // -------------------------------------------------------------------------
    // Anotaciones de Convivencia
    // -------------------------------------------------------------------------

    @CircuitBreaker(name = CB_NAME, fallbackMethod = "fallbackObtenerAnotaciones")
    public List<AnotacionResponseDTO> obtenerAnotaciones() {
        return anotacionClient.getAnotaciones();
    }

    public List<AnotacionResponseDTO> fallbackObtenerAnotaciones(Throwable t) {
        log.warn("Circuit breaker abierto en obtenerAnotaciones: {}", t.getMessage());
        return Collections.emptyList();
    }

    @CircuitBreaker(name = CB_NAME, fallbackMethod = "fallbackCrearAnotacion")
    public AnotacionResponseDTO crearAnotacion(AnotacionRequestDTO dto) {
        return anotacionClient.postAnotacion(dto);
    }

    public AnotacionResponseDTO fallbackCrearAnotacion(AnotacionRequestDTO dto, Throwable t) {
        log.warn("Circuit breaker abierto en crearAnotacion: {}", t.getMessage());
        AnotacionResponseDTO fallback = new AnotacionResponseDTO();
        fallback.setId(-1L);
        fallback.setDescripcion("Servicio no disponible");
        return fallback;
    }

    // -------------------------------------------------------------------------
    // Asistencias de Convivencia
    // -------------------------------------------------------------------------

    @CircuitBreaker(name = CB_NAME, fallbackMethod = "fallbackObtenerAsistencias")
    public List<AsistenciaResponseDTO> obtenerAsistenciasPorEstudiante(Long estudianteId) {
        return asistenciaClient.getAsistenciasPorEstudiante(estudianteId);
    }

    public List<AsistenciaResponseDTO> fallbackObtenerAsistencias(Long estudianteId, Throwable t) {
        log.warn("Circuit breaker abierto en obtenerAsistencias: {}", t.getMessage());
        return Collections.emptyList();
    }

    @CircuitBreaker(name = CB_NAME, fallbackMethod = "fallbackRegistrarAsistencia")
    public AsistenciaResponseDTO registrarAsistencia(AsistenciaRequestDTO dto) {
        return asistenciaClient.registrarAsistencia(dto);
    }

    public AsistenciaResponseDTO fallbackRegistrarAsistencia(AsistenciaRequestDTO dto, Throwable t) {
        log.warn("Circuit breaker abierto en registrarAsistencia: {}", t.getMessage());
        AsistenciaResponseDTO fallback = new AsistenciaResponseDTO();
        fallback.setId(-1L);
        return fallback;
    }
}
