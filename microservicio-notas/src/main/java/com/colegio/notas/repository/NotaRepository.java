package com.colegio.notas.repository;

import com.colegio.notas.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    /** Retorna todas las notas de un estudiante determinado */
    List<Nota> findByEstudianteId(Long estudianteId);
}
