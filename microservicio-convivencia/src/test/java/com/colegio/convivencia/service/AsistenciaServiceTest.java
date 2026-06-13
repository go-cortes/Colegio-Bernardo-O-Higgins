package com.colegio.convivencia.service;

import com.colegio.convivencia.dto.AsistenciaRequestDTO;
import com.colegio.convivencia.dto.AsistenciaResponseDTO;
import com.colegio.convivencia.model.Asistencia;
import com.colegio.convivencia.model.Asistencia.EstadoAsistencia;
import com.colegio.convivencia.repository.AsistenciaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Test unitario puro: NO levanta contexto Spring ni base de datos.
 * Cubre la lógica de negocio clave: un alumno solo puede tener un
 * registro de asistencia por día.
 */
@ExtendWith(MockitoExtension.class)
class AsistenciaServiceTest {

    @Mock
    private AsistenciaRepository asistenciaRepository;

    @InjectMocks
    private AsistenciaService asistenciaService;

    private AsistenciaRequestDTO requestDTO;
    private Asistencia asistenciaGuardada;
    private final LocalDate HOY = LocalDate.of(2024, 5, 20);

    @BeforeEach
    void setUp() {
        requestDTO = new AsistenciaRequestDTO();
        requestDTO.setEstudianteId(5L);
        requestDTO.setFecha(HOY);
        requestDTO.setEstado(EstadoAsistencia.PRESENTE);
        requestDTO.setObservacion(null);

        asistenciaGuardada = Asistencia.builder()
                .id(1L)
                .estudianteId(5L)
                .fecha(HOY)
                .estado(EstadoAsistencia.PRESENTE)
                .observacion(null)
                .build();
    }

    // ----------------------------------------------------------------
    // registrarAsistencia()
    // ----------------------------------------------------------------

    @Test
    @DisplayName("registrarAsistencia: debe persistir y retornar el DTO con ID generado")
    void registrarAsistencia_DebeGuardarYRetornarDTO() {
        // Arrange: no existe registro previo → Optional vacío
        when(asistenciaRepository.findByEstudianteIdAndFecha(5L, HOY))
                .thenReturn(Optional.empty());
        when(asistenciaRepository.save(any(Asistencia.class))).thenReturn(asistenciaGuardada);

        // Act
        AsistenciaResponseDTO resultado = asistenciaService.registrarAsistencia(requestDTO);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getEstudianteId()).isEqualTo(5L);
        assertThat(resultado.getFecha()).isEqualTo(HOY);
        assertThat(resultado.getEstado()).isEqualTo(EstadoAsistencia.PRESENTE);

        verify(asistenciaRepository, times(1))
                .findByEstudianteIdAndFecha(5L, HOY);
        verify(asistenciaRepository, times(1)).save(any(Asistencia.class));
    }

    @Test
    @DisplayName("registrarAsistencia: debe lanzar IllegalStateException si ya existe registro ese día")
    void registrarAsistencia_RegistroDuplicado_DebeLanzarExcepcion() {
        // Arrange: ya existe un registro para ese alumno ese día
        when(asistenciaRepository.findByEstudianteIdAndFecha(5L, HOY))
                .thenReturn(Optional.of(asistenciaGuardada));

        // Act & Assert
        assertThatThrownBy(() -> asistenciaService.registrarAsistencia(requestDTO))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Ya existe un registro de asistencia")
                .hasMessageContaining("5")
                .hasMessageContaining(HOY.toString());

        // Verificar que NUNCA se intenta guardar cuando hay duplicado
        verify(asistenciaRepository, never()).save(any());
    }

    @Test
    @DisplayName("registrarAsistencia: debe guardar correctamente el estado TARDANZA con observacion")
    void registrarAsistencia_ConTardanzaYObservacion_DebeGuardarCorrectamente() {
        // Arrange
        requestDTO.setEstado(EstadoAsistencia.TARDANZA);
        requestDTO.setObservacion("Llegó 20 minutos tarde");

        Asistencia tardanza = Asistencia.builder()
                .id(2L).estudianteId(5L).fecha(HOY)
                .estado(EstadoAsistencia.TARDANZA)
                .observacion("Llegó 20 minutos tarde")
                .build();

        when(asistenciaRepository.findByEstudianteIdAndFecha(5L, HOY))
                .thenReturn(Optional.empty());
        when(asistenciaRepository.save(any(Asistencia.class))).thenReturn(tardanza);

        // Act
        AsistenciaResponseDTO resultado = asistenciaService.registrarAsistencia(requestDTO);

        // Assert
        assertThat(resultado.getEstado()).isEqualTo(EstadoAsistencia.TARDANZA);
        assertThat(resultado.getObservacion()).isEqualTo("Llegó 20 minutos tarde");
    }

    // ----------------------------------------------------------------
    // obtenerAsistenciasPorEstudiante()
    // ----------------------------------------------------------------

    @Test
    @DisplayName("obtenerAsistenciasPorEstudiante: debe retornar lista filtrada por estudianteId")
    void obtenerAsistenciasPorEstudiante_DebeRetornarLista() {
        // Arrange
        when(asistenciaRepository.findByEstudianteIdOrderByFechaDesc(5L))
                .thenReturn(List.of(asistenciaGuardada));

        // Act
        List<AsistenciaResponseDTO> resultado =
                asistenciaService.obtenerAsistenciasPorEstudiante(5L);

        // Assert
        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getEstudianteId()).isEqualTo(5L);
        verify(asistenciaRepository, times(1))
                .findByEstudianteIdOrderByFechaDesc(5L);
    }

    @Test
    @DisplayName("obtenerAsistenciasPorEstudiante: debe retornar lista vacía si el alumno no tiene registros")
    void obtenerAsistenciasPorEstudiante_SinRegistros_DebeRetornarListaVacia() {
        when(asistenciaRepository.findByEstudianteIdOrderByFechaDesc(99L))
                .thenReturn(List.of());

        List<AsistenciaResponseDTO> resultado =
                asistenciaService.obtenerAsistenciasPorEstudiante(99L);

        assertThat(resultado).isEmpty();
    }

    // ----------------------------------------------------------------
    // obtenerAsistenciasPorFecha()
    // ----------------------------------------------------------------

    @Test
    @DisplayName("obtenerAsistenciasPorFecha: debe retornar todos los registros de ese día")
    void obtenerAsistenciasPorFecha_DebeRetornarRegistrosDeLaFecha() {
        // Arrange
        Asistencia a2 = Asistencia.builder()
                .id(2L).estudianteId(6L).fecha(HOY)
                .estado(EstadoAsistencia.AUSENTE).build();

        when(asistenciaRepository.findByFecha(HOY))
                .thenReturn(List.of(asistenciaGuardada, a2));

        // Act
        List<AsistenciaResponseDTO> resultado =
                asistenciaService.obtenerAsistenciasPorFecha(HOY);

        // Assert
        assertThat(resultado).hasSize(2);
        assertThat(resultado).extracting(AsistenciaResponseDTO::getFecha)
                .containsOnly(HOY);
        verify(asistenciaRepository, times(1)).findByFecha(HOY);
    }
}
