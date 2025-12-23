// Contract configuration
export const CONTRACT_CONFIG = {
  // Hero contract
  PACKAGE_ID: '0xf6982c8aa48fed673c9ee20165c5e4e80c5ec9b597495da26acd37b06c19c1c2', // Deployed package ID
  MODULE_NAME: 'hero',
  
  // Marketplace contract - FORGE Token DEX deployed on testnet!
  MARKETPLACE_PACKAGE_ID: '0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654', // Latest with forge_swap and forge_token modules
  MARKETPLACE_ADMIN_ID: '0x2ec1d6f2aec17fcdb4d7ec5a58aa2ad0be7d8a7631a45d371d8f3ab80e5ef1c4', // Marketplace admin object ID
  
  // FORGE Token configuration
  FORGE_TOKEN_TYPE: '0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654::forge_token::FORGE_TOKEN',
  FORGE_TREASURY_CAP: '0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f', // FORGE token treasury cap
  
  // FORGE Swap Pool configuration
  FORGE_SWAP_POOL_ID: '0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7', // Shared swap pool object
  FORGE_SWAP_TYPE: '0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654::forge_swap::FORGE', // FORGE token type in swap module
  
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