package com.colegio.usuarios.config;

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
 * La UI estará disponible en: http://localhost:8081/swagger-ui.html
 * La especificación JSON en:  http://localhost:8081/v3/api-docs
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI usuariosOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Microservicio Usuarios — API REST")
                        .description("""
                                API para la gestión de usuarios del Colegio Bernardo O'Higgins.
                                
                                Permite crear, consultar y filtrar usuarios (alumnos, profesores, directivos)
                                por rol, curso o email. Utilizada por el BFF para autenticación y
                                por otros microservicios para la resolución de IDs.
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
                                .url("http://localhost:8081")
                                .description("Servidor de desarrollo local")
                ));
    }
}
