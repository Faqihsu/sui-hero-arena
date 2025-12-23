import React from 'react';
import { Hero, HeroRarity } from '@/types';
import { Icons, XP_PER_LEVEL } from '@/constants';

interface HeroCardProps {
  hero: Hero;
  onTrain?: (id: string) => void;
  onTransfer?: (id: string) => void;
  isTraining?: boolean;
  justLeveledUp?: boolean;
}

const getHeroRarity = (level: number): HeroRarity => {
  if (level >= 50) return HeroRarity.LEGENDARY;
  if (level >= 30) return HeroRarity.EPIC;
  if (level >= 15) return HeroRarity.RARE;
  return HeroRarity.COMMON;
};

const getRarityColor = (rarity: HeroRarity) => {
  switch (rarity) {
    case HeroRarity.LEGENDARY:
      return 'from-yellow-400 to-orange-500 text-yellow-900';
    case HeroRarity.EPIC:
      return 'from-purple-400 to-pink-500 text-purple-900';
    case HeroRarity.RARE:
      return 'from-blue-400 to-cyan-500 text-blue-900';
    case HeroRarity.COMMON:
      return 'from-slate-400 to-slate-500 text-slate-900';
  }
};

const getRarityEmoji = (rarity: HeroRarity) => {
  switch (rarity) {
    case HeroRarity.LEGENDARY:
      return '👑';
    case HeroRarity.EPIC:
      return '✨';
    case HeroRarity.RARE:
      return '⭐';
    case HeroRarity.COMMON:
      return '🎖️';
  }
};

export const HeroCard: React.FC<HeroCardProps> = ({ 
  hero, 
  onTrain, 
  onTransfer, 
  isTraining, 
  justLeveledUp 
}) => {
  const xpProgress = (hero.stats.xp % XP_PER_LEVEL);
  const xpPercent = (xpProgress / XP_PER_LEVEL) * 100;
  const rarity = getHeroRarity(hero.stats.level);
  const rarityColor = getRarityColor(rarity);
  const rarityEmoji = getRarityEmoji(rarity);

  return (
    <div className={`group flex flex-col bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-lg overflow-hidden border backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
      justLeveledUp ? 'animate-level-up border-cyan-500' : 'border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-cyan-500/20'
    }`}>
      {/* Visual Identity Area */}
      <div className="relative aspect-square overflow-hidden bg-slate-950">
        <img 
          src={hero.imageUrl} 
          alt={hero.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
        
        {/* Contextual Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 backdrop-blur-md border border-cyan-400/50 rounded text-[10px] font-bold text-cyan-300 uppercase tracking-widest">
            {hero.class}
          </span>
        </div>

        <div className="absolute top-3 right-3">
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className={`px-2 py-1 bg-gradient-to-r ${rarityColor} rounded-md text-[9px] font-bold uppercase tracking-widest flex items-center gap-1`}>
                <span>{rarityEmoji}</span>
                <span>{rarity}</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-[9px] uppercase font-semibold text-cyan-300 tracking-wide">Lv</span>
                <span className="text-xl font-extrabold text-white drop-shadow-glow">{hero.stats.level}</span>
              </div>
            </div>
        </div>

        <div className="absolute bottom-3 left-3">
          <h3 className="text-sm font-bold text-white tracking-tight">{hero.name}</h3>
        </div>
      </div>

      {/* Structured Content Area */}
      <div className="p-3 flex flex-col flex-1 space-y-2">

        {/* Experience Bar with Visual Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-bold text-cyan-400 uppercase tracking-widest">XP Progress</span>
            <span className="text-[7px] font-bold text-cyan-300">{Math.round(xpPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900/50 rounded-full overflow-hidden border border-cyan-500/30">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 ease-out" 
              style={{width: `${xpPercent}%`, boxShadow: '0 0 10px rgba(6,182,212,0.6)'}}
            />
          </div>
        </div>

        {/* Professional Stats Display */}
        <div className="grid grid-cols-2 gap-px bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-md overflow-hidden border border-cyan-500/30">
          <div className="bg-cyan-950/40 p-2 flex flex-col items-center gap-0.5">
            <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-tighter">ATK</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-cyan-300">{hero.stats.attack}</span>
              {justLeveledUp && <span className="text-[8px] text-emerald-400 font-bold">+2</span>}
            </div>
          </div>
          <div className="bg-purple-950/40 p-2 flex flex-col items-center gap-0.5">
            <span className="text-[8px] font-bold text-purple-400 uppercase tracking-tighter">DEF</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-purple-300">{hero.stats.defense}</span>
              {justLeveledUp && <span className="text-[8px] text-emerald-400 font-bold">+2</span>}
            </div>
          </div>
        </div>

        {/* Primary Actions - Refined */}
        <div className="flex gap-2 mt-auto pt-2">
          <button
            onClick={() => onTrain?.(hero.id)}
            disabled={isTraining}
            className="flex-[3] relative h-11 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:from-slate-700 disabled:to-slate-800 text-white rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/50"
          >
            {isTraining ? (
              <div className="w-4 h-4 border-2 border-cyan-300 border-t-cyan-700 rounded-full animate-spin" />
            ) : (
              <>
                LEVEL UP
              </>
            )}
          </button>
          <button
            onClick={() => onTransfer?.(hero.id)}
            className="text-md font-bold flex-1 h-11 border-2 border-pink-500/50 hover:border-pink-500 hover:bg-pink-500/10 text-pink-400 rounded-lg transition-all flex items-center justify-center"
            title="Transfer ownership"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};