import React from 'react';
import { PlayerStats } from '@/types';

export const PlayerStatsDisplay: React.FC<PlayerStats> = (stats) => {
  const winRate = stats.totalBattles === 0 ? 0 : Math.round((stats.wins / stats.totalBattles) * 100);
  const avgDamagePerBattle = Math.round((stats.wins * 15) / Math.max(1, stats.totalBattles));

  const getStreakColor = () => {
    if (stats.winStreak >= 10) return 'text-red-400';
    if (stats.winStreak >= 5) return 'text-orange-400';
    return 'text-yellow-400';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          📊 Your Statistics 📊
        </h1>
        <p className="text-cyan-300/60 text-sm">Track your battle progress and achievements</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Win/Loss Overview */}
        <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 p-6 rounded-xl border border-cyan-500/40 backdrop-blur-sm space-y-4">
          <h3 className="text-lg font-bold text-cyan-300">Battle Record</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-black text-emerald-400">{stats.wins}</div>
              <div className="text-sm text-cyan-300/60 font-semibold">Victories</div>
            </div>
            <div className="text-5xl text-cyan-500/30">—</div>
            <div>
              <div className="text-4xl font-black text-red-400">{stats.losses}</div>
              <div className="text-sm text-cyan-300/60 font-semibold">Defeats</div>
            </div>
            {stats.draws > 0 && (
              <>
                <div className="text-5xl text-cyan-500/30">—</div>
                <div>
                  <div className="text-4xl font-black text-yellow-400">{stats.draws}</div>
                  <div className="text-sm text-cyan-300/60 font-semibold">Draws</div>
                </div>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-cyan-500/30">
            <div className="flex justify-between items-center">
              <span className="text-cyan-300 font-semibold">Total Battles:</span>
              <span className="text-2xl font-black text-cyan-400">{stats.totalBattles}</span>
            </div>
          </div>
        </div>

        {/* Win Rate & Rating */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/40 backdrop-blur-sm space-y-4">
          <h3 className="text-lg font-bold text-purple-300">Performance</h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-purple-300 font-semibold">Win Rate</span>
                <span className="text-3xl font-black text-emerald-400">{winRate}%</span>
              </div>
              <div className="w-full bg-purple-900/30 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${winRate}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/50">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-semibold">ELO Rating</span>
                <span className="text-3xl font-black text-indigo-400">{stats.eloRating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Winning Streak */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-xl border border-slate-700/50">
          <h3 className="text-lg font-bold text-white mb-4">Current Streak</h3>
          <div className="flex items-center gap-4">
            <div>
              <div className={`text-5xl font-black ${getStreakColor()}`}>{stats.winStreak}</div>
              <div className="text-sm text-slate-400 font-semibold">consecutive wins</div>
            </div>
            <div className="flex-1 text-right">
              {stats.winStreak >= 10 && <div className="text-4xl">🔥</div>}
              {stats.winStreak >= 5 && stats.winStreak < 10 && <div className="text-3xl">⚡</div>}
              {stats.winStreak > 0 && stats.winStreak < 5 && <div className="text-2xl">✨</div>}
              {stats.winStreak === 0 && <div className="text-2xl">💪</div>}
            </div>
          </div>
        </div>

        {/* Hero Collection */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-xl border border-slate-700/50">
          <h3 className="text-lg font-bold text-white mb-4">Your Arsenal</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-semibold">Total Heroes</span>
              <span className="text-4xl font-black text-purple-400">{stats.totalHeroes}</span>
            </div>
            <div className="text-xs text-slate-400 pt-2">
              Build your strongest team and dominate the arena!
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-xl border border-slate-700/50">
        <h3 className="text-lg font-bold text-white mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.totalBattles >= 1 && (
            <div className="bg-slate-900/60 p-4 rounded-lg text-center border border-slate-700/50">
              <div className="text-2xl mb-2">⚔️</div>
              <div className="text-xs text-slate-300 font-bold">Battle Veteran</div>
            </div>
          )}
          {stats.totalBattles >= 10 && (
            <div className="bg-slate-900/60 p-4 rounded-lg text-center border border-indigo-500/30">
              <div className="text-2xl mb-2">🎖️</div>
              <div className="text-xs text-indigo-300 font-bold">10 Battles</div>
            </div>
          )}
          {winRate >= 50 && (
            <div className="bg-slate-900/60 p-4 rounded-lg text-center border border-green-500/30">
              <div className="text-2xl mb-2">🏅</div>
              <div className="text-xs text-green-300 font-bold">50% Win Rate</div>
            </div>
          )}
          {stats.winStreak >= 5 && (
            <div className="bg-slate-900/60 p-4 rounded-lg text-center border border-orange-500/30">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-xs text-orange-300 font-bold">{stats.winStreak} Streak</div>
            </div>
          )}
          {stats.eloRating >= 1200 && (
            <div className="bg-slate-900/60 p-4 rounded-lg text-center border border-yellow-500/30">
              <div className="text-2xl mb-2">👑</div>
              <div className="text-xs text-yellow-300 font-bold">1200+ ELO</div>
            </div>
          )}
          {stats.totalHeroes >= 5 && (
            <div className="bg-slate-900/60 p-4 rounded-lg text-center border border-purple-500/30">
              <div className="text-2xl mb-2">💎</div>
              <div className="text-xs text-purple-300 font-bold">5 Heroes</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
