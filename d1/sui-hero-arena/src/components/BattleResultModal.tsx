import React from 'react';

interface BattleResultModalProps {
  isOpen: boolean;
  heroName: string;
  result: 'win' | 'lose';
  onClose: () => void;
}

export const BattleResultModal: React.FC<BattleResultModalProps> = ({
  isOpen,
  heroName,
  result,
  onClose,
}) => {
  if (!isOpen) return null;

  const isWin = result === 'win';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className={`relative z-50 w-full max-w-md mx-4 rounded-3xl overflow-hidden shadow-2xl ${
        isWin 
          ? 'bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 border-2 border-green-400/50 shadow-green-500/30'
          : 'bg-gradient-to-br from-red-900 via-orange-800 to-red-900 border-2 border-red-400/50 shadow-red-500/30'
      }`}>
        {/* Animated background */}
        <div className={`absolute inset-0 opacity-30 ${
          isWin 
            ? 'bg-gradient-to-t from-green-500 via-transparent to-transparent'
            : 'bg-gradient-to-t from-red-500 via-transparent to-transparent'
        }`}></div>

        <div className="relative z-10 p-8 space-y-6 text-center">
          {/* Icon/Emoji */}
          <div className="flex justify-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-5xl shadow-2xl ${
              isWin
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-yellow-500/50'
                : 'bg-gradient-to-br from-slate-700 to-slate-800 shadow-slate-700/50'
            }`}>
              {isWin ? '🏆' : '💔'}
            </div>
          </div>

          {/* Result Title */}
          <div className="space-y-2">
            <h2 className={`text-4xl font-black uppercase tracking-widest ${
              isWin ? 'text-green-300' : 'text-red-300'
            }`}>
              {isWin ? 'VICTORY!' : 'DEFEAT'}
            </h2>
            <p className="text-slate-200 text-lg">
              {heroName} {isWin ? 'triumphed!' : 'was defeated!'}
            </p>
          </div>

          {/* Rewards/Penalties */}
          <div className={`p-6 rounded-2xl border-2 space-y-3 ${
            isWin
              ? 'bg-green-900/40 border-green-400/30'
              : 'bg-red-900/40 border-red-400/30'
          }`}>
            {isWin ? (
              <>
                <div className="flex items-center justify-between text-white">
                  <span className="font-bold">⭐ Experience Gained</span>
                  <span className="text-yellow-300 font-black text-xl">+100 XP</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span className="font-bold">💎 Bonus Reward</span>
                  <span className="text-green-300 font-black text-xl">+50 Gold</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span className="font-bold">🔥 Stats Boost</span>
                  <span className="text-orange-300 font-black text-xl">+5 ATK</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-white">
                  <span className="font-bold">⚠️ Health Lost</span>
                  <span className="text-red-300 font-black text-xl">-30 HP</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span className="font-bold">⏱️ Cooldown</span>
                  <span className="text-orange-300 font-black text-xl">30s Wait</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span className="font-bold">🎯 Try Again</span>
                  <span className="text-slate-300 font-black text-xl">Challenge Again</span>
                </div>
              </>
            )}
          </div>

          {/* Stats Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${
              isWin ? 'bg-green-900/30 border border-green-400/30' : 'bg-red-900/30 border border-red-400/30'
            }`}>
              <div className="text-slate-300 text-sm font-semibold mb-2">Damage Dealt</div>
              <div className={`text-3xl font-black ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                {isWin ? '85' : '42'}
              </div>
            </div>
            <div className={`p-4 rounded-xl ${
              isWin ? 'bg-green-900/30 border border-green-400/30' : 'bg-red-900/30 border border-red-400/30'
            }`}>
              <div className="text-slate-300 text-sm font-semibold mb-2">Survived</div>
              <div className={`text-3xl font-black ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                {isWin ? '65 HP' : '5 HP'}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`w-full px-6 py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 ${
              isWin
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg shadow-green-500/50'
                : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white shadow-lg shadow-red-500/50'
            }`}
          >
            {isWin ? '🎉 Claim Victory' : '🔄 Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
};
