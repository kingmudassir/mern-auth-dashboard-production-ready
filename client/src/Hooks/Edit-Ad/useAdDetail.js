import { useQuery } from '@tanstack/react-query';
import carService from '../../Services/Car-Marketplace/carService';

export const useAdDetail = (adId) => {
    return useQuery({
        queryKey: ['ad', adId],
        queryFn: () => carService.getAdById(adId),
        enabled: !!adId, // Only fetch if an ID is provided
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        retry: 1,
    });
};