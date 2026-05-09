package com.colegio.bff.controller;

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

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioDTO> crearUsuario(@RequestBody UsuarioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bffService.crearUsuario(dto));
    }

    @GetMapping("/notas")
    public ResponseEntity<List<NotaDTO>> getNotas() {
        return ResponseEntity.ok(bffService.obtenerNotas());
    }

    @PostMapping("/notas")
    public ResponseEntity<NotaDTO> crearNota(@RequestBody NotaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bffService.crearNota(dto));
    }
}
