import React from 'react';

interface EnhancedLoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export const EnhancedLoadingSpinner: React.FC<EnhancedLoadingSpinnerProps> = ({
  size = 'medium',
  message = 'Loading...',
  fullScreen = false
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const spinner = (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Outer rotating ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 border-r-purple-500"
        style={{
          animation: 'spin 1s linear infinite'
        }}
      />

      {/* Middle rotating ring with delay */}
      <div
        className="absolute inset-2 rounded-full border-2 border-transparent border-b-cyan-400 border-l-purple-400"
        style={{
          animation: 'spin 2s linear infinite reverse'
        }}
      />

      {/* Inner pulsing circle */}
      <div
        className="absolute inset-4 rounded-full bg-gradient-to-r from-cyan-500/50 to-purple-500/50"
        style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-md">
        <div className="space-y-6 text-center">
          {spinner}
          {message && (
            <div className="space-y-2">
              <p className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {message}
              </p>
              <div className="flex gap-1 justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{animationDelay: '0s'}} />
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{animationDelay: '0.2s'}} />
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{animationDelay: '0.4s'}} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {spinner}
      {message && (
        <p className="text-sm font-semibold text-cyan-300">{message}</p>
      )}
    </div>
  );
};

// Skeleton Loader for hero cards
export const HeroCardSkeleton: React.FC = () => (
  <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-lg overflow-hidden border border-cyan-500/30 p-3 space-y-3 animate-pulse">
    <div className="aspect-square bg-slate-800/50 rounded-lg" />
    <div className="space-y-2">
      <div className="h-4 bg-slate-800/50 rounded w-3/4" />
      <div className="h-3 bg-slate-800/50 rounded w-1/2" />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="h-8 bg-slate-800/50 rounded" />
      <div className="h-8 bg-slate-800/50 rounded" />
    </div>
  </div>
);

// Battle loading state
export const BattleLoadingState: React.FC<{ battleType?: string }> = ({ battleType = 'PvP' }) => (
  <div className="space-y-8 animate-fadeIn">
    <div className="text-center space-y-4">
      <div className="inline-block">
        <EnhancedLoadingSpinner size="large" />
      </div>
      <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        Preparing {battleType} Battle
      </h2>
      <p className="text-cyan-300/60">Initializing combat arena...</p>
    </div>

    {/* Arena preparation steps */}
    <div className="max-w-md mx-auto space-y-2">
      {['Loading heroes', 'Calculating stats', 'Starting countdown'].map((step, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-cyan-900/20 rounded-lg">
          <div
            className="w-3 h-3 rounded-full bg-cyan-500"
            style={{
              animation: `pulse 1s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
          <span className="text-cyan-300 text-sm font-semibold">{step}</span>
        </div>
      ))}
    </div>
  </div>
);
