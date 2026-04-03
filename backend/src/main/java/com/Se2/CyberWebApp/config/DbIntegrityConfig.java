package com.Se2.CyberWebApp.config;

import com.Se2.CyberWebApp.repository.UserRepository;
import com.Se2.CyberWebApp.repository.RoleRepository;
import com.Se2.CyberWebApp.entity.Role;
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

            // 1. Ensure Roles exist
            ensureRole(1, "SUPER ADMIN");
            ensureRole(2, "ADMIN");
            ensureRole(12, "MENTEE");
            ensureRole(13, "MENTOR");

            // 2. Fix Users with invalid roles
            userRepository.findAll().forEach(user -> {
                if (user.getRoleEntity() == null) {
                    roleRepository.findByName("MENTEE").ifPresent(role -> {
                        System.out.println("[BOOTSTRAP] Fixing user " + user.getUsername()
                                + ": Role was null or invalid. Assigning MENTEE.");
                        user.setRoleEntity(role);
                        userRepository.save(user);
                    });
                }
            });
            System.out.println("[BOOTSTRAP] Integrity check complete.");
        };
    }

    private void ensureRole(Integer id, String name) {
        if (!roleRepository.existsById(id)) {
            Role role = new Role();
            role.setId(id);
            role.setName(name);
            roleRepository.save(role);
            System.out.println("[BOOTSTRAP] Created missing role: " + name + " (ID: " + id + ")");
        }
    }
}
