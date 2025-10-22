import React, { useState, useMemo, useEffect } from 'react';
import type { Mission, MissionStatus } from '../types';

interface MapViewProps {
    track: { lat: number; lon: number }[];
}

const MapView: React.FC<MapViewProps> = ({ track }) => {
    const width = 500;
    const height = 500;
    const padding = 20;

    const points = useMemo(() => {
        if (!track || track.length === 0) return '';

        const lats = track.map(p => p.lat);
        const lons = track.map(p => p.lon);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);

        const latRange = maxLat - minLat || 1;
        const lonRange = maxLon - minLon || 1;
        
        const scale = Math.min((width - padding * 2) / lonRange, (height - padding * 2) / latRange);

        const lonOffset = (width - lonRange * scale) / 2;
        const latOffset = (height - latRange * scale) / 2;


        return track
            .map(p => {
                const x = ((p.lon - minLon) * scale) + lonOffset;
                const y = ((maxLat - p.lat) * scale) + latOffset;
                return `${x},${y}`;
            })
            .join(' ');
    }, [track, width, height, padding]);
    
    const lastPoint = track && track.length > 0 ? track[track.length - 1] : null;

    return (
         <div className="relative w-full h-full bg-gray-700 rounded-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1542435520-2504a3771520?q=80&w=800&auto-format&fit=crop" alt="Satellite map background" className="absolute inset-0 w-full h-full object-cover opacity-50"/>
            {points && (
                 <svg className="absolute inset-0" viewBox={`0 0 ${width} ${height}`}>
                    <polyline points={points} fill="none" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Start point */}
                    <circle cx={points.split(' ')[0].split(',')[0]} cy={points.split(' ')[0].split(',')[1]} r="5" fill="#4ade80" />
                </svg>
            )}
            {!points && <div className="flex items-center justify-center h-full text-gray-400">No GPS Track Available</div>}
             {lastPoint && (
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-mono p-1.5 rounded">
                    <p>Lat: {lastPoint.lat.toFixed(6)}</p>
                    <p>Lon: {lastPoint.lon.toFixed(6)}</p>
                </div>
            )}
        </div>
    );
};

const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
);
const FilterIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L12 14.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 016 17V14.414L3.293 6.707A1 1 0 013 6V4z"></path></svg>
);


interface FlightLogsPanelProps {
    missions: Mission[];
}

