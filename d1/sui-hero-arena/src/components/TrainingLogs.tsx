import React from 'react';
import { TrainingLog, Hero, BattleLog } from '@/types';

interface TrainingLogsProps {
  logs: TrainingLog[];
  heroes: Hero[];
  battleLogs?: BattleLog[];
}

export const TrainingLogs: React.FC<TrainingLogsProps> = ({ logs, heroes, battleLogs = [] }) => {
  // Combine training logs and battle logs, sorted by timestamp
  const allLogs = [
    ...logs.map(log => ({
      type: 'training' as const,
      timestamp: log.timestamp,
      data: log,
    })),
    ...battleLogs.map(log => ({
      type: 'battle' as const,
      timestamp: log.timestamp,
      data: log,
    })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-in">
      <div className="pb-4 border-b border-slate-900">
        <h2 className="text-2xl font-bold text-white tracking-tight">Operation Ledger</h2>
        <p className="text-slate-500 text-sm">Historical training records, battles, and unit mutations.</p>
      </div>
      
      {allLogs.length === 0 ? (
        <div className="text-center py-20 text-slate-600 text-sm font-medium">No operations logged.</div>
      ) : (
        <div className="space-y-3">
          {allLogs.map((log, idx) => {
            if (log.type === 'training') {
              const trainingLog = log.data as TrainingLog;
              const hero = heroes.find(h => h.id === trainingLog.heroId);
              return (
                <div key={`training_${trainingLog.id}`} className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-slate-200">{hero?.name || 'Unit Alpha'}</span>
                      <span className="text-[10px] font-mono text-slate-600 uppercase">{new Date(trainingLog.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{trainingLog.description}</p>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                    +{trainingLog.xpGained} XP
                  </div>
                </div>
              );
            } else {
              const battleLog = log.data as BattleLog;
              const isWinner = (heroId: string) => battleLog.winner === heroId;
              return (
                <div key={`battle_${battleLog.id}`} className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex gap-4 items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    battleLog.winner === 'draw' 
                      ? 'bg-yellow-500/10 text-yellow-400' 
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    ⚔️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-slate-200">
                        {battleLog.hero1Name} vs {battleLog.hero2Name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-600 uppercase">{new Date(battleLog.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {battleLog.winner === 'draw' 
                        ? '🏆 DRAW' 
                        : `🏆 Winner: ${battleLog.winner === battleLog.hero1Id ? battleLog.hero1Name : battleLog.hero2Name}`}
                      {' • '}{battleLog.battleRounds} round{battleLog.battleRounds !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-1 rounded ${
                    battleLog.winner === 'draw' 
                      ? 'text-yellow-400 bg-yellow-400/10' 
                      : 'text-red-400 bg-red-400/10'
                  }`}>
                    BATTLE
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};