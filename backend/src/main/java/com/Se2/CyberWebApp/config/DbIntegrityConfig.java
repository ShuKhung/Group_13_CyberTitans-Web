package com.Se2.CyberWebApp.config;

import com.Se2.CyberWebApp.repository.UserRepository;
import com.Se2.CyberWebApp.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DbIntegrityConfig {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Bean
    public CommandLineRunner fixIntegrity() {
        return args -> {
            System.out.println("[BOOTSTRAP] Checking database integrity...");
            userRepository.findAll().forEach(user -> {
                if (user.getRoleEntity() == null) {
                    // This user has an invalid role ID or null role
                    // We can assign them to a default role (e.g., MENTEE)
                    roleRepository.findByName("MENTEE").ifPresent(role -> {
                        System.out.println("[BOOTSTRAP] Fixing user " + user.getUsername() + ": Role was null or invalid. Assigning MENTEE.");
                        user.setRoleEntity(role);
                        userRepository.save(user);
                    });
                }
            });
            System.out.println("[BOOTSTRAP] Integrity check complete.");
        };
    }
}
