import React, { useState } from 'react';
import { useHeroes } from '@/hooks/useHeroes';
import { Hero } from '@/types';

export const BattleArena: React.FC = () => {
  const { heroes } = useHeroes();
  const [hero1, setHero1] = useState<Hero | null>(null);
  const [hero2, setHero2] = useState<Hero | null>(null);
  const [result, setResult] = useState<string>('');
  const [battling, setBattling] = useState(false);

  const calculateWinner = (h1: Hero, h2: Hero) => {
    const score1 = h1.attack + h1.defense + h1.damage;
    const score2 = h2.attack + h2.defense + h2.damage;
    
    if (score1 > score2) return h1;
    if (score2 > score1) return h2;
    return Math.random() > 0.5 ? h1 : h2;
  };

  const handleBattle = async () => {
    if (!hero1 || !hero2) {
      setResult('❌ Select 2 heroes to battle!');
      return;
    }

    setBattling(true);
    setResult('⚔️ Battle in progress...');

    // Simulate battle animation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const winner = calculateWinner(hero1, hero2);
    const isHero1Winner = winner.id === hero1.id;

    setResult(
      `✨ ${winner.name} wins!\n` +
      `${isHero1Winner ? hero1.name : hero2.name} (${winner.attack} ATK) defeated ${isHero1Winner ? hero2.name : hero1.name}`
    );

    setBattling(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text">
        ⚔️ Battle Arena
      </h2>

      {/* Hero Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero 1 */}
        <div className="space-y-3">
          <h3 className="text-cyan-300 font-bold">🟦 Select Hero 1</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {heroes.map((hero) => (
              <button
                key={hero.id}
                onClick={() => setHero1(hero)}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  hero1?.id === hero.id
                    ? 'bg-cyan-600 border border-cyan-400'
                    : 'bg-cyan-950/40 border border-cyan-500/20 hover:bg-cyan-900/40'
                }`}
              >
                <div className="font-bold text-cyan-300">{hero.name}</div>
                <div className="text-xs text-cyan-300/60">Lvl {hero.level} • ATK {hero.attack} • DEF {hero.defense}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Hero 2 */}
        <div className="space-y-3">
          <h3 className="text-orange-300 font-bold">🟥 Select Hero 2</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {heroes.map((hero) => (
              <button
                key={hero.id}
                onClick={() => setHero2(hero)}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  hero2?.id === hero.id
                    ? 'bg-orange-600 border border-orange-400'
                    : 'bg-orange-950/40 border border-orange-500/20 hover:bg-orange-900/40'
                }`}
              >
                <div className="font-bold text-orange-300">{hero.name}</div>
                <div className="text-xs text-orange-300/60">Lvl {hero.level} • ATK {hero.attack} • DEF {hero.defense}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Battle Stats */}
      {hero1 && hero2 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-lg p-4 text-center">
            <div className="text-cyan-300 font-bold mb-2">{hero1.name}</div>
            <div className="space-y-1 text-sm">
              <div>Level: <span className="text-cyan-400">{hero1.level}</span></div>
              <div>Power: <span className="text-cyan-400">{hero1.attack + hero1.defense + hero1.damage}</span></div>
            </div>
          </div>
          <div className="bg-orange-950/40 border border-orange-500/30 rounded-lg p-4 text-center">
            <div className="text-orange-300 font-bold mb-2">{hero2.name}</div>
            <div className="space-y-1 text-sm">
              <div>Level: <span className="text-orange-400">{hero2.level}</span></div>
              <div>Power: <span className="text-orange-400">{hero2.attack + hero2.defense + hero2.damage}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Battle Button */}
      <button
        onClick={handleBattle}
        disabled={!hero1 || !hero2 || battling}
        className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-lg rounded-lg disabled:opacity-50 transition-all transform hover:scale-105"
      >
        {battling ? '⚔️ Battle in progress...' : '⚔️ START BATTLE'}
      </button>

      {/* Result */}
      {result && (
        <div className="p-6 bg-gradient-to-r from-cyan-950/40 to-orange-950/40 border border-cyan-500/30 rounded-lg text-center whitespace-pre-line">
          <p className="text-lg font-bold text-transparent bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text">
            {result}
          </p>
        </div>
      )}

      {heroes.length === 0 && (
        <div className="text-center py-12 text-cyan-300/50">
          🔔 Mint at least 2 heroes to battle!
        </div>
      )}
    </div>
  );
};
