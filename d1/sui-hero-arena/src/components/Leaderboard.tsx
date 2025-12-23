import React from 'react';
import { PlayerStats } from '@/types';

interface LeaderboardEntry extends PlayerStats {
  playerAddress: string;
  displayName: string;
  rank: number;
}

interface LeaderboardProps {
  currentPlayerStats: PlayerStats;
  players?: LeaderboardEntry[];
  currentPlayerAddress?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentPlayerStats, players = [], currentPlayerAddress }) => {
  // Sample leaderboard data if no players provided
  const samplePlayers: LeaderboardEntry[] = [
    {
      playerAddress: '0x1234567890',
      displayName: 'ShadowNinja',
      rank: 1,
      totalBattles: 156,
      wins: 128,
      losses: 25,
      draws: 3,
      winStreak: 12,
      totalHeroes: 8,
      eloRating: 2450,
    },
    {
      playerAddress: '0x2345678901',
      displayName: 'PhoenixRiser',
      rank: 2,
      totalBattles: 142,
      wins: 110,
      losses: 28,
      draws: 4,
      winStreak: 7,
      totalHeroes: 6,
      eloRating: 2310,
    },
    {
      playerAddress: '0x3456789012',
      displayName: 'IceKnight',
      rank: 3,
      totalBattles: 138,
      wins: 105,
      losses: 30,
      draws: 3,
      winStreak: 5,
      totalHeroes: 7,
      eloRating: 2180,
    },
    {
      playerAddress: '0x4567890123',
      displayName: 'ThunderStrike',
      rank: 4,
      totalBattles: 125,
      wins: 92,
      losses: 30,
      draws: 3,
      winStreak: 3,
      totalHeroes: 5,
      eloRating: 2050,
    },
    {
      playerAddress: '0x5678901234',
      displayName: 'InfernoMaster',
      rank: 5,
      totalBattles: 118,
      wins: 85,
      losses: 32,
      draws: 1,
      winStreak: 2,
      totalHeroes: 6,
      eloRating: 1950,
    },
    {
      playerAddress: '0x6789012345',
      displayName: 'FrostbornWarrior',
      rank: 6,
      totalBattles: 105,
      wins: 75,
      losses: 28,
      draws: 2,
      winStreak: 4,
      totalHeroes: 4,
      eloRating: 1820,
    },
    {
      playerAddress: '0x7890123456',
      displayName: 'DarkVortex',
      rank: 7,
      totalBattles: 98,
      wins: 68,
      losses: 28,
      draws: 2,
      winStreak: 1,
      totalHeroes: 5,
      eloRating: 1750,
    },
    {
      playerAddress: '0x8901234567',
      displayName: 'VenomStrike',
      rank: 8,
      totalBattles: 92,
      wins: 62,
      losses: 28,
      draws: 2,
      winStreak: 0,
      totalHeroes: 3,
      eloRating: 1680,
    },
    {
      playerAddress: '0x9012345678',
      displayName: 'HolyBlade',
      rank: 9,
      totalBattles: 87,
      wins: 57,
      losses: 28,
      draws: 2,
      winStreak: 2,
      totalHeroes: 4,
      eloRating: 1620,
    },
    {
      playerAddress: '0x0123456789',
      displayName: 'CrimsonFury',
      rank: 10,
      totalBattles: 81,
      wins: 51,
      losses: 28,
      draws: 2,
      winStreak: 1,
      totalHeroes: 3,
      eloRating: 1550,
    },
  ];

  const topPlayers = players.length > 0 ? players.slice(0, 10) : samplePlayers;
  const currentPlayerRank = players.length > 0 
    ? players.findIndex(p => p.playerAddress === currentPlayerAddress) 
    : -1;

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500 to-amber-500'; // Gold
    if (rank === 2) return 'from-slate-400 to-slate-500'; // Silver
    if (rank === 3) return 'from-orange-600 to-orange-700'; // Bronze
    return 'from-slate-700 to-slate-800';
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '•';
  };

  const getWinRate = (stats: PlayerStats) => {
    const total = stats.wins + stats.losses + stats.draws;
    if (total === 0) return '0%';
    return `${Math.round((stats.wins / total) * 100)}%`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          🏆 LEADERBOARD 🏆
        </h1>
        <p className="text-slate-400 text-sm">Top warriors by rating</p>
      </div>

      {/* Top 3 Podium */}
      {topPlayers.length >= 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          {topPlayers.length >= 2 && (
            <div className="relative h-64 rounded-xl overflow-hidden border-2 border-slate-400/50">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-400/20 to-slate-900/40" />
              <div className="relative h-full flex flex-col items-center justify-center text-center p-4 space-y-2">
                <div className="text-4xl">🥈</div>
                <div className="text-sm font-bold text-yellow-400">#2</div>
                <div className="text-lg font-bold text-white">{topPlayers[1].displayName}</div>
                <div className="text-sm text-slate-300">{topPlayers[1].eloRating} ELO</div>
                <div className="text-xs text-slate-400 mt-2">
                  {topPlayers[1].wins}W - {topPlayers[1].losses}L
                </div>
              </div>
            </div>
          )}

          {/* 1st Place */}
          <div className="relative h-80 rounded-xl overflow-hidden border-4 border-yellow-400/70 md:col-span-1 md:row-span-2 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/20 to-slate-900/40" />
            <div className="relative h-full flex flex-col items-center justify-center text-center p-4 space-y-3">
              <div className="text-6xl">🥇</div>
              <div className="text-lg font-black text-yellow-300">#1 CHAMPION</div>
              <div className="text-2xl font-black text-white">{topPlayers[0].displayName}</div>
              <div className="text-lg text-yellow-300 font-bold">{topPlayers[0].eloRating} ELO</div>
              <div className="text-sm text-slate-300 mt-2">
                {topPlayers[0].wins}W - {topPlayers[0].losses}L
              </div>
              <div className="text-xs text-yellow-400 font-bold mt-2">
                {getWinRate(topPlayers[0])} Win Rate
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          {topPlayers.length >= 3 && (
            <div className="relative h-64 rounded-xl overflow-hidden border-2 border-orange-600/50">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-600/20 to-slate-900/40" />
              <div className="relative h-full flex flex-col items-center justify-center text-center p-4 space-y-2">
                <div className="text-4xl">🥉</div>
                <div className="text-sm font-bold text-orange-400">#3</div>
                <div className="text-lg font-bold text-white">{topPlayers[2].displayName}</div>
                <div className="text-sm text-slate-300">{topPlayers[2].eloRating} ELO</div>
                <div className="text-xs text-slate-400 mt-2">
                  {topPlayers[2].wins}W - {topPlayers[2].losses}L
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="space-y-2">
        {topPlayers.map((player, idx) => (
          <div
            key={player.playerAddress}
            className={`bg-gradient-to-r ${getRankColor(player.rank)} p-0.5 rounded-lg`}
          >
            <div className={`bg-slate-900 p-4 rounded-lg flex items-center justify-between ${
              player.playerAddress === currentPlayerAddress ? 'border-2 border-indigo-500' : ''
            }`}>
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex items-center gap-3 w-20">
                  <span className="text-2xl font-black">{getMedalEmoji(player.rank)}</span>
                  <span className="text-xl font-black text-slate-400">#{player.rank}</span>
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white truncate">{player.displayName}</div>
                  <div className="text-xs text-slate-500 font-mono truncate">
                    {player.playerAddress.slice(0, 6)}...{player.playerAddress.slice(-4)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-right">
                  <div className="font-bold text-indigo-400">{player.eloRating} ELO</div>
                  <div className="text-xs text-slate-400">Rating</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-400">{player.wins}W</div>
                  <div className="text-xs text-slate-400">Wins</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-400">{player.losses}L</div>
                  <div className="text-xs text-slate-400">Losses</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-yellow-400">{getWinRate(player)}%</div>
                  <div className="text-xs text-slate-400">Win Rate</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Player Rank */}
      {currentPlayerRank > 9 && (
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="text-sm text-slate-400 mb-3">Your Position</div>
          <div className="bg-indigo-900/30 p-4 rounded-lg border-2 border-indigo-500/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-indigo-400">#{currentPlayerRank + 1}</div>
                <div className="text-sm text-slate-300">Keep climbing!</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-indigo-300">
                  {players[currentPlayerRank].eloRating} ELO
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Player Stats Section */}
      <div className="mt-8 pt-6 border-t border-slate-700/50">
        <div className="text-sm text-slate-400 mb-3">Your Stats</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-indigo-900/30 p-4 rounded-lg border-2 border-indigo-500/50">
            <div className="text-sm text-slate-400">Total Battles</div>
            <div className="text-3xl font-black text-indigo-300 mt-1">{currentPlayerStats.totalBattles}</div>
          </div>
          <div className="bg-green-900/30 p-4 rounded-lg border-2 border-green-500/50">
            <div className="text-sm text-slate-400">Wins</div>
            <div className="text-3xl font-black text-green-300 mt-1">{currentPlayerStats.wins}</div>
          </div>
          <div className="bg-red-900/30 p-4 rounded-lg border-2 border-red-500/50">
            <div className="text-sm text-slate-400">Losses</div>
            <div className="text-3xl font-black text-red-300 mt-1">{currentPlayerStats.losses}</div>
          </div>
          <div className="bg-yellow-900/30 p-4 rounded-lg border-2 border-yellow-500/50">
            <div className="text-sm text-slate-400">ELO Rating</div>
            <div className="text-3xl font-black text-yellow-300 mt-1">{currentPlayerStats.eloRating}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
