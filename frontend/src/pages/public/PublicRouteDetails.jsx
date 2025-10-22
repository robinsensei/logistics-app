import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { ClockIcon, MapPinIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';

const MapFocusController = ({ positions }) => {
    const map = useMap();

    useEffect(() => {
        if (positions && positions.length > 0) {
            map.fitBounds(positions, { padding: [50, 50] });
        }
    }, [positions, map]);

    return null;
};

const PublicRouteDetails = () => {
    const { id } = useParams();
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const fetchRoute = async () => {
            try {
                const [routeRes, routeStopsRes] = await Promise.all([
                    api.get(`/routes/${id}`, { signal: controller.signal }),
                    api.get(`/api/routes/${id}/stops`, { signal: controller.signal })
                ]);

                // Combine route data with its stops
                const routeData = {
                    ...routeRes.data,
                    stops: routeStopsRes.data.sort((a, b) => a.stopOrder - b.stopOrder)
                };
                
                setRoute(routeData);
            } catch (err) {
                if (err.name !== 'CanceledError') {
                    setError('Failed to fetch route details. Please try again later.');
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();

        return () => {
            controller.abort();
        };
    }, [id]);

    const getEndpoints = () => {
        if (!route || !route.stops || route.stops.length < 2) {
            return { from: 'N/A', to: 'N/A' };
        }
        const from = route.stops[0].stop.name;
        const to = route.stops[route.stops.length - 1].stop.name;
        return { from, to };
    };

    const getStopPositions = () => {
        if (!route || !route.stops) return [];
        return route.stops
            .filter(rs => rs.stop.latitude && rs.stop.longitude)
            .map(rs => [rs.stop.latitude, rs.stop.longitude]);
    };

    const stopPositions = getStopPositions();

    if (loading) {
        return <div className="text-center py-20">Loading route details...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    if (!route) {
        return <div className="text-center py-20">Route not found.</div>;
    }

    const { from, to } = getEndpoints();

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <h1 className="text-3xl font-bold text-gray-900">🚌 Route: {route.name} ({route.direction})</h1>
                        <p className="mt-2 text-lg text-gray-600">From: <span className="font-semibold">{from}</span> → To: <span className="font-semibold">{to}</span></p>
                        <hr className="my-6" />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                            <div className="flex flex-col items-center">
                                <ClockIcon className="h-8 w-8 text-indigo-500" />
                                <span className="mt-2 text-sm text-gray-500">Operating Hours</span>
                                <span className="font-semibold text-gray-800">6:00 AM – 9:00 PM</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <ArrowsRightLeftIcon className="h-8 w-8 text-indigo-500" />
                                <span className="mt-2 text-sm text-gray-500">Distance</span>
                                <span className="font-semibold text-gray-800">18.7 km (Mock)</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <MapPinIcon className="h-8 w-8 text-indigo-500" />
                                <span className="mt-2 text-sm text-gray-500">Total Stops</span>
                                <span className="font-semibold text-gray-800">{route.stops.length}</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-gray-800">📍 Stops</h2>
                            <ul className="mt-4 space-y-3 list-decimal list-inside">
                                {route.stops.map(routeStop => (
                                    <li key={routeStop.id} className="text-gray-700">{routeStop.stop.name} – <span className="text-gray-500">{routeStop.stop.address}</span></li>
                                ))}
                            </ul>
                        </div>

                        {stopPositions.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">🗺️ Route Map</h2>
                                <div className="h-96 w-full rounded-lg overflow-hidden shadow-md">
                                    <MapContainer center={stopPositions[0]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <MapFocusController positions={stopPositions} />
                                        {route.stops.map(routeStop => (
                                            routeStop.stop.latitude && routeStop.stop.longitude &&
                                            <Marker key={routeStop.id} position={[routeStop.stop.latitude, routeStop.stop.longitude]}>
                                                <Popup>{routeStop.stop.name}</Popup>
                                            </Marker>
                                        ))}
                                        <Polyline pathOptions={{ color: 'blue' }} positions={stopPositions} />
                                    </MapContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicRouteDetails;