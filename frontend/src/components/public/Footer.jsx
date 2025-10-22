import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';

const companyLinks = [
    { name: 'About Us', href: '/#about' },
    { name: 'Our Solution & Benefits', href: '/#solution' }, // Assuming a section with this ID exists
    { name: 'Technology Stack', href: '/#about' }, // Linking to the tech part of the about section
];

const supportLinks = [
    { name: 'Contact Us', href: '/#contact' },
    { name: 'Commuter Feedback', href: '/#contact', tooltip: null },
    { name: 'Passenger Portal Login', href: '#', tooltip: 'Under Construction' },
    { name: 'Admin Portal', href: '/login', tooltip: null },
];

const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Research & References', href: '#' },
    { name: 'Future Roadmap', href: '#' },
];

const Tooltip = ({ children, text }) => {
    if (!text) return <>{children}</>;
    return (
        <div className="relative group inline-block">
            {children}
            <div className="absolute bottom-full mb-2 w-max max-w-xs left-1/2 -translate-x-1/2 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900" />
            </div>
        </div>
    );
};

export default function Footer() {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setShowModal(true);
            setEmail('');
        }
    };

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Column */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">UrbanSync</h3>
                        <p className="text-sm text-gray-400">
                            Smart Urban Transport Management System for a faster, more reliable urban mobility experience.
                        </p>
                        <ul className="mt-4 space-y-2">
                            {companyLinks.map((item) => (
                                <li key={item.name}>
                                    <Tooltip text={item.name === 'Our Solution & Benefits' ? 'Under Construction' : null}>
                                        <a href={item.href} className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                                            {item.name}
                                        </a>
                                    </Tooltip>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support & Access Column */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">Support & Access</h3>
                        <ul className="mt-4 space-y-2">
                            {supportLinks.map((item) => (
                                <li key={item.name}>
                                    <Tooltip text={item.tooltip}>
                                        <a href={item.href} className={`text-sm text-gray-400 hover:text-indigo-400 transition-colors ${item.tooltip ? 'cursor-not-allowed' : ''}`}>
                                            {item.name}
                                        </a>
                                    </Tooltip>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal & Research Column */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">Legal & Research</h3>
                        <ul className="mt-4 space-y-2">
                            {legalLinks.map((item) => (
                                <li key={item.name}>
                                    <Tooltip text="Under Construction">
                                        <a href={item.href} className="text-sm text-gray-400 hover:text-indigo-400 transition-colors cursor-not-allowed">
                                            {item.name}
                                        </a>
                                    </Tooltip>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Stay Connected Column */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">Stay Connected</h3>
                        <div className="flex space-x-4 mt-4">
                            <Tooltip text="Under Construction">
                                <a href="#" className="text-gray-400 hover:text-indigo-400 cursor-not-allowed"><span className="sr-only">LinkedIn</span><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg></a>
                            </Tooltip>
                            <Tooltip text="Under Construction">
                                <a href="#" className="text-gray-400 hover:text-indigo-400 cursor-not-allowed"><span className="sr-only">Facebook</span><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg></a>
                            </Tooltip>
                            <Tooltip text="Under Construction">
                                <a href="#" className="text-gray-400 hover:text-indigo-400 cursor-not-allowed"><span className="sr-only">Twitter</span><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.299 1.634 4.21 3.808 4.649-.6.162-1.224.208-1.86.086.635 1.891 2.448 3.268 4.6 3.304-2.054 1.615-4.543 2.573-7.288 2.573-.473 0-.94-.027-1.402-.083 2.645 1.7 5.798 2.688 9.142 2.688 10.972 0 16.982-9.094 16.982-16.982 0-.259-.007-.518-.02-.774.94-.688 1.763-1.558 2.423-2.527z" /></svg></a>
                            </Tooltip>
                        </div>
                        <p className="text-sm text-gray-400 mt-4">Subscribe for updates on mobile app expansion:</p>
                        <form onSubmit={handleSubscribe} className="mt-2 flex">
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input type="email" name="email-address" id="email-address" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:w-64 sm:text-sm sm:leading-6" placeholder="Your email" />
                            <Tooltip text="Under Construction">
                                <Button type="submit" variant="subscribe" className="ml-2 flex-none px-3 py-1.5">Subscribe</Button>
                            </Tooltip>
                        </form>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-700 pt-8">
                    <p className="text-sm text-gray-400 text-center">&copy; 2025 UrbanSync. All rights reserved. | Developed by the UrbanSync Research Group.</p>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                        <h3 className="text-xl font-bold text-gray-900">Thank You!</h3>
                        <p className="mt-2 text-gray-600">Thanks for subscribing to our newsletter.</p>
                        <Button onClick={() => setShowModal(false)} className="mt-6">Close</Button>
                    </div>
                </div>
            )}
        </footer>
    );
}