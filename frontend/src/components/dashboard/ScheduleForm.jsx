import { useState, useEffect } from 'react';
import Button from '../Button';
import SaveButton from '../buttons/SaveButton';

export default function ScheduleForm({ schedule, onSave, onCancel, availableDrivers, availableBuses, availableRoutes }) {
    const [driverId, setDriverId] = useState('');
    const [busId, setBusId] = useState('');
    const [routeId, setRouteId] = useState('');
    const [departureDateTime, setDepartureDateTime] = useState('');
    const [status, setStatus] = useState('SCHEDULED');

    useEffect(() => {
        if (schedule) {
            setDriverId(schedule.driver.id || '');
            setBusId(schedule.bus.id || '');
            setRouteId(schedule.route.id || '');
            // Format LocalDateTime from backend (e.g., 2025-10-21T10:00:00) to what datetime-local input expects (yyyy-MM-ddThh:mm)
            setDepartureDateTime(schedule.departureDateTime ? schedule.departureDateTime.slice(0, 16) : '');
            setStatus(schedule.status || 'SCHEDULED');
        } else {
            // Reset for new entry
            setDriverId('');
            setBusId('');
            setRouteId('');
            setDepartureDateTime('');
            setStatus('SCHEDULED');
        }
    }, [schedule]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            driverId: parseInt(driverId),
            busId: parseInt(busId),
            routeId: parseInt(routeId),
            departureDateTime,
            status
        });
    };

    return (
        <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {schedule ? 'Edit Schedule' : 'Add New Schedule'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="driverId" className="block text-sm font-medium text-gray-700">Driver</label>
                        <select id="driverId" value={driverId} onChange={(e) => setDriverId(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="">Select a driver</option>
                            {availableDrivers.map(driver => (
                                <option key={driver.id} value={driver.id}>{driver.firstName} {driver.lastName} ({driver.employeeId})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="busId" className="block text-sm font-medium text-gray-700">Bus</label>
                        <select id="busId" value={busId} onChange={(e) => setBusId(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="">Select a bus</option>
                            {availableBuses.map(bus => (
                                <option key={bus.id} value={bus.id}>{bus.busNumber} - {bus.plateNumber}</option>
                            ))}
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="routeId" className="block text-sm font-medium text-gray-700">Route</label>
                        <select id="routeId" value={routeId} onChange={(e) => setRouteId(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="">Select a route</option>
                            {availableRoutes.map(route => (
                                <option key={route.id} value={route.id}>{route.name} ({route.direction})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="departureDateTime" className="block text-sm font-medium text-gray-700">Departure Date and Time</label>
                        <input type="datetime-local" id="departureDateTime" value={departureDateTime} onChange={(e) => setDepartureDateTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="SCHEDULED">SCHEDULED</option>
                            <option value="IN_TRANSIT">IN_TRANSIT</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" onClick={onCancel} variant="cancel">
                        Cancel
                    </Button>
                    <SaveButton type="submit">
                        {schedule ? 'Save Changes' : 'Save Schedule'}
                    </SaveButton>
                </div>
            </form>
        </div>
    );
}