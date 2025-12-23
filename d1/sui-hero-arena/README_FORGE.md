# FORGE Token Documentation Index

Complete implementation of FORGE Token with DEX Swap on Sui Testnet.

## 📑 Documentation Files (Read in Order)

### 1. **START HERE: IMPLEMENTATION_STATUS.md** ⭐
- **What**: Complete overview of what was deployed
- **For**: Everyone - gives you the big picture
- **Read Time**: 5 minutes
- **Contains**: Quick start, key addresses, verification checklist

### 2. **QUICK_REFERENCE.md** 🔍
- **What**: Quick lookup card with commands and addresses
- **For**: Developers who need fast access to info
- **Read Time**: 2 minutes (reference)
- **Contains**: CLI commands, addresses, error codes, common issues

### 3. **FORGE_SWAP_GUIDE.md** 📚
- **What**: Complete step-by-step user guide
- **For**: Users and developers setting up swaps
- **Read Time**: 15 minutes
- **Contains**: Detailed setup, minting, swapping, testing instructions

### 4. **DEPLOYMENT_SUMMARY.md** 🏗️
- **What**: Technical deep dive into architecture
- **For**: Developers, architects, auditors
- **Read Time**: 20 minutes
- **Contains**: System design, tokenomics, implementation details

## 🔗 Contract Addresses (Copy & Paste)

```
Package ID:        0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654
SwapPool ID:       0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7
Treasury Cap:      0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f
Marketplace Admin: 0x2ec1d6f2aec17fcdb4d7ec5a58aa2ad0be7d8a7631a45d371d8f3ab80e5ef1c4
```

## 📊 Quick Stats

| Metric | Value |
|--------|-------|
| **Network** | Sui Testnet |
| **Token Name** | FORGE |
| **Total Supply** | 10 Billion |
| **Decimals** | 8 |
| **Swap Rate** | 1 SUI = 100,000 FORGE |
| **Deployer Allocation** | 1% (100M tokens) |
| **Pool Allocation** | 99% (9.9B tokens) |
| **Status** | ✅ Live & Tested |

## 🚀 Quick Start (Copy-Paste Commands)

### 1️⃣ Mint FORGE Tokens
```bash
sui client call \
  --package 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654 \
  --module forge_token \
  --function mint_and_transfer \
  --args "0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f" "100000000000000000" \
  --gas-budget 10000000
```

### 2️⃣ Initialize Swap Pool
```bash
sui client call \
  --package 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654 \
  --module forge_swap \
  --function init_pool_with_forge \
  --args "0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7" "<FORGE_COIN_ID>" \
  --gas-budget 5000000
```

### 3️⃣ Swap SUI for FORGE
```bash
sui client call \
  --package 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654 \
  --module forge_swap \
  --function swap_sui_for_forge \
  --args "0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7" "<SUI_COIN_ID>" \
  --gas-budget 5000000
```

## 🛠️ Verify Deployment

**Windows**:
```cmd
verify_deployment.bat
```

**Linux/macOS**:
```bash
chmod +x verify_deployment.sh
./verify_deployment.sh
```

## 📱 View On Blockchain

- **Package**: https://testnet.suivision.xyz/packages/0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654
- **SwapPool**: https://testnet.suivision.xyz/objects/0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7

## 🎯 Use Cases

### For Token Users
→ Read: **QUICK_REFERENCE.md** + **FORGE_SWAP_GUIDE.md**

### For React Developers
→ Read: **FORGE_SWAP_GUIDE.md** (React Integration section)

### For Smart Contract Developers
→ Read: **DEPLOYMENT_SUMMARY.md** (Implementation Details)

### For Auditors
→ Read: **DEPLOYMENT_SUMMARY.md** (entire document)

### For DevOps/Operators
→ Read: **QUICK_REFERENCE.md** + verification scripts

## 📦 What's Included

