import { useState, useEffect, useCallback } from 'react';
import EmployeeForm from '../../components/dashboard/EmployeeForm';
import Modal from '../../components/dashboard/Modal';
import api from '../../services/api';
import Button from '../../components/Button';
import EditButton from '../../components/buttons/EditButton';

export default function Employees() {
    const [showForm, setShowForm] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [entriesToShow, setEntriesToShow] = useState(10);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            // This endpoint is admin-only, so non-admins will see an error.
            const response = await api.get('/employees');
            setEmployees(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching employees:', err);
            setError('Failed to load employees. You may not have permission to view this page.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleSaveEmployee = async (employeeData) => {
        try {
            setError(null); // Clear previous errors
            if (editingEmployee) {
                await api.put(`/employees/${editingEmployee.id}`, employeeData);
                setSuccessMessage('Employee updated successfully!');
            } else {
                await api.post('/employees', employeeData);
                setSuccessMessage('Employee added successfully!');
            }
            await fetchEmployees();
            closeForm();
        } catch (err) {
            console.error('Error saving employee:', err);
            const errorMessage = err.response?.data?.message || 'Failed to save employee.';
            setError(errorMessage);
        }
    };

    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee);
        setShowForm(true);
    };

    const handleAddClick = () => {
        setEditingEmployee(null);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingEmployee(null);
        setError(null);
    };

    const displayedEmployees = employees.slice(0, entriesToShow);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-900">Employees</h1>
                {!showForm && (
                    <Button onClick={handleAddClick}>
                        Add Employee
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
                        <option value={employees.length}>All</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
                    <span className="font-medium">Error:</span> {error}
                </div>
            )}

            {showForm && (
                <EmployeeForm employee={editingEmployee} onSave={handleSaveEmployee} onCancel={closeForm} apiError={error} />
            )}

            <Modal
                message={successMessage}
                onClose={() => setSuccessMessage('')}
            />

            <div className="overflow-hidden bg-white rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                        ) : employees.length === 0 && !error ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    No employees found.
                                </td>
                            </tr>
                        ) : (
                            displayedEmployees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.employeeId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${employee.firstName} ${employee.lastName}`}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {employee.roles.map(role => role.name.replace('ROLE_', '')).join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            employee.status === 'ACTIVE' 
                                                ? 'bg-green-100 text-green-800'
                                                : employee.status === 'SUSPENDED' || employee.status === 'ON_LEAVE'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {employee.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <EditButton onClick={() => handleEditEmployee(employee)} />
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