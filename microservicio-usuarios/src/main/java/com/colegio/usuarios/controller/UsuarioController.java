package com.colegio.usuarios.controller;

import com.colegio.usuarios.dto.UsuarioDTO;
import com.colegio.usuarios.service.UsuarioService;
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
 * Controller Layer. Expone los endpoints RESTful.
 */
@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "Gestión de usuarios del colegio: alumnos, profesores y directivos")
public class UsuarioController {

    private final UsuarioService usuarioService;

    /** GET /usuarios → retorna lista de todos los usuarios */
    @Operation(summary = "Listar todos los usuarios",
               description = "Retorna la lista completa de usuarios registrados en el sistema, sin importar el rol.")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getUsuarios() {
        return ResponseEntity.ok(usuarioService.obtenerTodosLosUsuarios());
    }

    /** GET /usuarios/alumnos → retorna solo los alumnos */
    @Operation(summary = "Listar solo alumnos",
               description = "Retorna únicamente los usuarios con rol ALUMNO. Usado por el módulo de notas y asistencia.")
    @ApiResponse(responseCode = "200", description = "Lista de alumnos obtenida exitosamente")
    @GetMapping("/alumnos")
    public ResponseEntity<List<UsuarioDTO>> getAlumnos() {
        return ResponseEntity.ok(usuarioService.obtenerAlumnos());
    }

    /**
     * GET /usuarios/by-email?email=ana@colegio.cl → retorna el usuario con ese email.
     * El frontend lo usa para autenticar: si existe → loguear; si no → error.
     * (Sistema demo: la contraseña es la parte antes del @ del email)
     */
    @Operation(summary = "Buscar usuario por email",
               description = "Busca un usuario por su dirección de email. Utilizado para autenticación del frontend.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuario encontrado",
                     content = @Content(schema = @Schema(implementation = UsuarioDTO.class))),
        @ApiResponse(responseCode = "404", description = "No existe usuario con ese email",
                     content = @Content)
    })
    @GetMapping("/by-email")
    public ResponseEntity<UsuarioDTO> getByEmail(
            @Parameter(description = "Email del usuario a buscar", example = "ana.garcia@colegio.cl")
            @RequestParam String email) {
        return usuarioService.buscarPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** POST /usuarios → crea un usuario */
    @Operation(summary = "Crear un nuevo usuario",
               description = "Registra un nuevo usuario en el sistema. Si no se especifica rol, se asigna ALUMNO por defecto.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Usuario creado exitosamente",
                     content = @Content(schema = @Schema(implementation = UsuarioDTO.class))),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos",
                     content = @Content)
    })
    @PostMapping
    public ResponseEntity<UsuarioDTO> createUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDTO creado = usuarioService.crearUsuario(usuarioDTO);
        return new ResponseEntity<>(creado, HttpStatus.CREATED);
    }
}
