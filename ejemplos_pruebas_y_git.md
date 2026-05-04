# Pruebas Unitarias y Flujo Git (Estándar Senior)

## 1. Pruebas Unitarias (JUnit 5 + Mockito)

### Service de Usuarios (`UsuarioServiceTest.java`)
```java
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
        // Arrange (Preparar)
        Usuario u1 = new Usuario(1L, "Juan", "juan@mail.com");
        Usuario u2 = new Usuario(2L, "Ana", "ana@mail.com");
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(u1, u2));

        // Act (Ejecutar)
        List<UsuarioDTO> resultado = usuarioService.obtenerTodosLosUsuarios();

        // Assert (Verificar)
        assertEquals(2, resultado.size());
        assertEquals("Juan", resultado.get(0).getNombre());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    void debeCrearYRetornarUsuario() {
        // Arrange
        UsuarioDTO dto = UsuarioDTO.builder().nombre("Nuevo").email("nuevo@mail.com").build();
        Usuario mockDb = new Usuario(3L, "Nuevo", "nuevo@mail.com");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(mockDb);

        // Act
        UsuarioDTO resultado = usuarioService.crearUsuario(dto);

        // Assert
        assertEquals(3L, resultado.getId());
        assertEquals("Nuevo", resultado.getNombre());
    }
}
```

### Service de Notas (`NotaServiceTest.java`)
```java
package com.colegio.notas.service;

import com.colegio.notas.dto.NotaDTO;
import com.colegio.notas.model.Nota;
import com.colegio.notas.repository.NotaRepository;
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

class NotaServiceTest {

    @Mock
    private NotaRepository notaRepository;

    @InjectMocks
    private NotaService notaService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void debeCalcularYRetornarNotas() {
        // Arrange
        Nota n1 = new Nota(1L, 100L, "Matemáticas", 6.0);
        when(notaRepository.findAll()).thenReturn(Arrays.asList(n1));

        // Act
        List<NotaDTO> resultado = notaService.obtenerTodasLasNotas();

        // Assert
        assertEquals(1, resultado.size());
        assertEquals("Matemáticas", resultado.get(0).getAsignatura());
        assertEquals(6.0, resultado.get(0).getValorNota());
    }
}
```

---

## 2. Ejemplos Reales: Ramas y Commits (Convención Convencional)

### Ejemplos de Nombres de Ramas (GitFlow)
* `feature/auth-supabase` *(Nuevas funcionalidades)*
* `feature/crud-usuarios`
* `bugfix/fix-modal-edicion` *(Correcciones rápidas en dev)*
* `hotfix/login-crash-prod` *(Correcciones urgentes en producción)*
* `release/v1.0.0` *(Preparación de versión a producción)*

### Ejemplos de Commits Reales
* `feat: implementar JWT en AuthContext`
* `feat(notas): agregar modal interactivo para edicion de promedios`
* `fix: corregir renderizado duplicado en AdminDashboard`
* `fix(api): solucionar timeout en conexion con Supabase`
* `refactor: optimizar inyeccion de dependencias en UsuarioService`
* `docs: actualizar README con endpoints del BFF`
* `test: agregar pruebas unitarias con mockito para NotasService`
* `chore: actualizar dependencias de maven y dependabot`

### Flujo GitFlow Aplicado (Ejemplo de Terminal)
```bash
# 1. Crear rama para nueva característica desde la rama 'develop'
git checkout develop
git checkout -b feature/integracion-notas

# 2. Programar y guardar cambios
git add .
git commit -m "feat: crear microservicio de notas con endpoints CRUD"

# 3. Subir rama al repositorio
git push origin feature/integracion-notas

# 4. (En GitHub) Se aprueba el Pull Request hacia 'develop'

# 5. Descargar los cambios integrados en develop
git checkout develop
git pull origin develop

# 6. Preparar pase a producción
git checkout -b release/v1.0.0
git commit -m "chore: preparar version 1.0.0 para presentacion"

# 7. Merge a Main (Producción)
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "Versión Inicial Producción"
git push origin main --tags
```
