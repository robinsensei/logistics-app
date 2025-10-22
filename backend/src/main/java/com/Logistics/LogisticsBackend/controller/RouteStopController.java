package com.Logistics.LogisticsBackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Logistics.LogisticsBackend.model.RouteStop;
import com.Logistics.LogisticsBackend.payload.request.RouteStopRequest;
import com.Logistics.LogisticsBackend.payload.response.MessageResponse;
import com.Logistics.LogisticsBackend.security.services.RouteStopService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/routes/{routeId}/stops")
public class RouteStopController {

    @Autowired
    private RouteStopService routeStopService;

    @GetMapping
    public ResponseEntity<List<RouteStop>> getStopsForRoute(@PathVariable Long routeId) {
        List<RouteStop> stops = routeStopService.getStopsForRoute(routeId);
        return ResponseEntity.ok(stops);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addStopToRoute(@PathVariable Long routeId, @Valid @RequestBody RouteStopRequest request) {
        RouteStop newRouteStop = routeStopService.addStopToRoute(routeId, request);
        return ResponseEntity.ok(newRouteStop);
    }

    @PutMapping("/{routeStopId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStopOnRoute(
            @PathVariable Long routeId, // Not strictly needed by service, but good for URL consistency
            @PathVariable Long routeStopId,
            @Valid @RequestBody RouteStopRequest request) {
        RouteStop updatedRouteStop = routeStopService.updateStopOnRoute(routeStopId, request);
        return ResponseEntity.ok(updatedRouteStop);
    }

    @DeleteMapping("/{routeStopId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> removeStopFromRoute(
            @PathVariable Long routeId, // Not strictly needed by service
            @PathVariable Long routeStopId) {
        routeStopService.removeStopFromRoute(routeStopId);
        return ResponseEntity.ok(new MessageResponse("Route stop removed successfully!"));
    }
}