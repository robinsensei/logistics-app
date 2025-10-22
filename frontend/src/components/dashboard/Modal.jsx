import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function Modal({ message, type = 'success', onClose }) {
    if (!message) return null;

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
    const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
    const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className={`relative mx-auto p-8 border w-96 shadow-lg rounded-md bg-white ${bgColor}`}>
                <div className="text-center">
                    <Icon className={`w-12 h-12 mx-auto mb-4 ${textColor}`} />
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {isSuccess ? 'Success' : 'Error'}
                    </h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-600">{message}</p>
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-indigo-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}