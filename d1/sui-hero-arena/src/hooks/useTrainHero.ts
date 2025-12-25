import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONFIG } from '@/config/contract';

export const useTrainHero = () => {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const train = async (heroId: string) => {
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }

    const tx = new Transaction();
    
    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::train_hero`,
      arguments: [tx.object(heroId)],
    });

    tx.setGasBudget(100_000_000);

    console.log('🏋️ Training hero...');
    const result = await signAndExecuteTransaction({
      transaction: tx,
    });

    console.log('✅ Training success:', result.digest);
    return result;
  };

  return { train, isConnected: !!account };
};

