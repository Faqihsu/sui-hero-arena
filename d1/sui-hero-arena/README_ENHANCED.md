# 🎮 Sui Hero Arena - Complete Game Platform

> A blockchain-based hero management and battle game built on Sui Network with comprehensive NFT trading features.

## 🌟 Features

### 🎯 Core Gameplay
- **Mint Heroes** - Create unique hero NFTs with custom stats
- **Train Heroes** - Level up and improve hero attributes
- **Battle System** - 1v1 real-time combat with damage calculation
- **Leaderboard** - Rank heroes by various metrics
- **Inventory** - Manage your hero collection

### 💼 Marketplace
- **Buy/Sell Heroes** - Trade on decentralized marketplace
- **FORGE Tokens** - Utility token for in-game transactions
- **DEX Swap** - Trade SUI ↔ FORGE tokens
- **Item Shop** - Purchase potions, scrolls, and rare items

### 📊 Analytics
- **Dashboard** - Real-time statistics and overview
- **Leaderboard** - Multiple ranking systems
- **Statistics** - Detailed performance metrics
- **Class Distribution** - Visual hero breakdown

---

## 🚀 Quick Start

### Prerequisites
- Node.js v20+
- npm or pnpm
- Sui Wallet (browser extension)
- Testnet SUI tokens

### Installation

```bash
# Clone or navigate to project
cd d1/sui-hero-arena

# Install dependencies
npm install

# Start development server
npm run dev
```

**Access**: `http://localhost:3001`

---

## 📱 UI Pages

| Page | Icon | Features |
|------|------|----------|
| **Home** | 🏠 | Welcome, feature overview, quick start |
| **Dashboard** | 📊 | Statistics, metrics, performance overview |
| **Inventory** | 🎒 | Hero management, training, filtering |
| **Leaderboard** | 🏆 | Rankings, sorting, top performers |
| **Forge** | 🔨 | Mint new heroes, custom creation |
| **Shop** | 🛍️ | Buy items, potions, upgrades |
| **Battle** | ⚔️ | Combat system, 1v1 battles |

---

## 🎮 Game Mechanics

### Hero Creation
```
Starting Stats:
- HP: 100
- Level: 1
- Attack: 10
- Defense: 5
- Chakra: 50
```

### Hero Classes
- ⚔️ Warrior
- 🔮 Mage
- 🗡️ Assassin
- ✨ Paladin
- 🏹 Ranger
- 👻 Rogue

### Battle System
- **Chakra Cost**: 5 per attack
- **Damage Formula**: (Attacker ATK + Level) - Defender DEF
- **Winner**: Hero with more remaining HP
- **Rewards**: Winner gains +1 Level

### Training
- **Cost**: Small amount per training
- **Gains**: 
  - Level +1
  - Attack +2
  - Defense +1
  - Chakra +5

---

## 💻 Technical Stack

### Frontend
```
React 18 + TypeScript
├── Tailwind CSS (Styling)
├── Vite (Build tool)
├── @mysten/dapp-kit (Sui integration)
└── Custom hooks (Game logic)
```

### Smart Contracts (Move)
```
Sui Framework
├── hero.move (NFT & battles)
├── forge_token.move (Utility token)
├── forge_swap.move (DEX pool)
└── marketplace.move (Trading)
```

### Blockchain
- **Network**: Sui Testnet
- **Language**: Move
- **Version**: 2024.beta

---

## 📦 Package IDs (Testnet)

### Coin Contract
```
0x0109444aaa5930bc79f6c94f0c7e0c6154c9acaf7f429505b2a873a9fbd44d7b
```

### Hero Contract
```
0x9cb978970619b9c56f21ae6a7928ec45f3543d7a7fd80d74bc7df4bba53a1cf4
```

### Marketplace Contract
```
0xe53b20a0ff583c08b16d7085d3da239f3a251996f8f592ab908d69e78f09df21
```

### Important IDs
- **Marketplace Admin**: `0x04b2475eead8c77cc11a2509130262d33d98b0027140291504a2cd1d285bcff7`
- **Swap Pool**: `0xaf2deb1162e4479ba6a33f40dcc2dff8af2fd1b4c132e780af40f7dfbbd7cced`
- **Treasury Cap**: `0xcd79e99d9818ec3c82971ecd0f81e203a2534b17d24a557192ca56b7f085d153`

---

## 🎨 UI Components

### Dashboard
- Statistics cards with real-time data
- Class distribution visualization
- Quick action buttons
- Performance metrics

