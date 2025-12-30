import React, { useState } from 'react';
import { useHeroes } from '@/hooks/useHeroes';
import { HeroCard } from './HeroCard';

export const Leaderboard: React.FC = () => {
  const { heroes } = useHeroes();
  const [sortBy, setSortBy] = useState<'level' | 'attack' | 'hp'>('level');

  const sortedHeroes = React.useMemo(() => {
    if (!heroes) return [];
    const sorted = [...heroes];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'level':
          return b.level - a.level;
        case 'attack':
          return b.attack - a.attack;
        case 'hp':
          return b.hp - a.hp;
        default:
          return 0;
      }
    });
    return sorted;
  }, [heroes, sortBy]);

  return (
    <div className="space-y-6">
      {/* Leaderboard Header */}
      <div className="card-glow rounded-xl p-6 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30">
        <h1 className="text-3xl font-bold mb-2 text-yellow-300">🏆 Hero Leaderboard</h1>
        <p className="text-yellow-300/70">Rank your heroes by different metrics</p>
      </div>

      {/* Sort Buttons */}
      <div className="flex gap-3 flex-wrap">
        {[
          { id: 'level' as const, label: '📊 By Level', icon: '📊' },
          { id: 'attack' as const, label: '⚔️ By Attack', icon: '⚔️' },
          { id: 'hp' as const, label: '❤️ By HP', icon: '❤️' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setSortBy(btn.id)}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              sortBy === btn.id
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-slate-800/50 text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/50'
            }`}
          >
            {btn.icon} {btn.label.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      {sortedHeroes.length === 0 ? (
        <div className="card-glow rounded-xl p-12 text-center border border-cyan-500/20">
          <p className="text-cyan-300/60 text-lg">No heroes yet. Mint your first hero! 🎮</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedHeroes.map((hero, index) => (
            <div
              key={hero.id}
              className="flex items-center gap-4 bg-slate-800/30 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all"
            >
              {/* Rank Badge */}
              <div className="min-w-[60px]">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0
                      ? 'bg-yellow-600/30 text-yellow-300 border-2 border-yellow-500'
                      : index === 1
                      ? 'bg-gray-600/30 text-gray-300 border-2 border-gray-500'
                      : index === 2
                      ? 'bg-orange-600/30 text-orange-300 border-2 border-orange-500'
                      : 'bg-slate-700/30 text-cyan-300 border-2 border-cyan-500/30'
                  }`}
                >
                  #{index + 1}
                </div>
              </div>

              {/* Hero Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-cyan-300">{hero.name}</h3>
                <p className="text-sm text-cyan-300/60">{hero.heroClass}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xs text-cyan-300/60">Level</div>
                  <div className="font-bold text-cyan-300">{hero.level}</div>
                </div>
                <div>
                  <div className="text-xs text-cyan-300/60">ATK</div>
                  <div className="font-bold text-orange-400">{hero.attack}</div>
                </div>
                <div>
                  <div className="text-xs text-cyan-300/60">DEF</div>
                  <div className="font-bold text-cyan-400">{hero.defense}</div>
                </div>
                <div>
                  <div className="text-xs text-cyan-300/60">HP</div>
                  <div className="font-bold text-red-400">{hero.hp}</div>
                </div>
              </div>

              {/* Total Score */}
              <div className="text-right">
                <div className="text-xs text-cyan-300/60">Total Score</div>
                <div className="text-2xl font-bold text-purple-400">
                  {hero.level * 10 + hero.attack + hero.defense + hero.hp}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
