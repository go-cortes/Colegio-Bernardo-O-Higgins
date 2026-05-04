package \${package}.repository;

import org.springframework.stereotype.Repository;

@Repository
public class ExampleRepository {

    public String fetchData() {
        return "Hola desde el Arquetipo Spring Boot!";
    }
}
