import React from 'react';
import { Link } from 'react-router-dom';
import { WebLogo } from '../../assets';

import Button from '../Button';
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Routes', href: '/#routes' },
  { name: 'Schedule', href: '/#schedule' },
  { name: 'About', href: '/#about' }, // Assuming About is a section on the Home page
  { name: 'Contact', href: '/#contact' }, // Assuming Contact is a section on the Home page
];

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 animate-slide-down">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img className="h-8 w-auto" src={WebLogo} alt="UrbanSync Logo" />
              <span className="ml-2 text-xl font-bold text-gray-800">UrbanSync</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <a key={item.name} href={item.href} className="text-blue-900 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-transparent hover:border-yellow-400 hover:text-yellow-500 hover:font-bold transform hover:scale-105 transition-all duration-300">
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <Button to="/login">Login</Button>
          </div>
        </div>
      </nav>
    </header>
  );
}