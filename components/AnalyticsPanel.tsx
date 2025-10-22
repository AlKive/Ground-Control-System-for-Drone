import React from 'react';
import type { Mission } from '../types';

// --- Reusable Chart Components ---

const BarChart: React.FC = () => {
    const data = [
        { label: 'Week 1', value: 75 },
        { label: 'Week 2', value: 120 },
        { label: 'Week 3', value: 175 },
        { label: 'Week 4', value: 50 },
    ];
    const maxValue = 200;

    return (
        <div className="h-48 flex items-end justify-around gap-4 p-4">
            {data.map(item => (
                <div key={item.label} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gcs-orange/20 rounded-t-md hover:bg-gcs-orange/40 transition-colors" style={{ height: `${(item.value / maxValue) * 100}%` }}></div>
                    <span className="text-xs text-gray-500 mt-2">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

const LineChart: React.FC = () => {
    const data = [ 25, 20, 75, 80, 150];
    const width = 300;
    const height = 150;
    const maxValue = 175;
    const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d / maxValue) * height}`).join(' ');

    return (
        <div className="h-48 flex items-center justify-center p-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                <polyline fill="none" stroke="#F97316" strokeWidth="3" points={points} />
                <circle cx={(data.length-1) / (data.length - 1) * width} cy={height - (data[data.length-1] / maxValue) * height} r="5" fill="#F97316" />
            </svg>
        </div>
    );
};

const DonutChart: React.FC<{ percentage: number }> = ({ percentage }) => {
    const size = 120;
    const strokeWidth = 15;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    return (
        <div className="relative flex items-center justify-center" style={{width: size, height: size}}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle className="text-gray-200" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size/2} cy={size/2} />
                <circle className="text-gcs-orange"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size/2}
                    cy={size/2}
                    style={{transform: 'rotate(-90deg)', transformOrigin: '50% 50%'}}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                 <span className="text-2xl font-bold">{percentage}%</span>
                 <span className="text-xs text-gray-500">Completed</span>
            </div>
        </div>
    );
};


// --- Main Analytics Panel ---

interface AnalyticsPanelProps {
    missions: Mission[];
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ missions }) => {
    const totalMissions = missions.length;
    const completedMissions = missions.filter(m => m.status === 'Completed').length;
    const successRate = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;
    
    return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Summary Cards */}
            <div className="bg-white p-6 rounded-2xl shadow-sm"><p className="text-sm text-gray-500">Missions Flown</p><p className="text-4xl font-bold mt-2">{totalMissions}</p><p className="text-xs text-gray-400 mt-1">Total Missions Completed</p></div>
            <div className="bg-white p-6 rounded-2xl shadow-sm"><p className="text-sm text-gray-500">Coverage Area</p><p className="text-4xl font-bold mt-2">1,255 <span className="text-2xl">ha</span></p><p className="text-xs text-gray-400 mt-1">Total Area Treated</p></div>
            <div className="bg-white p-6 rounded-2xl shadow-sm"><p className="text-sm text-gray-500">Success Rate</p><p className="text-4xl font-bold mt-2">{successRate}%</p><p className="text-xs text-gray-400 mt-1">Completed Mission Ratio</p></div>

            {/* Charts */}
            <div className="md:col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-lg">Missions Over Time</h3>
                <BarChart />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                 <h3 className="font-bold text-lg">Flight Duration Trend</h3>
                 <LineChart />
            </div>

            {/* Data Cards */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-lg mb-4">Operational & Efficiency</h3>
                <div className="space-y-3 text-sm">
                    <p>Area Covered: <span className="font-semibold float-right">1,550 Hectares</span></p>
                    <p>Spray Efficiency: <span className="font-semibold float-right text-green-600">92%</span></p>
                    <p>Chemical: <span className="font-semibold float-right">15.4 Liters / Mission</span></p>
                    <hr className="my-2"/>
                    <p>Mosquito Reduction: <span className="font-bold float-right text-red-500">28% (Reduction)</span></p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                 <h3 className="font-bold text-lg mb-4">Environmental Data</h3>
                 <div className="h-32 bg-gray-100 flex items-center justify-center rounded-lg">
                    <p className="text-gray-500 text-sm">(Environmental Chart)</p>
                 </div>
                 <p className="text-center text-sm mt-2 text-gray-600">Avg Temp: 28°C / Humidity 75%</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center">
                 <h3 className="font-bold text-lg mb-4">Mission Performance Summary</h3>
                 <DonutChart percentage={successRate} />
                 <button className="w-full mt-auto bg-gcs-orange text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity">
                    Export Report
                 </button>
            </div>

        </div>
    );
};

export default AnalyticsPanel;