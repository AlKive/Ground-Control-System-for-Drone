import React from 'react';
import type { LiveTelemetry } from '../types';

const TelemetryItem: React.FC<{ label: string; value: string | number; unit?: string; icon: React.ReactNode }> = ({ label, value, unit, icon }) => (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
        <div className="flex items-center gap-3">
            <div className="text-gcs-orange">{icon}</div>
            <span className="text-sm text-gray-300">{label}</span>
        </div>
        <span className="font-mono text-white">
            {value}
            <span className="text-xs ml-1 opacity-70">{unit}</span>
        </span>
    </div>
);

const AttitudeIndicator: React.FC<{ roll: number; pitch: number }> = ({ roll, pitch }) => {
    return (
        <div className="relative w-40 h-40 mx-auto mt-2">
            <div className="relative w-full h-full overflow-hidden rounded-full border-2 border-white/30">
                {/* Sky and Ground */}
                <div
                    className="absolute w-full h-[200%] top-[-50%] left-0 transition-transform duration-100 ease-linear"
                    style={{ transform: `translateY(${-pitch * 1.5}px) rotate(${-roll}deg)` }}
                >
                    <div className="h-1/2 bg-sky-400"></div>
                    <div className="h-1/2 bg-yellow-800"></div>
                </div>
                {/* Horizon Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white opacity-80" style={{ transform: `translateY(${-pitch * 1.5}px) rotate(${-roll}deg)` }}></div>

                 {/* Aircraft Symbol */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-12">
                         <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 25 L30 35 M50 25 L70 35 M50 25 L50 0 M 0 25 H 100" stroke="#F97316" strokeWidth="3" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Icons
const SignalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.556a8.889 8.889 0 0111.112-1.41M5.556 12.889a13.333 13.333 0 0116.11-2.044M3 9.222a17.778 17.778 0 0120.222-2.388M12 18.222h.01" /></svg>;
const BatteryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const SatelliteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;


const FlightControls: React.FC<{ telemetry: LiveTelemetry }> = ({ telemetry }) => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex flex-col gap-5 h-full overflow-y-auto">
            {/* Status Indicators */}
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className={`p-3 rounded-lg ${telemetry.armed ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                    <p className="text-xs opacity-80">STATUS</p>
                    <p className="font-bold text-lg">{telemetry.armed ? 'ARMED' : 'DISARMED'}</p>
                </div>
                <div className="p-3 bg-blue-500/80 rounded-lg">
                    <p className="text-xs opacity-80">FLIGHT MODE</p>
                    <p className="font-bold text-lg">{telemetry.flightMode}</p>
                </div>
            </div>

            {/* Command Buttons */}
            <div>
                 <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Commands</h3>
                 <div className="grid grid-cols-2 gap-3">
                     <button className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors">Take Off</button>
                     <button className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors">Land</button>
                     <button className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors">Hold Position</button>
                     <button className="bg-gcs-orange/80 hover:bg-gcs-orange p-3 rounded-lg transition-colors font-bold">Return to Launch</button>
                 </div>
            </div>

            {/* Live Telemetry Data */}
            <div>
                 <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2 mt-2">Telemetry</h3>
                 <div className="space-y-2">
                    <TelemetryItem label="Signal Strength" value={telemetry.signalStrength} unit="dBm" icon={<SignalIcon />} />
                    <TelemetryItem label="Battery" value={`${telemetry.battery.percentage.toFixed(1)}%`} unit={`${telemetry.battery.voltage.toFixed(1)}V`} icon={<BatteryIcon />} />
                    <TelemetryItem label="Satellites" value={telemetry.satellites} icon={<SatelliteIcon />} />
                    <TelemetryItem label="Dist. from Home" value={telemetry.distanceFromHome.toFixed(0)} unit="m" icon={<HomeIcon />} />
                 </div>
            </div>

            {/* Attitude Indicator */}
            <div className="mt-auto pt-4">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2 text-center">Attitude</h3>
                 <AttitudeIndicator roll={telemetry.roll} pitch={telemetry.pitch} />
            </div>
        </div>
    );
};

export default FlightControls;