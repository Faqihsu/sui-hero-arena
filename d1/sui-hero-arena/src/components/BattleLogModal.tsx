// src/components/BattleLogModal.tsx
import React from 'react';
import { HeroOnChain } from './BattleFight';

interface BattleLog {
  round: number;
  hero1Action: string;
  hero2Action: string;
  hero1HP: number;
  hero2HP: number;
}

interface BattleLogModalProps {
  isOpen: boolean;
  hero1?: HeroOnChain;
  hero2?: HeroOnChain;
  battleLogs: BattleLog[];
  winner?: string | null;
  onClose: () => void;
  onNewBattle: () => void;
}

export function BattleLogModal({
  isOpen,
  hero1,
  hero2,
  battleLogs,
  winner,
  onClose,
  onNewBattle,
}: BattleLogModalProps) {
  if (!isOpen || !hero1 || !hero2) return null;

  const handleNewBattle = () => {
    onNewBattle();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-2xl shadow-2xl shadow-indigo-500/20 w-full max-h-[90vh] overflow-y-auto max-w-4xl">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-indigo-500/30 px-8 py-6 flex items-center justify-between z-10">
            <h2 className="text-3xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              ⚔️ Battle Log ⚔️
            </h2>
            <button
              onClick={onClose}
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
                <img
                  src={hero1.image_url}
                  alt={hero1.name}
                  className="w-24 h-24 mx-auto rounded-lg object-cover mb-2"
                />
                <h4 className="font-bold text-white text-lg">{hero1.name}</h4>
                <div className="text-sm font-semibold text-yellow-400">Lv. {hero1.level}</div>
                <div
                  className={`text-lg font-bold mt-1 ${
                    winner === hero1.id ? 'text-green-400' : winner && winner !== 'draw' ? 'text-red-400' : ''
                  }`}
                >
                  HP: {Math.max(0, hero1.health - (battleLogs[battleLogs.length - 1]?.hero1HP || 0))}
                </div>
              </div>

              {/* VS */}
              <div className="flex items-center justify-center">
                <div className="text-2xl font-bold text-slate-500">VS</div>
              </div>

              {/* Hero 2 */}
              <div className="text-center">
                <img
                  src={hero2.image_url}
                  alt={hero2.name}
                  className="w-24 h-24 mx-auto rounded-lg object-cover mb-2"
                />
                <h4 className="font-bold text-white text-lg">{hero2.name}</h4>
                <div className="text-sm font-semibold text-yellow-400">Lv. {hero2.level}</div>
                <div
                  className={`text-lg font-bold mt-1 ${
                    winner === hero2.id ? 'text-green-400' : winner && winner !== 'draw' ? 'text-red-400' : ''
                  }`}
                >
                  HP: {Math.max(0, hero2.health - (battleLogs[battleLogs.length - 1]?.hero2HP || 0))}
                </div>
              </div>
            </div>

            {/* Round Details */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {battleLogs.map((log) => (
                <div
                  key={log.round}
                  className="border-2 border-red-500/40 rounded-lg p-4 bg-gradient-to-r from-red-950/30 to-slate-900/40 hover:from-red-950/50 hover:to-slate-900/60 transition-all hover:shadow-lg hover:shadow-red-500/20"
                >
                  <div className="font-black text-red-400 mb-3 text-lg uppercase tracking-widest">⚔️ Round {log.round}</div>
                  <div className="space-y-2">
                    {log.hero1Action && (
                      <div className="text-sm font-bold text-orange-300 bg-red-900/30 px-3 py-2 rounded border-l-4 border-orange-500 animate-pulse">
                        {log.hero1Action}
                      </div>
                    )}
                    {log.hero2Action && (
                      <div className="text-sm font-bold text-orange-300 bg-red-900/30 px-3 py-2 rounded border-l-4 border-orange-500 animate-pulse">
                        {log.hero2Action}
                      </div>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-sm font-bold mt-3 pt-2 border-t border-slate-700/50">
                    <div className="text-red-400">❤️ HP: {log.hero1HP}</div>
                    <div className="text-red-400">❤️ HP: {log.hero2HP}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Winner Announcement */}
            {winner && (
              <div className="mt-6 p-6 rounded-lg bg-gradient-to-r from-slate-800 to-slate-700 border-2 border-slate-600 text-center">
                {winner === 'draw' ? (
                  <div className="text-3xl font-bold text-yellow-300">IT'S A DRAW!</div>
                ) : (
                  <div>
                    <div className="text-lg text-slate-200 mb-2 font-semibold uppercase tracking-wider">
                      🏆 WINNER 🏆
                    </div>
                    <div className="text-3xl font-bold text-green-400">
                      {winner === hero1?.id ? hero1?.name : hero2?.name}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer Actions */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                onClick={handleNewBattle}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black rounded-lg transition-all duration-200 uppercase tracking-widest hover:shadow-2xl hover:shadow-red-500/40"
              >
                ⚔️ New Battle
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold rounded-lg transition-all duration-200 uppercase tracking-wide"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
