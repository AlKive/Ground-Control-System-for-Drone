import React from 'react';
import type { OverviewStat } from '../types';

const OverviewCard: React.FC<OverviewStat> = ({ icon, label, value, subtext }) => {
  return (
    <div className="bg-gcs-card dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex flex-col">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gcs-orange/10 flex items-center justify-center">
            {icon}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-3xl font-bold text-gcs-text-dark dark:text-white mt-1">{value}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{subtext}</p>
      </div>
    </div>
  );
};

export default OverviewCard;