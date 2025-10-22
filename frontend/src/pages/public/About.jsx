import React from 'react';
import { LightBulbIcon, CpuChipIcon, WrenchScrewdriverIcon, MapIcon, ClockIcon, ChartBarIcon, UserGroupIcon, ClipboardDocumentListIcon, CodeBracketIcon, DevicePhoneMobileIcon, ServerIcon, CommandLineIcon } from '@heroicons/react/24/outline';

import { Noran, DeLaPena, Ladrera, Sediaco, Domingo } from '../../assets';

const features = [
    {
        name: 'Route Planning and Optimization',
        description: 'Digitize and simplify the creation of efficient travel routes.',
        icon: MapIcon,
    },
    {
        name: 'Real-Time Vehicle Tracking',
        description: 'Utilize GPS integration to enable live updates on vehicle location for better decision-making.',
        icon: CpuChipIcon,
    },
    {
        name: 'Driver Schedule and Dispatch Coordination',
        description: 'Enhance coordination between drivers and dispatchers to reduce confusion and scheduling conflicts.',
        icon: ClockIcon,
    },
    {
        name: 'Admin Dashboard with Analytics',
        description: 'Provide administrators with KPIs, usage trends, and data for strategic planning.',
        icon: ChartBarIcon,
    },
    {
        name: 'Commuter-Facing Interface',
        description: 'Improve the passenger experience through timely information, accurate schedules, and service updates.',
        icon: UserGroupIcon,
    },
];

const teamMembers = [
    {
        name: 'Noran, Leonardo Noserale Jr.',
        role: 'Lead Researcher/Project Manager',
        skills: 'Jira, Confluence, Notion', // Kept for reference, but icons will be used
        skillIcon: ClipboardDocumentListIcon,
        imageUrl: Noran,
    },
    {
        name: 'De La Peña, Rollie Jansen Rojas',
        role: 'Researcher 1/Frontend webdev',
        skills: 'Tailwind, React, Angular',
        skillIcon: CodeBracketIcon,
        imageUrl: DeLaPena,
    },
    {
        name: 'Ladrera, Jose Mariano Luna',
        role: 'Researcher 2/Mobile dev',
        skills: 'Kotlin, React Native, Flutter',
        skillIcon: DevicePhoneMobileIcon,
        imageUrl: Ladrera,
    },
    {
        name: 'Sediaco, Ryan Jay Falcutila',
        role: 'Researcher 3/Backend Dev',
        skills: 'Springboot, Django, Express',
        skillIcon: ServerIcon,
        imageUrl: Sediaco,
    },
    {
        name: 'Domingo, Robinson Carag',
        role: 'Researcher 4/Automation Engineer',
        skills: 'Python, Java, C#',
        skillIcon: CommandLineIcon,
        imageUrl: Domingo,
    },
];

const About = () => {
    return (
        <div className="bg-white py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 1. Introduction */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
                        UrbanSync: Smart Urban Transport Management System
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-700">
                        A web-based transport management platform designed to modernize and streamline the operation of urban vehicle fleets for operators and managers in areas with growing transit demands.
                    </p>
                </div>

                {/* 2. Mission and Vision */}
                <div className="mt-20 max-w-lg sm:mx-auto md:max-w-none">
                    <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
                        <div className="relative flex flex-col gap-6 sm:flex-row md:flex-col lg:flex-row">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-yellow-400 sm:shrink-0">
                                <LightBulbIcon className="h-8 w-8" aria-hidden="true" />
                            </div>
                            <div className="sm:min-w-0 sm:flex-1">
                                <p className="text-lg font-semibold leading-8 text-black">Our Mission & Vision</p>
                                <p className="mt-2 text-base leading-7 text-gray-600">
                                    <strong>Mission:</strong> To develop a smart transport system that streamlines fleet operations.
                                    <br />
                                    <strong>Vision:</strong> To provide a unified digital solution that fundamentally improves urban mobility and efficiency.
                                </p>
                            </div>
                        </div>
                        <div className="relative flex flex-col gap-6 sm:flex-row md:flex-col lg:flex-row">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-yellow-400 sm:shrink-0">
                                <WrenchScrewdriverIcon className="h-8 w-8" aria-hidden="true" />
                            </div>
                            <div className="sm:min-w-0 sm:flex-1">
                                <p className="text-lg font-semibold leading-8 text-black">Key Problems Solved</p>
                                <p className="mt-2 text-base leading-7 text-gray-600">
                                    We address traffic congestion, inefficient operations, uncoordinated schedules, and poor commuter experiences.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Core Features */}
                <div className="mt-24">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">A Comprehensive, All-in-One Solution</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            UrbanSync centralizes operations, monitoring, and customer service.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {features.map((feature) => (
                                <div key={feature.name} className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-black">
                                        <feature.icon className="h-5 w-5 flex-none text-blue-900" aria-hidden="true" />
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                        <p className="flex-auto">{feature.description}</p>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                {/* 4. Technology */}
                <div className="mt-24 text-center">
                    <h2 className="text-2xl font-bold text-blue-900">Technology and Development</h2>
                    <p className="mt-4 text-base leading-7 text-gray-600">
                        Built on a robust technology stack including <span className="font-semibold">React</span>, <span className="font-semibold">Spring Boot</span>, and <span className="font-semibold">MySQL</span>, the platform was developed using the <span className="font-semibold">SCRUM</span> framework for an iterative and responsive approach.
                    </p>
                </div>

                {/* 5. The Team */}
                <div className="mt-20 text-center">
                    <h2 className="text-2xl font-bold text-blue-900">The Researchers and Software Engineers Behind UrbanSync</h2>
                    <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-5">
                        {teamMembers.map((member) => (
                            <div key={member.name} className="group space-y-4 text-center p-4 rounded-lg transition-all duration-300 hover:shadow-xl">
                                <img className="mx-auto h-24 w-24 rounded-full object-cover shadow-md transition-transform duration-300 group-hover:scale-110" src={member.imageUrl} alt={member.name} />
                                <div className="space-y-1">
                                    <div className="relative inline-block">
                                        <p className="font-semibold text-gray-800 transition-all duration-300 group-hover:font-bold group-hover:text-blue-900 group-hover:text-lg">{member.name}</p>
                                        <div className="absolute bottom-full mb-2 w-max max-w-xs left-1/2 -translate-x-1/2 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            {member.skills}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">{member.role}</p>
                                    <div className="flex justify-center items-center h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" title={member.skills}>
                                        <member.skillIcon className="h-6 w-6 text-blue-700" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;