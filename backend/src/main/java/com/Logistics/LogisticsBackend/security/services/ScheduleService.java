package com.Logistics.LogisticsBackend.security.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Logistics.LogisticsBackend.exception.DuplicateResourceException;
import com.Logistics.LogisticsBackend.exception.ResourceNotFoundException;
import com.Logistics.LogisticsBackend.model.Bus;
import com.Logistics.LogisticsBackend.model.ERole;
import com.Logistics.LogisticsBackend.model.Route;
import com.Logistics.LogisticsBackend.model.RouteStop;
import com.Logistics.LogisticsBackend.model.Schedule;
import com.Logistics.LogisticsBackend.model.User;
import com.Logistics.LogisticsBackend.payload.request.ScheduleRequest;
import com.Logistics.LogisticsBackend.repository.BusRepository;
import com.Logistics.LogisticsBackend.repository.RouteRepository;
import com.Logistics.LogisticsBackend.repository.RouteStopRepository;
import com.Logistics.LogisticsBackend.repository.ScheduleRepository;
import com.Logistics.LogisticsBackend.repository.UserRepository;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private RouteStopRepository routeStopRepository;

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    @Transactional
    public Schedule createSchedule(ScheduleRequest request) {
        // Validate request
        if (request.getDriverId() == null) {
            throw new IllegalArgumentException("Driver ID is required");
        }
        if (request.getBusId() == null) {
            throw new IllegalArgumentException("Bus ID is required");
        }
        if (request.getRouteId() == null) {
            throw new IllegalArgumentException("Route ID is required");
        }
        if (request.getDepartureDateTime() == null) {
            throw new IllegalArgumentException("Departure date time is required");
        }
        
        Schedule schedule = new Schedule();
        updateScheduleFromRequest(schedule, request);
        return scheduleRepository.save(schedule);
    }

    @Transactional
    public Schedule updateSchedule(Long id, ScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
        updateScheduleFromRequest(schedule, request);
        return scheduleRepository.save(schedule);
    }

    private void updateScheduleFromRequest(Schedule schedule, ScheduleRequest request) {
        // Find driver by ID
        User driver = userRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + request.getDriverId()));

        // Ensure the assigned user has the ROLE_DRIVER
        boolean isDriver = driver.getRoles().stream()
                .anyMatch(role -> role.getName().equals(ERole.ROLE_DRIVER));
        if (!isDriver) {
            throw new IllegalArgumentException("User with ID " + request.getDriverId() + " is not a driver.");
        }

        // Check if driver is ACTIVE
        if (driver.getStatus() != User.EmployeeStatus.ACTIVE) {
            throw new IllegalArgumentException("Driver with ID " + request.getDriverId() + " is not active. Current status: " + driver.getStatus());
        }

        // Find bus by ID and check status
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + request.getBusId()));
        
        // Check if bus is active
        if (!"ACTIVE".equalsIgnoreCase(bus.getStatus())) {
            throw new IllegalArgumentException("Bus with ID " + request.getBusId() + " is not active. Current status: " + bus.getStatus());
        }

        // Find route by ID
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new RuntimeException("Error: Route not found with ID: " + request.getRouteId()));
                
        // Check if route is already scheduled for the requested time
        if (!scheduleRepository.findByRouteIdAndDepartureDateTimeBetween(
                route.getId(), 
                request.getDepartureDateTime(), 
                request.getDepartureDateTime().plusHours(1))
            .isEmpty()) {
            throw new DuplicateResourceException("Route is already scheduled for this time period.");
        }

        schedule.setDriver(driver);
        schedule.setBus(bus);
        schedule.setRoute(route);
        schedule.setDepartureDateTime(request.getDepartureDateTime());

        LocalDateTime estimatedArrivalDateTime;

        // Calculate estimated arrival time based on route stops
        List<RouteStop> stops = routeStopRepository.findByRouteIdOrderByStopOrderAsc(route.getId());
        if (!stops.isEmpty()) {
            // Skip first stop since its travelTimeFromPrevMin is meaningless (it's the starting point)
            int totalTravelTimeMinutes = stops.stream()
                .skip(1) // Skip the first stop
                .mapToInt(routeStop -> {
                    Integer travelTime = routeStop.getTravelTimeFromPrevMin();
                    return travelTime != null ? travelTime : 30; // Default 30 mins if not specified
                })
                .sum();

            // Add buffer time for each stop (5 minutes per stop for boarding/alighting)
            int totalBufferTimeMinutes = stops.size() * 5;
            
            // Calculate estimated arrival time
            estimatedArrivalDateTime = request.getDepartureDateTime()
                .plusMinutes(totalTravelTimeMinutes + totalBufferTimeMinutes);
        } else {
            // Fallback if route has no stops
            estimatedArrivalDateTime = request.getDepartureDateTime().plusHours(1); // Default duration
        }
        schedule.setEstimatedArrivalDateTime(estimatedArrivalDateTime);

        // Check for overlapping schedules
        Long scheduleId = (schedule.getId() != null) ? schedule.getId() : -1L; // Use -1 for new schedules
        if (!scheduleRepository.findOverlappingSchedulesForDriver(driver.getId(), schedule.getDepartureDateTime(), schedule.getEstimatedArrivalDateTime(), scheduleId).isEmpty()) {
            throw new DuplicateResourceException("Driver is already scheduled for an overlapping time period.");
        }
        if (!scheduleRepository.findOverlappingSchedulesForBus(bus.getId(), schedule.getDepartureDateTime(), schedule.getEstimatedArrivalDateTime(), scheduleId).isEmpty()) {
            throw new DuplicateResourceException("Bus is already scheduled for an overlapping time period.");
        }

        if (request.getStatus() != null) {
            schedule.setStatus(request.getStatus());
        } else if (schedule.getStatus() == null) {
            schedule.setStatus("SCHEDULED");
        }
    }

    @Transactional
    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule not found with id: " + id);
        }
        scheduleRepository.deleteById(id);
    }
}