package com.colegio.notas.controller;

import com.colegio.notas.dto.NotaDTO;
import com.colegio.notas.service.NotaService;
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
public class NotaController {

    private final NotaService notaService;

    /**
     * GET /notas -> retorna lista de notas
     */
    @GetMapping
    public ResponseEntity<List<NotaDTO>> getNotas() {
        return ResponseEntity.ok(notaService.obtenerTodasLasNotas());
    }

    /**
     * POST /notas -> crea una nota
     */
    @PostMapping
    public ResponseEntity<NotaDTO> createNota(@RequestBody NotaDTO notaDTO) {
        NotaDTO creada = notaService.crearNota(notaDTO);
        return new ResponseEntity<>(creada, HttpStatus.CREATED);
    }
}
