// Contract configuration
export const CONTRACT_CONFIG = {
  // Update this with your actual deployed package ID from testnet
  PACKAGE_ID: '0xf6982c8aa48fed673c9ee20165c5e4e80c5ec9b597495da26acd37b06c19c1c2', // Deployed package ID
  MODULE_NAME: 'hero',
  
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