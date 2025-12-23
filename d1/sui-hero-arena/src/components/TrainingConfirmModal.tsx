import React from 'react';

interface TrainingConfirmModalProps {
  heroName: string;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TrainingConfirmModal: React.FC<TrainingConfirmModalProps> = ({
  heroName,
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      ></div>

      {/* Modal */}
      <div className="relative z-50 w-full max-w-sm mx-4 p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/20">
        <div className="space-y-6 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/50">
              ⚡
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Start Training</h2>
            <p className="text-slate-300">
              Train <span className="font-bold text-indigo-300">{heroName}</span> to increase stats?
            </p>
          </div>

          {/* Training Info */}
          <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
            <p className="text-sm text-slate-300">
              Training will take some time. Your hero's stats will increase significantly! ⏱️
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-600 text-white font-bold hover:bg-slate-700/50 disabled:opacity-50 transition-all duration-200 uppercase tracking-wide"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-indigo-500/40 uppercase tracking-wide flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Training...
                </>
              ) : (
                <>
                  <span>⚡</span>
                  Start Training
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
