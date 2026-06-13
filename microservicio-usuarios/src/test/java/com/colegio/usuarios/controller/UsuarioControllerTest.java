package com.colegio.usuarios.controller;

import com.colegio.usuarios.dto.UsuarioDTO;
import com.colegio.usuarios.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private UsuarioController usuarioController;

    @Test
    void testGetUsuarios() {
        UsuarioDTO u1 = UsuarioDTO.builder().nombre("Juan").build();
        when(usuarioService.obtenerTodosLosUsuarios()).thenReturn(Arrays.asList(u1));

        ResponseEntity<List<UsuarioDTO>> response = usuarioController.getUsuarios();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(usuarioService, times(1)).obtenerTodosLosUsuarios();
    }

    @Test
    void testGetAlumnos() {
        UsuarioDTO u1 = UsuarioDTO.builder().nombre("Alumno").rol("ALUMNO").build();
        when(usuarioService.obtenerAlumnos()).thenReturn(Arrays.asList(u1));

        ResponseEntity<List<UsuarioDTO>> response = usuarioController.getAlumnos();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(usuarioService, times(1)).obtenerAlumnos();
    }

    @Test
    void testGetByEmail_Success() {
        UsuarioDTO u1 = UsuarioDTO.builder().nombre("Ana").email("ana@colegio.cl").build();
        when(usuarioService.buscarPorEmail("ana@colegio.cl")).thenReturn(Optional.of(u1));

        ResponseEntity<UsuarioDTO> response = usuarioController.getByEmail("ana@colegio.cl");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Ana", response.getBody().getNombre());
    }

    @Test
    void testGetByEmail_NotFound() {
        when(usuarioService.buscarPorEmail(anyString())).thenReturn(Optional.empty());

        ResponseEntity<UsuarioDTO> response = usuarioController.getByEmail("noexiste@colegio.cl");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCreateUsuario() {
        UsuarioDTO dto = UsuarioDTO.builder().nombre("Pedro").build();
        when(usuarioService.crearUsuario(any(UsuarioDTO.class))).thenReturn(dto);

        ResponseEntity<UsuarioDTO> response = usuarioController.createUsuario(dto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Pedro", response.getBody().getNombre());
    }
}
