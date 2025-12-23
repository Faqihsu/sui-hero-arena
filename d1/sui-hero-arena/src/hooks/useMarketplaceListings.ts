import { useCallback, useState, useEffect } from 'react';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { CONTRACT_CONFIG } from '@/config/contract';

export interface MarketplaceListing {
  heroId: string;
  heroName: string;
  level: number;
  rarity: string;
  imageUrl: string;
  price: number;
  seller: string;
  createdAt: number;
}

export const useMarketplaceListings = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);

  const { data: objectData, isLoading, error, refetch } = useSuiClientQuery(
    'getObject',
    {
      id: CONTRACT_CONFIG.MARKETPLACE_ADMIN_ID,
      options: {
        showContent: true,
        showDisplay: true,
      },
    },
    {
      enabled: !!CONTRACT_CONFIG.MARKETPLACE_ADMIN_ID,
      refetchInterval: 5000, // Poll every 5 seconds for new listings
    }
  );

  // Parse listings from contract state
  useEffect(() => {
    if (objectData?.data?.content && 'fields' in objectData.data.content) {
      // Extract listings from the Table object
      const fields = (objectData.data.content as any).fields as any;
      // Note: Table structure depends on contract implementation
      // This is a placeholder - adjust based on your actual contract state
      setListings([]);
    }
  }, [objectData]);

  const refetchListings = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    listings,
    isLoading,
    error,
    refetchListings,
  };
};

// Hook to get single listing details
export const useListingDetails = (heroId: string) => {
  const { listings, isLoading, refetchListings } = useMarketplaceListings();
  const listing = listings.find(l => l.heroId === heroId);

  return {
    listing,
    isLoading,
    refetch: refetchListings,
  };
};
