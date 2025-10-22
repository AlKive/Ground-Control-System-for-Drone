import React, { useState, useEffect, useRef } from 'react';
import type { OverviewStat, LiveTelemetry, BreedingSiteInfo } from '../types';

const initialOverviewData: Omit<OverviewStat, 'icon'>[] = [
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
    label: 'Battery Health',
    value: '87%',
    subtext: 'Healthy / Not Charging',
  },
];

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
  const missionTimeRef = useRef(0);
  const initialGpsRef = useRef<{ lat: number, lon: number}>(defaultTelemetry.gps);
  const gpsTrackRef = useRef<{ lat: number; lon: number }[]>([]);
  const detectedSitesRef = useRef<BreedingSiteInfo[]>([]);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
        setLiveTelemetry(prev => ({ ...defaultTelemetry, gps: initialGpsRef.current, battery: { voltage: 16.8, percentage: 99 }, gpsTrack: [], detectedSites: [] }));

        simulationInterval = window.setInterval(() => {
            missionTimeRef.current += 1;
            const seconds = missionTimeRef.current;

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
                        voltage: Math.max(12, prev.battery.voltage - (0.005 + Math.random() * 0.002)),
                        percentage: Math.max(0, prev.battery.percentage - (0.1 + Math.random() * 0.05))
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

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = "October 10, 2025";

  return {
    overviewStats: initialOverviewData,
    time: "11:11 am",
    date: formattedDate,
    liveTelemetry,
  };
};