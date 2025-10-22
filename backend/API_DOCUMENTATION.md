# Logistics Backend API Documentation

This document provides an overview of the API endpoints and data models for the Logistics Backend application.

## Authentication

### `POST /api/auth/signin`
- **Description**: Authenticates a user and returns a JWT token.
- **Request Body**: `LoginRequest`
- **Response**: `JwtResponse`

### `POST /api/auth/signup`
- **Description**: Registers a new user (employee).
- **Request Body**: `SignupRequest`
- **Response**: `MessageResponse`

---

## Employees

### `GET /api/employees`
- **Description**: Retrieves a list of all employees.
- **Authorization**: `ADMIN`
- **Response**: `List<User>`

### `GET /api/employees/{id}`
- **Description**: Retrieves a specific employee by their ID.
- **Authorization**: `ADMIN`, `EMPLOYEE` (own record)
- **Response**: `User`

### `PUT /api/employees/{id}`
- **Description**: Updates an employee's details.
- **Authorization**: `ADMIN`, or the employee themselves.
- **Request Body**: `User`
- **Response**: `User`

### `DELETE /api/employees/{id}`
- **Description**: Deletes an employee.
- **Authorization**: `ADMIN`
- **Response**: `MessageResponse`

---

## Buses

### `GET /api/buses`
- **Description**: Retrieves a list of all buses.
- **Authorization**: `EMPLOYEE`, `ADMIN`, `DRIVER`
- **Response**: `List<Bus>`

### `GET /api/buses/{id}`
- **Description**: Retrieves a specific bus by its ID.
- **Authorization**: `EMPLOYEE`, `ADMIN`, `DRIVER`
- **Response**: `Bus`

### `POST /api/buses`
- **Description**: Creates a new bus.
- **Authorization**: `ADMIN`
- **Request Body**: `BusRegistrationRequest`
- **Response**: `Bus`

### `PUT /api/buses/{id}`
- **Description**: Updates a bus's details.
- **Authorization**: `ADMIN`
- **Request Body**: `BusRegistrationRequest`
- **Response**: `Bus`

### `DELETE /api/buses/{id}`
- **Description**: Deletes a bus.
- **Authorization**: `ADMIN`
- **Response**: `MessageResponse`

---

## Routes

### `GET /api/routes`
- **Description**: Retrieves a list of all routes.
- **Authorization**: `EMPLOYEE`, `ADMIN`, `DRIVER`
- **Response**: `List<Route>`

### `GET /api/routes/{id}`
- **Description**: Retrieves a route by its ID.
- **Authorization**: `EMPLOYEE`, `ADMIN`, `DRIVER`
- **Response**: `Route`

### `POST /api/routes`
- **Description**: Creates a new route.
- **Authorization**: `ADMIN`
- **Request Body**: `RouteRequest`
- **Response**: `Route`

### `PUT /api/routes/{id}`
- **Description**: Updates a route.
- **Authorization**: `ADMIN`
- **Request Body**: `RouteRequest`
- **Response**: `Route`

### `DELETE /api/routes/{id}`
- **Description**: Deletes a route.
- **Authorization**: `ADMIN`
- **Response**: `MessageResponse`

---

## Stops

### `GET /api/stops`
- **Description**: Retrieves a list of all stops.
- **Authorization**: `EMPLOYEE`, `ADMIN`, `DRIVER`
- **Response**: `List<Stop>`

### `POST /api/stops`
- **Description**: Creates a new stop.
- **Authorization**: `ADMIN`
- **Request Body**: `Stop`
- **Response**: `Stop`

### `DELETE /api/stops/{id}`
- **Description**: Deletes a stop.
- **Authorization**: `ADMIN`
- **Response**: `MessageResponse`

---

## Data Models

### User
Represents an employee in the system.
```
- id: Long
- username: String
- email: String
- password: String (Hashed)
- roles: Set<Role>
- firstName: String
- lastName: String
- phone: String
- address: String
- dateOfBirth: Date
- joiningDate: Date
- emergencyContact: String
- status: EmployeeStatus (Enum: ACTIVE, INACTIVE, ON_LEAVE, TERMINATED)
```

### Role
Represents a user role.
```
- id: Integer
- name: ERole (Enum: ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_DRIVER)
```

### Bus
Represents a bus in the fleet.
```
- id: Long
- busNumber: String (unique)
- plateNumber: String (unique)
- seatingCapacity: Integer
- type: String
- model: String
- manufacturer: String
- yearManufactured: Integer
- status: String (e.g., "Active", "Maintenance", "Retired")
- createdAt: LocalDateTime
- updatedAt: LocalDateTime
- routes: List<Route>
```

### Route
Represents a bus route.
```
- id: Long
- routeNumber: String (unique)
- stops: List<RouteStop>
- assignedBus: Bus
- departureTime: LocalTime
- estimatedArrivalTime: LocalTime
- status: String (e.g., "ACTIVE", "SUSPENDED", "CANCELLED")
- distanceInKm: Integer
- description: String
- createdAt: LocalDateTime
- updatedAt: LocalDateTime
```

### Stop
Represents a physical stop location.
```
- id: Long
- name: String (unique)
- address: String
- description: String
- type: String (e.g., "TERMINAL", "REST_STOP")
- landmark: String
- street: String
- isActive: Boolean
```

### RouteStop
A join table entity representing a stop within a specific route, including its order and estimated time.
```
- id: Long
- route: Route
- stopName: String
- stopOrder: Integer
- estimatedTime: LocalTime
- description: String
- isOrigin: Boolean
- isDestination: Boolean
```