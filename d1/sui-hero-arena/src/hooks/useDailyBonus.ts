import { useState, useEffect } from 'react';

export interface DailyBonusState {
  hasClaimedToday: boolean;
  lastClaimDate: Date | null;
  bonusPercentage: number;
  nextClaimTime: Date | null;
}

export const useDailyBonus = () => {
  const [bonusState, setBonusState] = useState<DailyBonusState>({
    hasClaimedToday: false,
    lastClaimDate: null,
    bonusPercentage: 0,
    nextClaimTime: null,
  });

  // Check if bonus is available
  useEffect(() => {
    const lastClaimStr = localStorage.getItem('lastDailyBonusDate');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (lastClaimStr) {
      const lastClaim = new Date(lastClaimStr);
      const lastClaimDay = new Date(lastClaim.getFullYear(), lastClaim.getMonth(), lastClaim.getDate());

      if (lastClaimDay.getTime() === today.getTime()) {
        // Already claimed today
        const nextClaim = new Date(today);
        nextClaim.setDate(nextClaim.getDate() + 1);
        setBonusState({
          hasClaimedToday: true,
          lastClaimDate: lastClaim,
          bonusPercentage: 25,
          nextClaimTime: nextClaim,
        });
      } else {
        // Can claim today
        setBonusState({
          hasClaimedToday: false,
          lastClaimDate: lastClaim,
          bonusPercentage: 25,
          nextClaimTime: null,
        });
      }
    } else {
      // Never claimed before
      setBonusState({
        hasClaimedToday: false,
        lastClaimDate: null,
        bonusPercentage: 25,
        nextClaimTime: null,
      });
    }
  }, []);

  const claimDailyBonus = () => {
    const now = new Date();
    localStorage.setItem('lastDailyBonusDate', now.toISOString());
    
    const nextClaim = new Date(now);
    nextClaim.setDate(nextClaim.getDate() + 1);

    setBonusState({
      hasClaimedToday: true,
      lastClaimDate: now,
      bonusPercentage: 25,
      nextClaimTime: nextClaim,
    });
  };

  const getTimeUntilNextBonus = (): string => {
    if (!bonusState.nextClaimTime) return '';
    
    const now = new Date();
    const diff = bonusState.nextClaimTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ready!';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return {
    ...bonusState,
    claimDailyBonus,
    getTimeUntilNextBonus,
  };
};
