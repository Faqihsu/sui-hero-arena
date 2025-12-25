import React from 'react';
import { ConnectButton } from '@mysten/dapp-kit';
import { MintHeroComponent, ForgeSwapComponent } from '@/components';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
            🎮 Sui Hero Arena
          </h1>
          <ConnectButton />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MintHeroComponent />
          <ForgeSwapComponent />
        </div>

        {/* Info */}
        <div className="mt-12 p-6 bg-cyan-950/20 rounded-lg border border-cyan-500/20 text-center">
          <p className="text-cyan-300/70 text-sm">
            Network: <strong>Sui Testnet</strong> | 
            Heroes are NFTs on-chain | 
            FORGE is a tradeable token
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
