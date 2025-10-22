import React from 'react';
import type { OverviewStat } from '../types';

const OverviewCard: React.FC<OverviewStat> = ({ icon, label, value, subtext }) => {
  return (
    <div className="bg-gcs-card p-6 rounded-2xl shadow-sm flex flex-col">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gcs-orange/10 flex items-center justify-center">
            {icon}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gcs-text-dark mt-1">{value}</p>
        <p className="text-sm text-gray-400 mt-1">{subtext}</p>
      </div>
    </div>
  );
};

export default OverviewCard;
