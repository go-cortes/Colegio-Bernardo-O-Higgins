package com.colegio.notas.service;

import com.colegio.notas.dto.NotaDTO;
import com.colegio.notas.model.Nota;
import com.colegio.notas.repository.NotaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotaServiceTest {

    @Mock
    private NotaRepository notaRepository;

    @InjectMocks
    private NotaService notaService;

    @Test
    void debeRetornarListaDeNotas() {
        // Arrange
        Nota n1 = new Nota(1L, 101L, "Historia", 6.0);
        Nota n2 = new Nota(2L, 102L, "Ciencias", 5.5);
        when(notaRepository.findAll()).thenReturn(Arrays.asList(n1, n2));

        // Act
        List<NotaDTO> resultado = notaService.obtenerTodasLasNotas();

        // Assert
        assertEquals(2, resultado.size());
        assertEquals("Historia", resultado.get(0).getAsignatura());
        assertEquals(6.0, resultado.get(0).getValorNota());
        verify(notaRepository, times(1)).findAll();
    }

    @Test
    void debeRetornarNotasPorEstudiante() {
        Nota n1 = new Nota(1L, 101L, "Historia", 6.0);
        when(notaRepository.findByEstudianteId(101L)).thenReturn(Arrays.asList(n1));

        List<NotaDTO> resultado = notaService.obtenerNotasPorEstudiante(101L);

        assertEquals(1, resultado.size());
        assertEquals("Historia", resultado.get(0).getAsignatura());
        verify(notaRepository, times(1)).findByEstudianteId(101L);
    }

    @Test
    void debeCrearYRetornarNota() {
        // Arrange
        NotaDTO dtoEntrada = NotaDTO.builder().estudianteId(103L).asignatura("Arte").valorNota(7.0).build();
        Nota mockGuardada = new Nota(3L, 103L, "Arte", 7.0);
        when(notaRepository.save(any(Nota.class))).thenReturn(mockGuardada);

        // Act
        NotaDTO resultado = notaService.crearNota(dtoEntrada);

        // Assert
        assertNotNull(resultado.getId());
        assertEquals(3L, resultado.getId());
        assertEquals("Arte", resultado.getAsignatura());
        assertEquals(7.0, resultado.getValorNota());
        verify(notaRepository, times(1)).save(any(Nota.class));
    }
}
