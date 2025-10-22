package com.Logistics.LogisticsBackend.security.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Logistics.LogisticsBackend.exception.DuplicateResourceException;
import com.Logistics.LogisticsBackend.exception.ResourceNotFoundException;
import com.Logistics.LogisticsBackend.model.Bus;
import com.Logistics.LogisticsBackend.payload.request.BusRegistrationRequest;
import com.Logistics.LogisticsBackend.repository.BusRepository;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    @Transactional
    public Bus registerBus(BusRegistrationRequest request) {
        // Validate unique constraints
        validateUniqueBus(request.getBusNumber(), request.getPlateNumber());
        
        Bus bus = new Bus();
        updateBusFromRequest(bus, request);

        return busRepository.save(bus);
    }

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public Optional<Bus> getBusById(Long id) {
        return busRepository.findById(id);
    }

    @Transactional
    public Bus updateBus(Long id, BusRegistrationRequest request) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + id));

        validateUniqueBusUpdate(request, bus);
        updateBusFromRequest(bus, request);

        return busRepository.save(bus);
    }

    private void updateBusFromRequest(Bus bus, BusRegistrationRequest request) {
        bus.setBusNumber(request.getBusNumber());
        bus.setPlateNumber(request.getPlateNumber());
        bus.setSeatingCapacity(request.getSeatingCapacity());
        bus.setType(request.getBusType());
        bus.setModel(request.getModel());
        bus.setManufacturer(request.getManufacturer());
        bus.setYearManufactured(request.getYearManufactured());
        bus.setStatus(request.getStatus() != null ? request.getStatus() : "Active");
    }

    private void validateUniqueBus(String busNumber, String plateNumber) {
        if (busRepository.existsByBusNumber(busNumber)) {
            throw new DuplicateResourceException("Bus number is already in use!");
        }
        if (busRepository.existsByPlateNumber(plateNumber)) {
            throw new DuplicateResourceException("Plate number is already in use!");
        }
    }

    private void validateUniqueBusUpdate(BusRegistrationRequest request, Bus existingBus) {
        if (!existingBus.getBusNumber().equals(request.getBusNumber()) && busRepository.existsByBusNumber(request.getBusNumber())) {
            throw new DuplicateResourceException("Bus number is already in use!");
        }
        if (!existingBus.getPlateNumber().equals(request.getPlateNumber()) && busRepository.existsByPlateNumber(request.getPlateNumber())) {
            throw new DuplicateResourceException("Plate number is already in use!");
        }
    }

    @Transactional
    public void deleteBus(Long id) {
        if (!busRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bus not found with id: " + id);
        }
        busRepository.deleteById(id);
    }
}