package com.example.service;

import com.example.model.Grade;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AcademicService {
    private static final Logger logger = LoggerFactory.getLogger(AcademicService.class);

    public List<Grade> getAllGrades() {
        logger.info("Obteniendo todas las notas desde la capa de servicio");
        return List.of(
            new Grade("1", "Matemáticas", 6.5),
            new Grade("1", "Historia", 5.5),
            new Grade("2", "Matemáticas", 7.0),
            new Grade("3", "Historia", 6.0)
        );
    }
}
