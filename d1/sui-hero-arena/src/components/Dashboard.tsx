import React from 'react';
import { useHeroes } from '@/hooks/useHeroes';

export const Dashboard: React.FC = () => {
  const { heroes } = useHeroes();

  const stats = React.useMemo(() => {
    if (!heroes || heroes.length === 0) {
      return {
        totalHeroes: 0,
        avgLevel: 0,
        avgHP: 0,
        totalAttack: 0,
        highestLevel: 0,
      };
    }

    const avgLevel = Math.round(heroes.reduce((sum, h) => sum + h.level, 0) / heroes.length);
    const avgHP = Math.round(heroes.reduce((sum, h) => sum + h.hp, 0) / heroes.length);
    const totalAttack = heroes.reduce((sum, h) => sum + h.attack, 0);
    const highestLevel = Math.max(...heroes.map((h) => h.level));

    return {
      totalHeroes: heroes.length,
      avgLevel,
      avgHP,
      totalAttack,
      highestLevel,
    };
  }, [heroes]);

  const classDistribution = React.useMemo(() => {
    if (!heroes) return {};
    const dist: Record<string, number> = {};
    heroes.forEach((h) => {
      dist[h.heroClass] = (dist[h.heroClass] || 0) + 1;
    });
    return dist;
  }, [heroes]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="card-glow rounded-xl p-8 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30">
        <h1 className="text-4xl font-bold mb-2 glow-text-cyan">Welcome to Sui Hero Arena</h1>
        <p className="text-cyan-300/80">Mint, Train, Battle, and Manage your heroes on Sui blockchain</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Heroes"
          value={stats.totalHeroes}
          icon="🎮"
          color="from-blue-600 to-blue-900"
        />
        <StatCard
          title="Avg Level"
          value={stats.avgLevel}
          icon="📊"
          color="from-green-600 to-green-900"
        />
        <StatCard
          title="Avg HP"
          value={stats.avgHP}
          icon="❤️"
          color="from-red-600 to-red-900"
        />
        <StatCard
          title="Total Attack"
          value={stats.totalAttack}
          icon="⚔️"
          color="from-orange-600 to-orange-900"
        />
        <StatCard
          title="Highest Level"
          value={stats.highestLevel}
          icon="👑"
          color="from-yellow-600 to-yellow-900"
        />
      </div>

      {/* Class Distribution */}
      <div className="card-glow rounded-xl p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-cyan-500/20">
        <h2 className="text-2xl font-bold mb-6 glow-text-cyan">Hero Class Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(classDistribution).map(([heroClass, count]) => (
            <div
              key={heroClass}
              className="bg-slate-800/50 rounded-lg p-4 text-center border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
            >
              <div className="text-lg font-bold text-cyan-300">{heroClass}</div>
              <div className="text-3xl font-bold text-purple-400 mt-2">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-glow rounded-xl p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-cyan-500/20">
        <h2 className="text-2xl font-bold mb-6 glow-text-cyan">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickActionCard
            icon="🔨"
            title="Mint New Hero"
            description="Create your first hero by forging"
            action="Go to Forge"
          />
          <QuickActionCard
            icon="⚔️"
            title="Battle Arena"
            description="Challenge other heroes in battle"
            action="Start Battle"
          />
          <QuickActionCard
            icon="📈"
            title="Train Heroes"
            description="Level up and improve your heroes"
            action="Train Now"
          />
          <QuickActionCard
            icon="💰"
            title="Marketplace"
            description="Buy, sell, or trade heroes"
            action="Browse Market"
          />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`card-glow rounded-xl bg-gradient-to-br ${color} p-1 hover:shadow-lg hover:shadow-cyan-500/30 transition-all`}>
      <div className="bg-slate-900/90 rounded-lg p-6 text-center space-y-3">
        <div className="text-4xl">{icon}</div>
        <div className="text-sm text-cyan-300/70">{title}</div>
        <div className="text-3xl font-bold text-cyan-300">{value}</div>
      </div>
    </div>
  );
};

interface QuickActionCardProps {
  icon: string;
  title: string;
  description: string;
  action: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon, title, description, action }) => {
  return (
    <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{icon}</div>
        <span className="text-xs bg-cyan-600/30 text-cyan-300 px-2 py-1 rounded-full">New</span>
      </div>
      <h3 className="font-bold text-cyan-300 mb-1">{title}</h3>
      <p className="text-sm text-cyan-300/60 mb-4">{description}</p>
      <button className="w-full bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 py-2 rounded-lg text-sm font-bold transition-all group-hover:translate-x-1">
        {action} →
      </button>
    </div>
  );
};
