import React, { useState, useMemo } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { HeroClass, Hero, BattleLog, PlayerStats } from '@/types';
import {
  MintForm,
  Navigation,
  TransferModal,
  TrainingLogs,
  WalletConnect,
  ToastContainer,
  BattleArena,
  TrainingConfirmModal,
  BattleResultModal,
  DeleteConfirmModal,
  Training,
  Leaderboard,
  PlayerStatsDisplay,
  DailyBonusCard
} from '@/components';
import { BattleFight, HeroOnChain } from "@/components/BattleFight";
import { useHeroes, useTransfer, useMintHero, useTrainHero, useTransferHero, useToast, useDeleteHero } from '@/hooks';

interface MintFormData {
  name: string;
  heroClass: HeroClass;
  attack: number;
  defense: number;
  cakra: number;
  damage: number;
  hp: number;
  imageUrl: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'collection' | 'forge' | 'logs' | 'battle' | 'training' | 'stats' | 'leaderboard'>('collection');
  const [trainingHeroId, setTrainingHeroId] = useState<string | null>(null);
  const [trainingConfirmOpen, setTrainingConfirmOpen] = useState(false);
  const [pendingTrainHeroId, setPendingTrainHeroId] = useState<string | null>(null);
  const [battleResult, setBattleResult] = useState<{ heroName: string; result: 'win' | 'lose' } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDeleteHeroId, setPendingDeleteHeroId] = useState<string | null>(null);
  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([]);
  const [trainingEndTime, setTrainingEndTime] = useState<number | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    totalBattles: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winStreak: 0,
    totalHeroes: 0,
    eloRating: 1200,
  });
  const currentAccount = useCurrentAccount();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const {
    heroes,
    logs,
    trainingId,
    leveledUpId,
    refreshHeroes,
  } = useHeroes(currentAccount?.address || null);

  const {
    showTransferModal,
    transferStep,
    transferAddress,
    setTransferAddress,
    openTransfer,
    closeTransfer,
    confirmTransfer,
    goBackToInput,
  } = useTransfer();

  const mintMutation = useMintHero({
    onSuccess: () => {
      setActiveTab('collection');
    },
    showToast: (message, type) => {
      if (type === 'success') {
        showSuccess('Hero successfully minted! Refreshing collection...');
      } else {
        showError(message);
      }
    },
  });

  const transferMutation = useTransferHero({
    onSuccess: () => {
      closeTransfer();
    },
    showToast: (message, type) => {
      if (type === 'success') {
        showSuccess(message);
      } else {
        showError(message);
      }
    },
  });

  const trainMutation = useTrainHero({
    showToast: (message, type) => {
      if (type === 'success') {
        showSuccess(message);
      } else {
        showError(message);
      }
    },
  });

  const deleteMutation = useDeleteHero({
    onSuccess: () => {
      closeDelete();
    },
    showToast: (message, type) => {
      if (type === 'success') {
        showSuccess(message);
      } else {
        showError(message);
      }
    },
  });

  const handleMintHero = (data: MintFormData) => {
    if (!currentAccount) {
      alert('Please connect your wallet first');
      return;
    }
    mintMutation.mutate({ name: data.name, imageUrl: data.imageUrl, heroClass: data.heroClass });
  };

  const handleTransferConfirm = (id: string) => {
    if (!transferAddress || !currentAccount) return;
    transferMutation.mutate({ heroId: id, recipientAddress: transferAddress });
  };

  const handleTrainHero = (id: string) => {
    if (!currentAccount) {
      showError('Please connect your wallet first');
      return;
    }
    setPendingTrainHeroId(id);
    setTrainingConfirmOpen(true);
  };

  const confirmTrainHero = () => {
    if (!pendingTrainHeroId) return;
    
    setTrainingHeroId(pendingTrainHeroId);
    trainMutation.mutate(pendingTrainHeroId, {
      onSettled: () => {
        setTrainingHeroId(null);
        setTrainingConfirmOpen(false);
        setPendingTrainHeroId(null);
      },
    });
  };

  const handleDeleteHero = (id: string) => {
    if (!currentAccount) {
      showError('Please connect your wallet first');
      return;
    }
    setPendingDeleteHeroId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteHero = () => {
    if (!pendingDeleteHeroId) return;
    
    deleteMutation.mutate(pendingDeleteHeroId);
  };

  const closeDelete = () => {
    setDeleteConfirmOpen(false);
    setPendingDeleteHeroId(null);
  };

  const handleBattleEnd = (hero1Id: string, hero2Id: string, winnerId: string | 'draw', roundCount: number) => {
    const hero1 = heroes.find(h => h.id === hero1Id);
    const hero2 = heroes.find(h => h.id === hero2Id);
    
    if (!hero1 || !hero2) return;

    const newBattleLog: BattleLog = {
      id: `battle_${Date.now()}`,
      hero1Id: hero1.id,
      hero2Id: hero2.id,
      hero1Name: hero1.name,
      hero2Name: hero2.name,
      hero1Level: hero1.stats.level,
      hero2Level: hero2.stats.level,
      winner: winnerId,
      timestamp: Date.now(),
      battleRounds: roundCount,
    };

    setBattleLogs([newBattleLog, ...battleLogs]);

    // Update player stats
    setPlayerStats(prev => {
      let newStats = { ...prev };
      newStats.totalBattles = prev.totalBattles + 1;
      
      if (winnerId === 'draw') {
        newStats.draws = prev.draws + 1;
        newStats.winStreak = 0;
      } else if (winnerId === hero1Id) {
        newStats.wins = prev.wins + 1;
        newStats.winStreak = prev.winStreak + 1;
        // ELO gain for winner (simplified calculation)
        newStats.eloRating = Math.round(prev.eloRating + 16);
      } else {
        newStats.losses = prev.losses + 1;
        newStats.winStreak = 0;
        // ELO loss for loser
        newStats.eloRating = Math.max(1000, Math.round(prev.eloRating - 16));
      }
      
      return newStats;
    });
  };

  const handleStartTraining = (heroId: string, durationMinutes: number) => {
    const endTime = Date.now() + (durationMinutes * 60 * 1000);
    setTrainingHeroId(heroId);
    setTrainingEndTime(endTime);
    showSuccess(`Hero is now training for ${durationMinutes} minutes!`);

    // Simulate training completion
    setTimeout(() => {
      setTrainingHeroId(null);
      setTrainingEndTime(null);
      showSuccess(`Training complete! Hero gained XP!`);
    }, durationMinutes * 60 * 1000);
  };

  const transferHero = showTransferModal ? heroes.find((h) => h.id === showTransferModal) : null;

  // Function to generate random unique stats for each hero
  const generateRandomStats = (heroId: string) => {
    // Use heroId as seed for consistency (same hero always gets same stats)
    const seed = heroId.charCodeAt(0) + heroId.charCodeAt(heroId.length - 1);
    const random = (min: number, max: number) => {
      return Math.floor((Math.sin(seed * Math.random()) + 1) / 2 * (max - min + 1)) + min;
    };

    const stats = new Set<number>();
    const getUniqueRandom = (min: number, max: number): number => {
      let num;
      do {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (stats.has(num));
      stats.add(num);
      return num;
    };

    return {
      damage: getUniqueRandom(30, 80),
      chakra: getUniqueRandom(20, 90),
      attack: getUniqueRandom(25, 70),
      defense: getUniqueRandom(15, 60),
    };
  };

  // mapping Hero -> HeroOnChain mengikuti BattleFight.tsx
  const heroesOnChain: HeroOnChain[] = heroes.map((h: Hero) => {
    const randomStats = generateRandomStats(h.id);
    return {
      id: h.id,
      name: h.name,
      health: h.stats.hp,
      level: h.stats.level,
      attack: randomStats.attack,
      defense: randomStats.defense,
      damage: randomStats.damage,
      chakra: randomStats.chakra,
      image_url: h.imageUrl,
      heroClass: h.class,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      <nav className="fixed top-0 left-0 right-0 h-16 backdrop-blur-2xl bg-black/30 border-b border-cyan-500/30 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* LOGO + TEKS */}
          <div className="app-logo flex items-center gap-4 group">
            {/* ANIMATED LOGO */}
            <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-125 group-hover:shadow-cyan-500/80 animate-pulse">
              {/* Outer glow rings */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/30 to-pink-400/30 blur-xl animate-spin" style={{animationDuration: '4s'}}></div>
              <div className="absolute inset-1 rounded-3xl border-2 border-cyan-300/50 opacity-0 group-hover:opacity-100 transition-opacity" style={{boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'}}></div>
              
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-transform group-hover:rotate-12"
              >
                {/* Sword icon */}
                <path d="M6 2l12 12-8 8-12-12 8-8z" />
                <path d="M18 6l4-4" />
                <circle cx="2" cy="18" r="1.5" fill="currentColor" />
              </svg>
            </div>

            {/* TITLE WITH EFFECTS */}
            <div className="relative">
              {/* Glowing background text */}
              <span className="absolute text-4xl font-black tracking-tight opacity-30 blur-lg text-cyan-500/40 pointer-events-none animate-pulse whitespace-nowrap" style={{textShadow: '0 0 8px rgba(6,182,212,0.3)'}}>
                FORGE BATTLE
              </span>
              
              {/* Main title - bright cyan with dark outline */}
              <span className="text-4xl font-black tracking-tight text-cyan-300 whitespace-nowrap transition-all" style={{textShadow: '0 0 12px rgba(6,182,212,0.8), -1px -1px 0 rgba(0,0,0,0.5), 1px -1px 0 rgba(0,0,0,0.5), -1px 1px 0 rgba(0,0,0,0.5), 1px 1px 0 rgba(0,0,0,0.5)'}}>
                FORGE BATTLE
              </span>

              {/* Subtitle */}
              <span className="text-xs font-bold text-cyan-400/80 tracking-widest uppercase mt-1 block animate-pulse">⚔️ Epic Arena</span>
            </div>
          </div>

          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end leading-none">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
              Network: Testnet
            </span>
            {currentAccount && (
              <span className="text-[11px] font-mono text-indigo-400">
                {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </span>
            )}
          </div>
          <WalletConnect />
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-6 pt-24 pb-12 space-y-8 z-10">
        {activeTab === 'collection' && (
          <BattleFight
            heroes={heroesOnChain}
            onTrain={handleTrainHero}
            onTransfer={openTransfer}
            onDelete={handleDeleteHero}
            trainingId={trainingHeroId}
            isTraining={trainMutation.isPending}
            leveledUpId={leveledUpId}
            battleResult={battleResult}
            onCloseBattleResult={() => setBattleResult(null)}
          />
        )}

        {activeTab === 'forge' && (
          <div className="py-12">
            <MintForm onMint={handleMintHero} isLoading={mintMutation.isPending} />
          </div>
        )}

        {activeTab === 'training' && (
          <Training
            heroes={heroesOnChain}
            onStartTraining={handleStartTraining}
            trainingHeroId={trainingHeroId}
            trainingEndTime={trainingEndTime}
          />
        )}

        {activeTab === 'logs' && <TrainingLogs logs={logs} heroes={heroes} battleLogs={battleLogs} />}

        {activeTab === 'battle' && <BattleArena heroes={heroesOnChain} onBattleEnd={handleBattleEnd} />}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <PlayerStatsDisplay {...playerStats} />
            <div className="flex justify-center">
              <DailyBonusCard />
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && <Leaderboard currentPlayerStats={playerStats} />}
      </main>

      {showTransferModal && transferHero && (
        <TransferModal
          hero={transferHero}
          transferAddress={transferAddress}
          transferStep={transferStep}
          onAddressChange={setTransferAddress}
          onConfirm={() => handleTransferConfirm(showTransferModal)}
          onCancel={closeTransfer}
          onBack={transferStep === 'input' ? confirmTransfer : goBackToInput}
          isLoading={transferMutation.isPending}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <TrainingConfirmModal
        isOpen={trainingConfirmOpen}
        heroName={heroes.find((h) => h.id === pendingTrainHeroId)?.name || 'Hero'}
        isLoading={trainMutation.isPending}
        onConfirm={confirmTrainHero}
        onCancel={() => {
          setTrainingConfirmOpen(false);
          setPendingTrainHeroId(null);
        }}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirmOpen}
        heroName={heroes.find((h) => h.id === pendingDeleteHeroId)?.name || 'Hero'}
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDeleteHero}
        onCancel={closeDelete}
      />
    </div>
  );
};

export default App;
