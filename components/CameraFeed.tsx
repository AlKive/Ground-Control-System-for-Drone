import React, { useEffect, useRef } from 'react';
import type { LiveTelemetry } from '../types';

interface CameraFeedProps {
    telemetry: LiveTelemetry;
}

const HUDValue: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
    <div>
        <p className="text-xs text-gcs-orange opacity-80">{label}</p>
        <p className="font-mono text-lg tracking-wider text-white">
            {value}
            {unit && <span className="text-sm ml-1 opacity-70">{unit}</span>}
        </p>
    </div>
);

const Compass: React.FC<{ heading: number }> = ({ heading }) => {
    const markers = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-black/30 rounded-lg backdrop-blur-sm flex items-center justify-center overflow-hidden">
            <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gcs-orange z-10"></div>
            <div className="flex transition-transform duration-100 ease-linear" style={{ transform: `translateX(${-heading * 2}px)`}}>
                {[...Array(360)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center justify-end h-10 w-2 mx-2 text-white font-mono">
                        {i % 45 === 0 ? <span className="text-lg">{markers[i/45]}</span> : i % 10 === 0 ? '|' : '.'}
                    </div>
                ))}
            </div>
        </div>
    );
};

const MiniMap: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
    return (
        <div className="absolute top-4 right-4 w-48 h-48 rounded-lg border-2 border-white/30 overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1542435520-2504a3771520?q=80&w=400&auto=format&fit=crop" alt="Satellite map view" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Drone Indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <div className="w-3 h-3 bg-gcs-orange rounded-full animate-ping"></div>
                 <div className="w-3 h-3 bg-gcs-orange rounded-full absolute top-0 left-0 border-2 border-white"></div>
            </div>
            <div className="absolute bottom-2 left-2 text-xs font-mono text-white/90 bg-black/50 px-1 rounded">
                <p>{lat.toFixed(4)}</p>
                <p>{lon.toFixed(4)}</p>
            </div>
        </div>
    );
};


const CameraFeed: React.FC<CameraFeedProps> = ({ telemetry }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let stream: MediaStream;
        const startCamera = async () => {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
            
            {/* HUD Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between font-mono">
                    <HUDValue label="LAT" value={telemetry.gps.lat.toFixed(6)} />
                    <HUDValue label="LON" value={telemetry.gps.lon.toFixed(6)} />
                </div>

                <div className="flex justify-between">
                    <div className="text-right">
                         <HUDValue label="ALT" value={telemetry.altitude.toFixed(1)} unit="m" />
                    </div>
                   <div className="text-right">
                         <HUDValue label="SPD" value={telemetry.speed.toFixed(1)} unit="m/s" />
                    </div>
                </div>
            </div>
            
            <MiniMap lat={telemetry.gps.lat} lon={telemetry.gps.lon} />
            <Compass heading={telemetry.heading} />
        </>
    );
};

export default CameraFeed;