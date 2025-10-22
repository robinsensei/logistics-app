import { useState, useEffect } from 'react';

export default function BusForm({ bus, onSave, onCancel }) {
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
            setBusType(bus.busType || '');
            setModel(bus.model || '');
            setManufacturer(bus.manufacturer || '');
            setYearManufactured(bus.yearManufactured || '');
            setStatus(bus.status || 'Active');
        }
    }, [bus]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ busNumber, plateNumber, seatingCapacity, busType, model, manufacturer, yearManufactured, status });
    };

    return (
        <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {bus ? 'Edit Bus' : 'Add New Bus'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="busNumber" className="block text-sm font-medium text-gray-700">Bus Number</label>
                        <input 
                            type="text" 
                            name="busNumber" 
                            id="busNumber" 
                            value={busNumber} 
                            onChange={(e) => setBusNumber(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                        <input 
                            type="number" 
                            name="yearManufactured" 
                            id="yearManufactured" 
                            value={yearManufactured} 
                            onChange={(e) => setYearManufactured(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status" 
                            id="status" 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
