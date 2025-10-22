package com.Logistics.LogisticsBackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.Logistics.LogisticsBackend.model.RouteStop;

@Repository
public interface RouteStopRepository extends JpaRepository<RouteStop, Long> {
    List<RouteStop> findByRouteIdOrderByStopOrderAsc(Long routeId);
    List<RouteStop> findByRouteId(Long routeId);

    @Query("SELECT rs FROM RouteStop rs WHERE rs.route.id = :routeId AND rs.stopOrder >= :stopOrder")
    List<RouteStop> findByRouteIdAndStopOrderGreaterThanEqual(Long routeId, Integer stopOrder);

    @Modifying
    @Query("UPDATE RouteStop rs SET rs.stopOrder = rs.stopOrder - 1 WHERE rs.route.id = :routeId AND rs.stopOrder > :stopOrder")
    void decrementStopOrders(Long routeId, Integer stopOrder);
    boolean existsByRouteIdAndStopOrder(Long routeId, Integer stopOrder);
}