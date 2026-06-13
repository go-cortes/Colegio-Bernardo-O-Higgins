package com.colegio.convivencia.controller;

import com.colegio.convivencia.dto.AsistenciaRequestDTO;
import com.colegio.convivencia.dto.AsistenciaResponseDTO;
import com.colegio.convivencia.service.AsistenciaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controller Layer para Asistencia Diaria.
 */
@RestController
@RequestMapping("/asistencias")
@RequiredArgsConstructor
@Tag(name = "Asistencia", description = "Registro diario de asistencia de estudiantes (PRESENTE, AUSENTE, TARDANZA, JUSTIFICADO)")
public class AsistenciaController {

    private final AsistenciaService asistenciaService;

    /** GET /asistencias/estudiante/{id} → historial de asistencia de un alumno */
    @Operation(summary = "Historial de asistencia por estudiante",
               description = "Retorna todos los registros de asistencia de un estudiante, ordenados de más reciente a más antiguo.")
    @ApiResponse(responseCode = "200", description = "Historial obtenido exitosamente")
    @GetMapping("/estudiante/{estudianteId}")
    public ResponseEntity<List<AsistenciaResponseDTO>> getAsistenciasPorEstudiante(
            @Parameter(description = "ID del estudiante en ms-usuarios", example = "1")
            @PathVariable Long estudianteId) {
        return ResponseEntity.ok(
                asistenciaService.obtenerAsistenciasPorEstudiante(estudianteId));
    }

    /**
     * GET /asistencias/fecha?fecha=2024-05-20 → todos los registros de un día
     * @DateTimeFormat indica a Spring cómo parsear el parámetro de fecha de la URL
     */
    @Operation(summary = "Registros de asistencia por fecha",
               description = "Retorna todos los registros de asistencia correspondientes a una fecha específica. "
                           + "Formato de fecha: YYYY-MM-DD (ISO 8601).")
    @ApiResponse(responseCode = "200", description = "Registros del día obtenidos exitosamente")
    @GetMapping("/fecha")
    public ResponseEntity<List<AsistenciaResponseDTO>> getAsistenciasPorFecha(
            @Parameter(description = "Fecha a consultar en formato ISO (YYYY-MM-DD)", example = "2024-05-20")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(asistenciaService.obtenerAsistenciasPorFecha(fecha));
    }

    /** POST /asistencias → registrar asistencia diaria */
    @Operation(summary = "Registrar asistencia diaria",
               description = "Registra la asistencia de un estudiante para una fecha determinada. "
                           + "Regla de negocio: un estudiante solo puede tener un registro por día "
                           + "(devuelve error 409 si ya existe).")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Asistencia registrada exitosamente",
                     content = @Content(schema = @Schema(implementation = AsistenciaResponseDTO.class))),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos",
                     content = @Content),
        @ApiResponse(responseCode = "409", description = "Ya existe un registro para ese estudiante en esa fecha",
                     content = @Content)
    })
    @PostMapping
    public ResponseEntity<AsistenciaResponseDTO> registrarAsistencia(
            @Valid @RequestBody AsistenciaRequestDTO request) {
        AsistenciaResponseDTO creada = asistenciaService.registrarAsistencia(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }
}
