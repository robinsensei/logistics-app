package com.Logistics.LogisticsBackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Logistics.LogisticsBackend.model.RouteStop;
import com.Logistics.LogisticsBackend.security.services.RouteStopService;

@RestController
@RequestMapping("/api/routestops")
public class RouteStopAdminController {
    @Autowired
    private RouteStopService routeStopService;

    @GetMapping
    public ResponseEntity<List<RouteStop>> getAllRouteStops() {
        return ResponseEntity.ok(routeStopService.getAllRouteStops());
    }
}