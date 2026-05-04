package com.colegio.bff.client;

import com.colegio.bff.dto.UsuarioDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class UsuarioClient {

    private final RestTemplate restTemplate;

    @Value("${microservicio.usuarios.url:http://localhost:8081}")
    private String urlUsuarios;

    public List<UsuarioDTO> getUsuarios() {
        try {
            ResponseEntity<List<UsuarioDTO>> response = restTemplate.exchange(
                    urlUsuarios + "/usuarios",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<UsuarioDTO>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error al obtener usuarios desde el microservicio: {}", e.getMessage());
            // Manejo básico de errores: retornar lista vacía en caso de fallo
            return Collections.emptyList();
        }
    }
}
