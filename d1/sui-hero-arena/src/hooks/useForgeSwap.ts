import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONFIG } from '@/config/contract';

export const useForgeSwap = () => {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const swapSuiForForge = async (suiAmount: number) => {
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }

    const tx = new Transaction();

    // Create coin from gas
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(suiAmount)]);

    // Call swap
    tx.moveCall({
      target: `${CONTRACT_CONFIG.MARKETPLACE_PACKAGE_ID}::forge_swap::swap_sui_for_forge`,
      arguments: [
        tx.object(CONTRACT_CONFIG.FORGE_SWAP_POOL_ID),
        coin,
      ],
    });

    tx.setGasBudget(100_000_000);

    console.log('🔄 Swapping SUI for FORGE...');
    const result = await signAndExecuteTransaction({
      transaction: tx,
    });

    console.log('✅ Swap success:', result.digest);
    return result;
  };

  const swapForgeForSui = async (forgeAmount: number) => {
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }

    // Note: This needs FORGE coins from wallet
    // For now, just call the endpoint
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACT_CONFIG.MARKETPLACE_PACKAGE_ID}::forge_swap::swap_forge_for_sui`,
      arguments: [
        tx.object(CONTRACT_CONFIG.FORGE_SWAP_POOL_ID),
        tx.pure.u64(forgeAmount),
      ],
    });

    tx.setGasBudget(100_000_000);

    console.log('🔄 Swapping FORGE for SUI...');
    const result = await signAndExecuteTransaction({
      transaction: tx,
    });

    console.log('✅ Swap success:', result.digest);
    return result;
  };

  return { 
    swapSuiForForge, 
    swapForgeForSui,
    isConnected: !!account 
  };
};
