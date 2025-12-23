import React, { useState } from 'react';
import { Hero } from '@/types';

interface HeroSelectorProps {
  heroes: Hero[];
  onSelect: (heroId: string) => void;
  onClose: () => void;
  isOpen: boolean;
  title?: string;
}

export const HeroSelector: React.FC<HeroSelectorProps> = ({
  heroes,
  onSelect,
  onClose,
  isOpen,
  title = 'Select Your Hero'
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = (heroId: string) => {
    setSelectedId(heroId);
    setTimeout(() => onSelect(heroId), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with animation */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal with animation */}
      <div className="relative animate-slideUp max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 p-6 border-b border-cyan-500/30 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ⚔️ {title}
            </h2>
            <button
              onClick={onClose}
              className="text-2xl text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-cyan-300/60 text-sm mt-2">Click to select your battle hero</p>
        </div>

        {/* Heroes Grid */}
        <div className="p-6 bg-gradient-to-b from-slate-900/40 to-slate-950/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {heroes.map((hero, index) => (
              <div
                key={hero.id}
                className="animate-scaleIn"
                style={{
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <button
                  onClick={() => handleSelect(hero.id)}
                  onMouseEnter={() => setHoveredId(hero.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`w-full relative group cursor-pointer transition-all duration-300 ${
                    selectedId === hero.id ? 'ring-2 ring-cyan-400' : ''
                  }`}
                >
                  {/* Selection indicator */}
                  {selectedId === hero.id && (
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-lg animate-pulse" />
                  )}

                  <div className={`relative bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-lg overflow-hidden border-2 transition-all p-4 ${
                    hoveredId === hero.id
                      ? 'border-cyan-400 shadow-lg shadow-cyan-500/50 scale-105'
                      : selectedId === hero.id
                      ? 'border-cyan-400'
                      : 'border-cyan-500/30 hover:border-cyan-500/60'
                  }`}>
                    {/* Hero Image */}
                    <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
                      <img
                        src={hero.imageUrl}
                        alt={hero.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                      {/* Level Badge */}
                      <div className="absolute top-2 right-2 bg-cyan-500/80 px-3 py-1 rounded-full text-white font-bold text-sm">
                        Lv.{hero.stats.level}
                      </div>
                    </div>

                    {/* Hero Info */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {hero.name}
                      </h3>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-cyan-950/50 rounded px-2 py-1">
                          <div className="text-[10px] text-cyan-400 font-bold">ATK</div>
                          <div className="text-cyan-300 font-bold">{hero.stats.attack}</div>
                        </div>
                        <div className="bg-purple-950/50 rounded px-2 py-1">
                          <div className="text-[10px] text-purple-400 font-bold">DEF</div>
                          <div className="text-purple-300 font-bold">{hero.stats.defense}</div>
                        </div>
                      </div>

                      {/* Class Badge */}
                      <div className="text-xs text-cyan-300 bg-cyan-950/30 rounded px-2 py-1 text-center font-semibold">
                        {hero.class}
                      </div>
                    </div>

                    {/* Hover Effect */}
                    {hoveredId === hero.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg pointer-events-none" />
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>

          {heroes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-cyan-300/50 text-lg">No heroes available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 p-4 border-t border-cyan-500/30 backdrop-blur-md sticky bottom-0 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 rounded-lg font-bold transition-all"
          >
            Cancel
          </button>
          <button
            disabled={!selectedId}
            onClick={() => selectedId && onSelect(selectedId)}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:from-slate-700 disabled:to-slate-800 text-white rounded-lg font-bold transition-all disabled:cursor-not-allowed"
          >
            Confirm Selection
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
