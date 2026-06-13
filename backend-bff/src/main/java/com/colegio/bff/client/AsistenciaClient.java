package com.colegio.bff.client;

import com.colegio.bff.dto.AsistenciaRequestDTO;
import com.colegio.bff.dto.AsistenciaResponseDTO;
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
 * Mismo patrón que AnotacionClient.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AsistenciaClient {

    private final RestTemplate restTemplate;

    @Value("${microservicio.convivencia.url:http://localhost:8083}")
    private String urlConvivencia;

    public List<AsistenciaResponseDTO> getAsistenciasPorEstudiante(Long estudianteId) {
        try {
            ResponseEntity<List<AsistenciaResponseDTO>> response = restTemplate.exchange(
                    urlConvivencia + "/asistencias/estudiante/" + estudianteId,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<AsistenciaResponseDTO>>() {}
            );
            return response.getBody() != null ? response.getBody() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Error al obtener asistencias de estudiante {} desde ms-convivencia: {}", estudianteId, e.getMessage());
            return Collections.emptyList();
        }
    }

    public AsistenciaResponseDTO registrarAsistencia(AsistenciaRequestDTO dto) {
        try {
            return restTemplate.postForObject(
                    urlConvivencia + "/asistencias", dto, AsistenciaResponseDTO.class);
        } catch (Exception e) {
            log.error("Error al registrar asistencia en ms-convivencia: {}", e.getMessage());
            return null;
        }
    }
}
