import React, { useState } from 'react';
import { useForgeSwap } from '@/hooks/useForgeSwap';

export const ForgeSwapComponent: React.FC = () => {
  const { swapSuiForForge, swapForgeForSui, isConnected } = useForgeSwap();
  const [loading, setLoading] = useState(false);
  const [suiAmount, setSuiAmount] = useState('0.1');
  const [forgeAmount, setForgeAmount] = useState('100000');
  const [message, setMessage] = useState('');

  const handleSwapSuiForForge = async () => {
    try {
      setLoading(true);
      setMessage('⏳ Swapping SUI for FORGE...');
      
      const amount = Math.floor(parseFloat(suiAmount) * 1_000_000_000);
      await swapSuiForForge(amount);
      
      setMessage('✅ Swap successful!');
      setSuiAmount('0.1');
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessage(`❌ Error: ${msg}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapForgeForSui = async () => {
    try {
      setLoading(true);
      setMessage('⏳ Swapping FORGE for SUI...');
      
      const amount = Math.floor(parseFloat(forgeAmount));
      await swapForgeForSui(amount);
      
      setMessage('✅ Swap successful!');
      setForgeAmount('100000');
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessage(`❌ Error: ${msg}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return <div className="text-red-400">❌ Connect wallet first</div>;
  }

  return (
    <div className="space-y-4 p-6 bg-purple-950/40 rounded-lg border border-purple-500/30">
      <h2 className="text-2xl font-bold text-purple-300">💰 FORGE Swap</h2>

      <div className="space-y-2">
        <label className="text-purple-300 text-sm">Swap SUI → FORGE</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="SUI amount"
            value={suiAmount}
            onChange={(e) => setSuiAmount(e.target.value)}
            className="flex-1 px-4 py-2 bg-purple-900/50 border border-purple-500/30 rounded text-white"
            disabled={loading}
            step="0.01"
          />
          <button
            onClick={handleSwapSuiForForge}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded disabled:opacity-50"
          >
            {loading ? '⏳' : '🔄'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-purple-300 text-sm">Swap FORGE → SUI</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="FORGE amount"
            value={forgeAmount}
            onChange={(e) => setForgeAmount(e.target.value)}
            className="flex-1 px-4 py-2 bg-purple-900/50 border border-purple-500/30 rounded text-white"
            disabled={loading}
            step="1000"
          />
          <button
            onClick={handleSwapForgeForSui}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded disabled:opacity-50"
          >
            {loading ? '⏳' : '🔄'}
          </button>
        </div>
      </div>

      {message && (
        <p className="text-sm text-center break-all">{message}</p>
      )}
    </div>
  );
};
