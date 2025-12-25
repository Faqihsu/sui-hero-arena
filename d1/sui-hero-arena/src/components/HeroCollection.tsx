import React, { useState } from 'react';
import { useHeroes } from '@/hooks/useHeroes';
import { useTrainHero } from '@/hooks/useTrainHero';
import { HeroCard } from './HeroCard';

export const HeroCollection: React.FC = () => {
  const { heroes, isLoading } = useHeroes();
  const { train } = useTrainHero();
  const [training, setTraining] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleTrain = async (heroId: string) => {
    try {
      setTraining(heroId);
      setMessage('⏳ Training in progress...');
      await train(heroId);
      setMessage('✅ Hero trained! Stats increased!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessage(`❌ Training failed: ${msg}`);
    } finally {
      setTraining(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin">⌛</div>
        <p className="text-cyan-300 mt-2">Loading your heroes...</p>
      </div>
    );
  }

  if (heroes.length === 0) {
    return (
      <div className="text-center py-12 bg-cyan-950/20 rounded-lg border border-cyan-500/20 p-6">
        <p className="text-cyan-300/70 text-lg mb-2">📭 No heroes yet</p>
        <p className="text-cyan-300/50 text-sm">Mint your first hero in the Forge!</p>
      </div>
    );
  }

  const avgLevel = Math.round(heroes.reduce((sum, h) => sum + h.level, 0) / heroes.length);
  const totalPower = heroes.reduce((sum, h) => sum + h.attack + h.defense, 0);

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-cyan-300">{heroes.length}</div>
          <div className="text-xs text-cyan-300/60 uppercase tracking-wide">Heroes</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/30 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-300">Lvl {avgLevel}</div>
          <div className="text-xs text-purple-300/60 uppercase tracking-wide">Avg Level</div>
        </div>
        <div className="bg-gradient-to-br from-orange-600/20 to-orange-900/20 border border-orange-500/30 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-orange-300">{totalPower}</div>
          <div className="text-xs text-orange-300/60 uppercase tracking-wide">Total Power</div>
        </div>
      </div>

      {/* Heroes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {heroes.map((hero) => (
          <HeroCard
            key={hero.id}
            hero={hero}
            onTrain={handleTrain}
            isTraining={training === hero.id}
          />
        ))}
      </div>

      {/* Message */}
      {message && (
        <div className="text-center p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-cyan-300">
          {message}
        </div>
      )}
    </div>
  );
};
