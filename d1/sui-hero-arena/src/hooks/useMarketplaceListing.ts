import { useCallback } from 'react';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useToast } from './useToast';
import { CONTRACT_CONFIG } from '@/config/contract';

interface ListingData {
  heroId: string;
  heroName: string;
  level: number;
  rarity: string;
  imageUrl: string;
  price: number;
}

export const useMarketplaceListing = () => {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const { showToast } = useToast();

  const createListing = useCallback(async (listing: ListingData) => {
    try {
      if (!account?.address) {
        showToast('Please connect your wallet first', 'error');
        return null;
      }

      const tx = new Transaction();

      tx.moveCall({
        target: `${CONTRACT_CONFIG.MARKETPLACE_PACKAGE_ID}::marketplace::create_listing`,
        arguments: [
          tx.object(CONTRACT_CONFIG.MARKETPLACE_ADMIN_ID),
          tx.pure.string(listing.heroId),
          tx.pure.string(listing.heroName),
          tx.pure.u64(listing.price),
          tx.pure.u64(listing.level),
          tx.pure.string(listing.rarity),
          tx.pure.string(listing.imageUrl),
        ],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx
      });

      showToast('Hero listed successfully on marketplace!', 'success');
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create listing';
      showToast(message, 'error');
      return null;
    }
  }, [account?.address, signAndExecuteTransaction, showToast]);

  const cancelListing = useCallback(async (heroId: string) => {
    try {
      if (!account?.address) {
        showToast('Please connect your wallet first', 'error');
        return null;
      }

      const tx = new Transaction();

      tx.moveCall({
        target: `${CONTRACT_CONFIG.MARKETPLACE_PACKAGE_ID}::marketplace::cancel_listing`,
        arguments: [
          tx.object(CONTRACT_CONFIG.MARKETPLACE_ADMIN_ID),
          tx.pure.string(heroId),
        ],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx
      });

      showToast('Listing cancelled successfully', 'success');
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel listing';
      showToast(message, 'error');
      return null;
    }
  }, [account?.address, signAndExecuteTransaction, showToast]);

  return {
    createListing,
    cancelListing,
  };
};
