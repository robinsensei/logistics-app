import { Routes, Route } from 'react-router-dom';

// Auth pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Dashboard pages
import Dashboard from '../pages/dashboard/Dashboard';
import RoutesComponent from '../pages/dashboard/Routes';
import StopsComponent from '../pages/dashboard/Stops';
import BusesComponent from '../pages/dashboard/Buses';
import EmployeesComponent from '../pages/dashboard/Employees'; 
import ScheduleComponent from '../pages/dashboard/Schedule';
import ServiceRouteComponent from '../pages/dashboard/ServiceRoute';
import ReportsComponent from '../pages/dashboard/Reports';
import ProfileComponent from '../pages/dashboard/Profile';
import SettingsComponent from '../pages/dashboard/Settings';

// Public pages
import Home from '../pages/public/Home';
import PublicSchedule from '../pages/public/PublicSchedule';
import PublicRoutes from '../pages/public/PublicRoutes';
import PublicRouteDetails from '../pages/public/PublicRouteDetails';

// Layouts
import Layout from '../components/dashboard/Layout';
import PublicLayout from '../components/public/PublicLayout';

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="routes/:id" element={<PublicRouteDetails />} />
      </Route>

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="routes" element={<RoutesComponent />} />
        <Route path="stops" element={<StopsComponent />} />
        <Route path="buses" element={<BusesComponent />} />
        <Route path="employees" element={<EmployeesComponent />} />
        <Route path="schedules" element={<ScheduleComponent />} />
        <Route path="service-route" element={<ServiceRouteComponent />} />
        <Route path="reports" element={<ReportsComponent />} />
        <Route path="profile" element={<ProfileComponent />} />
        <Route path="settings" element={<SettingsComponent />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
