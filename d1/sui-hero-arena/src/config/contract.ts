// Contract configuration - LIVE ON TESTNET
export const CONTRACT_CONFIG = {
  // Hero contract
  PACKAGE_ID: '0x9cb978970619b9c56f21ae6a7928ec45f3543d7a7fd80d74bc7df4bba53a1cf4',
  MODULE_NAME: 'hero',
  
  // Marketplace contract with FORGE Token & DEX
  MARKETPLACE_PACKAGE_ID: '0xe53b20a0ff583c08b16d7085d3da239f3a251996f8f592ab908d69e78f09df21',
  MARKETPLACE_ADMIN_ID: '0x04b2475eead8c77cc11a2509130262d33d98b0027140291504a2cd1d285bcff7',
  
  // FORGE Token
  FORGE_TOKEN_TYPE: '0xe53b20a0ff583c08b16d7085d3da239f3a251996f8f592ab908d69e78f09df21::forge_token::FORGE_TOKEN',
  FORGE_TREASURY_CAP: '0xcd79e99d9818ec3c82971ecd0f81e203a2534b17d24a557192ca56b7f085d153',
  
  // Swap Pool
  FORGE_SWAP_POOL_ID: '0xaf2deb1162e4479ba6a33f40dcc2dff8af2fd1b4c132e780af40f7dfbbd7cced',
  
  // Network
  NETWORK: 'testnet',
} as const;
