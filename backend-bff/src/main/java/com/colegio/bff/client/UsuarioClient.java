package com.colegio.bff.client;

import com.colegio.bff.dto.UsuarioDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

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
            return Collections.emptyList();
        }
    }

    /** GET /usuarios/alumnos — lista solo los alumnos */
    public List<UsuarioDTO> getAlumnos() {
        try {
            ResponseEntity<List<UsuarioDTO>> response = restTemplate.exchange(
                    urlUsuarios + "/usuarios/alumnos",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<UsuarioDTO>>() {}
            );
            return response.getBody() != null ? response.getBody() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Error al obtener alumnos: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * GET /usuarios/by-email — busca un usuario por email.
     * Retorna Optional vacío si no existe (404).
     */
    public Optional<UsuarioDTO> getByEmail(String email) {
        try {
            UsuarioDTO usuario = restTemplate.getForObject(
                    urlUsuarios + "/usuarios/by-email?email=" + email,
                    UsuarioDTO.class
            );
            return Optional.ofNullable(usuario);
        } catch (HttpClientErrorException.NotFound e) {
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error al buscar usuario por email: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public UsuarioDTO postUsuario(UsuarioDTO dto) {
        try {
            return restTemplate.postForObject(urlUsuarios + "/usuarios", dto, UsuarioDTO.class);
        } catch (Exception e) {
            log.error("Error al crear usuario en el microservicio: {}", e.getMessage());
            return null;
        }
    }
}
