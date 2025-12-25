export interface Hero {
  id: string;
  name: string;
  hp: number;
  level: number;
  attack: number;
  defense: number;
  damage: number;
  chakra: number;
  imageUrl: string;
  heroClass: string;
}

export interface MintHeroData {
  name: string;
  imageUrl: string;
  heroClass: string;
}

export interface SwapData {
  amountIn: number;
  direction: 'sui-to-forge' | 'forge-to-sui';
}
