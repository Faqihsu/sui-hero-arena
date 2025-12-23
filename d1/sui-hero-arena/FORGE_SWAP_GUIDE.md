# FORGE Token Swap Guide

## Overview
The FORGE token has been successfully deployed to Sui testnet with a DEX swap mechanism. This guide explains how to:
1. Mint FORGE tokens
2. Initialize the swap pool with liquidity
3. Swap SUI ↔ FORGE tokens

## Deployment Information

### Latest Deployment (Package 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654)

**Addresses:**
```
Package ID:    0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654
SwapPool ID:   0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7
Treasury Cap:  0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f
```

**Token Specifications:**
- Name: FORGE
- Symbol: FORGE
- Decimals: 8
- Total Supply: 10 Billion (10,000,000,000 tokens)
- Deployer Allocation: 1% (100,000,000 tokens = 100M)
- Swap Pool Allocation: 99% (9,900,000,000 tokens = 9.9B)

**Swap Rate:**
- 1 SUI = 100,000 FORGE
- 0.01 SUI (10,000,000 MIST) = 1,000 FORGE

## Step 1: Mint FORGE Tokens

### Option A: Using Sui CLI (Recommended)

```bash
# Mint 1 billion FORGE tokens to swap pool
sui client call \
  --package 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654 \
  --module forge_token \
  --function mint_and_transfer \
  --args "<TREASURY_CAP_ID>" "1000000000000000000" \
  --gas-budget 10000000
```

