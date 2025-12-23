import React from 'react';
import { Icons } from '@/constants';

interface NavigationProps {
  activeTab: 'collection' | 'forge' | 'logs' | 'battle' | 'training' | 'stats' | 'leaderboard' | 'marketplace';
  onTabChange: (tab: 'collection' | 'forge' | 'logs' | 'battle' | 'training' | 'stats' | 'leaderboard' | 'marketplace') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'collection', label: 'UNITS', icon: <Icons.Sword /> },
    { id: 'forge', label: 'SUMMON', icon: <Icons.Zap /> },
    { id: 'training', label: 'TRAIN', icon: <Icons.Zap /> },
    { id: 'battle', label: 'BATTLE', icon: <Icons.Zap /> },
    { id: 'stats', label: 'STATS', icon: <Icons.History /> },
    { id: 'leaderboard', label: 'RANKING', icon: <Icons.History /> },
    { id: 'marketplace', label: 'MARKET', icon: <Icons.History /> },
    { id: 'logs', label: 'HISTORY', icon: <Icons.History /> }
  ];

  return (
    <div className="hidden md:flex gap-1 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-2xl p-2 border-2 border-cyan-500/40 backdrop-blur-sm overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-lg flex items-center gap-1 text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
            activeTab === tab.id 
              ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-cyan-500/50 scale-105' 
              : 'text-slate-300 hover:text-white hover:bg-white/10 hover:scale-102'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};