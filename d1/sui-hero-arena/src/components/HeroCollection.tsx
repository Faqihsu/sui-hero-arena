import React from 'react';
import { Hero } from '@/types';
import { HeroCard } from './HeroCard';

interface HeroCollectionProps {
  heroes: Hero[];
  onTrain: (id: string) => void;
  onTransfer: (id: string) => void;
  trainingId: string | null;
  leveledUpId: string | null;
  onMintClick: () => void;
}

export const HeroCollection: React.FC<HeroCollectionProps> = ({
  heroes,
  onTrain,
  onTransfer,
  trainingId,
  isTraining,
  leveledUpId,
  onMintClick
}) => {
  return (
    <div className="space-y-8 fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-cyan-500/30">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Active Units</h2>
          <p className="text-cyan-300/60 text-sm mt-1">Manage and train your unique asset collection.</p>
        </div>
        <button 
          onClick={onMintClick}
          className="h-11 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg hover:shadow-cyan-500/50"
        >
          ✨ Summon Unit
        </button>
      </header>

      {heroes.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center bg-cyan-900/10 rounded-2xl border border-dashed border-cyan-500/30">
          <span className="text-cyan-400/50 mb-4 opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" y1="19" x2="19" y2="13"></line><line x1="16" y1="16" x2="20" y2="20"></line><line x1="19" y1="21" x2="21" y2="19"></line></svg>
          </span>
          <p className="text-cyan-300/50 text-sm font-medium">No units found in your primary wallet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          {heroes.map((hero, index) => (
            <div key={hero.id} style={{animation: `slideInUp 0.5s ease-out ${index * 0.05}s forwards`, animationFillMode: 'both'}}>
              <HeroCard 
                hero={hero} 
                onTrain={onTrain}
                onTransfer={onTransfer}
                isTraining={isTraining && trainingId === hero.id}
                justLeveledUp={leveledUpId === hero.id}
              />
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 480px) {
          .grid {
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
};