# FORGE Marketplace Smart Contract - Deployment Guide

## Overview

The marketplace enables heroes to be traded using the custom FORGE token. This guide covers:
- Contract structure
- Deployment steps
- Frontend integration
- Testing the marketplace

## Contract Structure

### 1. FORGE Token (`forge_token.move`)
- Custom ERC-20 style token for the marketplace
- 8 decimals
- Symbol: FORGE
- Used for all marketplace transactions

### 2. Marketplace Module (`marketplace.move`)
- Manages hero listings
- Handles purchases with FORGE tokens
- Tracks marketplace statistics (volume, transaction count)
- Events for tracking on-chain activity

## Deployment Steps

### Step 1: Install Sui CLI
```bash
curl -fsSL https://sui-releases.s3.us-east-1.amazonaws.com/sui-v1.25.0-ubuntu-x86_64/sui | tar xz
# Add to PATH
```

### Step 2: Build the Contract
```bash
cd contracts/hero_marketplace
sui move build --network testnet
```

### Step 3: Deploy to Testnet
```bash
sui client publish --gas-budget 10000 --network testnet
```

After deployment, you'll get:
- **Package ID**: Use in `CONTRACT_CONFIG.MARKETPLACE_PACKAGE_ID`
- **Marketplace Admin Object ID**: Use in `CONTRACT_CONFIG.MARKETPLACE_ADMIN_ID`

### Step 4: Update Frontend Configuration

Edit `src/config/contract.ts`:

```typescript
export const CONTRACT_CONFIG = {
  PACKAGE_ID: '0xf6982c8aa48fed673c9ee20165c5e4e80c5ec9b597495da26acd37b06c19c1c2',
  MODULE_NAME: 'hero',
  
  // ✅ Update these after deployment
  MARKETPLACE_PACKAGE_ID: '0x...', // Your deployed package ID
  MARKETPLACE_ADMIN_ID: '0x...', // Marketplace admin object ID
  FORGE_TOKEN_TYPE: '0x...::forge_token::FORGE_TOKEN', // Token type
  
  NETWORK: 'testnet',
  FUNCTIONS: {
    MINT_HERO: 'mint_hero',
    TRAIN_HERO: 'train_hero',
  }
};
```

## Contract Functions

### create_listing(marketplace, hero_id, hero_name, price, level, rarity, image_url)
Creates a new listing for a hero

**Parameters:**
- `marketplace`: Shared marketplace object
- `hero_id`: Unique hero identifier
- `hero_name`: Display name
- `price`: Price in FORGE tokens
- `level`: Hero level
- `rarity`: Common, Rare, Epic, or Legendary
- `image_url`: Hero image URL

**Events:**
```
ListingCreated {
  hero_id: String,
  seller: address,
  price: u64,
}
```

### purchase_hero(marketplace, hero_id, payment)
Purchases a hero from the marketplace

**Parameters:**
- `marketplace`: Shared marketplace object
- `hero_id`: ID of hero to purchase
- `payment`: FORGE token payment coin

**Events:**
```
HeroPurchased {
  hero_id: String,
  seller: address,
  buyer: address,
  price: u64,
}
```

**Note:** The actual hero NFT transfer needs to be handled separately in a future update.

### cancel_listing(marketplace, hero_id)
Cancels a listing (only by seller)

**Parameters:**
- `marketplace`: Shared marketplace object
- `hero_id`: ID of hero listing to cancel

**Events:**
```
ListingCancelled {
  hero_id: String,
  seller: address,
}
```

## Frontend Integration

### Hooks Available

1. **useMarketplaceListing**
   - `createListing(listingData)` - Create a new listing
   - `cancelListing(heroId)` - Cancel your listing

2. **useMarketplacePurchase**
   - `purchaseHero(heroId, price, seller)` - Buy a hero

3. **useMarketplaceListings**
   - `listings` - Get all active listings
   - `isLoading` - Loading state
   - `refetchListings()` - Refresh listings

### Usage Example

```typescript
const { createListing } = useMarketplaceListing();
const { purchaseHero } = useMarketplacePurchase();

// Create listing
await createListing({
  heroId: 'hero-123',
  heroName: 'Flameblade',
  level: 25,
  rarity: 'RARE',
  imageUrl: 'https://...',
  price: 250, // FORGE tokens
});

// Purchase hero
await purchaseHero(
  'hero-123',
  250, // price in FORGE
  '0x...' // seller address
);
```

## Testing the Marketplace

### 1. Mint FORGE Tokens (Admin Only)
```bash
sui client call --package <MARKETPLACE_PACKAGE_ID> \
  --module forge_token \
  --function mint \
  --args <treasury_cap_id> 1000000000 \
  --gas-budget 10000 \
  --network testnet
```

### 2. Create a Test Listing
- Navigate to Marketplace > Sell Hero
- Select a hero
- Set a price in FORGE tokens
- Click "List Hero Now"

### 3. Purchase a Hero
- Navigate to Marketplace > Browse Listings
- Find a listing
- Click "Buy Now" to purchase with FORGE tokens

### 4. View Your Listings
- Navigate to Marketplace > My Listings
- See heroes you've listed
- Cancel listings if needed

## Marketplace Statistics

The marketplace tracks:
- **Total Volume**: Sum of all successful trades (in FORGE)
- **Transaction Count**: Number of completed purchases
- **Active Listings**: Current number of heroes for sale

## Events

All important marketplace actions emit events:

```typescript
// When hero is listed
ListingCreated {
  hero_id: String,
  seller: address,
  price: u64,
}

// When hero is purchased
HeroPurchased {
  hero_id: String,
  seller: address,
  buyer: address,
  price: u64,
}

// When listing is cancelled
ListingCancelled {
  hero_id: String,
  seller: address,
}
```

## Future Enhancements

1. **Hero NFT Transfer**: Automatically transfer hero objects on purchase
2. **Bid System**: Allow users to place bids on listings
3. **Auction Mechanism**: Time-based auctions for rare heroes
4. **Fee Distribution**: Split marketplace fees among admins/developers
5. **Reputation System**: Track seller/buyer reputation
6. **Advanced Filters**: Filter by level, rarity, class, etc.

## Troubleshooting

### "Listing not found" error
- Hero ID must match exactly
- Ensure listing hasn't been purchased or cancelled

### "Insufficient balance" error
- You don't have enough FORGE tokens
- Mint more tokens or reduce purchase price

### "Not listing owner" error
- Only the original seller can cancel a listing

### Contract deployment fails
- Ensure Sui CLI is installed and up-to-date
- Check that you have sufficient SUI for gas
- Verify Move syntax: `sui move build --network testnet`

## Configuration Checklist

After deployment, ensure you've:
- [ ] Updated `MARKETPLACE_PACKAGE_ID` in `contract.ts`
- [ ] Updated `MARKETPLACE_ADMIN_ID` in `contract.ts`
- [ ] Updated `FORGE_TOKEN_TYPE` in `contract.ts`
- [ ] Deployed to testnet successfully
- [ ] Tested listing creation
- [ ] Tested hero purchase
- [ ] Verified marketplace stats update

## Support

For issues or questions:
1. Check Sui docs: https://docs.sui.io
2. Review Move language guide: https://move-book.com
3. Check marketplace contract examples: https://github.com/MystenLabs/sui/tree/main/examples
