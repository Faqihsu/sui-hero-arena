import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { Hero, TrainingLog, HeroClass } from '@/types';
import { CONTRACT_CONFIG } from '@/config/contract';

export const useHeroes = (ownerAddress: string | null) => {
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [trainingId, setTrainingId] = useState<string | null>(null);
  const [leveledUpId, setLeveledUpId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Helper function to map hero class
  const mapHeroClass = (classString: string): HeroClass => {
    const normalized = classString.toLowerCase().trim();
    
    switch (normalized) {
      case 'assassin':
        return HeroClass.ASSASSIN;
      case 'wizard':
        return HeroClass.WIZARD;
      case 'sniper':
        return HeroClass.SNIPER;
      case 'paladin':
        return HeroClass.PALADIN;
      case 'ranger':
        return HeroClass.RANGER;
      case 'sorceress':
        return HeroClass.SORCERESS;
      case 'rogue':
        return HeroClass.ASSASSIN;
      default:
        return HeroClass.ASSASSIN;
    }
  };

  // Use Sui dApp Kit's query hook for RPC calls with automatic refetching
  const {
    data: ownedObjects,
    isPending: isLoading,
    error,
    refetch: refreshHeroes
  } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: ownerAddress || '',
      filter: {
        StructType: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::Hero`
      },
      options: {
        showContent: true,
        showDisplay: true
      }
    },
    {
      enabled: !!ownerAddress,
      staleTime: 0,
      gcTime: 30000,
      refetchOnWindowFocus: true,
      refetchInterval: 10000,
      refetchIntervalInBackground: false,
    }
  );

  // Parse heroes from the query result
  const heroes: Hero[] = ownedObjects?.data?.map((obj: any) => {
    const content = obj.data?.content;
    const display = obj.data?.display?.data;
    
    if (!content || !display) {
      return null;
    }

    // Get hero_class from display data (newly added field)
    const heroClassFromDisplay = display.hero_class || display.class || 'Assassin';

    return {
      id: obj.data?.objectId || '',
      name: display.name || 'Unknown Hero',
      class: mapHeroClass(heroClassFromDisplay),
      imageUrl: display.image_url || '',
      stats: {
        hp: Number(content.fields?.hp || 100),
        xp: 0,
        level: Number(content.fields?.level || 1),
        attack: 10,
        defense: 10
      },
      owner: obj.data?.owner?.AddressOwner || '',
      createdAt: Date.now()
    };
  }).filter((hero: Hero | null): hero is Hero => hero !== null) || [];

  return {
    heroes,
    logs,
    trainingId,
    leveledUpId,
    isLoading,
    error,
    refreshHeroes: () => {
      queryClient.invalidateQueries({ queryKey: ['getOwnedObjects', ownerAddress] });
    }
  };
};