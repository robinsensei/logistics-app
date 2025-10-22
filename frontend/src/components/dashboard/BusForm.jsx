import { useState, useEffect } from 'react';
import Button from '../Button';
import SaveButton from '../buttons/SaveButton';

export default function BusForm({ bus, onSave, onCancel, apiError }) {
    const [busNumber, setBusNumber] = useState('');
    const [plateNumber, setPlateNumber] = useState('');
    const [seatingCapacity, setSeatingCapacity] = useState('');
    const [busType, setBusType] = useState('');
    const [model, setModel] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [yearManufactured, setYearManufactured] = useState('');
    const [status, setStatus] = useState('Active');

    useEffect(() => {
        if (bus) {
            setBusNumber(bus.busNumber || '');
            setPlateNumber(bus.plateNumber || '');
            setSeatingCapacity(bus.seatingCapacity || '');
            setBusType(bus.type || '');
            setModel(bus.model || '');
            setManufacturer(bus.manufacturer || '');
            setYearManufactured(bus.yearManufactured || '');
            setStatus(bus.status || 'Active');
        }
    }, [bus]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ 
            busNumber, 
            plateNumber, 
            seatingCapacity: parseInt(seatingCapacity, 10) || null, // Handle empty string case
            busType, model, 
            manufacturer, 
            yearManufactured: parseInt(yearManufactured, 10) || null, // Handle empty string case
            status });
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear - i);

    const errorInputClass = "border-red-500 focus:ring-red-500 focus:border-red-500";
    const defaultInputClass = "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500";

    const busNumberError = apiError && apiError.includes('Bus number');
    const plateNumberError = apiError && apiError.includes('Plate number');

    return (
        <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {bus ? 'Edit Bus' : 'Add New Bus'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {apiError && (
                        <div className="sm:col-span-2 p-3 text-sm text-red-700 bg-red-100 rounded-md">
                            {apiError}
                        </div>
                    )}
                    <div>
                        <label htmlFor="busNumber" className="block text-sm font-medium text-gray-700">Bus Number</label>
                        <input 
                            type="text" 
                            name="busNumber" 
                            id="busNumber" 
                            value={busNumber} 
                            onChange={(e) => setBusNumber(e.target.value)} 
                            required
                            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${busNumberError ? errorInputClass : defaultInputClass}`}
                        />
                    </div>
                    <div>
                        <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700">Plate Number</label>
                        <input 
                            type="text" 
                            name="plateNumber" 
                            id="plateNumber" 
                            value={plateNumber} 
                            onChange={(e) => setPlateNumber(e.target.value)} 
                            required
                            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${plateNumberError ? errorInputClass : defaultInputClass}`}
                        />
                    </div>
                    <div>
                        <label htmlFor="seatingCapacity" className="block text-sm font-medium text-gray-700">Seating Capacity</label>
                        <input 
                            type="number" 
                            name="seatingCapacity" 
                            id="seatingCapacity" 
                            value={seatingCapacity} 
                            onChange={(e) => setSeatingCapacity(e.target.value)} 
                            required
                            min="10"
                            max="100"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="busType" className="block text-sm font-medium text-gray-700">Bus Type</label>
                        <input 
                            type="text" 
                            name="busType" 
                            id="busType" 
                            value={busType} 
                            onChange={(e) => setBusType(e.target.value)} 
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                        <input 
                            type="text" 
                            name="model" 
                            id="model" 
                            value={model} 
                            onChange={(e) => setModel(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">Manufacturer</label>
                        <input 
                            type="text" 
                            name="manufacturer" 
                            id="manufacturer" 
                            value={manufacturer} 
                            onChange={(e) => setManufacturer(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="yearManufactured" className="block text-sm font-medium text-gray-700">Year Manufactured</label>
                        <select
                            name="yearManufactured" 
                            id="yearManufactured" 
                            value={yearManufactured} 
                            onChange={(e) => setYearManufactured(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Select Year</option>
                            {years.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status" 
                            id="status" 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)} 
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="Active">Active</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Retired">Retired</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" onClick={onCancel} variant="cancel">
                        Cancel
                    </Button>
                    <SaveButton type="submit">
                        {bus ? 'Save Changes' : 'Save'}
                    </SaveButton>
                </div>
            </form>
        </div>
    );
}
