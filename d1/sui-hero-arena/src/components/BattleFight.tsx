// src/components/BattleFight.tsx
import React from "react";
import { HeroClass } from "@/types";
import { BattleResultModal } from './BattleResultModal';

export type HeroOnChain = {
  id: string;
  name: string;
  health: number;
  level: number;
  attack: number;
  defense: number;
  damage: number;
  chakra: number;
  image_url: string;
  heroClass?: HeroClass;
};

type BattleFightProps = {
  heroes: HeroOnChain[];
  trainingId?: string | null;
  leveledUpId?: string | null;
  isTraining?: boolean;
  onTrain?: (id: string) => void;
  onTransfer?: (id: string) => void;
  onDelete?: (id: string) => void;
  battleResult?: { heroName: string; result: 'win' | 'lose' } | null;
  onCloseBattleResult?: () => void;
};

export function BattleFight({
  heroes,
  trainingId,
  leveledUpId,
  isTraining,
  onTrain,
  onTransfer,
  onDelete,
  battleResult,
  onCloseBattleResult,
}: BattleFightProps) {
  if (!heroes.length) {
    return (
      <div className="py-8 text-center text-slate-400">
        Kamu belum punya hero. Mint dulu di tab Forge.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Your Heroes
        </h1>
        <p className="text-slate-400 text-sm">Manage and train your warrior collection</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {heroes.map((hero) => {
        const isThisTraining = trainingId === hero.id;
        const isLeveled = leveledUpId === hero.id;

        return (
          <div
            key={hero.id}
            className="group glass-dark border border-indigo-500/20 hover:border-indigo-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20"
          >
            <div className="relative overflow-hidden">
              <img
                src={hero.image_url}
                alt={hero.name}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              {isLeveled && (
                <span className="absolute top-2 right-2 px-2 py-1 text-[10px] rounded bg-emerald-500 text-white font-bold">
                  LEVEL UP!
                </span>
              )}
            </div>

            <div className="px-4 pt-4 pb-3 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white">{hero.name}</h3>
                <span className="text-sm font-semibold text-yellow-400">
                  Lv. {hero.level}
                </span>
              </div>
              {hero.heroClass && (
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  Class: {hero.heroClass}
                </p>
              )}
            </div>

            <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 border-t border-indigo-500/10 rounded-lg p-4 space-y-2">
              <div className="text-sm font-bold text-white flex justify-between">
                <span>HP:</span>
                <span className="text-red-400">{hero.health}</span>
              </div>
              <div className="text-sm font-bold text-white flex justify-between">
                <span>ATK:</span>
                <span className="text-orange-400">{hero.attack}</span>
              </div>
              <div className="text-sm font-bold text-white flex justify-between">
                <span>DEF:</span>
                <span className="text-blue-400">{hero.defense}</span>
              </div>
              <div className="text-sm font-bold text-white flex justify-between">
                <span>DMG:</span>
                <span className="text-purple-400">{hero.damage}</span>
              </div>
              <div className="text-sm font-bold text-white flex justify-between">
                <span>Chakra:</span>
                <span className="text-cyan-400">{hero.chakra}</span>
              </div>
            </div>

            <div className="px-4 pb-4 flex gap-2">
              {onTrain && (
                <button
                  onClick={() => onTrain(hero.id)}
                  disabled={isTraining && isThisTraining}
                  className="flex-1 px-3 py-2 text-sm font-black rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/50 uppercase tracking-wide"
                >
                  {isTraining && isThisTraining ? "⏳ Leveling Up..." : "⚡ Level Up"}
                </button>
              )}
              {onTransfer && (
                <button
                  onClick={() => onTransfer(hero.id)}
                  className="flex-1 px-3 py-2 text-sm font-black rounded-lg border-2 border-indigo-400 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-300 transition-all duration-200 uppercase tracking-wide"
                >
                  🔄 Transfer
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(hero.id)}
                  className="px-3 py-2 text-sm font-black rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all duration-200 hover:shadow-lg hover:shadow-red-500/50"
                  title="Delete hero"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>

    {battleResult && (
      <BattleResultModal
        isOpen={true}
        heroName={battleResult.heroName}
        result={battleResult.result}
        onClose={onCloseBattleResult || (() => {})}
      />
    )}
  </div>
  );
}


