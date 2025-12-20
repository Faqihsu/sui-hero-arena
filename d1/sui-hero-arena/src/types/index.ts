export enum HeroClass {
  ASSASSIN = 'Assassin',
  WIZARD = 'Wizard',
  SNIPER = 'Sniper',
}

export interface HeroStats {
  hp: number;
  xp: number;
  level: number;
  attack: number;
  defense: number;
}

export interface Hero {
  id: string;
  name: string;
  class: HeroClass;
  imageUrl: string;
  stats: HeroStats;
  owner: string;
  backstory: string;
  createdAt: number;
}

export interface TrainingLog {
  id: string;
  heroId: string;
  timestamp: number;
  description: string;
  xpGained: number;
}

export interface WalletState {
  address: string;
  balance: number;
}