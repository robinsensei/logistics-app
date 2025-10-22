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

import com.Logistics.LogisticsBackend.model.Bus;
import com.Logistics.LogisticsBackend.payload.request.BusRegistrationRequest;
import com.Logistics.LogisticsBackend.payload.response.MessageResponse;
import com.Logistics.LogisticsBackend.security.services.BusService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/buses")
public class BusController {
    @Autowired
    private BusService busService;

    @GetMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN') or hasRole('DRIVER')")
    public ResponseEntity<?> getAllBuses() {
        List<Bus> buses = busService.getAllBuses();
        return ResponseEntity.ok(buses);
    }

        @GetMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN') or hasRole('DRIVER')")
    public ResponseEntity<?> getBusById(@PathVariable Long id) {
        return busService.getBusById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBus(@Valid @RequestBody BusRegistrationRequest request) {
        Bus savedBus = busService.registerBus(request);
        return ResponseEntity.ok(savedBus);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBus(@PathVariable Long id, @Valid @RequestBody BusRegistrationRequest request) {
        Bus updatedBus = busService.updateBus(id, request);
        return ResponseEntity.ok(updatedBus);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        return ResponseEntity.ok(new MessageResponse("Bus deleted successfully!"));
    }
}