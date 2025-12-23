import React, { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useSuiCoins } from '@/hooks/useSuiCoins';
import { CONTRACT_CONFIG } from '@/config/contract';
import { Button } from './Button';

export const AddLiquidity: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { suiBalance, forgeBalance, suiCoins, forgeCoins, isLoading: isFetchingCoins } = useSuiCoins();
  const [isLoading, setIsLoading] = useState(false);

  // Calculate 50% of balances
  const suiAmount50 = Math.floor(parseInt(suiBalance) / 2);
  const forgeAmount50 = Math.floor(parseInt(forgeBalance) / 2);

  const handleAddLiquidity = async () => {
    if (!currentAccount || suiAmount50 === 0 || forgeAmount50 === 0) {
      alert('Insufficient balance to add liquidity (need both SUI and FORGE)');
      return;
    }

    if (suiAmount50 < 1000000) {
      alert('Need at least 0.001 SUI to add liquidity');
      return;
    }

    if (forgeAmount50 < 1000) {
      alert('Need at least 1 FORGE to add liquidity');
      return;
    }

    if (forgeCoins.length === 0) {
      alert('You need FORGE coins to add liquidity');
      return;
    }

    setIsLoading(true);
    try {
      const tx = new Transaction();

      // Split SUI from gas
      const [suiCoin] = tx.splitCoins(tx.gas, [suiAmount50]);

      // Use first FORGE coin
      const forgeCoin = forgeCoins[0];
      const forgeCoinId = forgeCoin.objectId;

      // Split FORGE
      const [splitForgeCoin] = tx.splitCoins(tx.object(forgeCoinId), [forgeAmount50]);

      // Call add_liquidity function
      tx.moveCall({
        target: `${CONTRACT_CONFIG.MARKETPLACE_PACKAGE_ID}::forge_swap::add_liquidity`,
        arguments: [
          tx.object(CONTRACT_CONFIG.FORGE_SWAP_POOL_ID), // pool
          suiCoin, // sui_coin (from gas)
          splitForgeCoin, // forge_coin (split)
        ],
      });

      // Execute transaction
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log('Liquidity added:', result);
            alert(`✅ Liquidity added successfully!\nHash: ${result.digest}`);
            setIsLoading(false);
          },
          onError: (error) => {
            console.error('Add liquidity failed:', error);
            alert(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const suiDisplay = (parseInt(suiBalance) / 1e9).toFixed(2);
  const forgeDisplay = (parseInt(forgeBalance) / 1e3).toFixed(0);
  const sui50Display = (suiAmount50 / 1e9).toFixed(2);
  const forge50Display = (forgeAmount50 / 1e3).toFixed(0);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-2xl p-8 backdrop-blur-xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white mb-2" style={{ textShadow: '0 0 15px rgba(16,185,129,1)' }}>
            💧 Add Liquidity
          </h2>
          <p className="text-emerald-300 text-sm">Provide SUI + FORGE to earn trading fees</p>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-2 gap-4 mb-8 bg-black/30 rounded-xl p-4 border border-emerald-500/20">
          <div>
            <p className="text-emerald-300 text-xs font-bold uppercase">Your SUI</p>
            <p className="text-white text-2xl font-bold">{suiDisplay}</p>
            <p className="text-emerald-300/60 text-xs mt-1">50% = {sui50Display} SUI</p>
          </div>
          <div>
            <p className="text-teal-300 text-xs font-bold uppercase">Your FORGE</p>
            <p className="text-white text-2xl font-bold">{forgeDisplay}</p>
            <p className="text-teal-300/60 text-xs mt-1">50% = {forge50Display} FORGE</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6 space-y-2">
          <h3 className="font-bold text-emerald-300">What will happen:</h3>
          <ul className="text-sm text-emerald-300/80 space-y-1">
            <li>✓ Send 50% of your SUI ({sui50Display})</li>
            <li>✓ Send 50% of your FORGE ({forge50Display})</li>
            <li>✓ Receive LP tokens (earned from fees)</li>
            <li>✓ Earn trading fees from swaps</li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          {!currentAccount ? (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center">
              <p className="text-red-300 font-bold">Please connect your wallet</p>
            </div>
          ) : isFetchingCoins ? (
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 text-center">
              <p className="text-blue-300 font-bold">⏳ Fetching your coins...</p>
            </div>
          ) : suiAmount50 === 0 || forgeAmount50 === 0 ? (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 text-center">
              <p className="text-yellow-300 font-bold">
                Need both SUI and FORGE to add liquidity
              </p>
            </div>
          ) : (
            <Button
              onClick={handleAddLiquidity}
              disabled={isLoading || !currentAccount}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all"
            >
              {isLoading ? '⏳ Adding Liquidity...' : '💧 Add 50% of Both'}
            </Button>
          )}
        </div>

        {/* Pool Info */}
        <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-300">
          <p className="mb-2">
            <strong>Pool Address:</strong><br />
            <code className="text-gray-300 break-all block mt-1">{CONTRACT_CONFIG.FORGE_SWAP_POOL_ID}</code>
          </p>
        </div>
      </div>
    </div>
  );
};
