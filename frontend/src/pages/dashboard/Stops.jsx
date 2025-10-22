import { useState, useEffect } from 'react';
import StopForm from '../../components/dashboard/StopForm';
import Modal from '../../components/dashboard/Modal';
import api from '../../services/api';
import Button from '../../components/Button';
import EditButton from '../../components/buttons/EditButton';
import DeleteButton from '../../components/buttons/DeleteButton';

export default function Stops() {
    const [showForm, setShowForm] = useState(false);
    const [stops, setStops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingStop, setEditingStop] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [entriesToShow, setEntriesToShow] = useState(10);

    useEffect(() => {
        fetchStops();
    }, []);

    const fetchStops = async () => {
        setLoading(true);
        try {
            const response = await api.get('/stops');
            setStops(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching stops:', err);
            setError('Failed to load stops. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveStop = async (stopData) => {
        try {
            if (editingStop) {
                const response = await api.put(`/stops/${editingStop.id}`, stopData);
                setSuccessMessage('Stop updated successfully!');
            } else {
                const response = await api.post('/stops', stopData);
                setSuccessMessage('Stop added successfully!');
            }
            await fetchStops(); // Refresh the list
            closeForm();
        } catch (err) {
            console.error('Error saving stop:', err);
            const errorMessage = err.response?.data?.message || 'Failed to save stop. Please try again.';
            // This error is now passed to the form, so we don't need a separate modal for it here.
            setError(errorMessage);
        }
    };

    const handleDeleteStop = async (stopId) => {
        // Recommended: Use a confirmation modal here instead of window.confirm
        if (window.confirm('Are you sure you want to delete this stop? This might affect existing routes.')) {
            try {
                await api.delete(`/stops/${stopId}`);
                setSuccessMessage('Stop deleted successfully!');
                await fetchStops();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete stop.');
            }
        }
    };

    const handleEditClick = (stop) => {
        setEditingStop(stop);
        setShowForm(true);
    };

    const handleAddClick = () => {
        setEditingStop(null);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingStop(null);
        setError(null);
    };

    const handleEntriesToShowChange = (e) => {
        setEntriesToShow(Number(e.target.value));
    };

    const displayedStops = stops.slice(0, entriesToShow);





    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-900">Stops</h1>
                {!showForm && (
                    <Button onClick={handleAddClick}>
                        Add Stop
                    </Button>
                )}
            </div>

            {showForm && <StopForm stop={editingStop} onSave={handleSaveStop} onCancel={closeForm} />}

            <Modal 
                message={successMessage}
                onClose={() => setSuccessMessage('')}
            />

            <div className="flex justify-start items-center mb-4">
                <div className="flex items-center">
                    <label htmlFor="entries" className="mr-2 text-sm text-gray-600">Show</label>
                    <select 
                        id="entries"
                        value={entriesToShow} 
                        onChange={handleEntriesToShowChange}
                        className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>



            {error && !showForm && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Landmark</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Street</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : stops.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    No stops found.
                                </td>
                            </tr>
                        ) : 
                            displayedStops.map((stop) => (
                            <tr key={stop.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stop.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stop.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stop.landmark}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stop.street}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stop.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{stop.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <EditButton onClick={() => handleEditClick(stop)} />
                                    <DeleteButton onClick={() => handleDeleteStop(stop.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
