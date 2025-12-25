import React, { useState } from 'react';
import { ConnectButton } from '@mysten/dapp-kit';
import { MintHeroComponent, ForgeSwapComponent, HeroCollection, BattleArena } from '@/components';
import './App.css';

type Tab = 'home' | 'collection' | 'forge' | 'swap' | 'battle';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'collection', label: 'Collection', icon: '🎨' },
    { id: 'forge', label: 'Forge', icon: '🔨' },
    { id: 'swap', label: 'Swap', icon: '💰' },
    { id: 'battle', label: 'Battle', icon: '⚔️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
            🎮 Sui Hero Arena
          </h1>
          <ConnectButton />
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-900/40 backdrop-blur border-b border-cyan-500/20 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'text-cyan-300 border-b-2 border-cyan-500 bg-cyan-500/10'
                    : 'text-cyan-300/60 hover:text-cyan-300 border-b-2 border-transparent'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center py-20">
              <h2 className="text-5xl font-black text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text mb-4">
                Welcome to Sui Hero Arena
              </h2>
              <p className="text-cyan-300/70 text-lg mb-8">
                Mint powerful NFT heroes, train them, battle others, and trade on-chain!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-cyan-600/10 to-cyan-900/10 border border-cyan-500/30 rounded-lg p-6">
                  <div className="text-3xl mb-2">🎨</div>
                  <h3 className="text-cyan-300 font-bold mb-2">Mint Heroes</h3>
                  <p className="text-cyan-300/60 text-sm">Create unique heroes with custom stats and images</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600/10 to-purple-900/10 border border-purple-500/30 rounded-lg p-6">
                  <div className="text-3xl mb-2">⚔️</div>
                  <h3 className="text-purple-300 font-bold mb-2">Epic Battles</h3>
                  <p className="text-purple-300/60 text-sm">Challenge other heroes and prove your strength</p>
                </div>
                <div className="bg-gradient-to-br from-orange-600/10 to-orange-900/10 border border-orange-500/30 rounded-lg p-6">
                  <div className="text-3xl mb-2">💰</div>
                  <h3 className="text-orange-300 font-bold mb-2">Trade & Swap</h3>
                  <p className="text-orange-300/60 text-sm">Swap SUI for FORGE tokens and trade on marketplace</p>
                </div>
              </div>
            </div>

            {/* Quick Start */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MintHeroComponent />
              <ForgeSwapComponent />
            </div>
          </div>
        )}

        {activeTab === 'collection' && <HeroCollection />}
        {activeTab === 'forge' && <MintHeroComponent />}
        {activeTab === 'swap' && <ForgeSwapComponent />}
        {activeTab === 'battle' && <BattleArena />}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-cyan-500/20 text-center text-cyan-300/50 text-sm">
        <p>🚀 Powered by Sui Blockchain | Testnet</p>
      </footer>
    </div>
  );
}

export default App;
