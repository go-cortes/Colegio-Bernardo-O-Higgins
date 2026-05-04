package com.example.service;

import com.example.model.Student;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    public List<Student> getAllStudents() {
        logger.info("Obteniendo lista de estudiantes desde la capa de servicio");
        return List.of(
            new Student("1", "Juan", 15),
            new Student("2", "Maria", 16),
            new Student("3", "Pedro", 15)
        );
    }
}
