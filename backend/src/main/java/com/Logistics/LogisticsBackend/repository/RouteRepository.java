package com.Logistics.LogisticsBackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Logistics.LogisticsBackend.model.Route;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findByName(String name);
    Optional<Route> findByRouteCode(String routeCode);
    boolean existsByName(String name);
    boolean existsByRouteCode(String routeCode);
    boolean existsByNameAndDirection(String name, String direction);
    List<Route> findByNameContainingIgnoreCase(String name);
}