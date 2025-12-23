# FORGE Token Minting Guide 🪙

## Current Deployment Status

### Smart Contracts (Sui Testnet)
- **Latest Package ID**: `0xdb9a35b2db4e26e0b2ff637e69ac1804b7810c0613064aae18d55e93b0fea508`
- **Treasury Cap**: `0x51fba4d9437aafd89cc76b2f2afc45d17401780c17d88a1ce66c38fee25ef086`
- **MarketplaceAdmin**: `0xa5b98961866a6821ce8fbd31f717b1dfc0aa2af0315429bc374ee8e1c61b5830`

### How to Mint FORGE Tokens

#### Using Sui CLI

```bash
# Mint 10,000 FORGE tokens (with 8 decimals)
sui client call \
  --package 0xdb9a35b2db4e26e0b2ff637e69ac1804b7810c0613064aae18d55e93b0fea508 \
  --module forge_token \
  --function mint_and_transfer \
  --args 0x51fba4d9437aafd89cc76b2f2afc45d17401780c17d88a1ce66c38fee25ef086 1000000000000 \
  --gas-budget 100000000
```

#### Token Amount Calculation
- FORGE has 8 decimals
- 1 FORGE = 100,000,000 units
- 10,000 FORGE = 1,000,000,000,000 units

### Troubleshooting

#### TypeMismatch Error
If you get: `CommandArgumentError { arg_idx: 0, kind: TypeMismatch }`

**Solution**: The Treasury Cap may be from a different package version. The Treasury Cap object (`0x51fba4d9...`) must match the type in the current deployed package.

To fix:
1. Deploy fresh copy of contracts (no legacy treasury caps)
2. Use the new Treasury Cap from the fresh deployment

#### Package Not Found
Make sure you're using the correct package ID from the latest deployment.

### Next Steps
1. Mint initial FORGE tokens for testing
2. Transfer FORGE coins to different wallets for marketplace testing
3. Test hero listings and purchases with FORGE payment

## Development Notes

The `mint_and_transfer` function:
- Takes Treasury Cap reference (mutable)
- Takes amount in smallest unit
- Takes transaction context
- Automatically transfers minted coins to sender

```move
public entry fun mint_and_transfer(
    treasury: &mut coin::TreasuryCap<FORGE_TOKEN>,
    amount: u64,
    ctx: &mut sui::tx_context::TxContext
)
```
