import React from 'react';

export default function EditButton({ onClick, children = 'Edit' }) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1 text-sm font-medium text-blue-900 rounded-md transition-colors duration-200 hover:bg-blue-900 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            {children}
        </button>
    );
}
