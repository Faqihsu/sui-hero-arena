import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  heroName: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  heroName,
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
      <div className="relative z-50 w-full max-w-sm mx-4 p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-red-500/50 shadow-2xl shadow-red-500/20">
        <div className="space-y-6 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-3xl shadow-lg shadow-red-500/50">
              ⚠️
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Delete Hero?</h2>
            <p className="text-slate-300">
              Are you sure you want to permanently delete <span className="font-bold text-red-300">{heroName}</span>?
            </p>
          </div>

          {/* Warning Message */}
          <div className="p-4 bg-red-900/30 rounded-lg border border-red-600/30">
            <p className="text-sm text-red-300">
              ⚠️ This action cannot be undone. The hero will be deleted forever!
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
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-black hover:from-red-500 hover:to-orange-500 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-red-500/40 uppercase tracking-wide flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Deleting...
                </>
              ) : (
                <>
                  <span>🗑️</span>
                  Delete Hero
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
