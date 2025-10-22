import React from 'react';

interface DashboardHeaderProps {
  time: string;
  date: string;
  title: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ time, date, title }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gcs-text-dark">{title}</h1>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <p className="font-semibold">{time}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <div>
          <select className="bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-gcs-orange">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Today</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;