package com.Logistics.LogisticsBackend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Logistics.LogisticsBackend.model.ERole;
import com.Logistics.LogisticsBackend.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}