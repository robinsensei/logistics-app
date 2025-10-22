package com.Logistics.LogisticsBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LogisticsBackendApplication {

    public static void main(String[] args) {
        System.out.println("Starting Logistics Backend Application...");
        SpringApplication.run(LogisticsBackendApplication.class, args);
        System.out.println("Logistics Backend Application started successfully.");
    }
}
