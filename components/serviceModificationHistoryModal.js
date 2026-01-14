import {Fragment, useState, useEffect} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import moment from 'moment';

export default function ServiceModificationHistoryModal({isOpen, onClose, serviceId, serviceName}) {
    const [modifications, setModifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && serviceId) {
            fetchModifications();
        }
    }, [isOpen, serviceId]);

    const fetchModifications = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/get-service-modifications?serviceId=${serviceId}`);
            if (response.ok) {
                const data = await response.json();
                setModifications(data.modifications || []);
            } else {
                console.error('Failed to fetch modifications');
            }
        } catch (err) {
            console.error('Error fetching modifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'created':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'updated':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'deleted':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-black dark:bg-opacity-90 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6 max-h-[90vh] overflow-y-auto">
                                <div>
                                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-2">
                                        Modification History
                                    </Dialog.Title>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                        {serviceName}
                                    </p>
                                    
                                    {loading ? (
                                        <div className="text-center py-8">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading history...</p>
                                        </div>
                                    ) : modifications.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">No modification history found.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {modifications.map((mod, index) => (
                                                <div key={mod._id || index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-1 text-xs font-medium rounded ${getActionColor(mod.action)}`}>
                                                                {mod.action.charAt(0).toUpperCase() + mod.action.slice(1)}
                                                            </span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {moment(mod.timestamp).format('MMM D, YYYY [at] h:mm A')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-2">
                                                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                                                            <strong>Modified by:</strong> {mod.modifiedBy?.name || 'Unknown'} ({mod.modifiedBy?.email || 'unknown@email.com'})
                                                        </p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                                            <strong>Summary:</strong> {mod.summary}
                                                        </p>
                                                        
                                                        {mod.changes && mod.changes.length > 0 && (
                                                            <div className="mt-2 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                                                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Changes:</p>
                                                                <ul className="space-y-1">
                                                                    {mod.changes.map((change, idx) => (
                                                                        <li key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                                                                            <strong>{change.field}:</strong> "{change.oldValue || '(empty)'}" → "{change.newValue || '(empty)'}"
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-5 sm:mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        className="py-2 px-4 text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
