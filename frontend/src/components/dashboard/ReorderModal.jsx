export default function ReorderModal({ change, onConfirm, onCancel, isSaving }) {
    if (!change) return null;

    const renderStopList = (stops) => (
        <ul className="list-decimal list-inside text-sm text-gray-600">
            {stops.map(stop => (
                <li key={stop.id} className="py-1">
                    <span className="font-medium text-gray-800">{stop.stop.name}</span> (Order: {stop.stopOrder})
                </li>
            ))}
        </ul>
    );

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-8 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Stop Reorder</h3>
                    <p className="text-gray-600 mb-6">
                        You have changed the order of the stops. Please review the changes below and confirm.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div>
                            <h4 className="font-semibold text-lg mb-2 text-gray-700">Before</h4>
                            <div className="p-3 bg-gray-50 rounded-md border">
                                {renderStopList(change.before)}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-2 text-gray-700">After</h4>
                            <div className="p-3 bg-green-50 rounded-md border border-green-200">
                                {renderStopList(change.after)}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={onCancel}
                            disabled={isSaving}
                            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isSaving}
                            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:bg-indigo-400"
                        >
                            {isSaving ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </div>
                            ) : (
                                'Confirm & Save Changes'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}