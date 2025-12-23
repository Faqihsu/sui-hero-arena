import { useCallback, useState } from 'react';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useToast } from './useToast';
import { CONTRACT_CONFIG } from '@/config/contract';

export const useMarketplacePurchase = () => {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const { showToast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const purchaseHero = useCallback(async (heroId: string, priceInForge: number, sellerAddress: string) => {
    try {
      if (!account?.address) {
        showToast('Please connect your wallet first', 'error');
        return null;
      }

      setIsPurchasing(true);

      const tx = new Transaction();

      // Create payment coin
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(priceInForge)]);

      tx.moveCall({
        target: `${CONTRACT_CONFIG.MARKETPLACE_PACKAGE_ID}::marketplace::purchase_hero`,
        arguments: [
          tx.object(CONTRACT_CONFIG.MARKETPLACE_ADMIN_ID),
          tx.pure.string(heroId),
          coin,
        ],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx
      });

      showToast(`Hero purchased successfully! You now own this hero.`, 'success');
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to purchase hero';
      showToast(message, 'error');
      return null;
    } finally {
      setIsPurchasing(false);
    }
  }, [account?.address, signAndExecuteTransaction, showToast]);

  return {
    purchaseHero,
    isPurchasing,
  };
};
