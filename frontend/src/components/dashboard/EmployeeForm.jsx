import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Button from '../Button';
import SaveButton from '../buttons/SaveButton';

export default function EmployeeForm({ employee, onSave, onCancel, apiError }) {
    const [formData, setFormData] = useState({
        employeeId: '',
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        joiningDate: '',
        emergencyContact: '',
        status: 'ACTIVE',
        role: ['employee'],
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (employee) {
            setFormData({
                employeeId: employee.employeeId || '',
                firstName: employee.firstName || '',
                lastName: employee.lastName || '',
                username: employee.username || '',
                email: employee.email || '',
                password: '', // Password is not sent for updates
                phone: employee.phone || '',
                address: employee.address || '',
                dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
                joiningDate: employee.joiningDate ? employee.joiningDate.split('T')[0] : '',
                emergencyContact: employee.emergencyContact || '',
                status: employee.status || 'ACTIVE',
                role: employee.roles?.map(r => r.name.replace('ROLE_', '').toLowerCase()) || ['employee'],
            });
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (e) => {
        setFormData(prev => ({ ...prev, role: [e.target.value] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = { ...formData };
        if (employee && !dataToSave.password) {
            delete dataToSave.password; // Don't send empty password on update
        }
        onSave(dataToSave);
    };

    const errorInputClass = "border-red-500 focus:ring-red-500 focus:border-red-500";
    const defaultInputClass = "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500";
    const usernameError = apiError && apiError.includes('Username');
    const emailError = apiError && apiError.includes('Email');
    const employeeIdError = apiError && apiError.includes('Employee ID');

    return (
        <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {employee ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {apiError && (
                        <div className="sm:col-span-2 p-3 text-sm text-red-700 bg-red-100 rounded-md">
                            {apiError}
                        </div>
                    )}
                    <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Employee ID (e.g., E001)" required disabled={!!employee} className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${employeeIdError ? errorInputClass : defaultInputClass} ${employee ? 'bg-gray-100' : ''}`} />
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${defaultInputClass}`} />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${defaultInputClass}`} />
                    <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${usernameError ? errorInputClass : defaultInputClass}`} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${emailError ? errorInputClass : defaultInputClass}`} />
                    
                    {!employee && (
                        <div className="sm:col-span-2 relative">
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder="Password" 
                                required 
                                className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${defaultInputClass}`} 
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                        </div>
                    )}

                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${defaultInputClass}`} />
                    <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Emergency Contact" className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${defaultInputClass}`} />
                    
                    <div className="sm:col-span-2">
                        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${defaultInputClass}`} />
                    </div>

                    <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${defaultInputClass}`} />
                    </div>
                    <div>
                        <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700">Joining Date</label>
                        <input type="date" name="joiningDate" id="joiningDate" value={formData.joiningDate} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${defaultInputClass}`} />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            name="role"
                            id="role"
                            value={formData.role[0]}
                            onChange={handleRoleChange}
                            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${defaultInputClass}`}
                        >
                            <option value="employee">Employee</option>
                            <option value="driver">Driver</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            id="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${defaultInputClass}`}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="SUSPENDED">Suspended</option>
                            <option value="ON_LEAVE">On Leave</option>
                            <option value="TERMINATED">Terminated</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" onClick={onCancel} variant="cancel">
                        Cancel
                    </Button>
                    <SaveButton type="submit">
                        {employee ? 'Save Changes' : 'Save'}
                    </SaveButton>
                </div>
            </form>
        </div>
    );
}