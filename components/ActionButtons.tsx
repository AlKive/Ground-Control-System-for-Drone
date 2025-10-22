import React from 'react';

interface ActionButtonsProps {
    onMissionSetup: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onMissionSetup }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm h-full flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-gcs-text-dark dark:text-white">Ready Room</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                    Prepare and configure your next flight. Create a flight path, run pre-flight checks, and launch when ready.
                </p>
            </div>
            <button
                onClick={onMissionSetup}
                className="w-full mt-6 text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 bg-gcs-orange hover:opacity-90 shadow-lg shadow-gcs-orange/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gcs-orange"
            >
                Mission Setup
            </button>
        </div>
    );
};

export default ActionButtons;