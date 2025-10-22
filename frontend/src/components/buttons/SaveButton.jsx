import React from 'react';

export default function SaveButton({ onClick, type = 'submit', disabled = false, children = 'Save' }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="px-4 py-2 text-sm font-medium bg-blue-900 text-yellow-400 rounded-md transition-all duration-200 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            {children}
        </button>
    );
}
