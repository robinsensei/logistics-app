import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button';
import './LoginForm.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(username, password);
      // Navigation is handled by the parent Login component
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="w-full">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-6">LOGIN</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="username" className="block text-sm font-medium text-blue-900">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="block text-sm font-medium text-blue-900">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full mt-6">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;