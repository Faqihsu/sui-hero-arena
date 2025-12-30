import React, { useState } from 'react';

export const Shop: React.FC = () => {
  const [cart, setCart] = useState<string[]>([]);

  const items = [
    {
      id: 'health-potion',
      name: 'Health Potion',
      description: 'Restore 50 HP to your hero',
      price: 10,
      icon: '🧪',
      category: 'potions',
    },
    {
      id: 'mana-potion',
      name: 'Mana Potion',
      description: 'Restore 30 Chakra to your hero',
      price: 15,
      icon: '🔮',
      category: 'potions',
    },
    {
      id: 'strength-scroll',
      name: 'Strength Scroll',
      description: '+5 Attack permanently',
      price: 50,
      icon: '📜',
      category: 'scrolls',
    },
    {
      id: 'defense-scroll',
      name: 'Defense Scroll',
      description: '+5 Defense permanently',
      price: 50,
      icon: '📜',
      category: 'scrolls',
    },
    {
      id: 'hero-egg',
      name: 'Mystery Hero Egg',
      description: 'Hatch for a random rare hero',
      price: 200,
      icon: '🥚',
      category: 'rare',
    },
    {
      id: 'legendary-gear',
      name: 'Legendary Armor',
      description: '+10 All Stats, Unique Appearance',
      price: 500,
      icon: '⚔️',
      category: 'rare',
    },
  ];

  const categories = Array.from(new Set(items.map((i) => i.category)));
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);

  const filteredItems = items.filter((i) => i.category === selectedCategory);
  const cartTotal = cart.length * 100; // Simplified pricing

  const toggleCart = (itemId: string) => {
    if (cart.includes(itemId)) {
      setCart(cart.filter((id) => id !== itemId));
    } else {
      setCart([...cart, itemId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Shop Header */}
      <div className="card-glow rounded-xl p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30">
        <h1 className="text-3xl font-bold mb-2 text-green-300">🛍️ Hero Shop</h1>
        <p className="text-green-300/70">Buy potions, scrolls, and rare items to enhance your heroes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shop Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Filter */}
          <div className="space-y-3">
            <p className="text-cyan-300/60 font-bold">Shop Categories:</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all capitalize ${
                    selectedCategory === cat
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-800/50 text-green-300 border border-green-500/20 hover:border-green-500/50'
                  }`}
                >
                  {cat === 'potions' && '🧪'} {cat === 'scrolls' && '📜'} {cat === 'rare' && '⭐'} {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/50 border border-green-500/20 rounded-lg p-4 hover:border-green-500/50 hover:bg-slate-800/70 transition-all group"
              >
                {/* Item Icon */}
                <div className="text-4xl mb-3">{item.icon}</div>

                {/* Item Info */}
                <h3 className="text-lg font-bold text-green-300 mb-1">{item.name}</h3>
                <p className="text-sm text-cyan-300/60 mb-3">{item.description}</p>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-yellow-400">💰</span>
                    <span className="text-lg font-bold text-yellow-300">{item.price}</span>
                  </div>
                  <button
                    onClick={() => toggleCart(item.id)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      cart.includes(item.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-green-600/20 text-green-300 hover:bg-green-600/40'
                    }`}
                  >
                    {cart.includes(item.id) ? '✓ Added' : 'Add'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="card-glow rounded-xl p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-cyan-500/20 sticky top-20">
            <h2 className="text-xl font-bold text-cyan-300 mb-4">🛒 Shopping Cart</h2>

            {cart.length === 0 ? (
              <p className="text-cyan-300/60 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                  {cart.map((itemId) => {
                    const item = items.find((i) => i.id === itemId);
                    return (
                      <div
                        key={itemId}
                        className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item?.icon}</span>
                          <span className="text-cyan-300">{item?.name}</span>
                        </div>
                        <button
                          onClick={() => toggleCart(itemId)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Cart Summary */}
                <div className="border-t border-cyan-500/20 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-300/60">Items:</span>
                    <span className="text-cyan-300">{cart.length}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-cyan-300">Total:</span>
                    <span className="text-yellow-400">
                      💰 {cart.reduce((sum, id) => sum + (items.find((i) => i.id === id)?.price || 0), 0)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-3 rounded-lg font-bold transition-all">
                  💳 Checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
