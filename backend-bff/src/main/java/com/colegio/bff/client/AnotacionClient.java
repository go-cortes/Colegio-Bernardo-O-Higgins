package com.colegio.bff.client;

import com.colegio.bff.dto.AnotacionRequestDTO;
import com.colegio.bff.dto.AnotacionResponseDTO;
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

/**
 * Cliente HTTP del BFF para comunicarse con microservicio-convivencia (puerto 8083).
 * Mismo patrón que UsuarioClient y NotaClient.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AnotacionClient {

    private final RestTemplate restTemplate;

    @Value("${microservicio.convivencia.url:http://localhost:8083}")
    private String urlConvivencia;

    public List<AnotacionResponseDTO> getAnotaciones() {
        try {
            ResponseEntity<List<AnotacionResponseDTO>> response = restTemplate.exchange(
                    urlConvivencia + "/anotaciones",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<AnotacionResponseDTO>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error al obtener anotaciones desde ms-convivencia: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public AnotacionResponseDTO postAnotacion(AnotacionRequestDTO dto) {
        try {
            return restTemplate.postForObject(
                    urlConvivencia + "/anotaciones", dto, AnotacionResponseDTO.class);
        } catch (Exception e) {
            log.error("Error al crear anotación en ms-convivencia: {}", e.getMessage());
            return null;
        }
    }
}
