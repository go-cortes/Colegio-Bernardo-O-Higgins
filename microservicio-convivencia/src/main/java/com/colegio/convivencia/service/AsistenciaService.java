package com.colegio.convivencia.service;

import com.colegio.convivencia.dto.AsistenciaRequestDTO;
import com.colegio.convivencia.dto.AsistenciaResponseDTO;
import com.colegio.convivencia.model.Asistencia;
import com.colegio.convivencia.repository.AsistenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Layer para Asistencia Diaria.
 * Incluye validación de negocio: no permite duplicar asistencia del mismo alumno en el mismo día.
 */
@Service
@RequiredArgsConstructor
public class AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;

    @Transactional
    public AsistenciaResponseDTO registrarAsistencia(AsistenciaRequestDTO request) {
        // Regla de negocio: un alumno solo puede tener un registro por día
        asistenciaRepository
                .findByEstudianteIdAndFecha(request.getEstudianteId(), request.getFecha())
                .ifPresent(a -> {
                    throw new IllegalStateException(
                            "Ya existe un registro de asistencia para el estudiante "
                            + request.getEstudianteId() + " en la fecha " + request.getFecha()
                    );
                });

        Asistencia asistencia = Asistencia.builder()
                .estudianteId(request.getEstudianteId())
                .fecha(request.getFecha())
                .estado(request.getEstado())
                .observacion(request.getObservacion())
                .build();

        Asistencia guardada = asistenciaRepository.save(asistencia);
        return mapToResponseDTO(guardada);
    }

    @Transactional(readOnly = true)
    public List<AsistenciaResponseDTO> obtenerAsistenciasPorEstudiante(Long estudianteId) {
        return asistenciaRepository
                .findByEstudianteIdOrderByFechaDesc(estudianteId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AsistenciaResponseDTO> obtenerAsistenciasPorFecha(LocalDate fecha) {
        return asistenciaRepository
                .findByFecha(fecha)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private AsistenciaResponseDTO mapToResponseDTO(Asistencia asistencia) {
        return AsistenciaResponseDTO.builder()
                .id(asistencia.getId())
                .estudianteId(asistencia.getEstudianteId())
                .fecha(asistencia.getFecha())
                .estado(asistencia.getEstado())
                .observacion(asistencia.getObservacion())
                .build();
    }
}
