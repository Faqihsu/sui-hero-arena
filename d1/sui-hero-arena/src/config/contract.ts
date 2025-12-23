// Contract configuration
export const CONTRACT_CONFIG = {
  // Hero contract
  PACKAGE_ID: '0xf6982c8aa48fed673c9ee20165c5e4e80c5ec9b597495da26acd37b06c19c1c2', // Deployed package ID
  MODULE_NAME: 'hero',
  
  // Marketplace contract - FORGE Token deployed on testnet!
  MARKETPLACE_PACKAGE_ID: '0xddd29275b405b4e6cc3ef1b5545df6bbe33a16f6aab778cac7a7b01a29678c2e', // Marketplace package ID
  MARKETPLACE_ADMIN_ID: '0x48a49870e10ff63e7098845bdd11b11a50efdb37dadd72b86f181b14bcd71fe2', // Marketplace admin object ID
  FORGE_TOKEN_TYPE: '0xddd29275b405b4e6cc3ef1b5545df6bbe33a16f6aab778cac7a7b01a29678c2e::forge_token::FORGE_TOKEN',
  FORGE_TREASURY_CAP: '0x54c013aa0a8df4bb23682db63a6317b404707734c11af6903d2b1ff22f8de34f', // FORGE token treasury cap (admin only)
  
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