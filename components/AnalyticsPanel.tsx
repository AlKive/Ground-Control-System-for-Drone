import React, { useMemo } from 'react';
import type { Mission } from '../types';

// --- Reusable Chart Components ---

const BarChart: React.FC<{ missions: Mission[] }> = ({ missions }) => {
    const weeklyData = useMemo(() => {
        const now = new Date();
        const data = [
            { label: '3 Wks Ago', value: 0 },
            { label: '2 Wks Ago', value: 0 },
            { label: 'Last Wk', value: 0 },
            { label: 'This Wk', value: 0 },
        ];
        
        missions.forEach(mission => {
            const missionDate = new Date(mission.date);
            if (missionDate > now) return; // Ignore future-dated missions
            const diffTime = now.getTime() - missionDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 0 && diffDays < 7) {
                data[3].value++;
            } else if (diffDays >= 7 && diffDays < 14) {
                data[2].value++;
            } else if (diffDays >= 14 && diffDays < 21) {
                data[1].value++;
            } else if (diffDays >= 21 && diffDays < 28) {
                data[0].value++;
            }
        });

        return data;
    }, [missions]);

    const maxValue = Math.max(...weeklyData.map(d => d.value), 1) * 1.2;

    if (missions.length === 0) {
        return (
            <div className="h-48 flex items-center justify-center p-4 text-gray-500">
                No mission data to display.
            </div>
        )
    }

    return (
        <div className="h-48 flex items-end justify-around gap-4 p-4">
            {weeklyData.map(item => (
                <div key={item.label} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full h-full flex items-end">
                       <div className="w-full bg-gcs-orange/20 rounded-t-md hover:bg-gcs-orange/40 transition-colors" style={{ height: `${(item.value / maxValue) * 100}%` }}>
                           <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-sm font-bold text-gcs-text-dark dark:text-white">{item.value}</span>
                       </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

const parseDuration = (duration: string): number => {
    const parts = duration.split(' ');
    const value = parseInt(parts[0], 10);
    if (isNaN(value)) return 0;
    
    if (parts[1].startsWith('min')) return value;
    if (parts[1].startsWith('sec')) return value / 60;
    return 0;
};

const LineChart: React.FC<{ missions: Mission[] }> = ({ missions }) => {
    const data = useMemo(() => {
        return missions
            .slice(0, 10)
            .reverse()
            .map(m => parseDuration(m.duration));
    }, [missions]);
    
    if (data.length < 2) {
        return (
            <div className="h-48 flex items-center justify-center p-4 text-gray-500">
                Not enough mission data to display trend.
            </div>
        )
    }

    const width = 300;
    const height = 150;
    const maxValue = Math.max(...data, 1) * 1.1;
    const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d / maxValue) * height}`).join(' ');

    return (
        <div className="h-48 flex items-center justify-center p-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                <polyline fill="none" stroke="#F97316" strokeWidth="3" points={points} />
                {data.map((d, i) => (
                    <circle key={i} cx={(i / (data.length - 1)) * width} cy={height - (d / maxValue) * height} r="4" fill="#F97316" className="opacity-50 hover:opacity-100" />
                ))}
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
                <circle className="text-gray-200 dark:text-gray-600" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size/2} cy={size/2} />
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
                 <span className="text-2xl font-bold dark:text-white">{percentage}%</span>
                 <span className="text-xs text-gray-500 dark:text-gray-400">Completed</span>
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm"><p className="text-sm text-gray-500 dark:text-gray-400">Missions Flown</p><p className="text-4xl font-bold mt-2 dark:text-white">{totalMissions}</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Total Missions Completed</p></div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm"><p className="text-sm text-gray-500 dark:text-gray-400">Coverage Area</p><p className="text-4xl font-bold mt-2 dark:text-white">1,255 <span className="text-2xl">ha</span></p><p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Total Area Treated</p></div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm"><p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p><p className="text-4xl font-bold mt-2 dark:text-white">{successRate}%</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Completed Mission Ratio</p></div>

            {/* Charts */}
            <div className="md:col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-lg dark:text-white">Missions Over Time (Last 4 Weeks)</h3>
                <BarChart missions={missions} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                 <h3 className="font-bold text-lg dark:text-white">Flight Duration Trend (Last 10)</h3>
                 <LineChart missions={missions} />
            </div>

            {/* Data Cards */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-lg mb-4 dark:text-white">Operational & Efficiency</h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <p>Area Covered: <span className="font-semibold float-right dark:text-gray-100">1,550 Hectares</span></p>
                    <p>Spray Efficiency: <span className="font-semibold float-right text-green-600">92%</span></p>
                    <p>Chemical: <span className="font-semibold float-right dark:text-gray-100">15.4 Liters / Mission</span></p>
                    <hr className="my-2 dark:border-gray-700"/>
                    <p>Mosquito Reduction: <span className="font-bold float-right text-red-500">28% (Reduction)</span></p>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                 <h3 className="font-bold text-lg mb-4 dark:text-white">Environmental Data</h3>
                 <div className="h-32 bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">(Environmental Chart)</p>
                 </div>
                 <p className="text-center text-sm mt-2 text-gray-600 dark:text-gray-400">Avg Temp: 28°C / Humidity 75%</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex flex-col items-center">
                 <h3 className="font-bold text-lg mb-4 dark:text-white">Mission Performance Summary</h3>
                 <DonutChart percentage={successRate} />
                 <button className="w-full mt-auto bg-gcs-orange text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity">
                    Export Report
                 </button>
            </div>

        </div>
    );
};

export default AnalyticsPanel;