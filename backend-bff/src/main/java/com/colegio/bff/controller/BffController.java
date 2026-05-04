package com.colegio.bff.controller;

import com.colegio.bff.dto.DashboardResponseDTO;
import com.colegio.bff.service.BffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller del BFF (Backend For Frontend).
 * Actúa como punto de entrada único para las aplicaciones cliente (ej. SPA React).
 */
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class BffController {

    private final BffService bffService;

    @GetMapping
    public ResponseEntity<DashboardResponseDTO> getDashboardData() {
        DashboardResponseDTO response = bffService.obtenerDatosDashboard();
        return ResponseEntity.ok(response);
    }
}
