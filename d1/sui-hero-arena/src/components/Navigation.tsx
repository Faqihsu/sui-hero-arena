import React from 'react';
import { Icons } from '@/constants';

interface NavigationProps {
  activeTab: 'collection' | 'forge' | 'logs' | 'battle' | 'training' | 'stats' | 'leaderboard';
  onTabChange: (tab: 'collection' | 'forge' | 'logs' | 'battle' | 'training' | 'stats' | 'leaderboard') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'collection', label: 'UNITS', icon: <Icons.Sword /> },
    { id: 'forge', label: 'SUMMON', icon: <Icons.Zap /> },
    { id: 'training', label: 'TRAIN', icon: <Icons.Zap /> },
    { id: 'battle', label: 'BATTLE', icon: <Icons.Zap /> },
    { id: 'stats', label: 'STATS', icon: <Icons.History /> },
    { id: 'leaderboard', label: 'RANKING', icon: <Icons.History /> },
    { id: 'logs', label: 'HISTORY', icon: <Icons.History /> }
  ];

  return (
    <div className="hidden md:flex gap-1 bg-gradient-to-r from-slate-950/90 to-slate-900/90 rounded-2xl p-2 border-2 border-indigo-500/30 backdrop-blur-xl overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-lg flex items-center gap-1 text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
            activeTab === tab.id 
              ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white shadow-2xl shadow-orange-500/50 scale-105' 
              : 'text-slate-200 hover:text-white hover:bg-white/10 hover:scale-102'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};