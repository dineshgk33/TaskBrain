package org.example.taskbrain.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DatabaseFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Running Database Schema Fixes...");
        try {
            // Alter columns to TEXT to allow longer strings
            jdbcTemplate.execute("ALTER TABLE projects ALTER COLUMN frontend_tech TYPE TEXT");
            jdbcTemplate.execute("ALTER TABLE projects ALTER COLUMN backend_tech TYPE TEXT");
            jdbcTemplate.execute("ALTER TABLE projects ALTER COLUMN database_tech TYPE TEXT");
            jdbcTemplate.execute("ALTER TABLE projects ALTER COLUMN ai_ml_tech TYPE TEXT");
            jdbcTemplate.execute("ALTER TABLE projects ALTER COLUMN tools_tech TYPE TEXT");

            System.out.println("Database schema updated successfully: Tech columns changed to TEXT.");
        } catch (Exception e) {
            // It might fail if table doesn't exist yet or other issues, just log
            System.out.println("Schema update skipped or failed (might already be correct): " + e.getMessage());
        }

        try {
            // Add progress column to tasks table if it doesn't exist
            jdbcTemplate.execute("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0");
            System.out.println("Database schema updated: Added progress column to tasks.");

            // Add design_requirements column to tasks table if it doesn't exist
            jdbcTemplate.execute("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS design_requirements TEXT");
            System.out.println("Database schema updated: Added design_requirements column to tasks.");
        } catch (Exception e) {
            System.out.println("Failed to add progress column: " + e.getMessage());
        }
    }
}
