package com.Logistics.LogisticsBackend.security.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import com.Logistics.LogisticsBackend.exception.DuplicateResourceException;
import com.Logistics.LogisticsBackend.exception.ResourceNotFoundException;
import com.Logistics.LogisticsBackend.model.Route;
import com.Logistics.LogisticsBackend.payload.request.RouteRequest;
import com.Logistics.LogisticsBackend.repository.RouteRepository;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    @Transactional
    public Route createRoute(RouteRequest request) {
        // Validate unique constraints
        if (routeRepository.existsByNameAndDirection(request.getName(), request.getDirection())) {
            throw new DuplicateResourceException("A route with the same name and direction already exists!");
        }
        if (routeRepository.existsByRouteCode(request.getRouteCode())) {
            throw new DuplicateResourceException("Route code already exists!");
        }

        Route route = new Route();
        updateRouteFromRequest(route, request);

        return routeRepository.save(route);
    }

    @Transactional
    public Route updateRoute(Long id, RouteRequest request) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));

        // Check if the new name and direction combination is already used by another route
        if ((!route.getName().equals(request.getName()) || !route.getDirection().equals(request.getDirection())) &&
            routeRepository.existsByNameAndDirection(request.getName(), request.getDirection())) {
            throw new DuplicateResourceException("A route with the same name and direction already exists!");
        }
        if (!route.getRouteCode().equals(request.getRouteCode()) &&
            routeRepository.existsByRouteCode(request.getRouteCode())) {
            throw new DuplicateResourceException("Route code already exists!");
        }

        updateRouteFromRequest(route, request);
        return routeRepository.save(route);
    }

    private void updateRouteFromRequest(Route route, RouteRequest request) {
        route.setRouteCode(request.getRouteCode());
        route.setName(request.getName());
        route.setDescription(request.getDescription());
        route.setDirection(request.getDirection());
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Optional<Route> getRouteById(Long id) {
        return routeRepository.findById(id);
    }

    public Optional<Route> getRouteByName(String name) {
        return routeRepository.findByName(name);
    }

    public List<Route> searchRoutes(String name) {
        if (name == null || name.trim().isEmpty()) {
            return routeRepository.findAll();
        }
        return routeRepository.findByNameContainingIgnoreCase(name);
    }

    @Transactional
    public void deleteRoute(Long id) {
        if (!routeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Route not found with id: " + id);
        }
        routeRepository.deleteById(id);
    }
}