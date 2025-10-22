import React from 'react';
import type { LiveTelemetry } from '../types';

const TelemetryReadout: React.FC<{ label: string, value: string | React.ReactNode}> = ({label, value}) => (
    <div className="bg-gray-900/50 rounded-md px-3 py-1 text-center">
        <p className="text-xs text-gray-400 uppercase">{label}</p>
        <p className="font-mono text-white font-semibold">{value}</p>
    </div>
);

interface PreFlightPanelProps {
    onMissionSetup: () => void;
    telemetry: LiveTelemetry;
    setArmedState: (isArmed: boolean) => void;
}

const PreFlightPanel: React.FC<PreFlightPanelProps> = ({ onMissionSetup, telemetry, setArmedState }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm h-full flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-gcs-text-dark dark:text-white px-2">Pre-Flight Systems</h3>
                <div className="bg-gray-100 dark:bg-gray-900/50 p-3 my-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-sm dark:text-gray-300">SYSTEM STATUS:</span>
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${telemetry.armed ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                            {telemetry.armed ? 'ARMED' : 'DISARMED'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setArmedState(true)} disabled={telemetry.armed} className="text-xs font-bold bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed">ARM</button>
                        <button onClick={() => setArmedState(false)} disabled={!telemetry.armed} className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed">DISARM</button>
                    </div>
                </div>

                <div className="p-2 space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Telemetry</h4>
                     <div className="grid grid-cols-2 gap-2 mt-2">
                        <TelemetryReadout label="GPS (Lon)" value={telemetry.gps.lon.toFixed(4)} />
                        <TelemetryReadout label="GPS (Lat)" value={telemetry.gps.lat.toFixed(4)} />
                        <TelemetryReadout label="Battery" value={`${telemetry.battery.percentage.toFixed(0)}%`} />
                        <TelemetryReadout label="Flight Mode" value={telemetry.flightMode} />
                    </div>
                </div>
            </div>
            <button
                onClick={onMissionSetup}
                className="w-full mt-6 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 bg-gcs-orange hover:opacity-90 shadow-lg shadow-gcs-orange/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gcs-orange"
            >
                Mission Setup
            </button>
        </div>
    );
};

export default PreFlightPanel;
