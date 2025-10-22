import React from 'react';
import type { Mission, MissionStatus } from '../types';

interface MissionSummaryProps {
  missions: Mission[];
}

const StatusBadge: React.FC<{ status: MissionStatus }> = ({ status }) => {
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
    const statusClasses = {
        Completed: 'bg-green-100 text-green-800',
        Interrupted: 'bg-orange-100 text-orange-800',
        'In Progress': 'bg-blue-100 text-blue-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
}

const MissionSummary: React.FC<MissionSummaryProps> = ({ missions }) => {
  return (
    <div className="bg-gcs-card p-6 rounded-2xl shadow-sm flex-grow flex flex-col min-h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Mission Summary</h3>
        <select className="bg-white border border-gray-300 rounded-lg py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gcs-orange">
            <option>Status</option>
            <option>Completed</option>
            <option>Interrupted</option>
        </select>
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="text-xs text-gray-500 grid grid-cols-5 gap-4 mb-2 px-4 font-bold uppercase tracking-wider">
            <span>Mission Name</span>
            <span>Date</span>
            <span>Duration</span>
            <span>Status</span>
            <span>Location</span>
        </div>
        <div className="space-y-2 text-sm">
            {missions.map(mission => (
                <div key={mission.id} className="grid grid-cols-5 gap-4 items-center bg-gray-50/50 hover:bg-gray-100 p-4 rounded-lg transition-colors duration-150">
                    <div className="font-semibold text-gcs-text-dark">{mission.name}</div>
                    <div className="text-gray-600">{mission.date}</div>
                    <div className="text-gray-600">{mission.duration}</div>
                    <div><StatusBadge status={mission.status} /></div>
                    <div className="text-gray-600 truncate">{mission.location}</div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MissionSummary;