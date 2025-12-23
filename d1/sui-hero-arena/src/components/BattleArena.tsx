import React, { useState, useMemo } from "react";
import { HeroOnChain } from "./BattleFight";
import { BattleLogModal } from "./BattleLogModal";
import "./BattleArena.css";

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
  const [isColliding, setIsColliding] = useState(false);
  const [collisionSide, setCollisionSide] = useState<'left' | 'right' | null>(null);
  const [showBattleAnimation, setShowBattleAnimation] = useState(false);
  const [battleTheme, setBattleTheme] = useState<'fire' | 'ice' | 'lightning'>('fire');
  const [slowMotion, setSlowMotion] = useState(false);

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

  // Play collision sound effect
  const playCollisionSound = () => {
    // Create collision sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  // Play hit sound effect
  const playHitSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 150;
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  };

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
    setShowBattleAnimation(true);
    setSlowMotion(true);
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

      // Trigger collision animation
      setCollisionSide('left');
      setIsColliding(true);
      playCollisionSound();

      logs.push({
        round,
        hero1Action: getActionDescription(hero1.name, atk1Result.damage, atk1Result.isCritical),
        hero2Action: '',
        hero1HP: Math.max(0, hp1),
        hero2HP: Math.max(0, hp2),
      });

      setBattleLogs([...logs]);

      // Play hit sound
      await new Promise((resolve) => setTimeout(resolve, 150));
      playHitSound();

      // Delay setelah hero 1 attack
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (hp2 <= 0) break;

      // Hero 2 menyerang
      const atk2Result = calculateDamage(hero2, hero1);
      hp1 = Math.max(0, hp1 - atk2Result.damage);

      // Trigger collision animation
      setCollisionSide('right');
      setIsColliding(true);
      playCollisionSound();

      logs[logs.length - 1].hero2Action = getActionDescription(hero2.name, atk2Result.damage, atk2Result.isCritical);
      logs[logs.length - 1].hero1HP = Math.max(0, hp1);
      setBattleLogs([...logs]);

      // Play hit sound
      await new Promise((resolve) => setTimeout(resolve, 150));
      playHitSound();

      round++;

      // Delay setelah hero 2 attack
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setIsColliding(false);
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

    // Langsung close animation dan show battle log
    setSlowMotion(false);
    setShowBattleAnimation(false);
    await new Promise((resolve) => setTimeout(resolve, 500));

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

      {/* Theme Selector */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setBattleTheme('fire')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            battleTheme === 'fire'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/50'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          🔥 Fire
        </button>
        <button
          onClick={() => setBattleTheme('ice')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            battleTheme === 'ice'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          ❄️ Ice
        </button>
        <button
          onClick={() => setBattleTheme('lightning')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            battleTheme === 'lightning'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          ⚡ Lightning
        </button>
      </div>

      <div className="space-y-6">
      {/* Hero Selection */}
      {/* Hero Selection with Images */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Hero 1 Selection */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 text-center">Select Fighter 1</h3>
          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2">
            {availableHeroes1.map((hero) => (
              <button
                key={hero.id}
                onClick={() => setSelectedHero1(hero.id)}
                disabled={isBattling}
                className={`group relative overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
                  selectedHero1 === hero.id
                    ? "ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/50"
                    : "ring-1 ring-slate-600 hover:ring-indigo-400"
                }`}
              >
                {/* NFT Card Image */}
                <img
                  src={hero.image_url}
                  alt={hero.name}
                  className="w-full h-40 object-cover group-hover:brightness-110 transition-all duration-300"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                {/* Hero Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{hero.name}</h4>
                    <span className="text-xs font-bold px-2 py-1 bg-yellow-500/80 text-white rounded">Lv. {hero.level}</span>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-1 mt-2 text-xs font-bold">
                    <div className="text-center">
                      <div className="text-red-400">❤️</div>
                      <div className="text-white">{hero.health}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-400">⚔️</div>
                      <div className="text-white">{hero.attack}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400">🛡️</div>
                      <div className="text-white">{hero.defense}</div>
                    </div>
                  </div>
                </div>
                
                {/* Selection Indicator */}
                {selectedHero1 === hero.id && (
                  <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-2">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Hero 2 Selection */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 text-center">Select Fighter 2</h3>
          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2">
            {availableHeroes2.map((hero) => (
              <button
                key={hero.id}
                onClick={() => setSelectedHero2(hero.id)}
                disabled={isBattling}
                className={`group relative overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
                  selectedHero2 === hero.id
                    ? "ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/50"
                    : "ring-1 ring-slate-600 hover:ring-indigo-400"
                }`}
              >
                {/* NFT Card Image */}
                <img
                  src={hero.image_url}
                  alt={hero.name}
                  className="w-full h-40 object-cover group-hover:brightness-110 transition-all duration-300"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                {/* Hero Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{hero.name}</h4>
                    <span className="text-xs font-bold px-2 py-1 bg-yellow-500/80 text-white rounded">Lv. {hero.level}</span>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-1 mt-2 text-xs font-bold">
                    <div className="text-center">
                      <div className="text-red-400">❤️</div>
                      <div className="text-white">{hero.health}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-400">⚔️</div>
                      <div className="text-white">{hero.attack}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400">🛡️</div>
                      <div className="text-white">{hero.defense}</div>
                    </div>
                  </div>
                </div>
                
                {/* Selection Indicator */}
                {selectedHero2 === hero.id && (
                  <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-2">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
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

      {/* Battle Animation Display */}
      {showBattleAnimation && hero1 && hero2 && (
        <div className={`battle-theme-${battleTheme} fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm ${slowMotion ? 'battle-slow-motion' : ''}`}>
          <div className="relative w-full max-w-4xl h-96 flex items-center justify-between px-8">
            {/* Hero 1 Card */}
            <div className={`battle-card battle-card-hero1 ${isColliding && collisionSide === 'left' ? 'colliding' : ''}`}>
              <div className="relative">
                <img
                  src={hero1.image_url}
                  alt={hero1.name}
                  className="w-48 h-48 rounded-2xl object-cover shadow-2xl border-4 border-indigo-500"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-2xl">{hero1.name}</h3>
                  <p className="text-sm text-gray-300">Lv. {hero1.level}</p>
                </div>
              </div>
            </div>

            {/* Center VS */}
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl font-black text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text animate-pulse">
                VS
              </div>
              {isColliding && (
                <>
                  <div className="collision-effect"></div>
                  <div className="spark spark-1"></div>
                  <div className="spark spark-2"></div>
                  <div className="spark spark-3"></div>
                  <div className="spark spark-4"></div>
                  <div className="spark spark-5"></div>
                  <div className="spark spark-6"></div>
                </>
              )}
            </div>

            {/* Hero 2 Card */}
            <div className={`battle-card battle-card-hero2 ${isColliding && collisionSide === 'right' ? 'colliding' : ''}`}>
              <div className="relative">
                <img
                  src={hero2.image_url}
                  alt={hero2.name}
                  className="w-48 h-48 rounded-2xl object-cover shadow-2xl border-4 border-indigo-500"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-2xl">{hero2.name}</h3>
                  <p className="text-sm text-gray-300">Lv. {hero2.level}</p>
                </div>
              </div>
            </div>
          </div>
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
    </div>
    </div>
  );
}
