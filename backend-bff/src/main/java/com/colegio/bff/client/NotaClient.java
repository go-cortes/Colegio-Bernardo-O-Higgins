package com.colegio.bff.client;

import com.colegio.bff.dto.NotaDTO;
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
public class NotaClient {

    private final RestTemplate restTemplate;

    @Value("${microservicio.notas.url:http://localhost:8082}")
    private String urlNotas;

    public List<NotaDTO> getNotas() {
        try {
            ResponseEntity<List<NotaDTO>> response = restTemplate.exchange(
                    urlNotas + "/notas",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<NotaDTO>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error al obtener notas desde el microservicio: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public NotaDTO postNota(NotaDTO dto) {
        try {
            return restTemplate.postForObject(urlNotas + "/notas", dto, NotaDTO.class);
        } catch (Exception e) {
            log.error("Error al crear nota en el microservicio: {}", e.getMessage());
            return null;
        }
    }
}
