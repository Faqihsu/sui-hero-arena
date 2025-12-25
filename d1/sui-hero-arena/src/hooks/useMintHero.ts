import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONFIG } from '@/config/contract';
import { MintHeroData } from '@/types';

export const useMintHero = () => {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const mint = async (data: MintHeroData) => {
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }

    const tx = new Transaction();
    
    // Add move call
    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::mint_hero`,
      arguments: [
        tx.pure.string(data.name),
        tx.pure.string(data.imageUrl),
        tx.pure.string(data.heroClass),
      ],
    });

    // Set explicit gas budget (0.1 SUI = 100,000,000 MIST)
    tx.setGasBudget(100_000_000);

    console.log('📤 Sending mint transaction...');
    const result = await signAndExecuteTransaction({
      transaction: tx,
    });

    console.log('✅ Mint success:', result.digest);
    return result;
  };

  return { mint, isConnected: !!account };
};