### Inventory
- Grid view of heroes
- Class filtering system
- Training interface
- Inventory statistics

### Leaderboard
- Sortable hero rankings
- Visual rank badges
- Total score calculation
- Multi-criterion sorting

### Shop
- Item categories (Potions, Scrolls, Rare)
- Shopping cart system
- Real-time total calculation
- Checkout interface

---

## 🔧 Configuration

**File**: `src/config/contract.ts`

Update with your contract addresses:

```typescript
export const CONTRACT_CONFIG = {
  PACKAGE_ID: '0x...',
  MARKETPLACE_PACKAGE_ID: '0x...',
  MARKETPLACE_ADMIN_ID: '0x...',
  FORGE_TOKEN_TYPE: '0x...::forge_token::FORGE_TOKEN',
  FORGE_TREASURY_CAP: '0x...',
  FORGE_SWAP_POOL_ID: '0x...',
  NETWORK: 'testnet',
};
```

---

## 📊 Hero Stats

| Stat | Min | Max | Usage |
|------|-----|-----|-------|
| HP | 1 | 200+ | Battle survival |
| Level | 1 | 100+ | Power indicator |
| Attack | 1 | 50+ | Damage output |
| Defense | 1 | 30+ | Damage reduction |
| Chakra | 1 | 150+ | Skill resource |

---

## 🎯 Gameplay Flow

```
1. Connect Wallet
   ↓
2. Mint Hero (or start with existing)
   ↓
3. View in Inventory
   ↓
4. Train to level up
   ↓
5. Check Leaderboard
   ↓
6. Battle other heroes
   ↓
7. Earn reputation
   ↓
8. Trade on Marketplace
```

---

## 🔐 Security

- ✅ Wallet connection via Sui Wallet
- ✅ Transactions signed by user
- ✅ On-chain verification
- ✅ No private keys stored
- ✅ Smart contract audited patterns

---

## 🐛 Known Issues & Fixes

### Port Already in Use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3001
```

### Wallet Not Connecting
1. Ensure Sui Wallet extension is installed
2. Switch to Testnet in wallet
3. Refresh page
4. Try connecting again

### Slow Transactions
- Network congestion
- Insufficient gas budget
- Increase gas budget in config

---

## 📚 File Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx
│   ├── Inventory.tsx
│   ├── Leaderboard.tsx
│   ├── Shop.tsx
│   ├── MintHero.tsx
│   ├── BattleArena.tsx
│   ├── HeroCard.tsx
│   └── index.ts
│
├── hooks/              # Custom React hooks
│   ├── useMintHero.ts
│   ├── useHeroes.ts
│   ├── useTrainHero.ts
│   ├── useForgeSwap.ts
│   └── index.ts
│
├── config/
│   └── contract.ts     # Contract configuration
│
├── types/
│   └── index.ts        # TypeScript types
│
├── App.tsx             # Main app
└── index.tsx           # Entry point
```

---

## 🚀 Deployment

### To Testnet
```bash
# Build frontend
npm run build

# Deploy to your hosting
# (Vercel, Netlify, etc.)
```

### To Mainnet
1. Deploy contracts to mainnet
2. Update `NETWORK: 'mainnet'` in config
3. Update package IDs
4. Rebuild and deploy frontend

---

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Frontend Enhancements](./FRONTEND_ENHANCEMENTS.md)
- [Complete Summary](./COMPLETE_SUMMARY.md)
- [Sui Docs](https://docs.sui.io/)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with [Sui Framework](https://sui.io/)
- UI powered by [Tailwind CSS](https://tailwindcss.com/)
- Web3 integration via [@mysten/dapp-kit](https://github.com/MystenLabs/sui)

---

## 📞 Support

### Resources
- 📖 [Sui Documentation](https://docs.sui.io/)
- 🔗 [Testnet Explorer](https://explorer.sui.io/?network=testnet)
- 💬 [Sui Discord](https://discord.gg/sui)
- 🐦 [Twitter Updates](https://twitter.com/SuiNetwork)

### Troubleshooting
Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md) for common issues.

---

## 🎮 Enjoy the Game!

```
 ___________
|  WELCOME  |
|   TO SUI  |
| HERO AREA |
 ‾‾‾‾‾‾‾‾‾

Let's Build Something Epic! 🚀
```

---

**Status**: ✅ **PRODUCTION READY**  
**Version**: 2.0.0  
**Last Updated**: December 30, 2025

Made with ❤️ for the Sui Community
