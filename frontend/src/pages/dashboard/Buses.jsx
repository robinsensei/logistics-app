import { useState, useEffect, useMemo } from 'react';
import BusForm from '../../components/dashboard/BusForm';
import Modal from '../../components/dashboard/Modal';
import api from '../../services/api';
import Button from '../../components/Button';
import EditButton from '../../components/buttons/EditButton';

export default function Buses() {
    const [showForm, setShowForm] = useState(false);
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBus, setEditingBus] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [filters, setFilters] = useState({ type: '', year: '', model: '', seatingCapacity: '' });
    const [entriesToShow, setEntriesToShow] = useState(10);

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            const response = await api.get('/buses');
            setBuses(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching buses:', err);
            setError('Failed to load buses. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBus = async (busData) => {
        try {
            if (editingBus) {
                const response = await api.put(`/buses/${editingBus.id}`, busData);
                setSuccessMessage('Bus updated successfully!');
            } else {
                const response = await api.post('/buses', busData);
                setSuccessMessage('Bus added successfully!');
            }
            await fetchBuses(); // Refresh the list
            closeForm();
        } catch (err) {
            console.error('Error saving bus:', err);
            const errorMessage = err.response?.data?.message || 'Failed to save bus. Please try again.';
            setError(errorMessage);
        }
    };

    const handleEditBus = (bus) => {
        setEditingBus(bus);
        setShowForm(true);
        setError(null); // Clear previous API errors when opening form
    };

    const handleAddClick = () => {
        setEditingBus(null);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingBus(null);
        setError(null); // Clear error when form is closed
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredBuses = useMemo(() => {
        return buses.filter(bus => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const matchesSearch = bus.busNumber.toLowerCase().includes(lowerSearchTerm) ||
                                  bus.plateNumber.toLowerCase().includes(lowerSearchTerm);

            const matchesFilters = 
                (filters.type ? bus.type === filters.type : true) &&
                (filters.year ? bus.yearManufactured === parseInt(filters.year) : true) &&
                (filters.model ? bus.model === filters.model : true) &&
                (filters.seatingCapacity ? bus.seatingCapacity === parseInt(filters.seatingCapacity) : true);

            return matchesSearch && matchesFilters;
        });
    }, [buses, searchTerm, filters]);

    const displayedBuses = useMemo(() => {
        return filteredBuses.slice(0, entriesToShow);
    }, [filteredBuses, entriesToShow]);

    const uniqueTypes = useMemo(() => [...new Set(buses.map(b => b.type).filter(Boolean))], [buses]);
    const uniqueYears = useMemo(() => [...new Set(buses.map(b => b.yearManufactured).filter(Boolean))].sort((a, b) => b - a), [buses]);
    const uniqueModels = useMemo(() => [...new Set(buses.map(b => b.model).filter(Boolean))], [buses]);
    const uniqueCapacities = useMemo(() => [...new Set(buses.map(b => b.seatingCapacity).filter(Boolean))].sort((a, b) => a - b), [buses]);

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            type: '',
            year: '',
            model: '',
            seatingCapacity: ''
        });
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-900">Buses</h1>
                {!showForm && (
                    <Button onClick={handleAddClick}>
                        Add Bus
                    </Button>
                )}
            </div>

            {showForm && <BusForm bus={editingBus} onSave={handleSaveBus} onCancel={closeForm} apiError={error} />}

            <Modal 
                message={successMessage}
                onClose={() => setSuccessMessage('')}
            />

            {error && !showForm && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                    {error}
                </div>
            )}

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
                        <option value={buses.length}>All</option>
                    </select>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-2">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Bus/Plate No.</label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Filter Dropdowns */}
                    {[
                        { name: 'type', label: 'Type', options: uniqueTypes },
                        { name: 'year', label: 'Year', options: uniqueYears },
                        { name: 'model', label: 'Model', options: uniqueModels },
                        { name: 'seatingCapacity', label: 'Capacity', options: uniqueCapacities }
                    ].map(filter => (
                        <div key={filter.name}>
                            <label htmlFor={filter.name} className="block text-sm font-medium text-gray-700">{filter.label}</label>
                            <select
                                id={filter.name}
                                name={filter.name}
                                value={filters[filter.name]}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">All</option>
                                {filter.options.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-end">
                    <Button onClick={clearFilters} variant="cancel">
                        Clear Filters
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden bg-white rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Number</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seating Capacity</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
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
                        ) : filteredBuses.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                                    No buses found matching your criteria
                                </td>
                            </tr>
                        ) : displayedBuses.map((bus) => (
                            <tr key={bus.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bus.busNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.plateNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.seatingCapacity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        bus.status === 'Active' 
                                            ? 'bg-green-100 text-green-800'
                                            : bus.status === 'Maintenance'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {bus.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.model}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.yearManufactured}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(bus.updatedAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <EditButton onClick={() => handleEditBus(bus)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
