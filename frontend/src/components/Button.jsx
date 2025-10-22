import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ children, to, onClick, type = 'button', className = '', disabled = false, variant = 'default' }) => {
    const baseStyles = 'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    let themeStyles = '';
    switch (variant) {
        case 'subscribe':
            themeStyles = 'bg-yellow-400 text-blue-900 font-semibold shadow-sm hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/50 hover:font-bold focus:ring-yellow-500 disabled:bg-gray-400';
            break;
        case 'cancel':
            themeStyles = 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400';
            break;
        default: // 'default'
            themeStyles = 'bg-blue-900 text-yellow-400 hover:bg-blue-800 focus:ring-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed';
            break;
    }

    const combinedClassName = `${baseStyles} ${themeStyles} ${className}`;

    if (to) {
        return (
            <Link to={to} className={combinedClassName}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={combinedClassName}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;