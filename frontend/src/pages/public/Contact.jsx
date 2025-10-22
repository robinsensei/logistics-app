import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon, ChatBubbleLeftEllipsisIcon, MapPinIcon, ShareIcon } from '@heroicons/react/24/outline';

export default function Contact() {
    return (
        <div id="contact" className="bg-gray-50 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
                        Get in Touch with UrbanSync
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-600">
                        We are ready to help you streamline your fleet operations, enhance schedule coordination, and build a smarter urban transport system. Choose the contact method that best fits your inquiry.
                    </p>
                </div>

                {/* Contact Channels */}
                <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out hover:shadow-xl">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <BuildingOffice2Icon className="h-10 w-10 text-blue-900" aria-hidden="true" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-bold text-blue-900">Fleet Management Solutions & Partnerships</h2>
                                <p className="mt-1 text-base text-gray-500">For new client onboarding, pricing, or pilot program collaboration with local governments.</p>
                                <div className="mt-6 space-y-4">
                                    <p className="flex items-center text-base text-gray-700"><EnvelopeIcon className="flex-shrink-0 h-6 w-6 text-gray-400 mr-3" /><span>sales@urbansync.com / partnerships@urbansync.com</span></p>
                                    <p className="flex items-center text-base text-gray-700"><PhoneIcon className="flex-shrink-0 h-6 w-6 text-gray-400 mr-3" /><span>+63 (XX) XXX XXXX</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out hover:shadow-xl">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <ChatBubbleLeftEllipsisIcon className="h-10 w-10 text-blue-900" aria-hidden="true" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-bold text-blue-900">Commuter Feedback & Service Questions</h2>
                                <p className="mt-1 text-base text-gray-500">For passengers seeking information on the commuter interface, trip schedules, or to report an issue with live service updates.</p>
                                <div className="mt-6 space-y-4">
                                    <p className="flex items-center text-base text-gray-700"><EnvelopeIcon className="flex-shrink-0 h-6 w-6 text-gray-400 mr-3" /><span>support@urbansync.com</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location & Follow-up */}
                <div className="mt-16 text-center border-t border-gray-200 pt-16">
                    <h2 className="text-2xl font-bold text-blue-900">Location & Follow-Up</h2>
                    <div className="mt-8 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8">
                        <div className="sm:col-span-1">
                            <div className="flex items-center justify-center">
                                <MapPinIcon className="h-6 w-6 text-blue-900 mr-2" />
                                <h3 className="text-lg font-semibold text-blue-900">UrbanSync Headquarters</h3>
                            </div>
                            <p className="mt-2 text-base text-gray-500">123 Research Blvd., Innovation City, Philippines</p>
                        </div>
                        <div className="sm:col-span-1">
                            <div className="flex items-center justify-center">
                                <ShareIcon className="h-6 w-6 text-blue-900 mr-2" />
                                <h3 className="text-lg font-semibold text-blue-900">Follow Us</h3>
                            </div>
                            <p className="mt-2 text-base text-gray-500">Follow us for updates on AI route optimization and mobile app expansion.</p>
                            {/* TODO: Add actual social media links here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
