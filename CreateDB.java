import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class CreateDB {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/postgres";
        String user = "postgres";
        String password = "postgres";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
             
            System.out.println("Checking if database colegio_usuarios exists...");
            try {
                stmt.executeUpdate("CREATE DATABASE colegio_usuarios");
                System.out.println("Database 'colegio_usuarios' created successfully.");
            } catch (Exception e) {
                System.out.println("Database 'colegio_usuarios' might already exist or error occurred: " + e.getMessage());
            }

            System.out.println("Checking if database colegio_notas exists...");
            try {
                stmt.executeUpdate("CREATE DATABASE colegio_notas");
                System.out.println("Database 'colegio_notas' created successfully.");
            } catch (Exception e) {
                System.out.println("Database 'colegio_notas' might already exist or error occurred: " + e.getMessage());
            }

            System.out.println("Checking if database colegio_convivencia exists...");
            try {
                stmt.executeUpdate("CREATE DATABASE colegio_convivencia");
                System.out.println("Database 'colegio_convivencia' created successfully.");
            } catch (Exception e) {
                System.out.println("Database 'colegio_convivencia' might already exist or error occurred: " + e.getMessage());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
