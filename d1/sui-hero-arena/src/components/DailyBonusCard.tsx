import React from 'react';
import { useDailyBonus } from '@/hooks';

export const DailyBonusCard: React.FC = () => {
  const { hasClaimedToday, bonusPercentage, getTimeUntilNextBonus, claimDailyBonus } = useDailyBonus();

  const handleClaimBonus = () => {
    if (!hasClaimedToday) {
      claimDailyBonus();
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border-2 border-yellow-500/50 rounded-xl p-6 space-y-4 max-w-sm">
      <div className="flex items-center gap-3">
        <span className="text-4xl">🎁</span>
        <div>
          <h3 className="text-xl font-black text-yellow-300">Daily Bonus</h3>
          <p className="text-sm text-slate-400">Claim your reward!</p>
        </div>
      </div>

      <div className="bg-black/30 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Bonus Percentage:</span>
          <span className="text-2xl font-black text-yellow-400">+{bonusPercentage}%</span>
        </div>
        {hasClaimedToday && (
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Next Available:</span>
            <span className="text-sm font-bold text-amber-300">{getTimeUntilNextBonus()}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleClaimBonus}
        disabled={hasClaimedToday}
        className={`w-full py-3 rounded-lg font-black text-sm uppercase tracking-widest transition-all ${
          hasClaimedToday
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 hover:shadow-lg hover:shadow-yellow-500/40'
        }`}
      >
        {hasClaimedToday ? '✓ CLAIMED TODAY' : '🎁 CLAIM BONUS'}
      </button>

      <p className="text-xs text-slate-500 text-center">
        Bonus applies to your next battle rewards
      </p>
    </div>
  );
};
