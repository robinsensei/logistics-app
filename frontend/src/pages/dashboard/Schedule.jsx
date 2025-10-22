import { useState, useEffect } from 'react';
import api from '../../services/api';
import ScheduleForm from '../../components/dashboard/ScheduleForm';
import Modal from '../../components/dashboard/Modal';
import Button from '../../components/Button';
import EditButton from '../../components/buttons/EditButton';
import DeleteButton from '../../components/buttons/DeleteButton';

export default function Schedule() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Data for forms
    const [availableDrivers, setAvailableDrivers] = useState([]);
    const [availableBuses, setAvailableBuses] = useState([]);
    const [availableRoutes, setAvailableRoutes] = useState([]);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [entriesToShow, setEntriesToShow] = useState(10);

    useEffect(() => {
        fetchSchedules();
        fetchFormData();
    }, []);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const response = await api.get('/schedules');
            setSchedules(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching schedules:', err);
            setError('Failed to load schedules. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchFormData = async () => {
        try {
            const [employeesRes, busesRes, routesRes] = await Promise.all([
                api.get('/employees'),
                api.get('/buses'),
                api.get('/routes')
            ]);
            // Filter employees to only include drivers
            const drivers = employeesRes.data.filter(emp => emp.roles.some(role => role.name === 'ROLE_DRIVER'));
            setAvailableDrivers(drivers);
            setAvailableBuses(busesRes.data);
            setAvailableRoutes(routesRes.data);
        } catch (err) {
            console.error('Error fetching form data:', err);
            setError('Failed to load data for creating schedules.');
        }
    };

    const handleSaveSchedule = async (scheduleData) => {
        try {
            if (editingSchedule) {
                await api.put(`/schedules/${editingSchedule.id}`, scheduleData);
                setSuccessMessage('Schedule updated successfully!');
            } else {
                await api.post('/schedules', scheduleData);
                setSuccessMessage('Schedule created successfully!');
            }
            await fetchSchedules();
            closeForm();
        } catch (err) {
            console.error('Error saving schedule:', err);
            setError(err.response?.data?.message || 'Failed to save the schedule.');
        }
    };

    const handleDeleteSchedule = async (scheduleId) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            try {
                await api.delete(`/schedules/${scheduleId}`);
                setSuccessMessage('Schedule deleted successfully!');
                await fetchSchedules();
            } catch (err) {
                console.error('Error deleting schedule:', err);
                setError(err.response?.data?.message || 'Failed to delete the schedule.');
            }
        }
    };

    const handleAddClick = () => {
        setEditingSchedule(null);
        setShowForm(true);
    };

    const handleEditClick = (schedule) => {
        setEditingSchedule(schedule);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingSchedule(null);
        setError(null);
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        return new Date(dateTimeString).toLocaleString();
    };

    const displayedSchedules = schedules.slice(0, entriesToShow);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-900">Schedules</h1>
                {!showForm && (
                    <Button onClick={handleAddClick}>
                        Add Schedule
                    </Button>
                )}
            </div>

            <div className="flex justify-between items-center mb-4">
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
                        <option value={schedules.length}>All</option>
                    </select>
                </div>
            </div>

            {showForm && <ScheduleForm schedule={editingSchedule} onSave={handleSaveSchedule} onCancel={closeForm} availableDrivers={availableDrivers} availableBuses={availableBuses} availableRoutes={availableRoutes} />}

            <Modal message={successMessage} onClose={() => setSuccessMessage('')} />
            {error && !showForm && <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}

            <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Arrival</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-4">Loading schedules...</td></tr>
                        ) : schedules.length > 0 ? (
                            displayedSchedules.map((schedule) => (
                                <tr key={schedule.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.route.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.driver.firstName} {schedule.driver.lastName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.bus.busNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(schedule.departureDateTime)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(schedule.estimatedArrivalDateTime)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            schedule.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                            schedule.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' :
                                            schedule.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {schedule.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <EditButton onClick={() => handleEditClick(schedule)} />
                                        <DeleteButton onClick={() => handleDeleteSchedule(schedule.id)} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="text-center py-4 text-gray-500">No schedules found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}