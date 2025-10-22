import { useState, useEffect } from 'react';
import Button from '../Button';
import SaveButton from '../buttons/SaveButton';


export default function StopForm({ stop, onSave, onCancel }) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('REST_STOP');
    const [landmark, setLandmark] = useState('');
    const [street, setStreet] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    useEffect(() => {
        if (stop) {
            setName(stop.name || '');
            setAddress(stop.address || '');
            setDescription(stop.description || '');
            setType(stop.type || 'REST_STOP');
            setLandmark(stop.landmark || '');
            setStreet(stop.street || '');
            setLatitude(stop.latitude || '');
            setLongitude(stop.longitude || '');
        }
    }, [stop]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, address, description, type, landmark, street, latitude: parseFloat(latitude) || null, longitude: parseFloat(longitude) || null });
    };

    return (
        <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {stop ? 'Edit Stop' : 'Add New Stop'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Stop Name</label>
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
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                        <input 
                            type="text" 
                            value={type} 
                            onChange={(e) => setType(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input 
                            type="text" 
                            name="address" 
                            id="address" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
                        <input 
                            type="text" 
                            name="street" 
                            id="street" 
                            value={street} 
                            onChange={(e) => setStreet(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">Landmark</label>
                        <input 
                            type="text" 
                            name="landmark" 
                            id="landmark" 
                            value={landmark} 
                            onChange={(e) => setLandmark(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
                        <input 
                            type="number" 
                            name="latitude" 
                            id="latitude" 
                            value={latitude} 
                            onChange={(e) => setLatitude(e.target.value)} 
                            step="any"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
                        <input 
                            type="number" 
                            name="longitude" 
                            id="longitude" 
                            value={longitude} 
                            onChange={(e) => setLongitude(e.target.value)} 
                            step="any"
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
                    <SaveButton />
                </div>
            </form>
        </div>
    );
}
