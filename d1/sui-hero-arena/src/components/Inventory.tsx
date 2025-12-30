import React, { useState } from 'react';
import { useHeroes } from '@/hooks/useHeroes';
import { useTrainHero } from '@/hooks/useTrainHero';
import { HeroCard } from './HeroCard';

export const Inventory: React.FC = () => {
  const { heroes } = useHeroes();
  const { trainHero, isTraining } = useTrainHero();
  const [selectedClass, setSelectedClass] = useState<string>('All');

  const classes = React.useMemo(() => {
    if (!heroes) return [];
    const unique = new Set(heroes.map((h) => h.heroClass));
    return Array.from(unique);
  }, [heroes]);

  const filteredHeroes = React.useMemo(() => {
    if (!heroes) return [];
    if (selectedClass === 'All') return heroes;
    return heroes.filter((h) => h.heroClass === selectedClass);
  }, [heroes, selectedClass]);

  const handleTrain = async (heroId: string) => {
    try {
      await trainHero(heroId);
    } catch (error) {
      console.error('Training failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Inventory Header */}
      <div className="card-glow rounded-xl p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
        <h1 className="text-3xl font-bold mb-2 text-purple-300">🎒 Inventory</h1>
        <p className="text-purple-300/70">Manage and train your heroes</p>
      </div>

      {/* Class Filter */}
      <div className="space-y-3">
        <p className="text-cyan-300/60 font-bold">Filter by Class:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedClass('All')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              selectedClass === 'All'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800/50 text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/50'
            }`}
          >
            All ({heroes?.length || 0})
          </button>
          {classes.map((heroClass) => (
            <button
              key={heroClass}
              onClick={() => setSelectedClass(heroClass)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                selectedClass === heroClass
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800/50 text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/50'
              }`}
            >
              {heroClass} ({heroes?.filter((h) => h.heroClass === heroClass).length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Heroes Grid */}
      {filteredHeroes.length === 0 ? (
        <div className="card-glow rounded-xl p-12 text-center border border-cyan-500/20">
          <p className="text-cyan-300/60 text-lg">No heroes in this category yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHeroes.map((hero) => (
            <div key={hero.id} className="relative">
              <HeroCard hero={hero} onTrain={() => handleTrain(hero.id)} isTraining={isTraining} />

              {/* Train Button */}
              <button
                onClick={() => handleTrain(hero.id)}
                disabled={isTraining}
                className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-2 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTraining ? '⏳ Training...' : '📈 Train Hero'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Inventory Stats */}
      {heroes && heroes.length > 0 && (
        <div className="card-glow rounded-xl p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-cyan-500/20">
          <h2 className="text-xl font-bold mb-4 text-cyan-300">📊 Inventory Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox
              title="Total Heroes"
              value={heroes.length}
              icon="🎮"
            />
            <StatBox
              title="Avg Level"
              value={Math.round(heroes.reduce((sum, h) => sum + h.level, 0) / heroes.length)}
              icon="📈"
            />
            <StatBox
              title="Total Attack"
              value={heroes.reduce((sum, h) => sum + h.attack, 0)}
              icon="⚔️"
            />
            <StatBox
              title="Total Defense"
              value={heroes.reduce((sum, h) => sum + h.defense, 0)}
              icon="🛡️"
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface StatBoxProps {
  title: string;
  value: number;
  icon: string;
}

const StatBox: React.FC<StatBoxProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm text-cyan-300/60">{title}</div>
      <div className="text-2xl font-bold text-cyan-300 mt-1">{value}</div>
    </div>
  );
};
