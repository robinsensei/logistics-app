package com.Logistics.LogisticsBackend.payload.request;

import jakarta.validation.constraints.NotBlank;

public class RouteRequest {
    @NotBlank
    private String routeCode;

    @NotBlank
    private String name;

    private String description;

    private String direction;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRouteCode() {
        return routeCode;
    }

    public void setRouteCode(String routeCode) {
        this.routeCode = routeCode;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }
}