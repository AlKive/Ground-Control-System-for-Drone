import React, { useState, useEffect } from 'react';
import type { MissionPlan } from '../types';

interface LoadPlanModalProps {
    onLoad: (plan: MissionPlan) => void;
    onClose: () => void;
}

const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);


const LoadPlanModal: React.FC<LoadPlanModalProps> = ({ onLoad, onClose }) => {
    const [savedPlans, setSavedPlans] = useState<MissionPlan[]>([]);

    useEffect(() => {
        const savedPlansRaw = localStorage.getItem('gcs-mission-plans');
        if (savedPlansRaw) {
            setSavedPlans(JSON.parse(savedPlansRaw));
        }
    }, []);

    const handleDeletePlan = (planIdToDelete: string) => {
        if (!window.confirm("Are you sure you want to delete this mission plan?")) {
            return;
        }
        const updatedPlans = savedPlans.filter(plan => plan.id !== planIdToDelete);
        setSavedPlans(updatedPlans);
        localStorage.setItem('gcs-mission-plans', JSON.stringify(updatedPlans));
    };

    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-white/10 w-full max-w-lg text-left animate-dialog-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Load Mission Plan</h2>
                     <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg max-h-96 overflow-y-auto space-y-2 border border-gray-700">
                    {savedPlans.length > 0 ? (
                        savedPlans.map(plan => (
                            <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                                <div>
                                    <p className="font-semibold text-white">{plan.name}</p>
                                    <p className="text-xs text-gray-400">{plan.waypoints.length} waypoints</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => onLoad(plan)} className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-md transition-colors">Load</button>
                                    <button onClick={() => handleDeletePlan(plan.id!)} className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10 transition-colors" aria-label="Delete Plan">
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-8">No saved mission plans found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoadPlanModal;