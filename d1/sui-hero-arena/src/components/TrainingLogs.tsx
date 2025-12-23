import React, { useState } from 'react';
import { TrainingLog, Hero, BattleLog } from '@/types';

interface TrainingLogsProps {
  logs: TrainingLog[];
  heroes: Hero[];
  battleLogs?: BattleLog[];
}

export const TrainingLogs: React.FC<TrainingLogsProps> = ({ logs, heroes, battleLogs = [] }) => {
  const [selectedBattle, setSelectedBattle] = useState<BattleLog | null>(null);

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
                <button
                  key={`battle_${battleLog.id}`}
                  onClick={() => setSelectedBattle(battleLog)}
                  className="w-full bg-slate-900/60 p-4 rounded-xl border border-white/5 flex gap-4 items-center hover:bg-slate-900/80 hover:border-indigo-500/30 transition-all cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    battleLog.winner === 'draw' 
                      ? 'bg-yellow-500/10 text-yellow-400' 
                      : 'bg-red-500/10 text-red-400'
                  } group-hover:scale-110 transition-transform`}>
                    ⚔️
                  </div>
                  <div className="flex-1 min-w-0 text-left">
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
                    CLICK
                  </div>
                </button>
              );
            }
          })}
        </div>
      )}

      {/* Battle Details Modal */}
      {selectedBattle && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={() => setSelectedBattle(null)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-2xl shadow-2xl shadow-indigo-500/20 w-full max-h-[90vh] overflow-y-auto max-w-4xl">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-indigo-500/30 px-8 py-6 flex items-center justify-between z-10">
                <h2 className="text-3xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  ⚔️ Battle Details ⚔️
                </h2>
                <button
                  onClick={() => setSelectedBattle(null)}
                  className="text-slate-400 hover:text-white text-2xl transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* VS Display */}
                <div className="grid md:grid-cols-3 gap-4 p-6 bg-gradient-to-b from-slate-800/50 to-transparent rounded-xl border border-slate-700/30">
                  {/* Hero 1 */}
                  <div className="text-center">
                    <h4 className="font-bold text-white text-lg">{selectedBattle.hero1Name}</h4>
                    <div className="text-sm font-semibold text-yellow-400 mt-1">Lv. {selectedBattle.hero1Level}</div>
                    <div
                      className={`text-lg font-bold mt-2 ${
                        selectedBattle.winner === selectedBattle.hero1Id ? 'text-green-400' : selectedBattle.winner && selectedBattle.winner !== 'draw' ? 'text-red-400' : ''
                      }`}
                    >
                      {selectedBattle.winner === selectedBattle.hero1Id ? '🏆 WINNER' : selectedBattle.winner === 'draw' ? '🤝 DRAW' : '💀 LOSER'}
                    </div>
                  </div>

                  {/* VS */}
                  <div className="flex items-center justify-center">
                    <div className="text-2xl font-bold text-slate-500">VS</div>
                  </div>

                  {/* Hero 2 */}
                  <div className="text-center">
                    <h4 className="font-bold text-white text-lg">{selectedBattle.hero2Name}</h4>
                    <div className="text-sm font-semibold text-yellow-400 mt-1">Lv. {selectedBattle.hero2Level}</div>
                    <div
                      className={`text-lg font-bold mt-2 ${
                        selectedBattle.winner === selectedBattle.hero2Id ? 'text-green-400' : selectedBattle.winner && selectedBattle.winner !== 'draw' ? 'text-red-400' : ''
                      }`}
                    >
                      {selectedBattle.winner === selectedBattle.hero2Id ? '🏆 WINNER' : selectedBattle.winner === 'draw' ? '🤝 DRAW' : '💀 LOSER'}
                    </div>
                  </div>
                </div>

                {/* Battle Stats */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30">
                    <h3 className="text-sm font-bold text-slate-300 mb-3">Battle Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Rounds:</span>
                        <span className="text-white font-bold">{selectedBattle.battleRounds}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Date:</span>
                        <span className="text-white font-bold">{new Date(selectedBattle.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Time:</span>
                        <span className="text-white font-bold">{new Date(selectedBattle.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Status:</span>
                        <span className={`font-bold ${
                          selectedBattle.winner === 'draw' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {selectedBattle.winner === 'draw' ? '🤝 DRAW' : '✓ COMPLETED'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30">
                    <h3 className="text-sm font-bold text-slate-300 mb-3">Participants</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Fighter 1:</span>
                        <span className="text-white font-bold">{selectedBattle.hero1Name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Fighter 2:</span>
                        <span className="text-white font-bold">{selectedBattle.hero2Name}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-3 pt-2 border-t border-slate-700/50">
                        <span className="text-slate-400">Winner:</span>
                        <span className={`font-bold ${
                          selectedBattle.winner === 'draw' 
                            ? 'text-yellow-400' 
                            : selectedBattle.winner === selectedBattle.hero1Id 
                            ? 'text-green-400' 
                            : 'text-green-400'
                        }`}>
                          {selectedBattle.winner === 'draw' 
                            ? 'DRAW' 
                            : selectedBattle.winner === selectedBattle.hero1Id 
                            ? selectedBattle.hero1Name 
                            : selectedBattle.hero2Name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedBattle(null)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold rounded-lg transition-all duration-200 uppercase tracking-wide"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};