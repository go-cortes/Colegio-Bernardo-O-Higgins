package com.colegio.notas.repository;

import com.colegio.notas.model.Nota;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Repositorio Simulado en memoria para Notas.
 */
@Repository
public class NotaRepository {

    private final List<Nota> notas = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public NotaRepository() {
        // Datos semilla simulados
        notas.add(new Nota(idGenerator.getAndIncrement(), 101L, "Matemáticas", 6.5));
        notas.add(new Nota(idGenerator.getAndIncrement(), 101L, "Lenguaje", 5.8));
    }

    public List<Nota> findAll() {
        return new ArrayList<>(notas);
    }

    public Nota save(Nota nota) {
        if (nota.getId() == null) {
            nota.setId(idGenerator.getAndIncrement());
            notas.add(nota);
        } else {
            notas.stream()
                 .filter(n -> n.getId().equals(nota.getId()))
                 .findFirst()
                 .ifPresent(n -> {
                     n.setEstudianteId(nota.getEstudianteId());
                     n.setAsignatura(nota.getAsignatura());
                     n.setNota(nota.getNota());
                 });
        }
        return nota;
    }
}
