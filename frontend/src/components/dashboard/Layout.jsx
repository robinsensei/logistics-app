import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />
            <div className="pl-64">
                <Navbar />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
