package com.colegio.notas.controller;

import com.colegio.notas.dto.NotaDTO;
import com.colegio.notas.service.NotaService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotaControllerTest {

    @Mock
    private NotaService notaService;

    @InjectMocks
    private NotaController notaController;

    @Test
    void testGetNotas() {
        NotaDTO n1 = NotaDTO.builder().asignatura("Matemáticas").valorNota(6.5).build();
        when(notaService.obtenerTodasLasNotas()).thenReturn(Arrays.asList(n1));

        ResponseEntity<List<NotaDTO>> response = notaController.getNotas();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(notaService, times(1)).obtenerTodasLasNotas();
    }

    @Test
    void testGetNotasByEstudiante() {
        NotaDTO n1 = NotaDTO.builder().estudianteId(1L).asignatura("Historia").valorNota(7.0).build();
        when(notaService.obtenerNotasPorEstudiante(1L)).thenReturn(Arrays.asList(n1));

        ResponseEntity<List<NotaDTO>> response = notaController.getNotasByEstudiante(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(notaService, times(1)).obtenerNotasPorEstudiante(1L);
    }

    @Test
    void testCreateNota() {
        NotaDTO dto = NotaDTO.builder().estudianteId(2L).asignatura("Lenguaje").valorNota(5.5).build();
        when(notaService.crearNota(any(NotaDTO.class))).thenReturn(dto);

        ResponseEntity<NotaDTO> response = notaController.createNota(dto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Lenguaje", response.getBody().getAsignatura());
        verify(notaService, times(1)).crearNota(any(NotaDTO.class));
    }
}
