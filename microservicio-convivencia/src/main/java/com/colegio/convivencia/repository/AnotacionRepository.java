package com.colegio.convivencia.repository;

import com.colegio.convivencia.model.Anotacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository Layer para Anotacion.
 * Hereda los métodos CRUD de JpaRepository<T, ID>.
 * Spring Data genera el SQL automáticamente desde los nombres de los métodos.
 */
@Repository
public interface AnotacionRepository extends JpaRepository<Anotacion, Long> {

    /** Todas las anotaciones de un estudiante, ordenadas por fecha descendente */
    List<Anotacion> findByEstudianteIdOrderByFechaRegistroDesc(Long estudianteId);

    /** Anotaciones registradas por un profesor específico */
    List<Anotacion> findByProfesorIdOrderByFechaRegistroDesc(Long profesorId);

    /** Filtrar por tipo: POSITIVA, NEGATIVA o INFORMATIVA */
    List<Anotacion> findByTipo(Anotacion.TipoAnotacion tipo);
}
