package com.colegio.bff.service;

import com.colegio.bff.client.NotaClient;
import com.colegio.bff.client.UsuarioClient;
import com.colegio.bff.dto.DashboardResponseDTO;
import com.colegio.bff.dto.NotaDTO;
import com.colegio.bff.dto.UsuarioDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

class BffServiceTest {

    @Mock
    private UsuarioClient usuarioClient;

    @Mock
    private NotaClient notaClient;

    @InjectMocks
    private BffService bffService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void debeRetornarDatosCombinados() {
        // Arrange
        UsuarioDTO usuarioMock = new UsuarioDTO();
        usuarioMock.setId(1L);
        usuarioMock.setNombre("Test User");
        
        NotaDTO notaMock = new NotaDTO();
        notaMock.setId(1L);
        notaMock.setAsignatura("Matemáticas");

        when(usuarioClient.getUsuarios()).thenReturn(Collections.singletonList(usuarioMock));
        when(notaClient.getNotas()).thenReturn(Collections.singletonList(notaMock));

        // Act
        DashboardResponseDTO result = bffService.obtenerDatosDashboard();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getUsuarios().size());
        assertEquals(1, result.getNotas().size());
        assertEquals("Operativo - Datos combinados exitosamente", result.getEstadoBFF());
    }
}
