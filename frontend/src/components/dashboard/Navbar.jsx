import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { WebLogo } from '../../assets';

export default function Navbar() {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const { logout } = useAuth();

    const handleSignOut = () => {
        logout();
        setIsProfileOpen(false);
        // Navigate to the home page after logout
        navigate('/');
    };

    const mockNotifications = [
        { id: 1, title: 'New bus assigned', message: 'Bus #102 has been assigned to Route 5.', time: '2m ago' },
        { id: 2, title: 'Schedule Update', message: 'Your schedule for tomorrow has been updated.', time: '1h ago' },
        { id: 3, title: 'Maintenance Alert', message: 'Bus #205 requires maintenance.', time: '5h ago' },
    ];

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex justify-end h-16">
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <BellIcon className="w-6 h-6" />
                                {mockNotifications.length > 0 && (
                                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white">
                                        <span className="sr-only">New notifications</span>
                                    </span>
                                )}
                            </button>
                            {isNotificationOpen && (
                                <div className="absolute right-0 z-10 w-80 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="p-4 font-bold border-b">Notifications</div>
                                    <div className="py-1">
                                        {mockNotifications.length > 0 ? (
                                            mockNotifications.map(notification => (
                                                <div key={notification.id} className="px-4 py-3 border-b hover:bg-gray-100">
                                                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                                    <p className="text-sm text-gray-500">{notification.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="px-4 py-3 text-sm text-gray-500">No new notifications</p>
                                        )}
                                    </div>
                                    <div className="p-2 text-center border-t">
                                        <Link to="#" onClick={() => setIsNotificationOpen(false)} className="text-sm text-indigo-600 hover:text-indigo-800">
                                            View all notifications
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <UserCircleIcon className="w-6 h-6 text-gray-400" />
                            </button>

                            {/* Dropdown menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                    <Link 
                                        to="/dashboard/profile"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Profile
                                    </Link>
                                    <button 
                                        onClick={() => navigate('/dashboard/settings')}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Settings
                                    </button>
                                    <button 
                                        onClick={handleSignOut}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}