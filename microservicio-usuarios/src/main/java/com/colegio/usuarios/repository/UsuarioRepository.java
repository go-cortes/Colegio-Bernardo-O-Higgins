package com.colegio.usuarios.repository;

import com.colegio.usuarios.model.Usuario;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Repositorio Simulado.
 * Almacena los datos en memoria usando una lista en lugar de una Base de Datos real.
 */
@Repository
public class UsuarioRepository {

    private final List<Usuario> usuarios = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public UsuarioRepository() {
        // Datos semilla
        usuarios.add(new Usuario(idGenerator.getAndIncrement(), "Admin Colegio", "admin@colegio.cl"));
        usuarios.add(new Usuario(idGenerator.getAndIncrement(), "Profesor Jefe", "profesor@colegio.cl"));
    }

    public List<Usuario> findAll() {
        return new ArrayList<>(usuarios);
    }

    public Usuario save(Usuario usuario) {
        if (usuario.getId() == null) {
            usuario.setId(idGenerator.getAndIncrement());
            usuarios.add(usuario);
        } else {
            // Lógica de update si es necesario
            Optional<Usuario> existente = usuarios.stream()
                    .filter(u -> u.getId().equals(usuario.getId()))
                    .findFirst();
            existente.ifPresent(u -> {
                u.setNombre(usuario.getNombre());
                u.setEmail(usuario.getEmail());
            });
        }
        return usuario;
    }
}
