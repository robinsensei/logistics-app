package com.Logistics.LogisticsBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Logistics.LogisticsBackend.model.Stop;

@Repository
public interface StopRepository extends JpaRepository<Stop, Long> {
    boolean existsByName(String name);
}