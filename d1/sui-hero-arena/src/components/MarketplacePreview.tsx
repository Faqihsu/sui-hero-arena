import React from 'react';

interface MarketplaceListing {
  id: string;
  heroName: string;
  level: number;
  rarity: string;
  price: number;
  seller: string;
}

interface MarketplacePreviewProps {
  activeListings?: number;
  recentTrades?: number;
  totalVolume?: number;
}

export const MarketplacePreview: React.FC<MarketplacePreviewProps> = ({
  activeListings = 12,
  recentTrades = 234,
  totalVolume = 5820
}) => {
  const mockListings: MarketplaceListing[] = [
    { id: '1', heroName: 'Flameblade', level: 25, rarity: 'RARE', price: 250, seller: '0x1a2b...' },
    { id: '2', heroName: 'Frostmage', level: 18, rarity: 'COMMON', price: 120, seller: '0x3c4d...' },
    { id: '3', heroName: 'Shadowrogue', level: 32, rarity: 'EPIC', price: 450, seller: '0x5e6f...' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🏪 Hero Marketplace 🏪
        </h1>
        <p className="text-cyan-300/60 text-sm">Trade and collect legendary heroes</p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 p-6 rounded-xl border border-cyan-500/40 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📦</div>
            <div>
              <div className="text-2xl font-black text-cyan-400">{activeListings}</div>
              <div className="text-sm text-cyan-300/60">Active Listings</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/40 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🔄</div>
            <div>
              <div className="text-2xl font-black text-purple-400">{recentTrades}</div>
              <div className="text-sm text-purple-300/60">Recent Trades</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-900/20 to-yellow-900/20 p-6 rounded-xl border border-pink-500/40 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💰</div>
            <div>
              <div className="text-2xl font-black text-pink-400">{totalVolume} SUI</div>
              <div className="text-sm text-pink-300/60">24h Volume</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Listings */}
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          ⭐ Featured Listings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 p-4 rounded-lg border border-cyan-500/20 hover:border-cyan-500/60 transition-all cursor-pointer hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{listing.heroName}</h3>
                  <div className="flex items-center gap-2 text-sm text-cyan-300">
                    <span>Lv. {listing.level}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      listing.rarity === 'EPIC' ? 'bg-purple-500/30 text-purple-300' :
                      listing.rarity === 'RARE' ? 'bg-blue-500/30 text-blue-300' :
                      'bg-slate-500/30 text-slate-300'
                    }`}>
                      {listing.rarity}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-700/50 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cyan-300/60">Price</span>
                    <span className="text-xl font-black text-cyan-400">{listing.price} SUI</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">Seller: {listing.seller}</div>
                </div>

                <button className="w-full mt-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-2 rounded-lg transition-all">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/50">
            View All Listings
          </button>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 p-6 rounded-xl border border-blue-500/40 backdrop-blur-sm text-center">
        <h3 className="text-xl font-bold text-blue-300 mb-2">🚀 Full Marketplace Coming Soon</h3>
        <p className="text-blue-300/60 text-sm">Complete trading system with escrow, reputation, and advanced filters</p>
      </div>
    </div>
  );
};
