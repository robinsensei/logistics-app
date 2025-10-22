package com.Logistics.LogisticsBackend.payload.request;

import java.math.BigDecimal;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;

public class RouteStopRequest {

    @NotNull
    private Long stopId;

    @NotNull
    private Integer stopOrder;

    private LocalTime arrivalTime;

    private LocalTime departureTime;

    private BigDecimal distanceFromStartKm;

    private Integer travelTimeFromPrevMin;

    private String remarks;

    public Long getStopId() {
        return stopId;
    }

    public void setStopId(Long stopId) {
        this.stopId = stopId;
    }

    public Integer getStopOrder() {
        return stopOrder;
    }

    public void setStopOrder(Integer stopOrder) {
        this.stopOrder = stopOrder;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public BigDecimal getDistanceFromStartKm() {
        return distanceFromStartKm;
    }

    public void setDistanceFromStartKm(BigDecimal distanceFromStartKm) {
        this.distanceFromStartKm = distanceFromStartKm;
    }

    public Integer getTravelTimeFromPrevMin() {
        return travelTimeFromPrevMin;
    }

    public void setTravelTimeFromPrevMin(Integer travelTimeFromPrevMin) {
        this.travelTimeFromPrevMin = travelTimeFromPrevMin;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}