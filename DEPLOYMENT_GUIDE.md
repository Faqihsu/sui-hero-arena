# Smart Contract Deployment Guide

## ✅ Contracts Status
- ✅ coin.move - Ready
- ✅ sui_hero.move - Ready  
- ✅ forge_token.move - Ready
- ✅ forge_swap.move - Ready
- ✅ marketplace.move - Ready

## Step 1: Deploy Coin Contract

```bash
cd d:\sui-move-workshop\d1\coin
sui client publish --gas-budget 50000000
```

**Copy output Package ID and save it!**

## Step 2: Deploy Hero Contract

```bash
cd d:\sui-move-workshop\d1\sui_hero
sui client publish --gas-budget 50000000
```

**Copy output Package ID and save it!**

## Step 3: Deploy Hero Marketplace Contract

```bash
cd d:\sui-move-workshop\d1\sui-hero-arena\contracts\hero_marketplace
sui client publish --gas-budget 100000000
```

**This deploys:**
- forge_token module (FORGE token)
- forge_swap module (DEX swap pool)
- marketplace module (Hero marketplace)

**Copy ALL output IDs:**
- Package ID
- Treasury Cap Object ID
- Marketplace Admin Object ID
- Swap Pool Object ID

## Step 4: Update Frontend Configuration

Edit `d:\sui-move-workshop\d1\sui-hero-arena\src\config\contract.ts`:

```typescript
export const CONTRACT_CONFIG = {
  PACKAGE_ID: '0x<HERO_PACKAGE_ID>', // From Step 2
  MODULE_NAME: 'hero',
  
  MARKETPLACE_PACKAGE_ID: '0x<MARKETPLACE_PACKAGE_ID>', // From Step 3
  MARKETPLACE_ADMIN_ID: '0x<MARKETPLACE_ADMIN_ID>', // From Step 3
  
  FORGE_TOKEN_TYPE: '0x<MARKETPLACE_PACKAGE_ID>::forge_token::FORGE_TOKEN',
  FORGE_TREASURY_CAP: '0x<TREASURY_CAP_ID>', // From Step 3
  
  FORGE_SWAP_POOL_ID: '0x<SWAP_POOL_ID>', // From Step 3
  FORGE_SWAP_TYPE: '0x<MARKETPLACE_PACKAGE_ID>::forge_swap::FORGE',
  
  NETWORK: 'testnet', // or 'mainnet'
  
  FUNCTIONS: {
    MINT_HERO: 'mint_hero',
    TRAIN_HERO: 'train_hero',
  }
};
```

## Step 5: Run Frontend

```bash
cd d:\sui-move-workshop\d1\sui-hero-arena
npm run dev
```

Access at: http://localhost:3001

---

## Network Setup

Make sure Sui CLI is configured:

```bash
sui client active-address
sui client active-env
```

Switch to testnet if needed:

```bash
sui client switch --env testnet
```

---

## Troubleshooting

**Error: "Insufficient gas"**
- Increase gas-budget in publish command

**Error: "Transaction failed"**
- Check wallet has SUI balance
- Check sui client is on correct network

**Frontend can't connect to contracts**
- Verify contract addresses in config/contract.ts
- Ensure Package IDs are correct
- Check network matches (testnet/mainnet)
