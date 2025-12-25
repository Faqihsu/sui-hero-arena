import React, { useState } from 'react';
import { useMintHero } from '@/hooks/useMintHero';

export const MintHeroComponent: React.FC = () => {
  const { mint, isConnected } = useMintHero();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [heroClass, setHeroClass] = useState('Assassin');
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (url: string) => {
    setImageUrl(url);
    setImagePreview(url);
  };

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
      setImagePreview('');
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessage(`❌ Error: ${msg}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="card-glow p-6 rounded-xl text-center">
        <p className="text-red-400 font-bold">❌ Connect your wallet first!</p>
      </div>
    );
  }

  return (
    <div className="card-glow p-6 rounded-xl space-y-4">
      <h2 className="text-2xl font-bold glow-text-cyan text-center">🔨 Forge New Hero</h2>

      {/* Image Preview */}
      {imagePreview && (
        <div className="relative rounded-lg overflow-hidden h-40 mb-4">
          <img
            src={imagePreview}
            alt="preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <input
        type="text"
        placeholder="Hero name (e.g., Shadow Knight)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-400/50 focus:outline-none focus:border-cyan-500 transition-all"
        disabled={loading}
      />

      <input
        type="url"
        placeholder="Image URL (e.g., https://...)"
        value={imageUrl}
        onChange={(e) => handleImageChange(e.target.value)}
        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-400/50 focus:outline-none focus:border-cyan-500 transition-all"
        disabled={loading}
      />

      <select
        value={heroClass}
        onChange={(e) => setHeroClass(e.target.value)}
        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-all"
        disabled={loading}
      >
        <option>Assassin</option>
        <option>Warrior</option>
        <option>Mage</option>
        <option>Paladin</option>
        <option>Ranger</option>
        <option>Rogue</option>
      </select>

      <button
        onClick={handleMint}
        disabled={loading}
        className="w-full btn-primary text-lg py-3"
      >
        {loading ? '⏳ Processing...' : '✨ Mint Hero'}
      </button>

      {message && (
        <p className="text-sm text-center break-all p-3 rounded-lg bg-slate-800/50 border border-cyan-500/20 animate-slide-up">
          {message}
        </p>
      )}
    </div>
  );
};
