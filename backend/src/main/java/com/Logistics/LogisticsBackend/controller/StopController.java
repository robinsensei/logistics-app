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

import com.Logistics.LogisticsBackend.model.Stop;
import com.Logistics.LogisticsBackend.payload.response.MessageResponse;
import com.Logistics.LogisticsBackend.security.services.StopService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/stops")
public class StopController {

    @Autowired
    private StopService stopService;

    @GetMapping
    public List<Stop> getAllStops() {
        return stopService.getAllStops();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createStop(@Valid @RequestBody Stop stop) {
        Stop newStop = stopService.createStop(stop);
        return ResponseEntity.ok(newStop);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStop(@PathVariable Long id) {
        stopService.deleteStop(id);
        return ResponseEntity.ok(new MessageResponse("Stop deleted successfully!"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStop(@PathVariable Long id, @Valid @RequestBody Stop stopDetails) {
        Stop updatedStop = stopService.updateStop(id, stopDetails);
        return ResponseEntity.ok(updatedStop);
    }
}