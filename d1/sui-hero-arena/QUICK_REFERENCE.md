# FORGE Token - Quick Reference Card

## 🚀 Key Addresses

```
Package ID:        0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654
SwapPool ID:       0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7
Treasury Cap:      0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f
Marketplace Admin: 0x2ec1d6f2aec17fcdb4d7ec5a58aa2ad0be7d8a7631a45d371d8f3ab80e5ef1c4
```

## 💱 Swap Rate

```
1 SUI = 100,000 FORGE
0.01 SUI = 1,000 FORGE

Quick Conversions:
─────────────────────────────────────────
Amount SUI      │ MIST Amount   │ FORGE
─────────────────────────────────────────
0.001           │ 1,000,000     │ 100
0.01            │ 10,000,000    │ 1,000
0.1             │ 100,000,000   │ 10,000
1               │ 1,000,000,000 │ 100,000
10              │ 10B           │ 1,000,000
```

## 📋 Common Commands

### Check Pool Status
```bash
sui client object 0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7
```

### Mint FORGE Tokens (1 billion)
```bash
sui client call \
  --package 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654 \
  --module forge_token \
  --function mint_and_transfer \
  --args "0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f" "100000000000000000" \
  --gas-budget 10000000
```

### Initialize Pool with FORGE
```bash
sui client call \
  --package 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654 \
  --module forge_swap \
  --function init_pool_with_forge \
  --args "0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7" "<FORGE_COIN_ID>" \
  --gas-budget 5000000
```

### Swap SUI for FORGE
```bash
sui client call \
  --package 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654 \
  --module forge_swap \
  --function swap_sui_for_forge \
  --args "0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7" "<SUI_COIN_ID>" \
  --gas-budget 5000000
```

### Swap FORGE for SUI
```bash
sui client call \
  --package 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654 \
  --module forge_swap \
  --function swap_forge_for_sui \
  --args "0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7" "<FORGE_COIN_ID>" \
  --gas-budget 5000000
```

## 🛠️ Token Details

| Property | Value |
|----------|-------|
| **Name** | FORGE |
| **Symbol** | FORGE |
| **Decimals** | 8 |
| **Total Supply** | 10,000,000,000 |
| **Type** | `0x591...::forge_token::FORGE_TOKEN` |
| **Swap Type** | `0x591...::forge_swap::FORGE` |

## 📊 Token Distribution

- **Deployer**: 100,000,000 (1%)
- **Swap Pool**: 9,900,000,000 (99%)

## ⚙️ Smart Contract Functions

### forge_token Module

| Function | Entry? | Parameters | Returns |
|----------|--------|-----------|---------|
| `mint_and_transfer` | ✅ | treasury_cap, amount | None (transfers to sender) |
| `mint` | ✅ | treasury_cap, amount | Coin<FORGE_TOKEN> |
| `burn` | ✅ | treasury_cap, coin | None |

### forge_swap Module

| Function | Entry? | Parameters | Returns |
|----------|--------|-----------|---------|
| `init_pool_with_forge` | ✅ | pool, forge_coins | None |
| `swap_sui_for_forge` | ✅ | pool, sui_payment | None (transfers to sender) |
| `swap_forge_for_sui` | ✅ | pool, forge_payment | None (transfers to sender) |
| `get_pool_state` | ❌ | pool | (forge_balance, sui_balance, rate) |

## 📱 React Configuration

```typescript
// In src/config/contract.ts
export const CONTRACT_CONFIG = {
  MARKETPLACE_PACKAGE_ID: '0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654',
  FORGE_SWAP_POOL_ID: '0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7',
  FORGE_TREASURY_CAP: '0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f',
  FORGE_SWAP_TYPE: '0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654::forge_swap::FORGE',
};
```

## 🔗 Links

- **Sui Explorer**: https://testnet.suivision.xyz
- **Package**: https://testnet.suivision.xyz/packages/0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654
- **SwapPool**: https://testnet.suivision.xyz/objects/0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7

## 📝 Error Codes

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot find coin" | Coin object doesn't exist | Use `sui client gas` to list coins |
| "Insufficient balance" | Pool has no FORGE tokens | Run `init_pool_with_forge` first |
| "Insufficient gas" | Not enough SUI for gas | Need more than 5M MIST |
| "code 0" | Transaction failed | Check gas budget (use 10M+) |

## 🎯 Typical Usage Flow

```
1. Developer creates account
   └─ Uses testnet faucet to get SUI
   
2. Mint FORGE tokens
   └─ Calls: mint_and_transfer()
   └─ Receives: X billion FORGE tokens
   
3. Initialize swap pool
   └─ Calls: init_pool_with_forge()
   └─ SwapPool now has liquidity
   
4. Users can now swap
   ├─ SUI → FORGE: swap_sui_for_forge()
   └─ FORGE → SUI: swap_forge_for_sui()
   
5. Monitor pool state
   └─ Calls: get_pool_state() [view function]
```

## 🔐 Security Notes

- SwapPool is a **shared object** (anyone can swap)
- Fixed rate prevents manipulation
- Treasury Cap controls token minting
- No admin fees (can be added later)

## 📚 Documentation Files

- **FORGE_SWAP_GUIDE.md** - Complete setup & usage guide
- **DEPLOYMENT_SUMMARY.md** - Architecture & implementation details
- **QUICK_REFERENCE.md** - This file (quick lookup)

---

**Last Updated**: 2024 | **Network**: Sui Testnet | **Status**: ✅ Live
