package com.colegio.convivencia.config;

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
 * La UI estará disponible en: http://localhost:8083/swagger-ui.html
 * La especificación JSON en:  http://localhost:8083/v3/api-docs
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI convivenciaOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Microservicio Convivencia — API REST")
                        .description("""
                                API para la gestión de asistencia diaria y anotaciones de convivencia
                                del Colegio Bernardo O'Higgins.
                                
                                **Asistencia:** Registra presencia, ausencia, tardanza o justificación
                                de cada estudiante por día. Incluye validación de duplicados: un alumno
                                solo puede tener un registro por día.
                                
                                **Anotaciones:** Permite registrar observaciones de convivencia
                                (positivas, negativas, informativas) asociadas a un estudiante y profesor.
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
                                .url("http://localhost:8083")
                                .description("Servidor de desarrollo local")
                ));
    }
}