### Smart Contracts
- ✅ `forge_token.move` - Token creation & minting
- ✅ `forge_swap.move` - Swap pool & DEX functions
- ✅ `marketplace.move` - Hero marketplace

### Documentation
- ✅ IMPLEMENTATION_STATUS.md - Overview & checklist
- ✅ QUICK_REFERENCE.md - Command reference
- ✅ FORGE_SWAP_GUIDE.md - User guide
- ✅ DEPLOYMENT_SUMMARY.md - Technical details
- ✅ README.md (this file) - Navigation

### Tools
- ✅ verify_deployment.sh - Linux verification
- ✅ verify_deployment.bat - Windows verification

### Config
- ✅ src/config/contract.ts - Updated React config

## 🔄 Development Workflow

```
1. Deploy Contract
   └─ [DONE] ✅
   
2. Verify On-Chain
   └─ Run: verify_deployment.bat/sh
   
3. Mint FORGE Tokens
   └─ Follow: QUICK_REFERENCE.md (Step 1)
   
4. Initialize Pool
   └─ Follow: QUICK_REFERENCE.md (Step 2)
   
5. Test Swaps
   └─ Follow: QUICK_REFERENCE.md (Step 3)
   
6. Integrate Frontend
   └─ See: FORGE_SWAP_GUIDE.md (React section)
   
7. Deploy to Production
   └─ Update React & deploy to Vercel
```

## ⚡ Common Tasks

### Check Pool Status
```bash
sui client object 0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7
```

### Get Your Coins
```bash
sui client gas
```

### View Package Details
```bash
sui client object 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't find coin | Use `sui client gas` to list |
| Pool has no FORGE | Run init_pool_with_forge first |
| Insufficient gas | Increase --gas-budget (try 10000000) |
| Transaction fails | Check addresses match your network |
| Module not found | Verify package ID (copy from above) |

For more details: See **QUICK_REFERENCE.md** error codes section

## 📝 React Integration Example

```typescript
import { CONTRACT_CONFIG } from '@/config/contract';

// Your config now has:
{
  MARKETPLACE_PACKAGE_ID,
  FORGE_SWAP_POOL_ID,
  FORGE_TREASURY_CAP,
  FORGE_SWAP_TYPE,
}

// Use in components:
const swapPoolId = CONTRACT_CONFIG.FORGE_SWAP_POOL_ID;
```

## 🎓 Learning Resources

### Official Docs
- [Sui Documentation](https://docs.sui.io)
- [Move Language Guide](https://move-book.com)
- [Sui TypeScript SDK](https://sdk.ts.sui.io)

### This Project
- Look at: `contracts/hero_marketplace/sources/forge_swap.move`
- Read: Comments in the Move code
- Study: DEPLOYMENT_SUMMARY.md architecture section

## ✅ Verification Checklist

- [ ] Read IMPLEMENTATION_STATUS.md
- [ ] Run verify_deployment script
- [ ] View package on Sui Explorer
- [ ] Mint FORGE tokens successfully
- [ ] Initialize swap pool
- [ ] Test swap (small amount)
- [ ] Check React config updated
- [ ] Ready for production!

## 🎉 Success Criteria

✅ Contract deployed to Sui Testnet
✅ Package ID: 0x591bd66d...
✅ SwapPool: 0xd3266c00...
✅ All addresses documented
✅ Swap rate: 1 SUI = 100,000 FORGE
✅ Tokenomics: 10B total, 1% deployer, 99% pool
✅ Documentation complete
✅ Ready for users

## 📞 Next Steps

1. **Read**: Start with IMPLEMENTATION_STATUS.md
2. **Verify**: Run verification scripts
3. **Test**: Follow QUICK_REFERENCE.md commands
4. **Integrate**: Update your React app
5. **Deploy**: Push to production

---

**Status**: ✅ Complete
**Network**: Sui Testnet
**Date**: 2024
**Version**: 1.0

For detailed information, refer to the specific documentation files listed above.
