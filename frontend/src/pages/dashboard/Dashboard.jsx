import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
import { Pie, Bar } from 'react-chartjs-2';
import api from '../../services/api';
import { TruckIcon, MapIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// No need to register components when importing from 'chart.js/auto'

const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 transform hover:-translate-y-1 transition-transform duration-300">
        <div className="bg-blue-100 p-3 rounded-full">
            <Icon className="h-6 w-6 text-blue-900" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        buses: 0,
        routes: 0,
        employees: 0,
    });
    const [busStatusData, setBusStatusData] = useState(null);
    const [scheduleByDateData, setScheduleByDateData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [busesRes, routesRes, employeesRes, schedulesRes] = await Promise.all([
                    api.get('/buses'),
                    api.get('/routes'),
                    api.get('/employees'),
                    api.get('/schedules')
                ]);

                setStats({
                    buses: busesRes.data.length,
                    routes: routesRes.data.length,
                    employees: employeesRes.data.length,
                });

                // Process bus data for pie chart
                const statusCounts = busesRes.data.reduce((acc, bus) => {
                    acc[bus.status] = (acc[bus.status] || 0) + 1;
                    return acc;
                }, {});

                const chartData = {
                    labels: Object.keys(statusCounts),
                    datasets: [
                        {
                            label: 'Buses by Status',
                            data: Object.values(statusCounts),
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.6)', // Active
                                'rgba(255, 206, 86, 0.6)', // Maintenance
                                'rgba(255, 99, 132, 0.6)', // Retired
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(255, 99, 132, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                };
                setBusStatusData(chartData);

                // Process schedule data for bar chart
                const scheduleCountsByDate = schedulesRes.data.reduce((acc, schedule) => {
                    const date = new Date(schedule.departureDateTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});

                const sortedDates = Object.keys(scheduleCountsByDate).sort((a, b) => new Date(a) - new Date(b));

                const scheduleChartData = {
                    labels: sortedDates,
                    datasets: [
                        {
                            label: 'Number of Scheduled Trips',
                            data: sortedDates.map(date => scheduleCountsByDate[date]),
                            backgroundColor: 'rgba(30, 58, 138, 0.6)', // Marine Blue
                            borderColor: 'rgba(30, 58, 138, 1)',
                            borderWidth: 1,
                            borderRadius: 4,
                        },
                    ],
                };
                setScheduleByDateData(scheduleChartData);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-6">Loading Dashboard...</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-full">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">Dashboard Overview</h1>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Buses" value={stats.buses} icon={TruckIcon} />
                <StatCard title="Total Routes" value={stats.routes} icon={MapIcon} />
                <StatCard title="Total Employees" value={stats.employees} icon={UserGroupIcon} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-blue-900">Bus Status Distribution</h2>
                    <div className="h-80 flex justify-center">
                        {busStatusData && <Pie data={busStatusData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />}
                    </div>
                </div>
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-blue-900">Scheduled Trips by Date</h2>
                    <div className="h-80">{scheduleByDateData && <Bar data={scheduleByDateData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />}</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;