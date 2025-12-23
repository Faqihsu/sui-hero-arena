import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui/client';
import { SuiObjectData } from '@mysten/sui/client';

export interface CoinBalance {
  coinType: string;
  totalBalance: string;
  coins: SuiObjectData[];
}

export const useSuiCoins = () => {
  const account = useCurrentAccount();
  const [suiBalance, setSuiBalance] = useState<string>('0');
  const [forgeBalance, setForgeBalance] = useState<string>('0');
  const [suiCoins, setSuiCoins] = useState<SuiObjectData[]>([]);
  const [forgeCoins, setForgeCoins] = useState<SuiObjectData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!account?.address) return;

    const fetchCoins = async () => {
      setIsLoading(true);
      try {
        const client = new SuiClient({
          url: 'https://fullnode.testnet.sui.io',
        });

        // Fetch SUI coins (native currency)
        const suiCoinsData = await client.getCoins({
          owner: account.address,
          coinType: '0x2::sui::SUI',
        });

        setSuiCoins(suiCoinsData.data);
        
        // Calculate total SUI balance
        const totalSui = suiCoinsData.data.reduce((sum, coin) => {
          const balance = coin.balance ? parseInt(coin.balance) : 0;
          return sum + balance;
        }, 0);
        setSuiBalance(totalSui.toString());

        // Fetch FORGE coins
        const forgeCoinType = '0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654::forge_swap::FORGE';
        try {
          const forgeCoinsData = await client.getCoins({
            owner: account.address,
            coinType: forgeCoinType,
          });

          setForgeCoins(forgeCoinsData.data);

          // Calculate total FORGE balance
          const totalForge = forgeCoinsData.data.reduce((sum, coin) => {
            const balance = coin.balance ? parseInt(coin.balance) : 0;
            return sum + balance;
          }, 0);
          setForgeBalance(totalForge.toString());
        } catch (error) {
          console.log('No FORGE coins found:', error);
          setForgeBalance('0');
          setForgeCoins([]);
        }
      } catch (error) {
        console.error('Failed to fetch coins:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [account?.address]);

  return {
    suiBalance,
    forgeBalance,
    suiCoins,
    forgeCoins,
    isLoading,
  };
};
