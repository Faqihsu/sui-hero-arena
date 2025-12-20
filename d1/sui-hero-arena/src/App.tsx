import React, { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { HeroClass } from '@/types';
import {
  HeroCard,
  MintForm,
  Navigation,
  TransferModal,
  HeroCollection,
  TrainingLogs,
  WalletConnect,
  ToastContainer
} from '@/components';
import { useHeroes, useTransfer, useMintHero, useTrainHero, useTransferHero, useToast } from '@/hooks';

interface MintFormData {
  name: string;
  heroClass: HeroClass;
  backstory: string;
  attack: number;
  defense: number;
  imageUrl: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'collection' | 'forge' | 'logs'>('collection');
  const [trainingHeroId, setTrainingHeroId] = useState<string | null>(null);
  const currentAccount = useCurrentAccount();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const {
    heroes,
    logs,
    trainingId,
    leveledUpId,
    refreshHeroes
  } = useHeroes(currentAccount?.address || null);

  const {
    showTransferModal,
    transferStep,
    transferAddress,
    setTransferAddress,
    openTransfer,
    closeTransfer,
    confirmTransfer,
    goBackToInput
  } = useTransfer();

  // Use custom hooks for all transactions
  // Queries will automatically refetch after mutations complete
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
    }
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
    }
  });

  const trainMutation = useTrainHero({
    showToast: (message, type) => {
      if (type === 'success') {
        showSuccess(message);
      } else {
        showError(message);
      }
    }
  });

  const handleMintHero = (data: MintFormData) => {
    if (!currentAccount) {
      alert('Please connect your wallet first');
      return;
    }
    mintMutation.mutate({ name: data.name, imageUrl: data.imageUrl });
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
    setTrainingHeroId(id);
    trainMutation.mutate(id, {
      onSettled: () => {
        setTrainingHeroId(null);
      }
    });
  };

  const transferHero = showTransferModal ? heroes.find(h => h.id === showTransferModal) : null;

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 h-16 glass border-b border-white/5 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" y1="19" x2="19" y2="13"></line><line x1="16" y1="16" x2="20" y2="20"></line><line x1="19" y1="21" x2="21" y2="19"></line></svg>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white uppercase italic">Sui Arena</span>
          </div>

          <Navigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end leading-none">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Network: Testnet</span>
            {currentAccount && (
              <span className="text-[11px] font-mono text-indigo-400">
                {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </span>
            )}
          </div>
          <WalletConnect />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {activeTab === 'collection' && (
          <HeroCollection
            heroes={heroes}
            onTrain={handleTrainHero}
            onTransfer={openTransfer}
            trainingId={trainingHeroId}
            isTraining={trainMutation.isPending}
            leveledUpId={leveledUpId}
            onMintClick={() => setActiveTab('forge')}
          />
        )}

        {activeTab === 'forge' && (
          <div className="py-12">
            <MintForm onMint={handleMintHero} isLoading={mintMutation.isPending} />
          </div>
        )}

        {activeTab === 'logs' && (
          <TrainingLogs logs={logs} heroes={heroes} />
        )}
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
    </div>
  );
};

export default App;