const FlightLogsPanel: React.FC<FlightLogsPanelProps> = ({ missions }) => {
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | MissionStatus>('All');
    const [breedingSiteFilter, setBreedingSiteFilter] = useState<'All' | 'Has Detections' | 'No Detections'>('All');
    const [showFilters, setShowFilters] = useState(false);

    const filtersAreActive = statusFilter !== 'All' || breedingSiteFilter !== 'All';

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('All');
        setBreedingSiteFilter('All');
    };

    const filteredMissions = useMemo(() => {
        return missions.filter(mission => {
            const matchesSearch = searchTerm === '' ||
                mission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mission.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mission.location.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'All' || mission.status === statusFilter;

            const hasDetections = mission.detectedSites && mission.detectedSites.length > 0;
            const matchesBreedingSite = breedingSiteFilter === 'All' ||
                (breedingSiteFilter === 'Has Detections' && hasDetections) ||
                (breedingSiteFilter === 'No Detections' && !hasDetections);
                
            return matchesSearch && matchesStatus && matchesBreedingSite;
        });
    }, [missions, searchTerm, statusFilter, breedingSiteFilter]);

    useEffect(() => {
        if (!selectedMission || !filteredMissions.some(m => m.id === selectedMission.id)) {
             setSelectedMission(filteredMissions[0] || null);
        }
    }, [filteredMissions, selectedMission]);

    const handleDownloadGpx = () => {
        if (!selectedMission || !selectedMission.gpsTrack || selectedMission.gpsTrack.length === 0) {
            return;
        }

        const trackpoints = selectedMission.gpsTrack
            .map(p => `    <trkpt lat="${p.lat.toFixed(6)}" lon="${p.lon.toFixed(6)}"></trkpt>`)
            .join('\n');

        const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Ground Control System" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Mission ${selectedMission.name} Track</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>${selectedMission.name}</name>
    <trkseg>
${trackpoints}
    </trkseg>
  </trk>
</gpx>`;

        const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mission-${selectedMission.id}-track.gpx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="mt-8 flex-grow flex gap-6 animate-fade-in h-[calc(100%-100px)]">
            <div className="w-1/3 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex flex-col">
                <h2 className="text-xl font-bold mb-4 px-2 dark:text-white">Mission History</h2>
                <div className="px-2 mb-4">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search missions..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gcs-orange dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <SearchIcon />
                        </div>
                    </div>
                    <div className="mt-2">
                        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gcs-orange dark:text-gray-400 dark:hover:text-gcs-orange">
                           <FilterIcon /> 
                           <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
                           {filtersAreActive && <span className="w-2 h-2 bg-gcs-orange rounded-full ml-1 animate-pulse"></span>}
                        </button>
                    </div>
                     {showFilters && (
                        <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600 animate-fade-in-sm">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Filter Options</h4>
                                {filtersAreActive && (
                                    <button 
                                        onClick={handleClearFilters} 
                                        className="text-xs text-gcs-orange hover:underline font-semibold"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Status</label>
                                <div className="flex flex-wrap gap-2">
                                    {(['All', 'Completed', 'Interrupted'] as const).map(status => (
                                         <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1 text-xs rounded-full transition-colors ${statusFilter === status ? 'bg-gcs-orange text-white font-bold' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'}`}>
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Breeding Sites</label>
                                 <select onChange={(e) => setBreedingSiteFilter(e.target.value as any)} value={breedingSiteFilter} className="w-full p-2 border bg-white border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gcs-orange dark:bg-gray-600 dark:border-gray-500 dark:text-white">
                                     <option value="All">All Missions</option>
                                     <option value="Has Detections">Has Detections</option>
                                     <option value="No Detections">No Detections</option>
                                 </select>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="overflow-y-auto space-y-2 pr-2 flex-grow">
                    {filteredMissions.map(mission => (
                        <button key={mission.id} 
                            onClick={() => setSelectedMission(mission)}
                            className={`w-full text-left p-4 rounded-lg transition-colors ${selectedMission?.id === mission.id ? 'bg-gcs-orange/10 text-gcs-orange' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                        >
                            <p className="font-bold dark:text-gray-200">{mission.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{mission.date} - {mission.duration}</p>
                            <p className={`text-xs font-semibold mt-1 ${mission.status === 'Completed' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>{mission.status}</p>
                        </button>
                    ))}
                     {filteredMissions.length === 0 && (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                            <p>No missions found.</p>
                            <p className="text-xs">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mission Details */}
            <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex flex-col">
                 {selectedMission ? (
                    <>
                        <h2 className="text-2xl font-bold mb-1 dark:text-white">{selectedMission.name} Details</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{selectedMission.date}</p>
                        <div className="flex-grow min-h-0">
                             <MapView track={selectedMission.gpsTrack || []} />
                        </div>

                        {selectedMission.detectedSites && selectedMission.detectedSites.length > 0 && (
                            <div className="mt-4 pt-4 border-t dark:border-gray-700">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Detected Breeding Sites</h3>
                                <div className="space-y-2 max-h-24 overflow-y-auto bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border dark:border-gray-600">
                                    {selectedMission.detectedSites.map((site, index) => (
                                        <div key={index} className="text-sm dark:text-gray-200">
                                            <span className={`font-semibold px-2 py-0.5 rounded-full text-xs mr-2 ${site.type === 'Open' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'}`}>{site.type}</span> 
                                            {site.object}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-4 gap-4 pt-4 mt-4 border-t dark:border-gray-700 items-center">
                            <div><p className="text-xs text-gray-500 dark:text-gray-400">Status</p><p className="font-semibold dark:text-white">{selectedMission.status}</p></div>
                            <div><p className="text-xs text-gray-500 dark:text-gray-400">Duration</p><p className="font-semibold dark:text-white">{selectedMission.duration}</p></div>
                            <div><p className="text-xs text-gray-500 dark:text-gray-400">Location</p><p className="font-semibold dark:text-white">{selectedMission.location}</p></div>
                             <div>
                                <button 
                                    onClick={handleDownloadGpx}
                                    disabled={!selectedMission.gpsTrack || selectedMission.gpsTrack.length === 0}
                                    className="w-full bg-gcs-orange text-white font-bold py-2 px-4 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                                    Download Track
                                </button>
                            </div>
                        </div>
                    </>
                 ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400">Select a mission to view details or adjust your search filters.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in-sm {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-sm {
    animation: fade-in-sm 0.2s ease-out forwards;
}
`;
document.head.appendChild(style);


export default FlightLogsPanel;