import React, { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui/client';
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
  const [swapDirection, setSwapDirection] = useState<SwapDirection>('sui-to-forge');
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [poolState, setPoolState] = useState<PoolState>({
    suiBalance: '0',
    forgeBalance: '0',
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
            suiBalance: fields.sui_balance?.toString() || '0',
            forgeBalance: fields.forge_balance?.toString() || '0',
            totalSupply: fields.total_supply?.toString() || '0',
          });
        }
      } catch (error) {
        console.error('Failed to fetch pool state:', error);
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
    const suiBal = parseFloat(poolState.suiBalance) || 1;
    const forgeBal = parseFloat(poolState.forgeBalance) || 1;

    // Constant product formula: (x + inputAmount) * (y - outputAmount) = x * y
    // Solving for outputAmount: outputAmount = y - (x * y) / (x + inputAmount)
    
    if (direction === 'sui-to-forge') {
      // Input is SUI, output is FORGE
      // inputAmount in motes (1 SUI = 1e9 motes)
      const inputMotes = input * 1e9;
      const outputForge = forgeBal - (suiBal * forgeBal) / (suiBal + inputMotes / 1e9);
      return Math.max(0, outputForge).toFixed(2);
    } else {
      // Input is FORGE, output is SUI
      // forgeBal in base units
      const outputSui = suiBal - (suiBal * forgeBal) / (forgeBal + input);
      return Math.max(0, outputSui / 1e9).toFixed(6);
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
      // This would normally call the Move contract via your wallet provider
      // For now, we're showing the UI structure
      // You'd implement actual transaction signing here

      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: currentAccount.address,
          direction: swapDirection,
          inputAmount: inputAmount,
          poolId: CONTRACT_CONFIG.FORGE_SWAP_POOL_ID,
        }),
      });

      if (!response.ok) throw new Error('Swap failed');

      const { transactionHash } = await response.json();
      onSwapSuccess?.(transactionHash, outputAmount);
      setInputAmount('');
      setOutputAmount('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      onSwapError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getRate = (): string => {
    const suiBal = parseFloat(poolState.suiBalance) || 1;
    const forgeBal = parseFloat(poolState.forgeBalance) || 1;
    const rate = forgeBal / suiBal;
    return rate.toFixed(2);
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
            <Button
              onClick={handleSwap}
              disabled={isLoading || !inputAmount || parseFloat(inputAmount) === 0}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all"
            >
              {isLoading ? 'Swapping...' : 'Swap Now'}
            </Button>
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
