package com.Logistics.LogisticsBackend.security.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Logistics.LogisticsBackend.exception.ResourceNotFoundException;
import com.Logistics.LogisticsBackend.model.Route;
import com.Logistics.LogisticsBackend.model.RouteStop;
import com.Logistics.LogisticsBackend.model.Stop;
import com.Logistics.LogisticsBackend.payload.request.RouteStopRequest;
import com.Logistics.LogisticsBackend.repository.RouteRepository;
import com.Logistics.LogisticsBackend.repository.RouteStopRepository;
import com.Logistics.LogisticsBackend.repository.StopRepository;

@Service
public class RouteStopService {

    @Autowired
    private RouteStopRepository routeStopRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private StopRepository stopRepository;

    public List<RouteStop> getStopsForRoute(Long routeId) {
        if (!routeRepository.existsById(routeId)) {
            throw new ResourceNotFoundException("Route not found with id: " + routeId);
        }
        return routeStopRepository.findByRouteIdOrderByStopOrderAsc(routeId);
    }

    @Transactional(readOnly = true)
    public List<RouteStop> getAllRouteStops() {
        return routeStopRepository.findAll();
    }

    @Transactional
    public RouteStop addStopToRoute(Long routeId, RouteStopRequest request) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + routeId));
        Stop stop = stopRepository.findById(request.getStopId())
                .orElseThrow(() -> new ResourceNotFoundException("Stop not found with id: " + request.getStopId()));

        // If a stop with this order already exists, shift subsequent stops
        if (routeStopRepository.existsByRouteIdAndStopOrder(routeId, request.getStopOrder())) {
            List<RouteStop> stopsToShift = routeStopRepository.findByRouteIdAndStopOrderGreaterThanEqual(routeId, request.getStopOrder());
            for (RouteStop stopToShift : stopsToShift) {
                stopToShift.setStopOrder(stopToShift.getStopOrder() + 1);
            }
            routeStopRepository.saveAll(stopsToShift);
        }

        RouteStop routeStop = new RouteStop();
        routeStop.setRoute(route);
        routeStop.setStop(stop);
        routeStop.setStopOrder(request.getStopOrder());
        routeStop.setArrivalTime(request.getArrivalTime());
        routeStop.setDepartureTime(request.getDepartureTime());
        routeStop.setDistanceFromStartKm(request.getDistanceFromStartKm());
        routeStop.setTravelTimeFromPrevMin(request.getTravelTimeFromPrevMin());
        routeStop.setRemarks(request.getRemarks());

        return routeStopRepository.save(routeStop);
    }

    @Transactional
    public RouteStop updateStopOnRoute(Long routeStopId, RouteStopRequest request) {
        RouteStop routeStop = routeStopRepository.findById(routeStopId)
                .orElseThrow(() -> new ResourceNotFoundException("RouteStop not found with id: " + routeStopId));

        Stop stop = stopRepository.findById(request.getStopId())
                .orElseThrow(() -> new ResourceNotFoundException("Stop not found with id: " + request.getStopId()));

        routeStop.setStop(stop);

        if (request.getStopOrder() != null) {
            routeStop.setStopOrder(request.getStopOrder());
        }
        if (request.getArrivalTime() != null) {
            routeStop.setArrivalTime(request.getArrivalTime());
        }
        if (request.getDepartureTime() != null) {
            routeStop.setDepartureTime(request.getDepartureTime());
        }
        if (request.getDistanceFromStartKm() != null) {
            routeStop.setDistanceFromStartKm(request.getDistanceFromStartKm());
        }
        if (request.getTravelTimeFromPrevMin() != null) {
            routeStop.setTravelTimeFromPrevMin(request.getTravelTimeFromPrevMin());
        }
        if (request.getRemarks() != null) {
            routeStop.setRemarks(request.getRemarks());
        }

        return routeStopRepository.save(routeStop);
    }

    @Transactional
    public void removeStopFromRoute(Long routeStopId) {
        RouteStop routeStop = routeStopRepository.findById(routeStopId)
                .orElseThrow(() -> new ResourceNotFoundException("RouteStop not found with id: " + routeStopId));

        // Decrement the order of all subsequent stops on the same route
        routeStopRepository.decrementStopOrders(routeStop.getRoute().getId(), routeStop.getStopOrder());
        routeStopRepository.delete(routeStop);
    }
}