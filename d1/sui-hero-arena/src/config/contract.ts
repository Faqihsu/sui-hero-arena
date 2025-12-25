// Contract configuration
export const CONTRACT_CONFIG = {
  // Hero contract
  PACKAGE_ID: '0x17b8af10e1aa9acdf06fc792b98b9d6dd7bafe768fdd81015e5a4209dd2c5dd8', // Deployed package ID
  MODULE_NAME: 'hero',
  
  // Marketplace contract - FORGE Token DEX deployed on testnet!
  MARKETPLACE_PACKAGE_ID: '0x8e1fb4287f067fd5987baa7fecd0719bfdd3e4a7e1917f2e3126e3cbdc3d8c2b', // Latest with forge_swap and forge_token modules
  MARKETPLACE_ADMIN_ID: '0xd85409d48fc152ba6a5f84cf12901cc134e2584712f049b5060dd0ecf1a1cddd', // Marketplace admin object ID
  
  // FORGE Token configuration
  FORGE_TOKEN_TYPE: '0x8e1fb4287f067fd5987baa7fecd0719bfdd3e4a7e1917f2e3126e3cbdc3d8c2b::forge_token::FORGE_TOKEN',
  FORGE_TREASURY_CAP: '0xbc50e8a6ae2ed574d188e4b0e7036705685aea6d8c73fc4a9dbee4e9adda3d3e', // FORGE token treasury cap
  
  // FORGE Swap Pool configuration
  FORGE_SWAP_POOL_ID: '0xc30166afe9fb696e364040a794e412c42f79a953c3e008c497f65ed25676b28e', // Shared swap pool object
  FORGE_SWAP_TYPE: '0x8e1fb4287f067fd5987baa7fecd0719bfdd3e4a7e1917f2e3126e3cbdc3d8c2b::forge_swap::FORGE', // FORGE token type in swap module
  
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