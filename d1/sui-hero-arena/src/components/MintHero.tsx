import React, { useState } from 'react';
import { useMintHero } from '@/hooks/useMintHero';

export const MintHeroComponent: React.FC = () => {
  const { mint, isConnected } = useMintHero();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [heroClass, setHeroClass] = useState('Assassin');
  const [message, setMessage] = useState('');

  const handleMint = async () => {
    if (!name.trim() || !imageUrl.trim()) {
      setMessage('❌ Fill all fields');
      return;
    }

    try {
      setLoading(true);
      setMessage('⏳ Minting hero...');
      
      await mint({ name, imageUrl, heroClass });
      
      setMessage('✅ Hero minted successfully!');
      setName('');
      setImageUrl('');
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
    <div className="space-y-4 p-6 bg-cyan-950/40 rounded-lg border border-cyan-500/30">
      <h2 className="text-2xl font-bold text-cyan-300">🔨 Mint Hero</h2>
      
      <input
        type="text"
        placeholder="Hero name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 bg-cyan-900/50 border border-cyan-500/30 rounded text-white placeholder-cyan-400/50"
        disabled={loading}
      />
      
      <input
        type="url"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full px-4 py-2 bg-cyan-900/50 border border-cyan-500/30 rounded text-white placeholder-cyan-400/50"
        disabled={loading}
      />

      <select
        value={heroClass}
        onChange={(e) => setHeroClass(e.target.value)}
        className="w-full px-4 py-2 bg-cyan-900/50 border border-cyan-500/30 rounded text-white"
        disabled={loading}
      >
        <option>Assassin</option>
        <option>Warrior</option>
        <option>Mage</option>
        <option>Paladin</option>
      </select>

      <button
        onClick={handleMint}
        disabled={loading}
        className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded disabled:opacity-50"
      >
        {loading ? '⏳ Processing...' : '✨ Mint Hero'}
      </button>

      {message && (
        <p className="text-sm text-center break-all">{message}</p>
      )}
    </div>
  );
};
