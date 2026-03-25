import { useQuery } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const usePendingListings = (filters = {}) => {
    return useQuery({
        queryKey: ['pendingListings', filters],
        queryFn: () => adminService.getPendingListings(filters),
        retry: false,
        staleTime: 30 * 1000,
    });
};
