import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function ItineraryDropdown({ icon: Icon, isActive }) {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const items = [
        { name: 'Routes', href: '/dashboard/routes' },
        { name: 'Stops', href: '/dashboard/stops' },
        { name: 'Service Route', href: '/dashboard/service-route' }
    ];

    const isItemActive = (href) => location.pathname === href;
    const isAnyItemActive = items.some(item => isItemActive(item.href));

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm ${
                    isAnyItemActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
            >
                <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3" />
                    Itinerary
                </div>
                <ChevronDownIcon 
                    className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
                />
            </button>
            
            {isOpen && (
                <div className="pl-11 mt-1 space-y-1">
                    {items.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`block px-4 py-2 text-sm ${
                                isItemActive(item.href)
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}