import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';


const ByRouteView = ({ schedules, routes }) => {
    // The `schedules` prop is now the paginated and pre-grouped data.
    const getRouteEndpoints = (route) => {
        if (!route.stops || route.stops.length === 0) return 'N/A → N/A';
        const origin = route.stops.find(rs => rs.stopOrder === 1);
        const destination = route.stops.reduce((latest, stop) => (!latest || stop.stopOrder > latest.stopOrder) ? stop : latest, null);
        return `${origin ? origin.stop.name : 'N/A'} → ${destination ? destination.stop.name : 'N/A'}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schedules.map(({ routeInfo, schedules: routeSchedules }) => (
                <div key={routeInfo.id} className="group bg-blue-900 text-gray-100 p-6 rounded-lg shadow-md hover:bg-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col">
                    <Link to={`/routes/${routeInfo.id}`}>
                        <h3 className="text-xl font-bold text-yellow-400 group-hover:text-blue-900 mb-1 hover:underline">
                            {routeInfo.name} ({routeInfo.direction})
                        </h3>
                    </Link>
                    <p className="text-sm text-gray-300 group-hover:text-blue-500 mb-4">{getRouteEndpoints(routeInfo)}</p>
                    <hr className="mb-4 border-blue-700 group-hover:border-gray-200" />
                    <div className="overflow-y-auto flex-grow">
                        <div className="flex justify-between text-xs font-semibold text-gray-400 group-hover:text-gray-700 uppercase mb-2 px-1">
                            <span>Departure</span>
                            <span>Est. Arrival</span>
                        </div>
                        <ul className="space-y-2">
                            {routeSchedules.length > 0 ? (
                                routeSchedules
                                    .sort((a, b) => new Date(a.departureDateTime) - new Date(b.departureDateTime))
                                    .map(schedule => (
                                    <li key={schedule.id} className="flex items-center justify-between text-sm">
                                        <span className="font-mono bg-blue-800 group-hover:bg-gray-100 px-2 py-1 rounded-md text-yellow-300 group-hover:text-black">
                                            {new Date(schedule.departureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="text-gray-400 group-hover:text-gray-500 mx-2">→</span>
                                        <span className="font-mono bg-blue-800 group-hover:bg-gray-100 px-2 py-1 rounded-md text-yellow-300 group-hover:text-black">
                                            {schedule.estimatedArrivalDateTime ? new Date(schedule.estimatedArrivalDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                        </span>
                                    </li>
                                ))) : (<p className="text-sm text-gray-400 group-hover:text-gray-600">No scheduled departures for this route.</p>)
                            }
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ByStopView = ({ schedules, stops, paginatedStops }) => {
    const nextBusesByStop = useMemo(() => {
        const result = {};
        const now = new Date();

        schedules.forEach(schedule => {
            if (new Date(schedule.departureDateTime) < now) return; // Skip past schedules

            schedule.route.stops.forEach(routeStop => {
                const stopId = routeStop.stop.id;
                if (!result[stopId]) {
                    result[stopId] = [];
                }
                const arrivalTime = new Date(schedule.departureDateTime);
                // This is a simplified calculation. A real implementation would be more complex.
                arrivalTime.setMinutes(arrivalTime.getMinutes() + (routeStop.travelTimeFromPrevMin || 0));

                result[stopId].push({
                    routeName: `${schedule.route.name} (${schedule.route.direction})`,
                    arrivalTime: arrivalTime,
                });
            });
        });

        // Sort buses for each stop
        for (const stopId in result) {
            result[stopId].sort((a, b) => a.arrivalTime - b.arrivalTime);
        }

        return result;
    }, [schedules]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedStops.map((stop) => (
                <div key={stop.id} className="group bg-blue-900 text-gray-100 p-6 rounded-lg shadow-md hover:bg-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
                    <h3 className="text-xl font-bold text-yellow-400 group-hover:text-blue-900 mb-1">Stop: {stop.name}</h3>
                    <hr className="mb-4 border-blue-700 group-hover:border-gray-200" />
                    <h4 className="font-semibold text-gray-300 group-hover:text-gray-700 mb-2">Next Buses:</h4>
                    {nextBusesByStop[stop.id] && nextBusesByStop[stop.id].length > 0 ? (
                        <ul className="space-y-2">
                            {nextBusesByStop[stop.id].slice(0, 5).map((bus, index) => ( // Show next 5
                                <li key={index} className="text-gray-200 group-hover:text-black">
                                    → {bus.routeName} <span className="text-gray-400 group-hover:text-blue-500">({bus.arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 group-hover:text-gray-600">No upcoming buses for this stop.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default function PublicSchedule() {
    const [view, setView] = useState('route'); // 'route' or 'stop'
    const [schedules, setSchedules] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [stops, setStops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all necessary data in parallel
                const [schedulesRes, routesRes, stopsRes] = await Promise.all([
                    api.get('/schedules'),
                    api.get('/routes'),
                    api.get('/stops')
                ]);

                // Fetch stops for each route that was returned
                const routeStopsPromises = routesRes.data.map(route =>
                    api.get(`/routes/${route.id}/stops`)
                );
                const routeStopsResponses = await Promise.all(routeStopsPromises);

                // Create a map of routeId -> stops array
                const routeStopsMap = routesRes.data.reduce((acc, route, index) => {
                    acc[route.id] = routeStopsResponses[index].data;
                    return acc;
                }, {});

                // Enrich the route object within each schedule with the stops data
                const schedulesWithFullRouteData = schedulesRes.data.map(schedule => ({
                    ...schedule,
                    route: {
                        ...schedule.route,
                        stops: (routeStopsMap[schedule.route.id] || []).sort((a, b) => a.stopOrder - b.stopOrder)
                    }
                }));

                setSchedules(schedulesWithFullRouteData);
                setRoutes(routesRes.data); // The routes state is still useful for the ByStopView
                setStops(stopsRes.data);
            } catch (error) {
                console.error("Failed to fetch public schedule data", error.response?.data || error);
                setError("Failed to load schedule data. It seems some resources might be protected. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Memoize data for pagination
    const paginatedData = useMemo(() => {
        const items = view === 'route'
            ? Object.values(schedules.reduce((acc, schedule) => {
                const routeId = schedule.route.id;
                if (!acc[routeId]) {
                    acc[routeId] = { routeInfo: schedule.route, schedules: [] };
                }
                acc[routeId].schedules.push(schedule);
                return acc;
            }, {}))
            : stops;

        const totalItems = items.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentItems = items.slice(startIndex, endIndex);

        // If current page becomes invalid after changing itemsPerPage, reset to page 1
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }

        return { currentItems, totalPages };
    }, [view, schedules, stops, currentPage, itemsPerPage]);

    const { currentItems, totalPages } = paginatedData;


    return (
        <div id="schedule" className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-center text-blue-900  mb-8">Public Schedules</h1>
                <div className="flex justify-center mb-8 border-b">
                    <button onClick={() => setView('route')} className={`px-6 py-2 font-medium transition-all duration-200 hover:bg-blue-900 hover:text-yellow-400 ${view === 'route' ? 'border-b-2 border-blue-900 text-blue-900 text-xl' : 'text-gray-500 text-lg'}`}>By Route</button>
                    <button onClick={() => setView('stop')} className={`px-6 py-2 font-medium transition-all duration-200 hover:bg-blue-900 hover:text-yellow-400 ${view === 'stop' ? 'border-b-2 border-blue-900 text-blue-900 text-xl' : 'text-gray-500 text-lg'}`}>By Stop</button>
                </div>
                
                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center my-6 gap-4">
                    <div>
                        <label htmlFor="items-per-page" className="text-sm font-medium text-gray-700 mr-2">Show:</label>
                        <select
                            id="items-per-page"
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1); // Reset to first page on change
                            }}
                            className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value={4}>4</option>
                            <option value={8}>8</option>
                            <option value={12}>12</option>
                            <option value={16}>16</option>
                        </select>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center space-x-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${currentPage === page ? 'bg-blue-900 text-yellow-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading schedules...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    view === 'route' ? <ByRouteView schedules={currentItems} /> : <ByStopView paginatedStops={currentItems} schedules={schedules} />
                )}
            </div>
        </div>
    );
}
