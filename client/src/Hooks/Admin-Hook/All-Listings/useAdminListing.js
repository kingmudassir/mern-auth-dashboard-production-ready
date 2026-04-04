import { useQuery } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useAdminListing = (listingId) => {
    return useQuery({
        queryKey: ['adminListing', listingId],
        queryFn: () => adminService.getListingById(listingId),
        enabled: Boolean(listingId),
        retry: false,
        staleTime: 0, // Always refetch — admin needs fresh data for review
        select: (data) => data?.listing ?? null,
    });
};