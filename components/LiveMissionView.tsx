import React, { useState } from 'react';
import type { LiveTelemetry, BreedingSiteInfo } from '../types';
import CameraFeed from './CameraFeed';
import FlightControls from './FlightControls';

interface LiveMissionViewProps {
  telemetry: LiveTelemetry;
  onEndMission: (duration: string, gpsTrack: { lat: number; lon: number }[], detectedSites: BreedingSiteInfo[]) => void;
}

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const LiveMissionView: React.FC<LiveMissionViewProps> = ({ telemetry, onEndMission }) => {
  const [isConfirmingEndMission, setConfirmingEndMission] = useState(false);
  
  return (
    <div className="fixed inset-0 bg-gcs-dark bg-opacity-95 backdrop-blur-sm z-50 flex flex-col p-6 text-gcs-text-light font-sans animate-fade-in">
      <header className="flex justify-between items-center pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Live Mission: <span className="text-gcs-orange">Sector 7G</span></h1>
        <div className="flex items-center gap-6">
            <div className="text-center">
                <p className="text-xs text-gray-400">MISSION TIME</p>
                <p className="text-lg font-mono tracking-widest">{telemetry.flightTime}</p>
            </div>
            <button onClick={() => setConfirmingEndMission(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
                End Mission
            </button>
        </div>
      </header>
      
      <main className="flex-1 flex gap-6 mt-6 overflow-hidden">
        <div className="flex-[3] flex flex-col gap-4">
            <div className="flex-1 bg-black rounded-2xl overflow-hidden relative">
                <CameraFeed telemetry={telemetry} />
            </div>
            {telemetry.breedingSiteDetected && telemetry.currentBreedingSite && (
                <div className="bg-yellow-400/80 border border-yellow-600 text-yellow-900 px-4 py-3 rounded-lg flex items-center gap-3 animate-pulse">
                    <AlertIcon />
                    <span className="font-bold">Alert:</span> Potential Site Detected - {telemetry.currentBreedingSite.type} ({telemetry.currentBreedingSite.object}).
                </div>
            )}
        </div>
        <aside className="flex-1 flex flex-col gap-6">
            <FlightControls telemetry={telemetry} />
        </aside>
      </main>

      {isConfirmingEndMission && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-60" aria-modal="true" role="dialog">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-white/10 max-w-sm text-center animate-dialog-in">
                <h2 className="text-xl font-bold text-white mb-3">Confirm End Mission</h2>
                <p className="text-gray-300 mb-6">Are you sure you want to end the current mission?</p>
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={() => setConfirmingEndMission(false)} 
                        className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => onEndMission(telemetry.flightTime, telemetry.gpsTrack, telemetry.detectedSites)} 
                        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// Animations for the view and dialog
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
    from { opacity: 0; transform: scale(0.98); }
    to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
}
@keyframes dialog-in {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-dialog-in {
    animation: dialog-in 0.2s ease-out forwards;
}
`;
document.head.appendChild(style);


export default LiveMissionView;