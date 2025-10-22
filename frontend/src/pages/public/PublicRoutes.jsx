import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';

const MapFocusController = ({ selectedRouteId, routes }) => {
    const map = useMap();

    useEffect(() => {
        // Focus on a specific route
        if (selectedRouteId) {
            const route = routes.find(r => r.id === parseInt(selectedRouteId));
            if (route) {
                const positions = (route.stops || [])
                    .filter(rs => rs.stop.latitude && rs.stop.longitude)
                    .map(rs => [rs.stop.latitude, rs.stop.longitude]);

                if (positions.length > 0) {
                    map.flyToBounds(positions, { padding: [50, 50] });
                }
            }
        // Default: Fit all routes
        } else if (routes.length > 0) {
            const allPositions = routes.flatMap(r =>
                (r.stops || [])
                    .filter(rs => rs.stop.latitude && rs.stop.longitude)
                    .map(rs => [rs.stop.latitude, rs.stop.longitude])
            );
            if (allPositions.length > 0) {
                map.fitBounds(allPositions, { padding: [50, 50] });
            }
        }
    }, [selectedRouteId, routes, map]);

    return null;
};

export default function PublicRoutes() {
    const [routes, setRoutes] = useState([]);
    const [selectedRouteId, setSelectedRouteId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const routeColors = ['blue', 'red', 'green', 'purple', 'orange', 'black'];

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                // First fetch routes
                const routesRes = await api.get('/routes', { signal: controller.signal });
                const routes = routesRes.data;

                // Then fetch stops for each route
                const routeStopsPromises = routes.map(route => 
                    api.get(`/routes/${route.id}/stops`, { signal: controller.signal })
                );

                const routeStopsResponses = await Promise.all(routeStopsPromises);

                // Create a map of route IDs to their stops
                const routeStopsMap = routes.reduce((acc, route, index) => {
                    acc[route.id] = routeStopsResponses[index].data;
                    return acc;
                }, {});

                // Combine routes with their stops
                const routesWithStops = routesRes.data.map(route => ({
                    ...route,
                    stops: (routeStopsMap[route.id] || []).sort((a, b) => a.stopOrder - b.stopOrder)
                }));

                setRoutes(routesWithStops);
            } catch (err) {
                if (err.name !== 'CanceledError') {
                    setError('Failed to load map data. Please try again later.');
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        return () => {
            controller.abort();
        };
    }, []);

    const allPositions = useMemo(() => 
        routes.flatMap(r => 
            (r.stops || [])
                .filter(rs => rs.stop.latitude && rs.stop.longitude)
                .map(rs => [rs.stop.latitude, rs.stop.longitude])
        ), [routes]);

    const routesWithStops = useMemo(() => {
        return routes.filter(route => 
            (route.stops || []).some(rs => rs.stop && rs.stop.latitude && rs.stop.longitude)
        );
    }, [routes]);

    const selectedRoute = useMemo(() => {
        if (!selectedRouteId) return null;
        return routes.find(r => r.id === parseInt(selectedRouteId));
    }, [selectedRouteId, routes]);

    return (
        <div id="routes" className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Available Routes</h1>

                {!loading && !error && routes.length > 0 && (
                    <div className="mb-6">
                        <div>
                            <label htmlFor="route-select" className="block text-sm font-medium text-gray-700 mb-2">
                                Focus on a specific route:
                            </label>
                            <select
                                id="route-select"
                                value={selectedRouteId}
                                onChange={(e) => setSelectedRouteId(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">Show All Routes</option>
                                {routesWithStops.length > 0 ? (
                                    routesWithStops.map(route => (
                                        <option key={route.id} value={route.id}>{route.name} ({route.direction})</option>
                                    ))
                                ) : (
                                    <option disabled>No routes with location data found</option>
                                )}
                            </select>
                        </div>
                    </div>
                )}

                {loading && <p className="text-center text-gray-500">Loading routes...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && allPositions.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No routes with location data are available to display on the map.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Map Container */}
                    <div className="lg:col-span-2 h-[70vh] w-full rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out hover:shadow-2xl">
                        {!loading && !error && allPositions.length > 0 ? (
                            <MapContainer center={[14.6, 121]} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {routes
                                    .filter(route => !selectedRouteId || route.id === parseInt(selectedRouteId))
                                    .map((route, index) => {
                                        const positions = (route.stops || [])
                                            .filter(rs => rs.stop.latitude && rs.stop.longitude)
                                            .sort((a, b) => a.stopOrder - b.stopOrder)
                                            .map(rs => [rs.stop.latitude, rs.stop.longitude]);

                                        if (positions.length === 0) return null;

                                        return (
                                            <React.Fragment key={route.id}>
                                                <Polyline 
                                                    pathOptions={{ 
                                                        color: routeColors[index % routeColors.length],
                                                        weight: selectedRouteId ? 5 : 3 // Make selected route line thicker
                                                    }} 
                                                    positions={positions}
                                                >
                                                    <Popup><b>{route.name}</b> ({route.direction})</Popup>
                                                </Polyline>
                                                {(route.stops || [])
                                                    .sort((a, b) => a.stopOrder - b.stopOrder)
                                                    .map(rs => (
                                                        rs.stop.latitude && rs.stop.longitude &&
                                                        <Marker 
                                                            key={`route-${route.id}-stop-${rs.stop.id}-order-${rs.stopOrder}`} 
                                                            position={[rs.stop.latitude, rs.stop.longitude]}
                                                        >
                                                            <Popup>
                                                                <div className="font-semibold">{rs.stop.name}</div>
                                                                <div className="text-sm text-gray-600">
                                                                    Route: {route.name}<br />
                                                                    Direction: {route.direction}<br />
                                                                    Stop Order: {rs.stopOrder}
                                                                </div>
                                                            </Popup>
                                                        </Marker>
                                                    ))
                                                }
                                            </React.Fragment>
                                        );
                                })}
                                <MapFocusController selectedRouteId={selectedRouteId} routes={routes} />
                            </MapContainer>
                        ) : null}
                    </div>

                    {/* Stops List Card */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg h-[70vh] flex flex-col transform hover:-translate-y-1 transition-all duration-300 ease-in-out hover:shadow-xl">
                        <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-2">
                            {selectedRoute ? `${selectedRoute.name} Stops` : 'Route Stops'}
                        </h2>
                        <div className="overflow-y-auto flex-grow">
                            {selectedRoute ? (
                                <ul className="space-y-3">
                                    {(selectedRoute.stops || []).map(rs => (
                                        <li key={rs.id} className="flex items-center text-gray-700">
                                            <span className="flex-shrink-0 h-6 w-6 text-sm bg-blue-900 text-yellow-400 rounded-full flex items-center justify-center font-bold mr-3">{rs.stopOrder}</span>
                                            <span>{rs.stop.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-center mt-4">Select a route from the dropdown to view its stops.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
