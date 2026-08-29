'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';

export interface DashaPeriod {
  id: string;
  planet: string;
  startDate: string;
  endDate: string;
  subPeriods?: DashaPeriod[];
}

interface DashaTimelineProps {
  dashas: DashaPeriod[];
  currentDate?: string;
}

const planetColors: Record<string, string> = {
  Sun: 'text-orange-500',
  Moon: 'text-gray-300',
  Mars: 'text-red-500',
  Mercury: 'text-green-500',
  Jupiter: 'text-yellow-500',
  Venus: 'text-pink-400',
  Saturn: 'text-blue-500',
  Rahu: 'text-gray-500',
  Ketu: 'text-amber-800'
};

const DashaNode = ({ period, level = 0, isCurrent = false }: { period: DashaPeriod, level?: number, isCurrent?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = period.subPeriods && period.subPeriods.length > 0;
  const colorClass = planetColors[period.planet] || 'text-[#c69214]';

  return (
    <div className="flex flex-col w-full">
      <div 
        className={`flex items-center py-2 px-3 hover:bg-[#1c2541] rounded-md cursor-pointer transition-colors ${level > 0 ? 'ml-6' : ''}`}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        <div className="w-6 flex items-center justify-center mr-2">
          {hasChildren && (
            isExpanded ? <ChevronDown size={16} className="text-[#e0a96d]" /> : <ChevronRight size={16} className="text-[#e0a96d]" />
          )}
        </div>
        <div className="flex-1 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {isCurrent && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c69214] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c69214]"></span>
              </span>
            )}
            <span className={`font-semibold ${colorClass}`}>{period.planet}</span>
          </div>
          <div className="text-sm text-[#e0a96d]">
            {period.startDate} - {period.endDate}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-l border-[#3a506b] ml-6"
          >
            {period.subPeriods!.map((sub) => (
              <DashaNode key={sub.id} period={sub} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function DashaTimeline({ dashas, currentDate }: DashaTimelineProps) {
  return (
    <div className="w-full bg-[#0b132b] border border-[#3a506b] rounded-lg p-4">
      <h3 className="text-xl font-serif text-[#c69214] mb-4">Vimshottari Dasha</h3>
      <div className="space-y-1">
        {dashas.map(dasha => (
          <DashaNode key={dasha.id} period={dasha} />
        ))}
      </div>
    </div>
  );
}

export default DashaTimeline;

