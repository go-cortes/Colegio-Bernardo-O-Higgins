package com.colegio.convivencia.controller;

import com.colegio.convivencia.dto.AsistenciaRequestDTO;
import com.colegio.convivencia.dto.AsistenciaResponseDTO;
import com.colegio.convivencia.model.Asistencia.EstadoAsistencia;
import com.colegio.convivencia.service.AsistenciaService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Test unitario del Controller Layer de Asistencia.
 * Verifica que el controller delega correctamente al service
 * y retorna los HTTP status codes apropiados.
 */
@ExtendWith(MockitoExtension.class)
class AsistenciaControllerTest {

    @Mock
    private AsistenciaService asistenciaService;

    @InjectMocks
    private AsistenciaController asistenciaController;

    private final LocalDate FECHA_PRUEBA = LocalDate.of(2024, 5, 20);

    private AsistenciaResponseDTO buildResponseDTO(Long id, Long estudianteId,
                                                    LocalDate fecha, EstadoAsistencia estado) {
        return AsistenciaResponseDTO.builder()
                .id(id)
                .estudianteId(estudianteId)
                .fecha(fecha)
                .estado(estado)
                .build();
    }

    // ----------------------------------------------------------------
    // GET /asistencias/estudiante/{estudianteId}
    // ----------------------------------------------------------------

    @Test
    @DisplayName("GET /asistencias/estudiante/{id} → 200 OK con historial del alumno")
    void testGetAsistenciasPorEstudiante_Retorna200ConHistorial() {
        AsistenciaResponseDTO dto1 = buildResponseDTO(1L, 5L, FECHA_PRUEBA, EstadoAsistencia.PRESENTE);
        AsistenciaResponseDTO dto2 = buildResponseDTO(2L, 5L, FECHA_PRUEBA.minusDays(1), EstadoAsistencia.TARDANZA);
        when(asistenciaService.obtenerAsistenciasPorEstudiante(5L)).thenReturn(List.of(dto1, dto2));

        ResponseEntity<List<AsistenciaResponseDTO>> response =
                asistenciaController.getAsistenciasPorEstudiante(5L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(2);
        assertThat(response.getBody()).extracting(AsistenciaResponseDTO::getEstudianteId)
                .containsOnly(5L);
        verify(asistenciaService, times(1)).obtenerAsistenciasPorEstudiante(5L);
    }

    @Test
    @DisplayName("GET /asistencias/estudiante/{id} → 200 OK con lista vacía si no hay registros")
    void testGetAsistenciasPorEstudiante_SinRegistros_Retorna200Vacio() {
        when(asistenciaService.obtenerAsistenciasPorEstudiante(99L)).thenReturn(List.of());

        ResponseEntity<List<AsistenciaResponseDTO>> response =
                asistenciaController.getAsistenciasPorEstudiante(99L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEmpty();
    }

    // ----------------------------------------------------------------
    // GET /asistencias/fecha?fecha=YYYY-MM-DD
    // ----------------------------------------------------------------

    @Test
    @DisplayName("GET /asistencias/fecha?fecha=... → 200 OK con todos los registros del día")
    void testGetAsistenciasPorFecha_Retorna200ConRegistrosDeLaFecha() {
        AsistenciaResponseDTO dto1 = buildResponseDTO(1L, 5L, FECHA_PRUEBA, EstadoAsistencia.PRESENTE);
        AsistenciaResponseDTO dto2 = buildResponseDTO(2L, 6L, FECHA_PRUEBA, EstadoAsistencia.AUSENTE);
        when(asistenciaService.obtenerAsistenciasPorFecha(FECHA_PRUEBA))
                .thenReturn(List.of(dto1, dto2));

        ResponseEntity<List<AsistenciaResponseDTO>> response =
                asistenciaController.getAsistenciasPorFecha(FECHA_PRUEBA);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(2);
        assertThat(response.getBody()).extracting(AsistenciaResponseDTO::getFecha)
                .containsOnly(FECHA_PRUEBA);
        verify(asistenciaService, times(1)).obtenerAsistenciasPorFecha(FECHA_PRUEBA);
    }

    // ----------------------------------------------------------------
    // POST /asistencias
    // ----------------------------------------------------------------

    @Test
    @DisplayName("POST /asistencias → 201 CREATED con el DTO registrado en el body")
    void testRegistrarAsistencia_Retorna201ConBody() {
        AsistenciaRequestDTO request = new AsistenciaRequestDTO();
        request.setEstudianteId(5L);
        request.setFecha(FECHA_PRUEBA);
        request.setEstado(EstadoAsistencia.PRESENTE);

        AsistenciaResponseDTO creada = buildResponseDTO(1L, 5L, FECHA_PRUEBA, EstadoAsistencia.PRESENTE);
        when(asistenciaService.registrarAsistencia(any(AsistenciaRequestDTO.class))).thenReturn(creada);

        ResponseEntity<AsistenciaResponseDTO> response =
                asistenciaController.registrarAsistencia(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(1L);
        assertThat(response.getBody().getEstado()).isEqualTo(EstadoAsistencia.PRESENTE);
        verify(asistenciaService, times(1)).registrarAsistencia(any(AsistenciaRequestDTO.class));
    }
}
