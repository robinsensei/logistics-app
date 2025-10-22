-- RouteStops Table Schema
CREATE TABLE IF NOT EXISTS route_stops (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    route_id BIGINT NOT NULL,
    stop_id BIGINT NOT NULL,
    stop_order INT NOT NULL,
    arrival_time TIME,
    departure_time TIME,
    distance_from_start_km DECIMAL(10,2),
    travel_time_from_prev_min INT,
    remarks VARCHAR(255),
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE,
    UNIQUE (route_id, stop_order),
    UNIQUE (route_id, stop_id)
);

-- Index for better query performance
CREATE INDEX idx_route_stops_route_order ON route_stops(route_id, stop_order);

-- Helper view for route stop details
CREATE OR REPLACE VIEW route_stop_details AS
SELECT 
    rs.id,
    rs.route_id,
    rs.stop_id,
    rs.stop_order,
    rs.arrival_time,
    rs.departure_time,
    rs.distance_from_start_km,
    rs.travel_time_from_prev_min,
    rs.remarks
FROM route_stops rs
ORDER BY rs.route_id, rs.stop_order;