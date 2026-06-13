package com.colegio.usuarios.repository;

import com.colegio.usuarios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /** Busca un usuario por su email (para login) */
    Optional<Usuario> findByEmail(String email);

    /** Busca usuarios por rol (ALUMNO, PROFESOR, etc.) */
    java.util.List<Usuario> findByRol(String rol);
}
