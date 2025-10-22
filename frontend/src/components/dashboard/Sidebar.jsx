import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    HomeIcon, 
    TruckIcon, 
    MapIcon, 
    UserGroupIcon, 
    CalendarIcon, 
    ChartBarIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';
import ItineraryDropdown from './ItineraryDropdown';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { type: 'dropdown', name: 'Itinerary', icon: MapIcon },
    { name: 'Buses', href: '/dashboard/buses', icon: TruckIcon },
    { name: 'Employees', href: '/dashboard/employees', icon: UserGroupIcon },
    { name: 'Schedule', href: '/dashboard/schedules', icon: CalendarIcon },
    { name: 'Reports', href: '/dashboard/reports', icon: ChartBarIcon },
];

export default function Sidebar() {
    const location = useLocation();
    const { user } = useAuth();

    // Helper to format the user's primary role for display
    const getDisplayRole = () => {
        if (!user || !user.roles || user.roles.length === 0) return 'Guest';
        // Cleans up role string, e.g., "ROLE_ADMIN" becomes "Admin"
        return user.roles[0].replace('ROLE_', '').charAt(0).toUpperCase() + user.roles[0].replace('ROLE_', '').slice(1).toLowerCase();
    };

    return (
        <div className="fixed inset-y-0 left-0 w-64 bg-gray-900">
            <div className="flex flex-col h-full">
                {/* Logo section */}
                <div className="flex items-center h-16 px-4 bg-gray-800">
                    <span className="text-xl font-bold text-white">URBANSYNC</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 mt-4 space-y-1">
                    {navigation.map((item) => (
                        item.type === 'dropdown' ? (
                            <ItineraryDropdown
                                key={item.name}
                                icon={item.icon}
                            />
                        ) : (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-2.5 text-sm ${
                                    location.pathname === item.href
                                        ? 'bg-gray-800 text-white' 
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        )
                    ))}
                </nav>

                {/* User section */}
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <UserCircleIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        {user && (
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{`${user.firstName} ${user.lastName}`}</p>
                                <p className="text-xs font-medium text-gray-300">{getDisplayRole()}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}