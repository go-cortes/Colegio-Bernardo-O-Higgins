package com.colegio.convivencia.service;

import com.colegio.convivencia.dto.AnotacionRequestDTO;
import com.colegio.convivencia.dto.AnotacionResponseDTO;
import com.colegio.convivencia.model.Anotacion;
import com.colegio.convivencia.model.Anotacion.TipoAnotacion;
import com.colegio.convivencia.repository.AnotacionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Test unitario puro: NO levanta contexto Spring ni base de datos.
 * Mockito simula el repository para aislar completamente la lógica del Service.
 */
@ExtendWith(MockitoExtension.class)
class AnotacionServiceTest {

    @Mock
    private AnotacionRepository anotacionRepository;

    @InjectMocks
    private AnotacionService anotacionService;

    private AnotacionRequestDTO requestDTO;
    private Anotacion anotacionGuardada;

    @BeforeEach
    void setUp() {
        // Arrange — datos reutilizados entre tests
        requestDTO = new AnotacionRequestDTO();
        requestDTO.setEstudianteId(3L);
        requestDTO.setProfesorId(1L);
        requestDTO.setTipo(TipoAnotacion.NEGATIVA);
        requestDTO.setDescripcion("El alumno interrumpió la clase en repetidas ocasiones.");
        requestDTO.setMedida("Se contactará al apoderado.");

        anotacionGuardada = Anotacion.builder()
                .id(1L)
                .estudianteId(3L)
                .profesorId(1L)
                .tipo(TipoAnotacion.NEGATIVA)
                .descripcion("El alumno interrumpió la clase en repetidas ocasiones.")
                .medida("Se contactará al apoderado.")
                .fechaRegistro(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("crearAnotacion: debe persistir y retornar el DTO con ID generado")
    void crearAnotacion_DebeGuardarYRetornarDTO() {
        // Arrange
        when(anotacionRepository.save(any(Anotacion.class))).thenReturn(anotacionGuardada);

        // Act
        AnotacionResponseDTO resultado = anotacionService.crearAnotacion(requestDTO);

        // Assert — verificamos el contenido del DTO devuelto
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getEstudianteId()).isEqualTo(3L);
        assertThat(resultado.getProfesorId()).isEqualTo(1L);
        assertThat(resultado.getTipo()).isEqualTo(TipoAnotacion.NEGATIVA);
        assertThat(resultado.getDescripcion())
                .isEqualTo("El alumno interrumpió la clase en repetidas ocasiones.");
        assertThat(resultado.getMedida()).isEqualTo("Se contactará al apoderado.");
        assertThat(resultado.getFechaRegistro()).isNotNull();

        // Assert — el repository fue llamado exactamente una vez con save()
        verify(anotacionRepository, times(1)).save(any(Anotacion.class));
    }

    @Test
    @DisplayName("obtenerAnotacionesPorEstudiante: debe retornar lista filtrada por estudianteId")
    void obtenerAnotacionesPorEstudiante_DebeRetornarListaFiltrada() {
        // Arrange
        when(anotacionRepository.findByEstudianteIdOrderByFechaRegistroDesc(3L))
                .thenReturn(List.of(anotacionGuardada));

        // Act
        List<AnotacionResponseDTO> resultado =
                anotacionService.obtenerAnotacionesPorEstudiante(3L);

        // Assert
        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getEstudianteId()).isEqualTo(3L);
        verify(anotacionRepository, times(1))
                .findByEstudianteIdOrderByFechaRegistroDesc(3L);
    }

    @Test
    @DisplayName("obtenerAnotacionesPorEstudiante: debe retornar lista vacía si no hay anotaciones")
    void obtenerAnotacionesPorEstudiante_SinAnotaciones_DebeRetornarListaVacia() {
        // Arrange
        when(anotacionRepository.findByEstudianteIdOrderByFechaRegistroDesc(99L))
                .thenReturn(List.of());

        // Act
        List<AnotacionResponseDTO> resultado =
                anotacionService.obtenerAnotacionesPorEstudiante(99L);

        // Assert
        assertThat(resultado).isEmpty();
    }

    @Test
    @DisplayName("crearAnotacion: NO debe llamar a findAll ni otros métodos del repository")
    void crearAnotacion_SoloDebeUsarSave() {
        // Arrange
        when(anotacionRepository.save(any(Anotacion.class))).thenReturn(anotacionGuardada);

        // Act
        anotacionService.crearAnotacion(requestDTO);

        // Assert — verificamos ausencia de llamadas no deseadas
        verify(anotacionRepository, never()).findAll();
        verify(anotacionRepository, never()).findById(any());
        verify(anotacionRepository, never()).findByEstudianteIdOrderByFechaRegistroDesc(any());
    }
}
