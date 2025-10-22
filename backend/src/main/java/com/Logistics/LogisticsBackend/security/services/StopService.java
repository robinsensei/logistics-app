package com.Logistics.LogisticsBackend.security.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Logistics.LogisticsBackend.exception.DuplicateResourceException;
import com.Logistics.LogisticsBackend.exception.ResourceNotFoundException;
import com.Logistics.LogisticsBackend.model.Stop;
import com.Logistics.LogisticsBackend.repository.StopRepository;

@Service
public class StopService {

    @Autowired
    private StopRepository stopRepository;

    public List<Stop> getAllStops() {
        return stopRepository.findAll();
    }

    @Transactional
    public Stop createStop(Stop stop) {
        if (stopRepository.existsByName(stop.getName())) {
            throw new DuplicateResourceException("Error: Stop name is already taken!");
        }
        return stopRepository.save(stop);
    }

    @Transactional
    public void deleteStop(Long id) {
        if (!stopRepository.existsById(id)) {
            throw new ResourceNotFoundException("Stop not found with id: " + id);
        }
        stopRepository.deleteById(id);
    }

    @Transactional
    public Stop updateStop(Long id, Stop stopDetails) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stop not found with id: " + id));

        // Check for name uniqueness if it's being changed
        if (!stop.getName().equals(stopDetails.getName()) && stopRepository.existsByName(stopDetails.getName())) {
            throw new DuplicateResourceException("Stop name is already in use!");
        }

        stop.setName(stopDetails.getName());
        stop.setAddress(stopDetails.getAddress());
        stop.setDescription(stopDetails.getDescription());
        stop.setType(stopDetails.getType());
        stop.setLandmark(stopDetails.getLandmark());
        stop.setStreet(stopDetails.getStreet());
        stop.setLatitude(stopDetails.getLatitude());
        stop.setLongitude(stopDetails.getLongitude());
        return stopRepository.save(stop);
    }
}