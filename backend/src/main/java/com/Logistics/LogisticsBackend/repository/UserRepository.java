package com.Logistics.LogisticsBackend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Logistics.LogisticsBackend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmployeeId(String employeeId);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    Boolean existsByEmployeeId(String employeeId);
}