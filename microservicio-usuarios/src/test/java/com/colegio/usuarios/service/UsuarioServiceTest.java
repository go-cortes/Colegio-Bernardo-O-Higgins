package com.colegio.usuarios.service;

import com.colegio.usuarios.dto.UsuarioDTO;
import com.colegio.usuarios.model.Usuario;
import com.colegio.usuarios.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void debeRetornarListaDeUsuarios() {
        // Arrange
        Usuario u1 = new Usuario(1L, "Test 1", "test1@mail.com", "ALUMNO", "4° Medio A");
        Usuario u2 = new Usuario(2L, "Test 2", "test2@mail.com", "ALUMNO", "4° Medio A");
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
        Usuario mockGuardado = new Usuario(3L, "Nuevo", "nuevo@mail.com", "ALUMNO", "4° Medio A");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(mockGuardado);

        // Act
        UsuarioDTO resultado = usuarioService.crearUsuario(dtoEntrada);

        // Assert
        assertNotNull(resultado.getId());
        assertEquals(3L, resultado.getId());
        assertEquals("Nuevo", resultado.getNombre());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void debeRetornarSoloAlumnos() {
        // Arrange
        Usuario alumno1 = new Usuario(1L, "Ana García", "ana@colegio.cl", "ALUMNO", "4° Medio A");
        Usuario alumno2 = new Usuario(2L, "Luis Pérez", "luis@colegio.cl", "ALUMNO", "3° Medio B");
        when(usuarioRepository.findByRol("ALUMNO")).thenReturn(Arrays.asList(alumno1, alumno2));

        // Act
        List<UsuarioDTO> resultado = usuarioService.obtenerAlumnos();

        // Assert
        assertEquals(2, resultado.size());
        assertEquals("ALUMNO", resultado.get(0).getRol());
        assertEquals("ALUMNO", resultado.get(1).getRol());
        verify(usuarioRepository, times(1)).findByRol("ALUMNO");
    }

    @Test
    void debeBuscarPorEmail_CuandoExiste_RetornaUsuario() {
        // Arrange
        Usuario usuario = new Usuario(5L, "María López", "maria@colegio.cl", "PROFESOR", "");
        when(usuarioRepository.findByEmail("maria@colegio.cl"))
                .thenReturn(Optional.of(usuario));

        // Act
        Optional<UsuarioDTO> resultado = usuarioService.buscarPorEmail("maria@colegio.cl");

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(5L, resultado.get().getId());
        assertEquals("María López", resultado.get().getNombre());
        assertEquals("PROFESOR", resultado.get().getRol());
        verify(usuarioRepository, times(1)).findByEmail("maria@colegio.cl");
    }

    @Test
    void debeBuscarPorEmail_CuandoNoExiste_RetornaVacio() {
        // Arrange
        when(usuarioRepository.findByEmail("noexiste@colegio.cl"))
                .thenReturn(Optional.empty());

        // Act
        Optional<UsuarioDTO> resultado = usuarioService.buscarPorEmail("noexiste@colegio.cl");

        // Assert
        assertFalse(resultado.isPresent());
        verify(usuarioRepository, times(1)).findByEmail("noexiste@colegio.cl");
    }
}
