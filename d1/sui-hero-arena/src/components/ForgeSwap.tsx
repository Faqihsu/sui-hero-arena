import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONFIG } from '@/config/contract';
import { Button } from './Button';

interface ForgeSwapProps {
  onSwapSuccess?: (txHash: string, amount: string) => void;
  onSwapError?: (error: string) => void;
}

interface PoolState {
  suiBalance: string;
  forgeBalance: string;
  totalSupply: string;
}

type SwapDirection = 'sui-to-forge' | 'forge-to-sui';

export const ForgeSwap: React.FC<ForgeSwapProps> = ({ onSwapSuccess, onSwapError }) => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [swapDirection, setSwapDirection] = useState<SwapDirection>('sui-to-forge');
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [poolState, setPoolState] = useState<PoolState>({
    // Mock data: 10 SUI = 1,000,000 FORGE (rate: 1 SUI = 100,000 FORGE)
    suiBalance: (10 * 1e9).toString(), // 10 SUI in motes
    forgeBalance: (1000000 * 1e3).toString(), // 1,000,000 FORGE in base units
    totalSupply: '0',
  });

  // Fetch pool state
  useEffect(() => {
    const fetchPoolState = async () => {
      try {
        const client = new SuiClient({
          url: 'https://fullnode.testnet.sui.io',
        });

        const poolObject = await client.getObject({
          id: CONTRACT_CONFIG.FORGE_SWAP_POOL_ID,
          options: {
            showContent: true,
          },
        });

        if (poolObject.data?.content && 'fields' in poolObject.data.content) {
          const fields = poolObject.data.content.fields as any;
          setPoolState({
            suiBalance: fields.sui_balance?.toString() || (10 * 1e9).toString(),
            forgeBalance: fields.forge_balance?.toString() || (1000000 * 1e3).toString(),
            totalSupply: fields.total_supply?.toString() || '0',
          });
        }
      } catch (error) {
        console.error('Failed to fetch pool state:', error);
        // Keep mock data on error
      }
    };

    fetchPoolState();
    const interval = setInterval(fetchPoolState, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate output amount based on constant product formula (x * y = k)
  const calculateOutputAmount = (inputVal: string, direction: SwapDirection): string => {
    if (!inputVal || parseFloat(inputVal) === 0) return '0';

    const input = parseFloat(inputVal);
    const suiBal = parseFloat(poolState.suiBalance); // in motes
    const forgeBal = parseFloat(poolState.forgeBalance); // in base units

    // Constant product formula: (x + inputAmount) * (y - outputAmount) = x * y
    // Solving for outputAmount: outputAmount = y - (x * y) / (x + inputAmount)
    
    if (direction === 'sui-to-forge') {
      // Input is SUI (displayed value), output is FORGE
      const inputMotes = input * 1e9; // Convert SUI to motes
      const outputBase = forgeBal - (suiBal * forgeBal) / (suiBal + inputMotes);
      const outputForge = outputBase / 1e3; // Convert from base units to FORGE display value
      return Math.max(0, outputForge).toFixed(0);
    } else {
      // Input is FORGE (displayed value), output is SUI
      const inputBase = input * 1e3; // Convert FORGE to base units
      const outputMotes = suiBal - (suiBal * forgeBal) / (forgeBal + inputBase);
      const outputSui = outputMotes / 1e9; // Convert motes to SUI display value
      return Math.max(0, outputSui).toFixed(6);
    }
  };

  const handleInputChange = (value: string) => {
    setInputAmount(value);
    const output = calculateOutputAmount(value, swapDirection);
    setOutputAmount(output);
  };

  const handleSwapDirectionChange = () => {
    const newDirection = swapDirection === 'sui-to-forge' ? 'forge-to-sui' : 'sui-to-forge';
    setSwapDirection(newDirection);
    setInputAmount('');
    setOutputAmount('');
  };

  const handleSwap = async () => {
    if (!currentAccount || !inputAmount || parseFloat(inputAmount) === 0) {
      onSwapError?.('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      const tx = new Transaction();
      const inputValue = parseFloat(inputAmount);

      if (swapDirection === 'sui-to-forge') {
        // Swap SUI for FORGE
        const suiAmount = Math.floor(inputValue * 1e9); // Convert to motes
        
        // Get SUI coin for payment
        const [suiCoin] = tx.splitCoins(tx.gas, [suiAmount]);

        // Call swap_sui_for_forge
        tx.moveCall({
          target: `${CONTRACT_CONFIG.MARKETPLACE_PACKAGE_ID}::forge_swap::swap_sui_for_forge`,
          arguments: [
            tx.object(CONTRACT_CONFIG.FORGE_SWAP_POOL_ID), // pool
            suiCoin, // sui_coin
          ],
        });
      } else {
        // Swap FORGE for SUI - requires user to provide FORGE coins
        // This is more complex and requires getting user's FORGE balance first
        onSwapError?.('FORGE to SUI swap coming soon - requires coin selection UI');
        setIsLoading(false);
        return;
      }

      // Execute transaction
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log('Swap successful:', result);
            onSwapSuccess?.(result.digest, outputAmount);
            setInputAmount('');
            setOutputAmount('');
            setIsLoading(false);
          },
          onError: (error) => {
            console.error('Swap failed:', error);
            onSwapError?.(error instanceof Error ? error.message : 'Swap transaction failed');
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      onSwapError?.(errorMessage);
      setIsLoading(false);
    }
  };

  const getRate = (): string => {
    const suiBal = parseFloat(poolState.suiBalance) / 1e9 || 1; // Convert from motes
    const forgeBal = parseFloat(poolState.forgeBalance) / 1e3 || 1; // Convert from base units
    const rate = forgeBal / suiBal;
    return rate.toFixed(0); // Show as whole number (100000 not 100000.00)
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white mb-2" style={{ textShadow: '0 0 15px rgba(6,182,212,1)' }}>
            💎 FORGE Swap
          </h2>
          <p className="text-cyan-300 text-sm">Exchange SUI ↔ FORGE at current pool rates</p>
        </div>

        {/* Pool Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 bg-black/30 rounded-xl p-4 border border-cyan-500/20">
          <div>
            <p className="text-cyan-300 text-xs font-bold uppercase">SUI in Pool</p>
            <p className="text-white text-lg font-bold">{(parseFloat(poolState.suiBalance) / 1e9).toFixed(2)} SUI</p>
          </div>
          <div>
            <p className="text-purple-300 text-xs font-bold uppercase">FORGE in Pool</p>
            <p className="text-white text-lg font-bold">{(parseFloat(poolState.forgeBalance) / 1e3).toFixed(2)}K FORGE</p>
          </div>
          <div>
            <p className="text-pink-300 text-xs font-bold uppercase">Current Rate</p>
            <p className="text-white text-lg font-bold">1 SUI = {getRate()} FORGE</p>
          </div>
        </div>

        {/* Swap Input */}
        <div className="space-y-4">
          {/* FROM */}
          <div className="bg-black/50 rounded-xl p-4 border border-cyan-500/20">
            <div className="flex justify-between items-center mb-2">
              <label className="text-cyan-300 text-sm font-bold">FROM</label>
              <span className="text-gray-400 text-xs">
                Balance: {swapDirection === 'sui-to-forge' ? '5.00 SUI' : '10,000 FORGE'}
              </span>
            </div>
            <div className="flex gap-3">
              <input
                type="number"
                value={inputAmount}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-white text-3xl font-bold outline-none placeholder-gray-600"
              />
              <div className="flex items-center gap-2 bg-cyan-500/10 rounded-lg px-4 py-2 border border-cyan-500/30">
                <span className="text-white font-bold">
                  {swapDirection === 'sui-to-forge' ? '🌊 SUI' : '💎 FORGE'}
                </span>
              </div>
            </div>
          </div>

          {/* Swap Direction Toggle */}
          <div className="flex justify-center">
            <button
              onClick={handleSwapDirectionChange}
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 rounded-full p-3 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all disabled:opacity-50"
            >
              <span className="text-xl">⇅</span>
            </button>
          </div>

          {/* TO */}
          <div className="bg-black/50 rounded-xl p-4 border border-cyan-500/20">
            <div className="flex justify-between items-center mb-2">
              <label className="text-purple-300 text-sm font-bold">TO</label>
              <span className="text-gray-400 text-xs">
                You get: {outputAmount ? outputAmount : '0.00'}
              </span>
            </div>
            <div className="flex gap-3">
              <input
                type="number"
                value={outputAmount}
                readOnly
                placeholder="0.00"
                className="flex-1 bg-transparent text-white text-3xl font-bold outline-none placeholder-gray-600"
              />
              <div className="flex items-center gap-2 bg-purple-500/10 rounded-lg px-4 py-2 border border-purple-500/30">
                <span className="text-white font-bold">
                  {swapDirection === 'sui-to-forge' ? '💎 FORGE' : '🌊 SUI'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 space-y-3 text-xs text-gray-400">
          <div className="flex justify-between bg-black/30 rounded-lg p-3">
            <span>Estimated Rate</span>
            <span className="text-white">
              {swapDirection === 'sui-to-forge' 
                ? `1 SUI = ${getRate()} FORGE`
                : `1 FORGE = ${(1 / parseFloat(getRate())).toFixed(6)} SUI`
              }
            </span>
          </div>
          <div className="flex justify-between bg-black/30 rounded-lg p-3">
            <span>Fee (0.3%)</span>
            <span className="text-white">{(parseFloat(outputAmount || '0') * 0.003).toFixed(2)}</span>
          </div>
          <div className="flex justify-between bg-black/30 rounded-lg p-3">
            <span>Slippage</span>
            <span className="text-white">-</span>
          </div>
        </div>

        {/* Swap Button */}
        <div className="mt-8">
          {!currentAccount ? (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center">
              <p className="text-red-300 font-bold">Please connect your wallet to swap</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={handleSwap}
                disabled={isLoading || !inputAmount || parseFloat(inputAmount) === 0 || swapDirection === 'forge-to-sui'}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all"
              >
                {isLoading ? '⏳ Processing...' : swapDirection === 'forge-to-sui' ? '🔄 Coming Soon' : '💱 Swap Now'}
              </Button>
              {swapDirection === 'forge-to-sui' && (
                <p className="text-xs text-yellow-400 text-center">FORGE → SUI swap coming soon</p>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
          <p className="text-cyan-300 text-xs">
            💡 <strong>Pool Address:</strong><br />
            <code className="text-gray-300 text-xs break-all">{CONTRACT_CONFIG.FORGE_SWAP_POOL_ID}</code>
          </p>
        </div>
      </div>
    </div>
  );
};
