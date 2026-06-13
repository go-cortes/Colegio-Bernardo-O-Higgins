package com.colegio.convivencia.repository;

import com.colegio.convivencia.model.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository Layer para Asistencia.
 * Los métodos derivados son generados automáticamente por Spring Data JPA.
 */
@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    /** Asistencias de un estudiante ordenadas por fecha descendente */
    List<Asistencia> findByEstudianteIdOrderByFechaDesc(Long estudianteId);

    /** Todas las asistencias de una fecha determinada (registro del día) */
    List<Asistencia> findByFecha(LocalDate fecha);

    /** Busca si ya existe un registro para ese alumno en esa fecha (evitar duplicados) */
    Optional<Asistencia> findByEstudianteIdAndFecha(Long estudianteId, LocalDate fecha);
}
