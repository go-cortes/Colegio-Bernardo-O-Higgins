package com.colegio.notas.service;

import com.colegio.notas.dto.NotaDTO;
import com.colegio.notas.model.Nota;
import com.colegio.notas.repository.NotaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Layer para la gestión de notas.
 */
@Service
@RequiredArgsConstructor
public class NotaService {

    private final NotaRepository notaRepository;

    public List<NotaDTO> obtenerTodasLasNotas() {
        return notaRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public NotaDTO crearNota(NotaDTO dto) {
        Nota nota = new Nota();
        nota.setEstudianteId(dto.getEstudianteId());
        nota.setAsignatura(dto.getAsignatura());
        nota.setNota(dto.getValorNota());
        
        Nota guardada = notaRepository.save(nota);
        return mapToDTO(guardada);
    }

    private NotaDTO mapToDTO(Nota nota) {
        return NotaDTO.builder()
                .id(nota.getId())
                .estudianteId(nota.getEstudianteId())
                .asignatura(nota.getAsignatura())
                .valorNota(nota.getNota())
                .build();
    }
}
