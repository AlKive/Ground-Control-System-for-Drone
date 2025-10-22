import React, { useState, useEffect, useRef } from 'react';
import type { OverviewStat, LiveTelemetry, BreedingSiteInfo } from '../types';

const defaultTelemetry: LiveTelemetry = {
    gps: { lat: 34.0522, lon: -118.2437 },
    altitude: 0,
    speed: 0,
    roll: 0,
    pitch: 0,
    heading: 345,
    signalStrength: -55,
    battery: { voltage: 16.8, percentage: 99 },
    satellites: 14,
    flightTime: '00:00',
    distanceFromHome: 0,
    flightMode: 'Loiter',
    armed: false,
    breedingSiteDetected: false,
    detectedSites: [],
    gpsTrack: [],
};

const breedingSiteObjects = {
    Enclosed: ['Flower Pots', 'Discarded Containers', 'Clogged Gutters'],
    Open: ['Stagnant Ponds', 'Construction Puddles', 'Old Tires']
};

export const useDashboardData = (isMissionActive: boolean) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveTelemetry, setLiveTelemetry] = useState<LiveTelemetry>(defaultTelemetry);
  const [battery, setBattery] = useState(98.7);
  
  const missionTimeRef = useRef(0);
  const initialGpsRef = useRef<{ lat: number, lon: number}>(defaultTelemetry.gps);
  const gpsTrackRef = useRef<{ lat: number; lon: number }[]>([]);
  const detectedSitesRef = useRef<BreedingSiteInfo[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      if (!isMissionActive) {
        setBattery(b => Math.max(0, b - 0.0005));
      }

    }, 1000);
    return () => clearInterval(timer);
  }, [isMissionActive]);

  useEffect(() => {
    let simulationInterval: number | undefined;
    
    if (isMissionActive) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                initialGpsRef.current = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                 setLiveTelemetry(prev => ({ ...prev, gps: initialGpsRef.current }));
            }, () => {
                console.warn("Geolocation permission denied. Using default coordinates.");
                initialGpsRef.current = defaultTelemetry.gps;
            });
        }
        
        missionTimeRef.current = 0;
        gpsTrackRef.current = [];
        detectedSitesRef.current = [];
        setLiveTelemetry(prev => ({ 
            ...defaultTelemetry, 
            armed: true,
            gps: initialGpsRef.current, 
            battery: { ...prev.battery, percentage: battery },
            gpsTrack: [], 
            detectedSites: [] 
        }));

        simulationInterval = window.setInterval(() => {
            missionTimeRef.current += 1;
            const seconds = missionTimeRef.current;
            const newBatteryLevel = Math.max(0, battery - (seconds * (0.05 + Math.random() * 0.01)));
            setBattery(newBatteryLevel);

            setLiveTelemetry(prev => {
                const newLat = initialGpsRef.current.lat + Math.sin(seconds / 20) * 0.0005;
                const newLon = initialGpsRef.current.lon + Math.cos(seconds / 20) * 0.0005;
                const newGps = { lat: newLat, lon: newLon };
                gpsTrackRef.current.push(newGps);
                
                const breedingSiteDetected = (seconds % 25 > 10 && seconds % 25 < 14);
                let currentBreedingSite: BreedingSiteInfo | undefined = undefined;

                if (breedingSiteDetected) {
                    if (!prev.breedingSiteDetected) { // New detection
                        const type = Math.random() > 0.5 ? 'Enclosed' : 'Open';
                        const objects = breedingSiteObjects[type];
                        const object = objects[Math.floor(Math.random() * objects.length)];
                        currentBreedingSite = { type, object };
                        detectedSitesRef.current.push(currentBreedingSite);
                    } else {
                        currentBreedingSite = prev.currentBreedingSite; // Ongoing detection
                    }
                }

                return {
                    ...prev,
                    gps: newGps,
                    altitude: 50 + Math.sin(seconds / 10) * 5 + (Math.random() - 0.5) * 2,
                    speed: 10 + Math.cos(seconds/5) * 2 + (Math.random() - 0.5) * 1.5,
                    roll: Math.sin(seconds / 2) * 5 + (Math.random() - 0.5),
                    pitch: Math.cos(seconds / 3) * 3 + (Math.random() - 0.5),
                    heading: (prev.heading + 0.5 + (Math.random() - 0.5)) % 360,
                    battery: {
                        voltage: Math.max(12, 12 + (newBatteryLevel/100) * 4.8),
                        percentage: newBatteryLevel
                    },
                    flightTime: new Date(seconds * 1000).toISOString().substr(14, 5),
                    distanceFromHome: Math.sqrt(Math.pow(seconds * 2, 2) + Math.pow(seconds,2)),
                    armed: true,
                    flightMode: 'Loiter',
                    breedingSiteDetected,
                    currentBreedingSite,
                    detectedSites: [...detectedSitesRef.current],
                    gpsTrack: [...gpsTrackRef.current],
                };
            });
        }, 1000);
    }
    
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    }
  }, [isMissionActive]);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const formattedDate = currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const overviewStats: Omit<OverviewStat, 'icon'>[] = [
      {
        id: 'flights',
        label: 'Total Flights',
        value: '12 Flights',
        subtext: 'Completed Missions',
      },
      {
        id: 'flightTime',
        label: 'Total Flight Time',
        value: '6.7 Hours',
        subtext: 'Accumulated drone flight duration',
      },
      {
        id: 'battery',
        label: 'System Battery',
        value: `${battery.toFixed(1)}%`,
        subtext: battery > 20 ? 'Healthy' : 'Low',
      },
  ];

  return {
    overviewStats,
    time: formattedTime,
    date: formattedDate,
    liveTelemetry: { ...liveTelemetry, battery: { ...liveTelemetry.battery, percentage: battery } },
  };
};