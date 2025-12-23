// Contract configuration
export const CONTRACT_CONFIG = {
  // Hero contract
  PACKAGE_ID: '0xf6982c8aa48fed673c9ee20165c5e4e80c5ec9b597495da26acd37b06c19c1c2', // Deployed package ID
  MODULE_NAME: 'hero',
  
  // Marketplace contract - FORGE Token deployed on testnet!
  MARKETPLACE_PACKAGE_ID: '0xd753e8e60a52cba379805a6a66661dc9ca1c2f7db18238519b8dc50efd6162b0', // Marketplace package ID
  MARKETPLACE_ADMIN_ID: '0xa5b98961866a6821ce8fbd31f717b1dfc0aa2af0315429bc374ee8e1c61b5830', // Marketplace admin object ID
  FORGE_TOKEN_TYPE: '0xd753e8e60a52cba379805a6a66661dc9ca1c2f7db18238519b8dc50efd6162b0::forge_token::FORGE_TOKEN',
  FORGE_TREASURY_CAP: '0x51fba4d9437aafd89cc76b2f2afc45d17401780c17d88a1ce66c38fee25ef086', // FORGE token treasury cap (admin only)
  
  // Network configuration
  NETWORK: 'testnet',
  
  // Contract functions
  FUNCTIONS: {
    MINT_HERO: 'mint_hero',
    TRAIN_HERO: 'train_hero',
  }
};

// Helper to get full function target
export const getFunctionTarget = (functionName: string) => {
  return `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::${functionName}`;
};