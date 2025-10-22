import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCircleIcon, AtSymbolIcon, IdentificationIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth();

  const getDisplayRole = () => {
    if (!user || !user.roles || user.roles.length === 0) return 'Guest';
    return user.roles[0].replace('ROLE_', '').charAt(0).toUpperCase() + user.roles[0].replace('ROLE_', '').slice(1).toLowerCase();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">User Profile</h1>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            {user ? (
              <>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Profile picture placeholder */}
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserCircleIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                  {/* User name and role */}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">{`${user.firstName} ${user.lastName}`}</h2>
                    <p className="text-md text-indigo-600 font-semibold">{getDisplayRole()}</p>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8">
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center"><AtSymbolIcon className="h-5 w-5 mr-2 text-gray-400" /> Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center"><IdentificationIcon className="h-5 w-5 mr-2 text-gray-400" /> Username</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.username}</dd>
                    </div>
                  </dl>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center">Loading profile information...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;