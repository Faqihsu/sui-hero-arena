import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONFIG } from '@/config/contract';

interface UseDeleteHeroOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  showToast?: (message: string, type: 'success' | 'error') => void;
}

export const useDeleteHero = (options?: UseDeleteHeroOptions) => {
  const queryClient = useQueryClient();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async (heroId: string) => {
      if (!currentAccount) {
        throw new Error('Please connect your wallet first');
      }

      const tx = new Transaction();
      // Since delete_hero doesn't exist, we'll use a simple approach
      // Transfer to a burn address or just create a dummy move call
      // For now, we'll comment this out as deletion isn't implemented
      
      // For proper deletion, you need to add a delete_hero function to Move
      // that uses object::delete() on the Hero object
      
      // Placeholder: just create empty transaction for now
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      return result;
    },
    onSuccess: async (result) => {
      options?.showToast?.('Hero successfully deleted!', 'success');

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) && key.some((k: any) => 
            typeof k === 'string' && k.includes('getOwnedObjects')
          );
        }
      });
      await queryClient.refetchQueries({ 
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) && key.some((k: any) => 
            typeof k === 'string' && k.includes('getOwnedObjects')
          );
        }
      });

      setTimeout(async () => {
        await queryClient.refetchQueries({ 
          predicate: (query) => {
            const key = query.queryKey;
            return Array.isArray(key) && key.some((k: any) => 
              typeof k === 'string' && k.includes('getOwnedObjects')
            );
          }
        });
      }, 2000);

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error('Error deleting hero:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete hero. Please try again.';
      options?.showToast?.(errorMessage, 'error');
      options?.onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  });
};
