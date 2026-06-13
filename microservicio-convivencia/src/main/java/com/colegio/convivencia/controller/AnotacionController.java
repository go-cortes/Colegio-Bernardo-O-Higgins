package com.colegio.convivencia.controller;

import com.colegio.convivencia.dto.AnotacionRequestDTO;
import com.colegio.convivencia.dto.AnotacionResponseDTO;
import com.colegio.convivencia.service.AnotacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller Layer. Solo enruta y delega al Service — sin lógica de negocio.
 * @Valid activa las validaciones del DTO (Jakarta Validation).
 */
@RestController
@RequestMapping("/anotaciones")
@RequiredArgsConstructor
@Tag(name = "Anotaciones", description = "Gestión de observaciones de convivencia escolar (positivas, negativas, informativas)")
public class AnotacionController {

    private final AnotacionService anotacionService;

    /** GET /anotaciones → lista todas las anotaciones */
    @Operation(summary = "Listar todas las anotaciones",
               description = "Retorna todas las observaciones de convivencia registradas, sin filtro.")
    @ApiResponse(responseCode = "200", description = "Lista de anotaciones obtenida exitosamente")
    @GetMapping
    public ResponseEntity<List<AnotacionResponseDTO>> getAnotaciones() {
        return ResponseEntity.ok(anotacionService.obtenerTodasLasAnotaciones());
    }

    /** GET /anotaciones/estudiante/{id} → anotaciones de un alumno específico */
    @Operation(summary = "Listar anotaciones por estudiante",
               description = "Retorna todas las observaciones de un estudiante específico, ordenadas de más reciente a más antigua.")
    @ApiResponse(responseCode = "200", description = "Anotaciones del estudiante obtenidas exitosamente")
    @GetMapping("/estudiante/{estudianteId}")
    public ResponseEntity<List<AnotacionResponseDTO>> getAnotacionesPorEstudiante(
            @Parameter(description = "ID del estudiante en ms-usuarios", example = "1")
            @PathVariable Long estudianteId) {
        return ResponseEntity.ok(
                anotacionService.obtenerAnotacionesPorEstudiante(estudianteId));
    }

    /** GET /anotaciones/profesor/{id} → anotaciones registradas por un profesor */
    @Operation(summary = "Listar anotaciones registradas por un profesor",
               description = "Retorna todas las observaciones ingresadas por un profesor específico, ordenadas de más reciente a más antigua.")
    @ApiResponse(responseCode = "200", description = "Anotaciones del profesor obtenidas exitosamente")
    @GetMapping("/profesor/{profesorId}")
    public ResponseEntity<List<AnotacionResponseDTO>> getAnotacionesPorProfesor(
            @Parameter(description = "ID del profesor en ms-usuarios", example = "5")
            @PathVariable Long profesorId) {
        return ResponseEntity.ok(
                anotacionService.obtenerAnotacionesPorProfesor(profesorId));
    }

    /** POST /anotaciones → registrar una nueva observación de convivencia */
    @Operation(summary = "Registrar una nueva anotación",
               description = "Registra una observación de convivencia (POSITIVA, NEGATIVA o INFORMATIVA) "
                           + "asociada a un estudiante y un profesor. La fecha de registro es asignada automáticamente por el servidor.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Anotación creada exitosamente",
                     content = @Content(schema = @Schema(implementation = AnotacionResponseDTO.class))),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos (campos obligatorios faltantes)",
                     content = @Content)
    })
    @PostMapping
    public ResponseEntity<AnotacionResponseDTO> crearAnotacion(
            @Valid @RequestBody AnotacionRequestDTO request) {
        AnotacionResponseDTO creada = anotacionService.crearAnotacion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }
}
