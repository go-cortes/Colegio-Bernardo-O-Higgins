package com.colegio.convivencia.service;

import com.colegio.convivencia.dto.AnotacionRequestDTO;
import com.colegio.convivencia.dto.AnotacionResponseDTO;
import com.colegio.convivencia.model.Anotacion;
import com.colegio.convivencia.repository.AnotacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Layer para Anotaciones de Convivencia.
 * Contiene la lógica de negocio y el mapeo entre Model y DTO.
 * @Transactional garantiza rollback automático si algo falla durante la operación.
 */
@Service
@RequiredArgsConstructor
public class AnotacionService {

    private final AnotacionRepository anotacionRepository;

    @Transactional
    public AnotacionResponseDTO crearAnotacion(AnotacionRequestDTO request) {
        Anotacion anotacion = Anotacion.builder()
                .estudianteId(request.getEstudianteId())
                .profesorId(request.getProfesorId())
                .tipo(request.getTipo())
                .descripcion(request.getDescripcion())
                .medida(request.getMedida())
                .build();

        Anotacion guardada = anotacionRepository.save(anotacion);
        return mapToResponseDTO(guardada);
    }

    @Transactional(readOnly = true)
    public List<AnotacionResponseDTO> obtenerTodasLasAnotaciones() {
        return anotacionRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AnotacionResponseDTO> obtenerAnotacionesPorEstudiante(Long estudianteId) {
        return anotacionRepository
                .findByEstudianteIdOrderByFechaRegistroDesc(estudianteId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AnotacionResponseDTO> obtenerAnotacionesPorProfesor(Long profesorId) {
        return anotacionRepository
                .findByProfesorIdOrderByFechaRegistroDesc(profesorId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Mapper manual — consistente con el patrón de UsuarioService y NotaService
    private AnotacionResponseDTO mapToResponseDTO(Anotacion anotacion) {
        return AnotacionResponseDTO.builder()
                .id(anotacion.getId())
                .estudianteId(anotacion.getEstudianteId())
                .profesorId(anotacion.getProfesorId())
                .tipo(anotacion.getTipo())
                .descripcion(anotacion.getDescripcion())
                .medida(anotacion.getMedida())
                .fechaRegistro(anotacion.getFechaRegistro())
                .build();
    }
}
