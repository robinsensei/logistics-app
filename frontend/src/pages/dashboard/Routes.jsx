import { useState, useEffect, useCallback } from 'react';
import RouteForm from '../../components/dashboard/RouteForm';
import api from '../../services/api';
import Button from '../../components/Button';
import EditButton from '../../components/buttons/EditButton';

export default function Routes() {
    const [showForm, setShowForm] = useState(false);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRoute, setEditingRoute] = useState(null);
    const [entriesToShow, setEntriesToShow] = useState(10);

    const fetchRoutes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/routes');
            setRoutes(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching routes:', err);
            setError('Failed to load routes. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoutes();
    }, [fetchRoutes]);

    const handleSaveRoute = async (routeData) => {
        try {
            if (editingRoute) {
                await api.put(`/routes/${editingRoute.id}`, routeData);
            } else {
                await api.post('/routes', routeData);
            }
            await fetchRoutes(); // Refresh the list
            closeForm();
        } catch (err) {
            console.error('Error saving route:', err);
            const errorMessage = err.response?.data?.message || 'Failed to save route. Please try again.';
            setError(errorMessage);
        }
    };

    const handleEditRoute = (route) => {
        setEditingRoute(route);
        setShowForm(true);
    };

    const handleAddClick = () => {
        setEditingRoute(null);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingRoute(null);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-900">Routes</h1>
                {!showForm && (
                    <Button onClick={handleAddClick}>
                        Add Route
                    </Button>
                )}
            </div>

            {showForm && <RouteForm route={editingRoute} onSave={handleSaveRoute} onCancel={closeForm} />}

            {error && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                    {error}
                </div>
            )}

            <div className="flex justify-start items-center mb-4">
                <div className="flex items-center">
                    <label htmlFor="entries" className="mr-2 text-sm text-gray-600">Show</label>
                    <select 
                        id="entries"
                        value={entriesToShow} 
                        onChange={(e) => setEntriesToShow(Number(e.target.value))}
                        className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden bg-white rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route Code</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Direction</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    </div>
                                </td>
                            </tr>)
                        : routes.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No routes found.
                                </td>
                            </tr>
                        ) : ( 
                            routes.slice(0, entriesToShow).map((route) => (
                                <tr key={route.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{route.routeCode}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.direction}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <EditButton onClick={() => handleEditRoute(route)} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
