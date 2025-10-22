import React from 'react';
import OverviewCard from './AttitudeIndicator';
import MissionSummary from './MapView';
import PerformanceMetrics from './Gauge';
import TelemetryData from './VideoFeed';
import ActionButtons from './MessageConsole';
import type { OverviewStat, Mission } from '../types';

// SVG Icons for Overview Cards
const DroneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gcs-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5,9A7.5,7.5,0,1,1,12,1.5,7.5,7.5,0,0,1,19.5,9Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9 L12 22.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9 L1.5 9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9 L22.5 9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9 L6.3 3.3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9 L17.7 3.3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9 L6.3 14.7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9 L17.7 14.7" />
    </svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gcs-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const BatteryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gcs-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

interface DashboardViewProps {
    overviewStats: Omit<OverviewStat, 'icon'>[];
    missions: Mission[];
    onStartMission: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ overviewStats: rawStats, missions, onStartMission }) => {
    const icons: { [key: string]: React.ReactNode } = {
        flights: <DroneIcon />,
        flightTime: <ClockIcon />,
        battery: <BatteryIcon />,
    };
    const overviewStats: OverviewStat[] = rawStats.map(stat => ({ ...stat, icon: icons[stat.id] || <div /> }));

    return (
        <>
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gcs-text-dark">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
                    {overviewStats.map(stat => (
                        <OverviewCard key={stat.id} {...stat} />
                    ))}
                </div>
            </div>

            <div className="mt-8 flex-grow flex flex-col lg:flex-row gap-8">
                <div className="flex-[2] flex flex-col min-w-0">
                    <MissionSummary missions={missions} />
                    <ActionButtons onStartMission={onStartMission} />
                </div>
                <div className="flex-1 flex flex-col gap-8">
                    <PerformanceMetrics />
                    <TelemetryData />
                </div>
            </div>
        </>
    );
};

export default DashboardView;