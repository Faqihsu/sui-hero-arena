// src/types/index.ts

// --------- Kelas Hero ---------
export enum HeroClass {
  ASSASSIN = 'Assassin',
  WIZARD = 'Wizard',
  SNIPER = 'Sniper',
  PALADIN = 'Paladin',
  RANGER = 'Ranger',
  SORCERESS = 'Sorceress',
}

// --------- Struktur asli dari backend / storage ---------
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
  createdAt: number;
}

// --------- Bentuk datar yang dipakai UI BattleFight ---------
// (ini sama konsepnya dengan HeroOnChain di BattleFight.tsx)
export interface FlatHero {
  id: string;
  name: string;
  health: number;
  level: number;
  attack: number;
  defense: number;
  damage: number;
  chakra: number;
  imageUrl: string;
  heroClass?: HeroClass;
}

// Helper optional: konversi Hero -> FlatHero
export const toFlatHero = (hero: Hero): FlatHero => ({
  id: hero.id,
  name: hero.name,
  health: hero.stats.hp,
  level: hero.stats.level,
  attack: hero.stats.attack,
  defense: hero.stats.defense,
  damage: 0,      // sesuaikan kalau nanti ada di backend
  chakra: 0,      // sesuaikan kalau nanti ada di backend
  imageUrl: hero.imageUrl,
  heroClass: hero.class,
});

// --------- Training & Wallet ---------
export interface TrainingLog {
  id: string;
  heroId: string;
  timestamp: number;
  description: string;
  xpGained: number;
}

export interface BattleLog {
  id: string;
  hero1Id: string;
  hero2Id: string;
  hero1Name: string;
  hero2Name: string;
  winner: string | 'draw';
  timestamp: number;
  battleRounds: number;
}

export interface WalletState {
  address: string;
  balance: number;
}
