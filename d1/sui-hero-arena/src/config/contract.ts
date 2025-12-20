// Contract configuration
export const CONTRACT_CONFIG = {
  // Update this with your actual deployed package ID from testnet
  PACKAGE_ID: process.env.NEXT_PUBLIC_PACKAGE_ID || '0x9b42dc59d9153a936d611261eb39c874de7bfe9b1588dd36d6f1c879889da0c1', // Deployed package ID
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