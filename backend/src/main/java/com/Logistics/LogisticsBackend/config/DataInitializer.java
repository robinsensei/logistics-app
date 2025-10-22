package com.Logistics.LogisticsBackend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.Logistics.LogisticsBackend.model.ERole;
import com.Logistics.LogisticsBackend.model.Role;
import com.Logistics.LogisticsBackend.repository.RoleRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed roles if not present
        for (ERole e : ERole.values()) {
            roleRepository.findByName(e).orElseGet(() -> roleRepository.save(new Role(e)));
        }
    }
}
