import React from 'react';

export default function DeleteButton({ onClick, children = 'Delete' }) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1 text-sm font-medium text-red-600 rounded-md transition-colors duration-200 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
            {children}
        </button>
    );
}