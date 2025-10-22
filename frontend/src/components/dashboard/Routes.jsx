import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import './Routes.css';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axiosInstance.get('/routes');
      setRoutes(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError('Failed to load routes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading routes...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="routes-container">
      <h2>Routes</h2>
      <div className="routes-list">
        {routes.length === 0 ? (
          <p>No routes found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Route Number</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Assigned Bus</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.id}>
                  <td>{route.routeNumber}</td>
                  <td>{route.origin}</td>
                  <td>{route.destination}</td>
                  <td>{route.status}</td>
                  <td>{route.assignedBus?.busNumber || 'Not assigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Routes;