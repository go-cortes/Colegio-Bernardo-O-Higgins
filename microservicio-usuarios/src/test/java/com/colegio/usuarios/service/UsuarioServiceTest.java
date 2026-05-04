package com.colegio.usuarios.service;

import com.colegio.usuarios.dto.UsuarioDTO;
import com.colegio.usuarios.model.Usuario;
import com.colegio.usuarios.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void debeRetornarListaDeUsuarios() {
        // Arrange
        Usuario u1 = new Usuario(1L, "Test 1", "test1@mail.com");
        Usuario u2 = new Usuario(2L, "Test 2", "test2@mail.com");
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(u1, u2));

        // Act
        List<UsuarioDTO> resultado = usuarioService.obtenerTodosLosUsuarios();

        // Assert
        assertEquals(2, resultado.size());
        assertEquals("Test 1", resultado.get(0).getNombre());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    void debeCrearYRetornarUsuario() {
        // Arrange
        UsuarioDTO dtoEntrada = UsuarioDTO.builder().nombre("Nuevo").email("nuevo@mail.com").build();
        Usuario mockGuardado = new Usuario(3L, "Nuevo", "nuevo@mail.com");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(mockGuardado);

        // Act
        UsuarioDTO resultado = usuarioService.crearUsuario(dtoEntrada);

        // Assert
        assertNotNull(resultado.getId());
        assertEquals(3L, resultado.getId());
        assertEquals("Nuevo", resultado.getNombre());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }
}
