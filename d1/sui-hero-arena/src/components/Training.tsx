import React, { useState, useEffect } from 'react';
import { HeroOnChain } from './BattleFight';

interface TrainingProps {
  heroes: HeroOnChain[];
  onStartTraining: (heroId: string, duration: number) => void;
  trainingHeroId: string | null;
  trainingEndTime: number | null;
}

export function Training({
  heroes,
  onStartTraining,
  trainingHeroId,
  trainingEndTime,
}: TrainingProps) {
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(5); // minutes
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const selectedHero = heroes.find((h) => h.id === selectedHeroId);
  const isTraining = trainingHeroId !== null;
  const trainingHero = heroes.find((h) => h.id === trainingHeroId);

  // Timer effect for remaining training time
  useEffect(() => {
    if (!isTraining || !trainingEndTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, trainingEndTime - now);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isTraining, trainingEndTime]);

  const handleStartTraining = () => {
    if (!selectedHeroId) return;
    onStartTraining(selectedHeroId, selectedDuration);
    setSelectedHeroId(null);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const trainingDurations = [5, 10, 15, 30];

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-in">
      <div className="pb-4 border-b border-slate-900">
        <h2 className="text-2xl font-bold text-white tracking-tight">Training Grounds</h2>
        <p className="text-slate-500 text-sm">Send your heroes to train and gain experience.</p>
      </div>

      {isTraining && trainingHero ? (
        // Active Training Display
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/20 border-2 border-indigo-500/30 rounded-2xl p-8 text-center">
            <div className="mb-6">
              <img
                src={trainingHero.image_url}
                alt={trainingHero.name}
                className="w-32 h-32 mx-auto rounded-xl object-cover border-2 border-indigo-500/50"
              />
            </div>

            <h3 className="text-3xl font-bold text-white mb-2">{trainingHero.name}</h3>
            <p className="text-slate-400 mb-6">Currently Training</p>

            {/* Timer Display */}
            <div className="space-y-4">
              <div className="text-6xl font-black font-mono text-transparent bg-gradient-to-r from-yellow-400 via-red-400 to-orange-400 bg-clip-text animate-pulse">
                {formatTime(timeLeft)}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-700/50 rounded-full h-3 border border-slate-600/50 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000"
                  style={{
                    width: `${trainingEndTime ? ((trainingEndTime - timeLeft) / (trainingEndTime - (trainingEndTime - Date.now() - timeLeft)) || 0) * 100 : 0}%`,
                  }}
                />
              </div>

              <p className="text-sm text-slate-400">
                Training in progress... Check back soon for rewards!
              </p>
            </div>

            {/* Expected Rewards Preview */}
            <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-indigo-500/20">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Estimated Rewards</p>
              <div className="text-2xl font-bold text-emerald-400">+150 XP</div>
            </div>
          </div>
        </div>
      ) : (
        // Training Selection
        <div className="grid md:grid-cols-2 gap-6">
          {/* Hero Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Select Hero</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {heroes.map((hero) => (
                <button
                  key={hero.id}
                  onClick={() => setSelectedHeroId(hero.id)}
                  className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
                    selectedHeroId === hero.id
                      ? 'bg-indigo-600/30 border-indigo-500'
                      : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={hero.image_url}
                      alt={hero.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-white">{hero.name}</div>
                      <div className="text-xs text-slate-400">Lv. {hero.level}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Training Duration Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Training Duration</h3>
            <div className="space-y-3">
              {trainingDurations.map((duration) => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(duration)}
                  disabled={!selectedHeroId}
                  className={`w-full p-4 rounded-lg transition-all border-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedDuration === duration
                      ? 'bg-orange-600/30 border-orange-500'
                      : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-bold text-white">{duration} Minutes</div>
                    <div className="text-xs text-slate-400">
                      {duration === 5 && '+50 XP'}
                      {duration === 10 && '+100 XP'}
                      {duration === 15 && '+150 XP'}
                      {duration === 30 && '+300 XP'}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartTraining}
              disabled={!selectedHeroId}
              className="w-full px-6 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-lg transition-all duration-200 uppercase tracking-widest hover:shadow-2xl hover:shadow-orange-500/40 mt-4"
            >
              📚 Start Training
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-slate-900/40 border border-slate-700/30 rounded-lg p-4">
        <p className="text-sm text-slate-300">
          <span className="font-bold text-indigo-400">💡 Tip:</span> Send your heroes to train regularly to boost their level and power!
          Higher duration = more XP gained.
        </p>
      </div>
    </div>
  );
}
