package com.colegio.convivencia.controller;

import com.colegio.convivencia.dto.AnotacionRequestDTO;
import com.colegio.convivencia.dto.AnotacionResponseDTO;
import com.colegio.convivencia.model.Anotacion.TipoAnotacion;
import com.colegio.convivencia.service.AnotacionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Test unitario del Controller Layer de Anotaciones.
 * Verifica que el controller delega correctamente al service
 * y retorna los HTTP status codes apropiados.
 */
@ExtendWith(MockitoExtension.class)
class AnotacionControllerTest {

    @Mock
    private AnotacionService anotacionService;

    @InjectMocks
    private AnotacionController anotacionController;

    private AnotacionResponseDTO buildResponseDTO(Long id, Long estudianteId,
                                                   Long profesorId, TipoAnotacion tipo) {
        return AnotacionResponseDTO.builder()
                .id(id)
                .estudianteId(estudianteId)
                .profesorId(profesorId)
                .tipo(tipo)
                .descripcion("Descripción de prueba")
                .fechaRegistro(LocalDateTime.now())
                .build();
    }

    // ----------------------------------------------------------------
    // GET /anotaciones
    // ----------------------------------------------------------------

    @Test
    @DisplayName("GET /anotaciones → 200 OK con lista completa")
    void testGetAnotaciones_RetornaListaConStatus200() {
        AnotacionResponseDTO dto1 = buildResponseDTO(1L, 10L, 5L, TipoAnotacion.POSITIVA);
        AnotacionResponseDTO dto2 = buildResponseDTO(2L, 11L, 5L, TipoAnotacion.NEGATIVA);
        when(anotacionService.obtenerTodasLasAnotaciones()).thenReturn(List.of(dto1, dto2));

        ResponseEntity<List<AnotacionResponseDTO>> response = anotacionController.getAnotaciones();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(2);
        verify(anotacionService, times(1)).obtenerTodasLasAnotaciones();
    }

    @Test
    @DisplayName("GET /anotaciones → 200 OK con lista vacía (no 404)")
    void testGetAnotaciones_ListaVacia_Retorna200() {
        when(anotacionService.obtenerTodasLasAnotaciones()).thenReturn(List.of());

        ResponseEntity<List<AnotacionResponseDTO>> response = anotacionController.getAnotaciones();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEmpty();
    }

    // ----------------------------------------------------------------
    // GET /anotaciones/estudiante/{estudianteId}
    // ----------------------------------------------------------------

    @Test
    @DisplayName("GET /anotaciones/estudiante/{id} → 200 OK con anotaciones del alumno")
    void testGetAnotacionesPorEstudiante_RetornaListaFiltrada() {
        AnotacionResponseDTO dto = buildResponseDTO(1L, 10L, 5L, TipoAnotacion.NEGATIVA);
        when(anotacionService.obtenerAnotacionesPorEstudiante(10L)).thenReturn(List.of(dto));

        ResponseEntity<List<AnotacionResponseDTO>> response =
                anotacionController.getAnotacionesPorEstudiante(10L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0).getEstudianteId()).isEqualTo(10L);
        verify(anotacionService, times(1)).obtenerAnotacionesPorEstudiante(10L);
    }

    // ----------------------------------------------------------------
    // GET /anotaciones/profesor/{profesorId}
    // ----------------------------------------------------------------

    @Test
    @DisplayName("GET /anotaciones/profesor/{id} → 200 OK con anotaciones del profesor")
    void testGetAnotacionesPorProfesor_RetornaListaFiltrada() {
        AnotacionResponseDTO dto1 = buildResponseDTO(1L, 10L, 5L, TipoAnotacion.POSITIVA);
        AnotacionResponseDTO dto2 = buildResponseDTO(2L, 12L, 5L, TipoAnotacion.INFORMATIVA);
        when(anotacionService.obtenerAnotacionesPorProfesor(5L)).thenReturn(List.of(dto1, dto2));

        ResponseEntity<List<AnotacionResponseDTO>> response =
                anotacionController.getAnotacionesPorProfesor(5L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(2);
        verify(anotacionService, times(1)).obtenerAnotacionesPorProfesor(5L);
    }

    // ----------------------------------------------------------------
    // POST /anotaciones
    // ----------------------------------------------------------------

    @Test
    @DisplayName("POST /anotaciones → 201 CREATED con el DTO creado en el body")
    void testCrearAnotacion_Retorna201ConBody() {
        AnotacionRequestDTO request = new AnotacionRequestDTO();
        request.setEstudianteId(10L);
        request.setProfesorId(5L);
        request.setTipo(TipoAnotacion.NEGATIVA);
        request.setDescripcion("El alumno interrumpió la clase reiteradamente.");

        AnotacionResponseDTO creada = buildResponseDTO(1L, 10L, 5L, TipoAnotacion.NEGATIVA);
        when(anotacionService.crearAnotacion(any(AnotacionRequestDTO.class))).thenReturn(creada);

        ResponseEntity<AnotacionResponseDTO> response = anotacionController.crearAnotacion(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(1L);
        assertThat(response.getBody().getTipo()).isEqualTo(TipoAnotacion.NEGATIVA);
        verify(anotacionService, times(1)).crearAnotacion(any(AnotacionRequestDTO.class));
    }
}
