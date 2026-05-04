package com.example.controller;

import com.example.model.Student;
import com.example.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/students")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Student>> getStudents() {
        try {
            logger.info("Petición recibida para obtener estudiantes");
            List<Student> students = userService.getAllStudents();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            logger.error("Error al obtener estudiantes: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
