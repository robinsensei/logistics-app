import { useState, useEffect } from 'react';
import Button from '../Button';
import SaveButton from '../buttons/SaveButton';

export default function RouteStopForm({ routeStop, onSave, onCancel, availableStops = [] }) {
    const [stopId, setStopId] = useState('');
    const [stopOrder, setStopOrder] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [distanceFromStartKm, setDistanceFromStartKm] = useState('');
    const [travelTimeFromPrevMin, setTravelTimeFromPrevMin] = useState('');
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        if (routeStop) {
            setStopId(routeStop.stop.id || '');
            setStopOrder(routeStop.stopOrder || '');
            setArrivalTime(routeStop.arrivalTime || '');
            setDepartureTime(routeStop.departureTime || '');
            setDistanceFromStartKm(routeStop.distanceFromStartKm || '');
            setTravelTimeFromPrevMin(routeStop.travelTimeFromPrevMin || '');
            setRemarks(routeStop.remarks || '');
        } else {
            // Reset for new entry
            setStopId('');
            setStopOrder('');
            setArrivalTime('');
            setDepartureTime('');
            setDistanceFromStartKm('');
            setTravelTimeFromPrevMin('');
            setRemarks('');
        }
    }, [routeStop]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            stopId: parseInt(stopId),
            stopOrder: parseInt(stopOrder),
            arrivalTime,
            departureTime,
            distanceFromStartKm: parseFloat(distanceFromStartKm),
            travelTimeFromPrevMin: parseInt(travelTimeFromPrevMin),
            remarks
        });
    };

    return (
        <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {routeStop ? 'Edit Stop on Route' : 'Add New Stop to Route'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <label htmlFor="stopId" className="block text-sm font-medium text-gray-700">Stop</label>
                        <select id="stopId" value={stopId} onChange={(e) => setStopId(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="">Select a stop</option>
                            {availableStops.map(stop => (
                                <option key={stop.id} value={stop.id}>{stop.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="stopOrder" className="block text-sm font-medium text-gray-700">Order</label>
                        <input type="number" id="stopOrder" value={stopOrder} onChange={(e) => setStopOrder(e.target.value)} required min="1" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700">Arrival Time</label>
                        <input type="time" id="arrivalTime" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700">Departure Time</label>
                        <input type="time" id="departureTime" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="distanceFromStartKm" className="block text-sm font-medium text-gray-700">Distance from Start (km)</label>
                        <input type="number" id="distanceFromStartKm" value={distanceFromStartKm} onChange={(e) => setDistanceFromStartKm(e.target.value)} min="0" step="0.1" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="travelTimeFromPrevMin" className="block text-sm font-medium text-gray-700">Travel Time from Prev. (min)</label>
                        <input type="number" id="travelTimeFromPrevMin" value={travelTimeFromPrevMin} onChange={(e) => setTravelTimeFromPrevMin(e.target.value)} min="0" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks</label>
                        <textarea id="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows="2" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" onClick={onCancel} variant="cancel">
                        Cancel
                    </Button>
                    <SaveButton type="submit">
                        {routeStop ? 'Save Changes' : 'Save Stop'}
                    </SaveButton>
                </div>
            </form>
        </div>
    );
}