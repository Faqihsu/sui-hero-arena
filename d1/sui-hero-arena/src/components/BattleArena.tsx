import React, { useState, useMemo } from "react";
import { HeroOnChain } from "./BattleFight";
import { BattleLogModal } from "./BattleLogModal";

interface BattleLog {
  round: number;
  hero1Action: string;
  hero2Action: string;
  hero1HP: number;
  hero2HP: number;
}

type BattleArenaProps = {
  heroes: HeroOnChain[];
  onBattleEnd?: (hero1Id: string, hero2Id: string, winnerId: string | 'draw', roundCount: number) => void;
};

export function BattleArena({ heroes, onBattleEnd }: BattleArenaProps) {
  const [selectedHero1, setSelectedHero1] = useState<string | null>(null);
  const [selectedHero2, setSelectedHero2] = useState<string | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [showBattleLog, setShowBattleLog] = useState(false);
  const [showResultDelay, setShowResultDelay] = useState(false);

  const hero1 = useMemo(() => heroes.find((h) => h.id === selectedHero1), [heroes, selectedHero1]);
  const hero2 = useMemo(() => heroes.find((h) => h.id === selectedHero2), [heroes, selectedHero2]);

  const availableHeroes1 = useMemo(
    () => heroes.filter((h) => h.id !== selectedHero2),
    [heroes, selectedHero2]
  );

  const availableHeroes2 = useMemo(
    () => heroes.filter((h) => h.id !== selectedHero1),
    [heroes, selectedHero1]
  );

  const getActionDescription = (attacker: string, damage: number, isCritical: boolean = false): string => {
    const actions = [
      `${attacker} UNLEASHES A DEVASTATING STRIKE! 💥 ${damage} DMG`,
      `${attacker} LAUNCHES A FIERCE ATTACK! ⚔️ ${damage} DMG`,
      `${attacker} STRIKES WITH INCREDIBLE FORCE! 🔥 ${damage} DMG`,
      `${attacker} EXECUTES A CRITICAL HIT! ⚡ ${damage} DMG`,
      `${attacker} PERFORMS A CRUSHING BLOW! 💢 ${damage} DMG`,
      `${attacker} CHANNELS DARK POWER! 🌑 ${damage} DMG`,
    ];
    const selected = actions[Math.floor(Math.random() * actions.length)];
    return isCritical ? selected.replace('DMG', 'CRITICAL DMG!!!') : selected;
  };

  const calculateDamage = (attacker: HeroOnChain, defender: HeroOnChain): { damage: number; isCritical: boolean } => {
    const baseDamage = attacker.attack + attacker.damage;
    const defensePct = Math.max(0.1, 1 - defender.defense / 100);
    const variance = Math.random() * 0.3 + 0.85; // 85-115%
    const isCritical = Math.random() > 0.8; // 20% chance for critical
    const critMultiplier = isCritical ? 1.5 : 1;
    const damage = Math.floor(baseDamage * defensePct * variance * critMultiplier);
    return { damage, isCritical };
  };

  const simulateBattle = async () => {
    if (!hero1 || !hero2) return;

    setIsBattling(true);
    setBattleLogs([]);
    setWinner(null);

    let hp1 = hero1.health;
    let hp2 = hero2.health;
    const logs: BattleLog[] = [];
    let round = 1;

    while (hp1 > 0 && hp2 > 0 && round <= 20) {
      // Hero 1 menyerang
      const atk1Result = calculateDamage(hero1, hero2);
      hp2 = Math.max(0, hp2 - atk1Result.damage);

      logs.push({
        round,
        hero1Action: getActionDescription(hero1.name, atk1Result.damage, atk1Result.isCritical),
        hero2Action: '',
        hero1HP: Math.max(0, hp1),
        hero2HP: Math.max(0, hp2),
      });

      setBattleLogs([...logs]);

      // Delay setelah hero 1 attack
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (hp2 <= 0) break;

      // Hero 2 menyerang
      const atk2Result = calculateDamage(hero2, hero1);
      hp1 = Math.max(0, hp1 - atk2Result.damage);

      logs[logs.length - 1].hero2Action = getActionDescription(hero2.name, atk2Result.damage, atk2Result.isCritical);
      logs[logs.length - 1].hero1HP = Math.max(0, hp1);
      setBattleLogs([...logs]);

      round++;

      // Delay setelah hero 2 attack
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }

    setBattleLogs(logs);

    let winnerId = "";
    if (hp1 > 0) {
      winnerId = hero1.id;
      setWinner(hero1.id);
    } else if (hp2 > 0) {
      winnerId = hero2.id;
      setWinner(hero2.id);
    } else {
      setWinner("draw");
    }

    // Show result animation delay
    setShowResultDelay(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowResultDelay(false);

    setIsBattling(false);
    setShowBattleLog(true);
    
    // Call the onBattleEnd callback with all details
    if (onBattleEnd) {
      onBattleEnd(hero1.id, hero2.id, winnerId || 'draw', logs.length);
    }
  };

  const resetBattle = () => {
    setSelectedHero1(null);
    setSelectedHero2(null);
    setBattleLogs([]);
    setWinner(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          ⚔️ BATTLE ARENA ⚔️
        </h1>
        <p className="text-slate-400 text-sm">Choose your fighters and clash for glory!</p>
      </div>
      <div className="space-y-6">
      {/* Hero Selection */}
      <div className="grid md:grid-cols-2 gap-6 bg-gradient-to-b from-slate-800/20 to-transparent rounded-xl p-6 border border-slate-700/30">
        {/* Hero 1 Selection */}
        <div>
          <h3 className="text-base font-bold text-white mb-3">Select Fighter 1</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {availableHeroes1.map((hero) => (
              <button
                key={hero.id}
                onClick={() => setSelectedHero1(hero.id)}
                disabled={isBattling}
                className={`w-full p-3 rounded-lg text-left transition-all border ${
                  selectedHero1 === hero.id
                    ? "bg-indigo-600/20 border-indigo-500"
                    : "border-slate-600 hover:border-slate-500"
                } disabled:opacity-50`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base">{hero.name}</span>
                  <span className="text-sm font-semibold text-yellow-400">Lv. {hero.level}</span>
                </div>
                <div className="text-sm text-slate-300 mt-1 font-medium">
                  HP: <span className="text-red-400 font-bold">{hero.health}</span> | ATK: <span className="text-orange-400 font-bold">{hero.attack}</span> | DEF: <span className="text-blue-400 font-bold">{hero.defense}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Hero 2 Selection */}
        <div>
          <h3 className="text-base font-bold text-white mb-3">Select Fighter 2</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {availableHeroes2.map((hero) => (
              <button
                key={hero.id}
                onClick={() => setSelectedHero2(hero.id)}
                disabled={isBattling}
                className={`w-full p-3 rounded-lg text-left transition-all border ${
                  selectedHero2 === hero.id
                    ? "bg-indigo-600/20 border-indigo-500"
                    : "border-slate-600 hover:border-slate-500"
                } disabled:opacity-50`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base">{hero.name}</span>
                  <span className="text-sm font-semibold text-yellow-400">Lv. {hero.level}</span>
                </div>
                <div className="text-sm text-slate-300 mt-1 font-medium">
                  HP: <span className="text-red-400 font-bold">{hero.health}</span> | ATK: <span className="text-orange-400 font-bold">{hero.attack}</span> | DEF: <span className="text-blue-400 font-bold">{hero.defense}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Battle Start Button */}
      {hero1 && hero2 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl blur-xl"></div>
          <button
            onClick={simulateBattle}
            disabled={isBattling}
            className="relative w-full px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:opacity-50 text-white font-black text-lg rounded-xl transition-all duration-200 uppercase tracking-widest hover:shadow-2xl hover:shadow-red-500/40"
          >
            {isBattling ? "⚡ BATTLING..." : "⚔️ START BATTLE"}
          </button>
        </div>
      )}

      {/* Battle Log */}
      <BattleLogModal
        isOpen={showBattleLog}
        hero1={hero1}
        hero2={hero2}
        battleLogs={battleLogs}
        winner={winner}
        onClose={() => setShowBattleLog(false)}
        onNewBattle={resetBattle}
      />

      {/* Result Animation Overlay */}
      {showResultDelay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative text-center space-y-6 animate-bounce">
            <div className="text-7xl">⚔️</div>
            <div className="text-4xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
              ANALYZING BATTLE...
            </div>
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
