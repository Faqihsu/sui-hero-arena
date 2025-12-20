import React from 'react';
import { Icons } from '@/constants';

interface NavigationProps {
  activeTab: 'collection' | 'forge' | 'logs';
  onTabChange: (tab: 'collection' | 'forge' | 'logs') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'collection', label: 'Units', icon: <Icons.Sword /> },
    { id: 'forge', label: 'Summon', icon: <Icons.Zap /> },
    { id: 'logs', label: 'History', icon: <Icons.History /> }
  ];

  return (
    <div className="hidden md:flex h-8 bg-slate-950/60 rounded-lg p-1 border border-white/5">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 h-full rounded flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
            activeTab === tab.id ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};