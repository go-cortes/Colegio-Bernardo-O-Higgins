package com.colegio.notas.controller;

import com.colegio.notas.dto.NotaDTO;
import com.colegio.notas.service.NotaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller Layer. Expone los endpoints REST para Notas.
 */
@RestController
@RequestMapping("/notas")
@RequiredArgsConstructor
@Tag(name = "Notas", description = "Gestión de calificaciones académicas (escala 1.0 a 7.0)")
public class NotaController {

    private final NotaService notaService;

    /**
     * GET /notas → retorna lista de notas
     */
    @Operation(summary = "Listar todas las notas",
               description = "Retorna la lista completa de calificaciones registradas en el sistema.")
    @ApiResponse(responseCode = "200", description = "Lista de notas obtenida exitosamente")
    @GetMapping
    public ResponseEntity<List<NotaDTO>> getNotas() {
        return ResponseEntity.ok(notaService.obtenerTodasLasNotas());
    }

    /**
     * GET /notas/estudiante/{estudianteId} → notas de un alumno específico
     */
    @Operation(summary = "Listar notas por estudiante",
               description = "Retorna todas las calificaciones de un estudiante específico, identificado por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Notas del estudiante obtenidas exitosamente"),
        @ApiResponse(responseCode = "200", description = "Lista vacía si el estudiante no tiene notas registradas",
                     content = @Content)
    })
    @GetMapping("/estudiante/{estudianteId}")
    public ResponseEntity<List<NotaDTO>> getNotasByEstudiante(
            @Parameter(description = "ID del estudiante en ms-usuarios", example = "1")
            @PathVariable Long estudianteId) {
        return ResponseEntity.ok(notaService.obtenerNotasPorEstudiante(estudianteId));
    }

    /**
     * POST /notas → crea una nota
     */
    @Operation(summary = "Registrar una nueva nota",
               description = "Registra una calificación académica para un estudiante en una asignatura. "
                           + "El valor debe estar entre 1.0 y 7.0.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Nota creada exitosamente",
                     content = @Content(schema = @Schema(implementation = NotaDTO.class))),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos",
                     content = @Content)
    })
    @PostMapping
    public ResponseEntity<NotaDTO> createNota(@RequestBody NotaDTO notaDTO) {
        NotaDTO creada = notaService.crearNota(notaDTO);
        return new ResponseEntity<>(creada, HttpStatus.CREATED);
    }
}
