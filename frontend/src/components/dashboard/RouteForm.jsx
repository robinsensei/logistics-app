import { useState, useEffect } from 'react';
import Button from '../Button';
import SaveButton from '../buttons/SaveButton';

export default function RouteForm({ route, onSave, onCancel }) {
    const [routeCode, setRouteCode] = useState('');
    const [name, setName] = useState('');
    const [direction, setDirection] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (route) {
            setRouteCode(route.routeCode || '');
            setName(route.name || '');
            setDirection(route.direction || '');
            setDescription(route.description || '');
        } else {
            // Reset form for new entry
            setRouteCode('');
            setName('');
            setDirection('');
            setDescription('');
        }
    }, [route]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            routeCode,
            name,
            direction,
            description
        };
        onSave(formData);
    };

    return (
        <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {route ? 'Edit Route' : 'Add New Route'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="routeCode" className="block text-sm font-medium text-gray-700">Route Code</label>
                        <input 
                            type="text" 
                            name="routeCode" 
                            id="routeCode" 
                            value={routeCode} 
                            onChange={(e) => setRouteCode(e.target.value)} 
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Route Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="direction" className="block text-sm font-medium text-gray-700">Direction</label>
                        <input 
                            type="text" 
                            name="direction" 
                            id="direction" 
                            value={direction} 
                            onChange={(e) => setDirection(e.target.value)} 
                            placeholder="e.g., Northbound, Southbound, Clockwise"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" onClick={onCancel} variant="cancel">
                        Cancel
                    </Button>
                    <SaveButton type="submit">
                        {route ? 'Save Changes' : 'Save'}
                    </SaveButton>
                </div>
            </form>
        </div>
    );
}
