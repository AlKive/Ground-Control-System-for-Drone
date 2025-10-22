import React from 'react';

interface ActionButtonsProps {
  onStartMission: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onStartMission }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <button className="w-full text-gcs-orange font-bold py-4 px-4 rounded-xl transition-all duration-200 bg-gcs-orange/10 hover:bg-gcs-orange/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gcs-orange">
                Mission Setup
            </button>
            <button 
                onClick={onStartMission}
                className="w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 bg-gcs-orange hover:opacity-90 shadow-lg shadow-gcs-orange/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gcs-orange"
            >
                Start Mission
            </button>
        </div>
    );
}

export default ActionButtons;
