package com.example.controller;

import com.example.model.Grade;
import com.example.service.AcademicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/grades")
public class AcademicController {

    private static final Logger logger = LoggerFactory.getLogger(AcademicController.class);
    private final AcademicService academicService;

    public AcademicController(AcademicService academicService) {
        this.academicService = academicService;
    }

    @GetMapping
    public ResponseEntity<List<Grade>> getGrades() {
        try {
            logger.info("Petición recibida para obtener notas");
            List<Grade> grades = academicService.getAllGrades();
            return ResponseEntity.ok(grades);
        } catch (Exception e) {
            logger.error("Error al obtener notas: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
