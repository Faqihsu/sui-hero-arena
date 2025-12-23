import React, { useState, useMemo } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useHeroes } from '@/hooks/useHeroes';
import { useMarketplaceListing, useMarketplacePurchase, useMarketplaceListings } from '@/hooks';
import { HeroCard } from './HeroCard';
import { ForgeSwap } from './ForgeSwap';

interface MarketplaceListingUI {
  heroId: string;
  heroName: string;
  level: number;
  rarity: string;
  imageUrl: string;
  priceInForge: number;
  sellerAddress: string;
  createdAt: number;
}

type MarketplaceTab = 'browse' | 'my-listings' | 'sell' | 'swap';

export const Marketplace: React.FC = () => {
  const account = useCurrentAccount();
  const { heroes } = useHeroes(account?.address || null);
  const { createListing } = useMarketplaceListing();
  const { purchaseHero, isPurchasing } = useMarketplacePurchase();
  const { listings: blockchainListings, isLoading: isLoadingListings } = useMarketplaceListings();

  const [activeTab, setActiveTab] = useState<MarketplaceTab>('browse');
  const [selectedHeroToSell, setSelectedHeroToSell] = useState<string | null>(null);
  const [sellPrice, setSellPrice] = useState<string>('100');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock listings for demonstration (will be replaced with blockchain data)
  const [mockListings, setMockListings] = useState<MarketplaceListingUI[]>([
    {
      heroId: 'mock-1',
      heroName: 'Flameblade',
      level: 25,
      rarity: 'RARE',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Flameblade',
      priceInForge: 250,
      sellerAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
      createdAt: Date.now() - 86400000,
    },
    {
      heroId: 'mock-2',
      heroName: 'Frostmage',
      level: 18,
      rarity: 'COMMON',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frostmage',
      priceInForge: 120,
      sellerAddress: '0x9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f',
      createdAt: Date.now() - 172800000,
    },
    {
      heroId: 'mock-3',
      heroName: 'Shadowrogue',
      level: 32,
      rarity: 'EPIC',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shadowrogue',
      priceInForge: 450,
      sellerAddress: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      createdAt: Date.now() - 259200000,
    },
  ]);

  // Get user's active listings (heroes they've listed)
  const userListings = useMemo(() => {
    return mockListings.filter(l => l.sellerAddress === account?.address);
  }, [mockListings, account?.address]);

  // Get heroes available to sell (not yet listed)
  const availableHeroesToSell = useMemo(() => {
    const listedIds = new Set(userListings.map(l => l.heroId));
    return heroes.filter(h => !listedIds.has(h.id));
  }, [heroes, userListings]);

  const handleSellHero = async () => {
    if (!selectedHeroToSell || !sellPrice || !account?.address) return;

    setIsSubmitting(true);
    try {
      const heroToSell = heroes.find(h => h.id === selectedHeroToSell);
      if (!heroToSell) return;

      const priceAmount = parseInt(sellPrice);
      if (isNaN(priceAmount) || priceAmount <= 0) {
        alert('Please enter a valid price');
        return;
      }

      // Call marketplace contract to create listing
      const result = await createListing({
        heroId: selectedHeroToSell,
        heroName: heroToSell.name,
        level: heroToSell.stats.level,
        rarity: 'RARE', // You can make this dynamic
        imageUrl: heroToSell.imageUrl,
        price: priceAmount,
      });

      if (result) {
        // Add to mock listings
        const newListing: MarketplaceListingUI = {
          heroId: selectedHeroToSell,
          heroName: heroToSell.name,
          level: heroToSell.stats.level,
          rarity: 'RARE',
          imageUrl: heroToSell.imageUrl,
          priceInForge: priceAmount,
          sellerAddress: account.address,
          createdAt: Date.now(),
        };
        setMockListings([...mockListings, newListing]);
        setSelectedHeroToSell(null);
        setSellPrice('100');
        setActiveTab('my-listings');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyHero = async (listing: MarketplaceListingUI) => {
    if (!account?.address) {
      alert('Please connect your wallet');
      return;
    }

    try {
      const result = await purchaseHero(
        listing.heroId,
        listing.priceInForge,
        listing.sellerAddress
      );

      if (result) {
        // Remove from listings
        setMockListings(mockListings.filter(l => l.heroId !== listing.heroId));
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🏪 Hero Marketplace 🏪
        </h1>
        <p className="text-cyan-200 text-sm font-semibold">Trade heroes with FORGE tokens</p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 p-6 rounded-xl border border-cyan-500/40 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📦</div>
            <div>
              <div className="text-2xl font-black text-cyan-400">{mockListings.length}</div>
              <div className="text-sm text-cyan-300 font-semibold">Active Listings</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/40 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🔄</div>
            <div>
              <div className="text-2xl font-black text-purple-400">{mockListings.length * 2}</div>
              <div className="text-sm text-purple-300 font-semibold">Total Trades</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-900/20 to-yellow-900/20 p-6 rounded-xl border border-pink-500/40 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💎</div>
            <div>
              <div className="text-2xl font-black text-pink-400">{mockListings.reduce((sum, l) => sum + l.priceInForge, 0)}</div>
              <div className="text-sm text-pink-300/60">Total Volume (FORGE)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-3 py-2 font-bold text-xs md:text-sm transition-all whitespace-nowrap ${
            activeTab === 'browse'
              ? 'text-cyan-300 border-b-2 border-cyan-400 font-extrabold'
              : 'text-cyan-200/70 hover:text-cyan-300'
          }`}
        >
          📖 Browse
        </button>
        <button
          onClick={() => setActiveTab('my-listings')}
          className={`px-3 py-2 font-bold text-xs md:text-sm transition-all whitespace-nowrap ${
            activeTab === 'my-listings'
              ? 'text-cyan-300 border-b-2 border-cyan-400 font-extrabold'
              : 'text-cyan-200/70 hover:text-cyan-300'
          }`}
        >
          📋 My Listings
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`px-3 py-2 font-bold text-xs md:text-sm transition-all whitespace-nowrap ${
            activeTab === 'sell'
              ? 'text-cyan-300 border-b-2 border-cyan-400 font-extrabold'
              : 'text-cyan-200/70 hover:text-cyan-300'
          }`}
        >
          💰 Sell
        </button>
        <button
          onClick={() => setActiveTab('swap')}
          className={`px-3 py-2 font-bold text-xs md:text-sm transition-all whitespace-nowrap ${
            activeTab === 'swap'
              ? 'text-cyan-300 border-b-2 border-cyan-400 font-extrabold'
              : 'text-cyan-200/70 hover:text-cyan-300'
          }`}
        >
          💱 Swap
        </button>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        {/* Browse Listings Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Available Heroes</h2>
            {mockListings.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No listings available at the moment. Be the first to list!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockListings.map((listing) => (
                  <div
                    key={listing.heroId}
                    className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 p-4 rounded-lg border border-cyan-500/20 hover:border-cyan-500/60 transition-all"
                  >
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{listing.heroName}</h3>
                        <div className="flex items-center gap-2 text-sm text-cyan-300 mt-1">
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

                      {listing.imageUrl && (
                        <img 
                          src={listing.imageUrl} 
                          alt={listing.heroName}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}

                      <div className="border-t border-slate-700/50 pt-3">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-cyan-300/60">Price</span>
                          <span className="text-xl font-black text-cyan-400">{listing.priceInForge} FORGE</span>
                        </div>
                        <button
                          onClick={() => handleBuyHero(listing)}
                          disabled={isPurchasing || listing.sellerAddress === account?.address}
                          className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-2 rounded-lg transition-all"
                        >
                          {listing.sellerAddress === account?.address ? 'Your Listing' : isPurchasing ? 'Purchasing...' : 'Buy Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Listings Tab */}
        {activeTab === 'my-listings' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Your Listings</h2>
            {userListings.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                You haven't listed any heroes yet. Go to "Sell Hero" to get started!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userListings.map((listing) => (
                  <div
                    key={listing.heroId}
                    className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 p-4 rounded-lg border border-purple-500/20"
                  >
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{listing.heroName}</h3>
                        <div className="flex items-center gap-2 text-sm text-cyan-300 mt-1">
                          <span>Lv. {listing.level}</span>
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/30 text-purple-300">
                            ✓ Listed
                          </span>
                        </div>
                      </div>

                      {listing.imageUrl && (
                        <img 
                          src={listing.imageUrl} 
                          alt={listing.heroName}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}

                      <div className="border-t border-slate-700/50 pt-3">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-cyan-300/60">Listed Price</span>
                          <span className="text-xl font-black text-purple-400">{listing.priceInForge} FORGE</span>
                        </div>
                        <button
                          className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-2 rounded-lg transition-all"
                        >
                          Cancel Listing
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sell Hero Tab */}
        {activeTab === 'sell' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-white">List Your Hero</h2>

            {availableHeroesToSell.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                All your heroes are already listed or you have no heroes. Mint or acquire heroes first!
              </div>
            ) : (
              <div className="space-y-4">
                {/* Hero Selection */}
                <div className="space-y-3">
                  <label className="block text-white font-bold">Select Hero to Sell</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableHeroesToSell.map((hero) => (
                      <button
                        key={hero.id}
                        onClick={() => setSelectedHeroToSell(hero.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedHeroToSell === hero.id
                            ? 'border-cyan-400 bg-cyan-500/10'
                            : 'border-slate-600 hover:border-slate-500 bg-slate-700/20'
                        }`}
                      >
                        <div className="font-bold text-white">{hero.name}</div>
                        <div className="text-sm text-cyan-300">Lv. {hero.stats.level}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Input */}
                <div className="space-y-3">
                  <label className="block text-white font-bold">Listing Price (FORGE)</label>
                  <input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    min="1"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="Enter price in FORGE tokens"
                  />
                  <div className="text-xs text-slate-400">
                    Fee: {Math.round(parseInt(sellPrice) * 0.05)} FORGE (5%)
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSellHero}
                  disabled={!selectedHeroToSell || !sellPrice || isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold rounded-lg transition-all"
                >
                  {isSubmitting ? 'Listing...' : 'List Hero Now'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Swap Tab */}
        {activeTab === 'swap' && (
          <div className="flex justify-center py-8">
            <ForgeSwap 
              onSwapSuccess={(txHash, amount) => {
                console.log(`Swap successful! Got ${amount} tokens. Tx: ${txHash}`);
              }}
              onSwapError={(error) => {
                console.error(`Swap failed: ${error}`);
              }}
            />
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 p-6 rounded-xl border border-blue-500/40 backdrop-blur-sm text-center">
        <h3 className="text-xl font-bold text-blue-300 mb-2">💎 Trading with FORGE Tokens</h3>
        <p className="text-blue-300/60 text-sm">
          Buy and sell your heroes using FORGE tokens. Secure blockchain transactions with instant ownership transfer.
        </p>
      </div>
    </div>
  );
};
