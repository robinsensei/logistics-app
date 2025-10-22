import { useState, useEffect } from 'react';
import api from '../../services/api';
import RouteStopForm from '../../components/dashboard/RouteStopForm';
import ReorderModal from '../../components/dashboard/ReorderModal';
import Modal from '../../components/dashboard/Modal';
import Button from '../../components/Button';
import EditButton from '../../components/buttons/EditButton';
import DeleteButton from '../../components/buttons/DeleteButton';

export default function ServiceRoute() {
    const [routes, setRoutes] = useState([]);
    const [availableStops, setAvailableStops] = useState([]);
    const [selectedRouteId, setSelectedRouteId] = useState('');
    const [routeStops, setRouteStops] = useState([]);
    const [loadingRoutes, setLoadingRoutes] = useState(true);
    const [loadingStops, setLoadingStops] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingRouteStop, setEditingRouteStop] = useState(null);

    // Drag and drop state
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [reorderChange, setReorderChange] = useState(null);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    // Fetch all routes for the dropdown on component mount
    useEffect(() => {
        const fetchRoutes = async () => {
            setLoadingRoutes(true);
            try {
                const response = await api.get('/routes');
                setRoutes(response.data);
                // If there's only one route, automatically select it.
                if (response.data.length === 1) {
                    setSelectedRouteId(response.data[0].id);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching routes:', err);
                setError('Failed to load routes. Please try again.');
            } finally {
                setLoadingRoutes(false);
            }
        };
        fetchRoutes();

        const fetchAvailableStops = async () => {
            try {
                const response = await api.get('/stops');
                setAvailableStops(response.data);
            } catch (err) {
                console.error('Error fetching available stops:', err);
            }
        };
        fetchAvailableStops();
    }, []);

    // Fetch stops for the selected route
    const fetchRouteStops = async () => {
        if (!selectedRouteId) {
            setRouteStops([]);
            return;
        }
        setLoadingStops(true);
        setError(null);
        try {
            const response = await api.get(`/routes/${selectedRouteId}/stops`);
            setRouteStops(response.data);
        } catch (err) {
            console.error(`Error fetching stops for route ${selectedRouteId}:`, err);
            setError('Failed to load stops for the selected route.');
        } finally {
            setLoadingStops(false);
        }
    };

    useEffect(() => {
        fetchRouteStops();
    }, [selectedRouteId]);

    const handleSaveRouteStop = async (routeStopData) => {
        try {
            if (editingRouteStop) {
                await api.put(`/routes/${selectedRouteId}/stops/${editingRouteStop.id}`, routeStopData);
                setSuccessMessage('Stop updated successfully!');
            } else {
                await api.post(`/routes/${selectedRouteId}/stops`, routeStopData);
                setSuccessMessage('Stop added successfully!');
            }
            await fetchRouteStops();
            closeForm();
        } catch (err) {
            console.error('Error saving route stop:', err);
            setError(err.response?.data?.message || 'Failed to save the stop.');
        }
    };

    const handleDeleteRouteStop = async (routeStopId) => {
        if (window.confirm('Are you sure you want to delete this stop from the route?')) {
            try {
                await api.delete(`/routes/${selectedRouteId}/stops/${routeStopId}`);
                setSuccessMessage('Stop removed successfully!');
                await fetchRouteStops();
            } catch (err) {
                console.error('Error deleting route stop:', err);
                setError(err.response?.data?.message || 'Failed to delete the stop.');
            }
        }
    };

    const handleAddClick = () => {
        setEditingRouteStop(null);
        setShowForm(true);
    };

    const handleEditClick = (routeStop) => {
        setEditingRouteStop(routeStop);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingRouteStop(null);
        setError(null);
    };

    // --- Drag and Drop Handlers ---
    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (targetIndex) => {
        if (draggedIndex === null || draggedIndex === targetIndex) {
            setDraggedIndex(null);
            return;
        }

        const originalOrder = [...routeStops];
        const newOrder = [...routeStops];
        const [draggedItem] = newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedItem);

        // Update stopOrder based on new array index
        const finalOrder = newOrder.map((stop, index) => ({
            ...stop,
            stopOrder: index + 1,
        }));

        setReorderChange({ before: originalOrder, after: finalOrder });
        setDraggedIndex(null);
    };

    const handleConfirmReorder = async () => {
        if (!reorderChange) return;
        setIsSavingOrder(true);
        setError(null);

        try {
            // Process updates sequentially to avoid race conditions on the backend
            for (const rs of reorderChange.after) {
                // We only need to send the fields that might change, but sending all is also fine.
                // The key is sending the new stopOrder.
                await api.put(`/routes/${selectedRouteId}/stops/${rs.id}`, {
                    stopId: rs.stop.id,
                    stopOrder: rs.stopOrder,
                    arrivalTime: rs.arrivalTime,
                    departureTime: rs.departureTime,
                    distanceFromStartKm: rs.distanceFromStartKm,
                    travelTimeFromPrevMin: rs.travelTimeFromPrevMin,
                    remarks: rs.remarks,
                });
            }

            setSuccessMessage('Stop order updated successfully!');
            setRouteStops(reorderChange.after); // Persist the new order in local state
        } catch (err) {
            console.error('Error saving new stop order:', err);
            setError('Failed to save the new order. Please try again.');
            await fetchRouteStops(); // Re-fetch to revert to original state on error
        } finally {
            setIsSavingOrder(false);
            setReorderChange(null);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-blue-900 mb-6">Service Route Details</h1>

            <div className="mb-6">
                <label htmlFor="route-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select a Route to view its stops:
                </label>
                <select
                    id="route-select"
                    value={selectedRouteId}
                    onChange={(e) => setSelectedRouteId(e.target.value)}
                    className="mt-1 block w-full md:w-1/2 lg:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    disabled={loadingRoutes}
                >
                    <option value="">{loadingRoutes ? 'Loading routes...' : '--- Select a Route ---'}</option>
                    {routes.map((route) => (
                        <option key={route.id} value={route.id}>
                            {route.name} ({route.routeCode}) - {route.direction}
                        </option>
                    ))}
                </select>
            </div>

            {selectedRouteId && !showForm && (
                <div className="flex justify-end items-center mb-6">
                    <Button onClick={handleAddClick}>Add Stop to Route</Button>
                </div>
            )}

            {showForm && <RouteStopForm routeStop={editingRouteStop} onSave={handleSaveRouteStop} onCancel={closeForm} availableStops={availableStops} />}
            {error && <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}
            <Modal message={successMessage} onClose={() => setSuccessMessage('')} />
            {reorderChange && (
                <ReorderModal
                    change={reorderChange}
                    onConfirm={handleConfirmReorder}
                    onCancel={() => setReorderChange(null)}
                    isSaving={isSavingOrder}
                />
            )}

            <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dist. (km)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Time (min)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loadingStops ? (
                            <tr><td colSpan="8" className="text-center py-4">Loading stops...</td></tr>
                        ) : routeStops.length > 0 ? (
                            routeStops.map((rs, index) => {
                                const isOrigin = rs.stopOrder === 1;
                                const isDestination = index === routeStops.length - 1;
                                return (
                                <tr 
                                    key={rs.id} 
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(index)}
                                    className={`cursor-move ${isOrigin || isDestination ? 'bg-gray-50' : ''} ${draggedIndex === index ? 'opacity-50' : ''}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rs.stopOrder}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {rs.stop.name}
                                        {isOrigin && <span className="ml-2 text-xs font-semibold text-green-800 bg-green-100 px-2 py-0.5 rounded-full">Origin</span>}
                                        {isDestination && <span className="ml-2 text-xs font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded-full">Destination</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rs.arrivalTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rs.departureTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rs.distanceFromStartKm}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rs.travelTimeFromPrevMin}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rs.remarks}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <EditButton onClick={() => handleEditClick(rs)} />
                                        <DeleteButton onClick={() => handleDeleteRouteStop(rs.id)} />
                                    </td>
                                </tr>)
                            })
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-gray-500">
                                    {selectedRouteId ? 'No stops found for this route. Use the button above to add one.' : 'Please select a route to see its stops.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}