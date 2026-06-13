package com.colegio.bff.controller;

import com.colegio.bff.dto.AnotacionRequestDTO;
import com.colegio.bff.dto.AnotacionResponseDTO;
import com.colegio.bff.dto.AsistenciaRequestDTO;
import com.colegio.bff.dto.AsistenciaResponseDTO;
import com.colegio.bff.dto.DashboardResponseDTO;
import com.colegio.bff.dto.NotaDTO;
import com.colegio.bff.dto.UsuarioDTO;
import com.colegio.bff.service.BffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BffController {

    private final BffService bffService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponseDTO> getDashboardData() {
        return ResponseEntity.ok(bffService.obtenerDatosDashboard());
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioDTO>> getUsuarios() {
        return ResponseEntity.ok(bffService.obtenerUsuarios());
    }

    /** GET /alumnos — lista solo estudiantes (para el ProfesorDashboard) */
    @GetMapping("/alumnos")
    public ResponseEntity<List<UsuarioDTO>> getAlumnos() {
        return ResponseEntity.ok(bffService.obtenerAlumnos());
    }

    /**
     * GET /auth/me?email=ana@colegio.cl — autenticación demo.
     * Si el email existe en la BD, retorna el usuario (rol incluido).
     * El frontend valida que la contraseña sea la parte antes del '@'.
     */
    @GetMapping("/auth/me")
    public ResponseEntity<UsuarioDTO> authMe(@RequestParam String email) {
        return bffService.loginPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioDTO> crearUsuario(@RequestBody UsuarioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bffService.crearUsuario(dto));
    }

    @GetMapping("/notas")
    public ResponseEntity<List<NotaDTO>> getNotas() {
        return ResponseEntity.ok(bffService.obtenerNotas());
    }

    /** GET /notas/estudiante/{id} — notas del alumno logueado */
    @GetMapping("/notas/estudiante/{estudianteId}")
    public ResponseEntity<List<NotaDTO>> getNotasPorEstudiante(@PathVariable Long estudianteId) {
        return ResponseEntity.ok(bffService.obtenerNotasPorEstudiante(estudianteId));
    }

    @PostMapping("/notas")
    public ResponseEntity<NotaDTO> crearNota(@RequestBody NotaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bffService.crearNota(dto));
    }

    // -------------------------------------------------------------------------
    // Anotaciones de Convivencia
    // -------------------------------------------------------------------------

    @GetMapping("/anotaciones")
    public ResponseEntity<List<AnotacionResponseDTO>> getAnotaciones() {
        return ResponseEntity.ok(bffService.obtenerAnotaciones());
    }

    @PostMapping("/anotaciones")
    public ResponseEntity<AnotacionResponseDTO> crearAnotacion(@RequestBody AnotacionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bffService.crearAnotacion(dto));
    }

    // -------------------------------------------------------------------------
    // Asistencias de Convivencia
    // -------------------------------------------------------------------------

    @GetMapping("/asistencias/estudiante/{estudianteId}")
    public ResponseEntity<List<AsistenciaResponseDTO>> getAsistenciasPorEstudiante(
            @PathVariable Long estudianteId) {
        return ResponseEntity.ok(bffService.obtenerAsistenciasPorEstudiante(estudianteId));
    }

    @PostMapping("/asistencias")
    public ResponseEntity<AsistenciaResponseDTO> registrarAsistencia(@RequestBody AsistenciaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bffService.registrarAsistencia(dto));
    }
}
