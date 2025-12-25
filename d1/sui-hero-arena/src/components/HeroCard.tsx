import React from 'react';
import { Hero } from '@/types';

interface HeroCardProps {
  hero: Hero;
  onTrain?: (heroId: string) => Promise<void>;
  isTraining?: boolean;
}

export const HeroCard: React.FC<HeroCardProps> = ({ hero, onTrain, isTraining }) => {
  const getClassColor = (heroClass: string) => {
    const colors: Record<string, string> = {
      'Assassin': 'from-red-600 to-red-900',
      'Warrior': 'from-orange-600 to-orange-900',
      'Mage': 'from-blue-600 to-blue-900',
      'Paladin': 'from-yellow-600 to-yellow-900',
    };
    return colors[heroClass] || 'from-gray-600 to-gray-900';
  };

  const totalStats = hero.attack + hero.defense + hero.damage + hero.chakra;
  const statsPercent = (totalStats / 80) * 100;

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${getClassColor(hero.heroClass)} p-1 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300`}>
      <div className="bg-slate-900/90 backdrop-blur rounded-lg p-4 space-y-3">
        {/* Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-slate-900">
          <img
            src={hero.imageUrl}
            alt={hero.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Hero';
            }}
          />
          <div className="absolute top-2 right-2 bg-cyan-600 px-3 py-1 rounded-full text-sm font-bold">
            Lvl {hero.level}
          </div>
        </div>

        {/* Name & Class */}
        <div>
          <h3 className="text-xl font-bold text-cyan-300 truncate">{hero.name}</h3>
          <p className="text-xs text-cyan-300/60">{hero.heroClass}</p>
        </div>

        {/* HP Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-red-400">❤️ HP</span>
            <span className="text-red-300">{hero.hp}/100</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-600 to-red-400 h-full"
              style={{ width: `${(hero.hp / 100) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-xs text-cyan-300/60">ATK</div>
            <div className="text-lg font-bold text-orange-400">⚔️ {hero.attack}</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-xs text-cyan-300/60">DEF</div>
            <div className="text-lg font-bold text-cyan-400">🛡️ {hero.defense}</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-xs text-cyan-300/60">DMG</div>
            <div className="text-lg font-bold text-red-400">💥 {hero.damage}</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-xs text-cyan-300/60">CHK</div>
            <div className="text-lg font-bold text-purple-400">✨ {hero.chakra}</div>
          </div>
        </div>

        {/* Overall Stats Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-cyan-300">Overall</span>
            <span className="text-cyan-400 font-bold">{totalStats}/80</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-600 to-purple-600 h-full transition-all"
              style={{ width: `${statsPercent}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        {onTrain && (
          <button
            onClick={() => onTrain(hero.id)}
            disabled={isTraining}
            className="w-full py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-lg disabled:opacity-50 transition-all"
          >
            {isTraining ? '⏳ Training...' : '🏋️ Train Hero'}
          </button>
        )}
      </div>
    </div>
  );
};