### Option B: Using Sui Studio or Explorer
1. Go to [Sui Testnet Explorer](https://testnet.suivision.xyz)
2. Navigate to the package ID: `0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654`
3. Call `forge_token::mint_and_transfer` with:
   - `treasury`: `0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f`
   - `amount`: Amount to mint (with 8 decimals)

### Amount Calculation Examples

Remember: 1 FORGE token = 10^8 base units due to 8 decimals

```
100M FORGE tokens    = 10,000,000,000 units (10^10)
1B FORGE tokens      = 100,000,000,000 units (10^11)
10B FORGE tokens     = 1,000,000,000,000 units (10^12)
```

## Step 2: Initialize Swap Pool Liquidity

After minting FORGE tokens, add them to the swap pool:

```bash
# Add FORGE tokens to swap pool
sui client call \
  --package 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654 \
  --module forge_swap \
  --function init_pool_with_forge \
  --args "<SWAP_POOL_ID>" "<FORGE_COIN_ID>" \
  --gas-budget 5000000
```

Where:
- `SWAP_POOL_ID`: `0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7`
- `FORGE_COIN_ID`: Object ID of the minted FORGE coin from Step 1

## Step 3: Swap SUI for FORGE

Swap SUI (Sui coins) to receive FORGE tokens:

```bash
# Swap 0.01 SUI (10,000,000 MIST) for ~1,000 FORGE
sui client call \
  --package 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654 \
  --module forge_swap \
  --function swap_sui_for_forge \
  --args "<SWAP_POOL_ID>" "<SUI_COIN_ID>" \
  --gas-budget 5000000
```

Where:
- `SWAP_POOL_ID`: `0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7`
- `SUI_COIN_ID`: Your SUI coin object ID to swap

**Example Amounts:**
```
10,000,000 MIST (0.01 SUI)     → 1,000 FORGE
100,000,000 MIST (0.1 SUI)     → 10,000 FORGE
1,000,000,000 MIST (1 SUI)     → 100,000 FORGE
10,000,000,000 MIST (10 SUI)   → 1,000,000 FORGE
```

## Step 4: Swap FORGE for SUI

Swap FORGE tokens back to SUI:

```bash
# Swap 1,000 FORGE for ~0.01 SUI (10,000,000 MIST)
sui client call \
  --package 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654 \
  --module forge_swap \
  --function swap_forge_for_sui \
  --args "<SWAP_POOL_ID>" "<FORGE_COIN_ID>" \
  --gas-budget 5000000
```

Where:
- `SWAP_POOL_ID`: `0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7`
- `FORGE_COIN_ID`: Your FORGE coin object ID to swap

## Step 5: Check Swap Pool Status

View the current liquidity and rates in the swap pool:

```bash
sui client object <SWAP_POOL_ID>
```

This will show:
- FORGE balance in pool
- SUI balance in pool
- Current exchange rate (100,000 FORGE per SUI)

Example output:
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Sui Object Info                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ ID: 0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7    │
│ Object Type: 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef    │
│              145ed654::forge_swap::SwapPool                                 │
│ Owner: Shared( 672597303 )                                                   │
│ Version: 672597303                                                           │
│ Digest: 6rqK6USFUkcV5DaG8EmZskYCqk54xnSYeGcGzr58x43V                         │
│                                                                              │
│ Content:                                                                     │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ forge_balance:   Balance of FORGE tokens in pool                       │  │
│ │ sui_balance:     Balance of SUI in pool                                │  │
│ │ forge_per_sui:   100000 (1 SUI = 100,000 FORGE)                        │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Common Issues & Troubleshooting

### Issue: "Cannot find coin" when swapping
**Solution**: Make sure you have an active SUI or FORGE coin object. List your coins:
```bash
sui client gas
```

### Issue: "Insufficient balance" error
**Solution**: The swap pool needs sufficient FORGE tokens before SUI→FORGE swaps work. Initialize it with Step 2.

### Issue: Transaction failed with "code 0"
**Solution**: Ensure gas budget is sufficient (at least 5,000,000 MIST for swaps).

### Issue: Cannot send coins between transactions
**Solution**: Coins must be finalized first. Use separate transactions for minting and swapping.

## Integration with React Frontend

Add these addresses to your React config:

```typescript
// src/config/contract.ts
export const CONTRACT_CONFIG = {
  MARKETPLACE_PACKAGE_ID: '0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654',
  SWAP_POOL_ID: '0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7',
  FORGE_TREASURY_CAP: '0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f',
  FORGE_TYPE: `${MARKETPLACE_PACKAGE_ID}::forge_token::FORGE_TOKEN`,
  FORGE_SWAP_TYPE: `${MARKETPLACE_PACKAGE_ID}::forge_swap::FORGE`,
};
```

## Testing the Swap Locally

Create a test script (test_swap.ts):

```typescript
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });
const keypair = Ed25519Keypair.deriveKeypair('your-mnemonic');

async function testSwap() {
  const tx = new TransactionBlock();
  
  // Get your SUI coins
  const coins = await client.getCoins({
    owner: keypair.getPublicKey().toSuiAddress(),
    coinType: '0x2::sui::SUI',
  });
  
  if (coins.data.length > 0) {
    // Perform swap
    tx.moveCall({
      target: `0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654::forge_swap::swap_sui_for_forge`,
      arguments: [
        tx.object('0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d321d460a4a009c7'),
        tx.object(coins.data[0].coinObjectId),
      ],
    });
    
    const result = await client.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: keypair,
    });
    
    console.log('Swap successful:', result.digest);
  }
}

testSwap();
```

## Key Concepts

### Balance vs Coin Types
- **Balance<FORGE>**: Internal representation of FORGE tokens in the smart contract
- **Coin<FORGE>**: User-facing FORGE token (what you receive from swaps)
- **FORGE type**: `0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654::forge_swap::FORGE`

### Swap Pool Mechanics
1. **Shared Object**: SwapPool is a shared object, so anyone can call swap functions
2. **Balance Management**: Uses `balance::split` and `balance::join` for atomic transfers
3. **Fixed Rate**: Exchange rate is fixed at 100,000 FORGE per SUI (no slippage)
4. **No Fees**: Current implementation has no fee structure (can be added later)

## Next Steps

1. ✅ Deploy forge_swap module with SwapPool
2. ⏳ Mint FORGE tokens using forge_token treasury
3. ⏳ Initialize swap pool with FORGE liquidity
4. ⏳ Create React UI component for swapping
5. ⏳ Integrate swap functionality into marketplace
6. ⏳ Deploy to production

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Move code: `sources/forge_swap.move`
3. Check Sui testnet explorer: https://testnet.suivision.xyz

---

**Last Updated**: 2024
**Network**: Sui Testnet
**Status**: ✅ Deployed and Ready for Testing
