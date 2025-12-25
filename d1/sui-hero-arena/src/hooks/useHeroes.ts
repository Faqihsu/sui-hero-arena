import { useQuery } from '@tanstack/react-query';
import { useSuiClient } from '@mysten/dapp-kit';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { CONTRACT_CONFIG } from '@/config/contract';
import { Hero } from '@/types';

export const useHeroes = () => {
  const client = useSuiClient();
  const account = useCurrentAccount();

  const { data: heroes = [], isLoading } = useQuery({
    queryKey: ['heroes', account?.address],
    queryFn: async () => {
      if (!account?.address) return [];

      try {
        const objects = await client.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::Hero`,
          },
          options: { showContent: true },
        });

        return objects.data
          .map((obj: any) => {
            const content = obj.data?.content?.fields;
            if (!content) return null;
            return {
              id: obj.data.objectId,
              name: content.name,
              hp: content.hp,
              level: content.level,
              attack: content.attack,
              defense: content.defense,
              damage: content.damage,
              chakra: content.chakra,
              imageUrl: content.image_url || 'https://via.placeholder.com/200',
              heroClass: content.hero_class || 'Unknown',
            } as Hero;
          })
          .filter((h): h is Hero => h !== null);
      } catch (error) {
        console.error('Error fetching heroes:', error);
        return [];
      }
    },
    enabled: !!account?.address,
    refetchInterval: 5000, // Auto-refresh every 5s
  });

  return { heroes, isLoading };
};
