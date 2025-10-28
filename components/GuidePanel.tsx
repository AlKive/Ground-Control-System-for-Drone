import React from 'react';

const GuideSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6">
    <h2 className="text-2xl font-bold text-gcs-text-dark dark:text-white border-b-2 border-gcs-orange/50 pb-2 mb-4">{title}</h2>
    <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert text-gray-600 dark:text-gray-300 space-y-3">
      {children}
    </div>
  </div>
);

const GuidePanel: React.FC = () => {
  return (
    <div className="mt-8 animate-fade-in">
      <GuideSection title="Welcome to the Ground Control System">
        <p>This guide provides a comprehensive overview of the Ground Control System (GCS) application. The GCS is your central hub for planning missions, monitoring live drone telemetry, and analyzing post-flight data to gain valuable insights.</p>
      </GuideSection>

      <GuideSection title="The Dashboard: Your Command Center">
        <p>The Dashboard is the first screen you see and provides an at-a-glance summary of your entire operation.</p>
        <ul>
          <li><strong>Overview Cards:</strong> These cards at the top show key metrics like Total Flights, Total Flight Time, and the current GCS System Battery level.</li>
          <li><strong>Recent Mission Logs:</strong> This panel displays a quick summary of your most recent flights, including a mini-map of their GPS track.</li>
          <li><strong>Pre-Flight Systems:</strong> This is a critical panel for ground operations. You can monitor basic telemetry (GPS, Battery) and, most importantly, <strong>ARM</strong> or <strong>DISARM</strong> the drone before takeoff or after landing.</li>
        </ul>
      </GuideSection>

      <GuideSection title="Mission Setup & Pre-Flight">
        <p>Proper planning is key to a successful mission. The Mission Setup view is where you define every parameter of your flight before launch.</p>
        <h3 className="text-lg font-semibold dark:text-gray-100">Flight Path Planning</h3>
        <p>The interactive map is the core of mission planning:</p>
        <ul>
            <li><strong>Add Waypoints:</strong> Simply click anywhere on the map to add a waypoint. You need at least two waypoints to form a flight path.</li>
            <li><strong>Reposition Waypoints:</strong> Click and drag any existing waypoint to move it to a new location. The flight path will update automatically.</li>
            <li><strong>Path Controls:</strong> Use the <strong>Undo</strong>, <strong>Redo</strong>, and <strong>Clear</strong> buttons on the map to manage your waypoints efficiently.</li>
        </ul>
        <h3 className="text-lg font-semibold dark:text-gray-100">Mission Parameters & Checklist</h3>
        <ul>
            <li><strong>Parameters:</strong> Use the sliders to set the desired <strong>Altitude</strong> and <strong>Speed</strong> for the mission.</li>
            <li><strong>Pre-flight Checklist:</strong> This is a mandatory safety step. You must check all items to confirm the drone is ready for flight. Use the "Check All" button for convenience. The "Launch Mission" button will remain disabled until the checklist is complete.</li>
            <li><strong>Save/Load Plans:</strong> You can save a configured mission plan for future use or load a previously saved one, saving you setup time.</li>
        </ul>
      </GuideSection>
      
      <GuideSection title="Conducting a Live Mission">
        <p>Once a mission is launched, the Live Mission View provides real-time data and control.</p>
        <ul>
            <li><strong>Camera Feed & HUD:</strong> The main view shows the drone's live camera feed with a Heads-Up Display (HUD) overlay showing critical data like GPS coordinates, altitude, and speed.</li>
            <li><strong>Flight Instruments:</strong> The gauges provide a classic cockpit experience, visualizing the drone's <strong>Speed</strong>, <strong>Attitude (Roll/Pitch)</strong>, <strong>Heading</strong>, and <strong>Vertical Speed</strong>. An altitude tape shows the current height.</li>
            <li><strong>System Interface:</strong> This panel shows the drone's status (Armed/Disarmed, Flight Mode) and allows you to issue commands like <strong>Return to Launch</strong>. It also displays essential telemetry like signal strength and battery voltage.</li>
        </ul>
      </GuideSection>

      <GuideSection title="Post-Flight Analysis">
        <h3 className="text-lg font-semibold dark:text-gray-100">Flight Logs</h3>
        <p>Review every detail of past missions in the Flight Logs panel. Select a mission from the list to see its information. The map view is fully interactive, allowing you to <strong>zoom</strong> (with the mouse wheel or buttons) and <strong>pan</strong> (by clicking and dragging) to inspect the flight path closely. You can also download the raw GPS track or <strong>Export Logs</strong> in CSV format using the flexible time-range options.</p>
        
        <h3 className="text-lg font-semibold dark:text-gray-100">Analytics</h3>
        <p>The Analytics panel visualizes your mission data over time. Here you can track trends in mission frequency, flight duration, and success rates to evaluate operational efficiency.</p>
      </GuideSection>

       <GuideSection title="Frequently Asked Questions (FAQ)">
        <h3 className="text-lg font-semibold dark:text-gray-100">Why can't I launch a mission?</h3>
        <p>The "Launch Mission" button will be disabled if either of these conditions isn't met:
            <br/> 1. The pre-flight checklist is not fully completed.
            <br/> 2. You have fewer than two waypoints set on the map.
        </p>

        <h3 className="text-lg font-semibold dark:text-gray-100">How do I export my flight data?</h3>
        <p>
            Navigate to the <strong>Flight Logs</strong> panel. Click the "Export Logs" button and select your desired range from the dropdown menu (e.g., Last 10 Missions, Last 30 Days). A CSV file will be automatically downloaded.
        </p>
         <h3 className="text-lg font-semibold dark:text-gray-100">Is the drone data real?</h3>
        <p>
            The data in this application is part of a high-fidelity simulation. It realistically mimics the behavior and telemetry of a real drone, making this GCS an excellent tool for training, demonstration, and development without risking physical hardware.
        </p>
      </GuideSection>
    </div>
  );
};

export default GuidePanel;