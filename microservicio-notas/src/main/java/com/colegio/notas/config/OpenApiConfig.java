package com.colegio.notas.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuración centralizada de Swagger / OpenAPI 3.
 * La UI estará disponible en: http://localhost:8082/swagger-ui.html
 * La especificación JSON en:  http://localhost:8082/v3/api-docs
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI notasOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Microservicio Notas — API REST")
                        .description("""
                                API para la gestión de calificaciones académicas del Colegio Bernardo O'Higgins.
                                
                                Permite registrar y consultar notas por estudiante y asignatura.
                                Las notas se almacenan en escala de 1.0 a 7.0 siguiendo el sistema
                                de evaluación chileno.
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipo Colegio O'Higgins")
                                .email("dev@colegioohiggins.cl"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8082")
                                .description("Servidor de desarrollo local")
                ));
    }
}
